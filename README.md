# nebula-admin

#### 介绍

基于 umimax 框架，配合 Ant Design UI 组件库搭建的管理系统

#### 界面图片

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801113906.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114034.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114145.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114221.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114303.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114349.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114423.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114448.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114532.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114603.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114639.png)

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
