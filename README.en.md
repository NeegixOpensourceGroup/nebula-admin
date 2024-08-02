# nebula-admin

#### Description

nebula-admin is a management system built on the umimax framework, complemented by the Ant Design UI component library.

#### Interface Images

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801113906.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801202333.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114145.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114221.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114303.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114349.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114423.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114448.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114532.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114603.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240801114639.png)

![](https://gitee.com/kushu001/pic-go-images/raw/master/images/20240802213815.png)

#### Software Architecture

```
"@ant-design/icons": "^5.0.1",
"@ant-design/pro-components": "^2.4.4",
"@umijs/max": "^4.2.9",
"antd": "^5.4.0"
```

#### Installation

1. Install dependencies: `npm install`
2. Start: `npm run dev`

#### Instructions

1.  The current page data is all mock data, so you need to git clone and start it yourself to view the demo.
2.  Configure route information and backend service proxy information in .umirc.ts:

```
proxy: {
  '/api': {
    'target': 'http://localhost:8080/',
  }
},
routes: [
  {
    name: 'Home',
    path: '/home',
    icon: 'HomeOutlined',
    component: './Home',
    access: 'home',
    wrappers: ['@/wrappers/auth'],
  }
]
```

3.  Create pages in the pages directory.
4.  Create interfaces in the services directory.
5.  Create mock data in the mock directory (or enable the backend service).
6.  Permission information about menus/buttons can be obtained through the `queryAccess` interface, or you can customize it, refer to the mock data for the interface result.

#### Contribution

1.  Fork the repository
2.  Create Feat_xxx branch
3.  Commit your code
4.  Create Pull Request

#### Future plans

1.  Continue to improve the page
2.  Start the backend service
3.  Add more features
