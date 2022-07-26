### nest-admin

**基于NestJs + TypeScript + TypeORM + Redis + MySql + Vue3 + Ant Design Vue编写的一款简单高效的前后端分离的权限管理系统。希望这个项目在全栈的路上能够帮助到你。**

- 前端项目地址：[传送门](https://github.com/buqiyuan/vue3-antd-admin)

### 演示地址

- [http://buqiyuan.gitee.io/vue3-antd-admin/](http://buqiyuan.gitee.io/vue3-antd-admin/)
- [Swagger Api文档](https://nest-api.buqiyuan.site/api/swagger-api/static/index.html#/)

### 项目启动前的准备工作
- sql文件：[/sql/init.sql](https://github.com/buqiyuan/nest-admin/tree/main/sql)
- mysql和redis连接配置：[src/config/config.development.ts](https://github.com/buqiyuan/nest-admin/blob/main/src/config/config.development.ts)

演示环境账号密码：

|     账号     |  密码  |           权限           |
| :----------: | :----: | :----------------------: |
|  rootadmin   | 123456 | 超级管理员 |

> 所有新建的用户初始密码都为123456

本地部署账号密码：

|   账号    |  密码  |    权限    |
| :-------: | :----: | :--------: |
| rootadmin | 123456 | 超级管理员 |

### 安装使用

- 获取项目代码

```bash
git clone https://github.com/buqiyuan/nest-admin
```
- 安装依赖

```bash
cd nest-admin

yarn install

```

- 运行

```bash
yarn dev
```

- 打包

```bash
yarn build
```

## 使用docker一键启动
启动成功后，通过 http://localhost:7001/swagger-api/ 访问。
```bash
docker-compose up -d
```
查看实时日志输出
```bash
docker-compose logs -f
```

### 系统截图

![](https://s1.ax1x.com/2021/12/11/oTi1nf.png)

![](https://s1.ax1x.com/2021/12/11/oTithj.png)

![](https://s1.ax1x.com/2021/12/11/oTirHU.png)

![](https://s1.ax1x.com/2021/12/11/oTia3n.png)


### 欢迎Star && PR

**如果项目有帮助到你可以点个Star支持下。有更好的实现欢迎PR。**

### 致谢

- [sf-nest-admin](https://github.com/hackycy/sf-nest-admin)

### LICENSE

[MIT](LICENSE)
