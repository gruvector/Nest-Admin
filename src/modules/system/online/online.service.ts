import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Inject, Injectable } from '@nestjs/common'

import Redis from 'ioredis'

import { UAParser } from 'ua-parser-js'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { ErrorEnum } from '~/constants/error-code.constant'

import { genOnlineUserKey } from '~/helper/genRedisKey'
import { AuthService } from '~/modules/auth/auth.service'
import { AccessTokenEntity } from '~/modules/auth/entities/access-token.entity'

import { TokenService } from '~/modules/auth/services/token.service'
import { getIpAddress } from '~/utils'

import { UserService } from '../../user/user.service'

import { OnlineUserInfo } from './online.model'

@Injectable()
export class OnlineService {
  constructor(
    @InjectRedis() private redis: Redis,
    private readonly userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,

  ) {}

  async addOnlineUser(value: string, ip: string, ua: string) {
    const parser = new UAParser()
    const uaResult = parser.setUA(ua).getResult()
    const address = await getIpAddress(ip)

    const token = await AccessTokenEntity.findOne({
      where: { value },
      relations: {
        user: {
          dept: true,
        },
      },
      cache: true,
    })

    const result: OnlineUserInfo = {
      ip,
      address,
      tokenId: token.id,
      uid: token.user.id,
      deptName: token.user.dept.name,
      os: `${`${uaResult.os.name ?? ''} `}${uaResult.os.version}`,
      browser: `${`${uaResult.browser.name ?? ''} `}${uaResult.browser.version}`,
      username: token.user.username,
      time: token.created_at.toString(),
    }
    this.redis.set(genOnlineUserKey(token.id), JSON.stringify(result), 'EX', this.securityConfig.jwtExprire)
  }

  async removeOnlineUser(value: string) {
    const token = await AccessTokenEntity.findOne({
      where: { value },
      relations: ['user'],
      cache: true,
    })
    this.redis.del(genOnlineUserKey(token?.id))
  }

  /**
   * 罗列在线用户列表
   */
  async listOnlineUser(value: string): Promise<OnlineUserInfo[]> {
    const token = await AccessTokenEntity.findOne({
      where: { value },
      relations: ['user'],
      cache: true,
    })
    const keys = await this.redis.keys(genOnlineUserKey('*'))
    const users = await this.redis.mget(keys)
    const rootUserId = await this.userService.findRootUserId()

    return users.map((e) => {
      const item = JSON.parse(e) as OnlineUserInfo
      item.isCurrent = token.id === item.tokenId
      item.disable = item.isCurrent || item.uid === rootUserId
      return item
    }).sort((a, b) => a.time > b.time ? -1 : 1)
  }

  /**
   * 下线当前用户
   */
  async kickUser(tokenId: string, user: IAuthUser): Promise<void> {
    const token = await AccessTokenEntity.findOne({
      where: { id: tokenId },
      relations: ['user'],
      cache: true,
    })
    if (!token)
      return
    const rootUserId = await this.userService.findRootUserId()
    const targetUid = token.user.id
    if (targetUid === rootUserId || targetUid === user.uid)
      throw new BusinessException(ErrorEnum.NOT_ALLOWED_TO_LOGOUT_USER)

    const targetUser = await this.tokenService.verifyAccessToken(token.value)
    await this.authService.clearLoginStatus(targetUser, token.value)
  }
}
