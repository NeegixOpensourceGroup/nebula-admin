# <div align=center>Nebula-Admin</div>

<div align=center><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/logo.png" width="70"/></div>

<div align=center>

![Static Badge](https://img.shields.io/badge/v0.0.1-white?style=flat&logo=nebula&label=nebula-admin&color=%23FF0000)

![Static Badge](https://img.shields.io/badge/v20.11.1-white?style=flat&logoColor=%23339933&label=nodejs&color=%23339933) ![Static Badge](https://img.shields.io/badge/v10.5.0-white?style=flat&logo=npm&label=npm&color=%23CB3837) ![Static Badge](https://img.shields.io/badge/%40umijs%2Fmax-%5E4.2.9-blue?style=flat) ![Static Badge](https://img.shields.io/badge/antd-5.4.0-green?style=flat)

</div>

#### 介绍

基于 umimax 框架，配合 Ant Design UI 组件库搭建的管理系统

#### 菜单结构

```
├── 首页        -- Home
├── 组织管理     -- Organization
  ├── 组织管理   -- Organization
  ├── 部门管理   -- Department
  ├── 人员管理   -- Person
  ├── 岗位管理   -- Post
├── 系统管理     -- System
  ├── 字典管理   -- Dictionary
  ├── 角色管理   -- Role
├── 日志管理     -- Log
  ├── 操作日志   -- OperationLog
  ├── 登录日志   -- LoginLog
  ├── 异常日志   -- ExceptionLog
├── 开发管理     -- Development
  ├── 菜单管理   -- Menu
  ├── 接口管理   -- Interface
├── 权限演示     -- Permission Demo
```

#### 界面图片

<table>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122055.png" width="300" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122147.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122222.png" width="300" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122404.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122447.png" width="300" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114423.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122530.png" width="300" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114448.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114532.png" width="300" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122613.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122652.png" width="300" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122734.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122757.png" width="300" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122904.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/20240807122830.png" width="300" /></td>
    <td></td>
  </tr>
</table>

#### 软件架构

```
"@ant-design/icons": "^5.0.1",
"@ant-design/pro-components": "^2.4.4",
"@umijs/max": "^4.2.9",
"antd": "^5.4.0"
```

#### 安装教程

1. 安装依赖: `npm install`
2. 启动: `npm run dev`

#### 使用说明

1. 目前页面数据都是 mock 数据，所以需要自己 git clone 后启动了才能查看 demo
2. .umirc.ts 下配置路由信息和后端服务代理信息

```
proxy: {
  '/api': {
    'target': 'http://localhost:8080/',
    'changeOrigin': true,
  },
},
routes: [
  {
    name: '首页',
    path: '/home',
    icon: 'HomeOutlined',
    component: './Home',
    access: 'home',
    wrappers: ['@/wrappers/auth'],
  },
]
```

3. pages 目录下创建页面
4. services 目录下创建接口
5. mock 目录下创建 mock 数据(或者启用后端服务)
6. 菜单/按钮的权限信息可以通过`queryAccess`接口获取，也可以改造成自己的方法，具体接口结果参考：mock 数据

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

#### 后续计划

1.  继续完善页面
2.  启动后端服务
3.  添加更多功能

#### 联系信息

<table>
  <tr>
    <th>QQ 群: 766104737</th>
    <th>Discord: <a href="https://discord.gg/WrP5J9Ea7z">https://discord.gg/WrP5J9Ea7z</a></th>
  </tr>
  <tr>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/qrcode_1723007085212.jpg" width="200" /></td>
    <td><img src="https://gitee.com/kushu001/pic-go-images/raw/master/images/httpsdiscord.ggWrP5J9Ea7z.png" width="200" /></td>
  </tr>
</table>
