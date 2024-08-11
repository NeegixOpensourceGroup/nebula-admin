import { defineConfig } from '@umijs/max';
export default defineConfig({
  antd: {
    compact: true,
  },
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: '',
  },
  favicons: ['/images/logo.png'],
  proxy: {
    '/api': {
      target: 'http://localhost:8080/',
      changeOrigin: true,
    },
  },
  layout: {
    title: 'Nebula',
    locale: true,
  },
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
    title: true,
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      layout: false,
      component: '@/pages/Login',
    },
    {
      title: 'menu.home',
      path: '/home',
      icon: 'HomeOutlined',
      component: './Home',
      wrappers: ['@/wrappers/auth'],
    },
    {
      title: 'menu.organization.title',
      path: '/organization',
      icon: 'ApartmentOutlined',
      routes: [
        {
          path: '/organization',
          redirect: '/organization/biz-unit',
        },
        {
          title: 'menu.organization.bizUnit',
          path: '/organization/biz-unit',
          component: './organization/BizUnit',
          wrappers: ['@/wrappers/auth'],
        },
        {
          title: 'menu.organization.dept',
          path: '/organization/dept',
          component: './organization/Dept',
          wrappers: ['@/wrappers/auth'],
        },
        {
          title: 'menu.organization.psn',
          path: '/organization/psn',
          component: './organization/Psn',
          access: 'organization:psn:list',
          wrappers: ['@/wrappers/auth'],
        },
        {
          title: 'menu.organization.position',
          path: '/organization/post',
          component: './organization/Post',
          wrappers: ['@/wrappers/auth'],
        },
      ],
    },
    {
      title: 'menu.system.title',
      path: '/system',
      icon: 'BlockOutlined',
      routes: [
        {
          path: '/system',
          redirect: '/system/dict',
        },
        {
          title: 'menu.system.dictionary',
          path: '/system/dict',
          component: './system/Dict',
          wrappers: ['@/wrappers/auth'],
        },
        {
          title: 'menu.system.role',
          path: '/system/role',
          component: './system/Role',
          wrappers: ['@/wrappers/auth'],
        },
      ],
    },
    {
      title: 'menu.log.title',
      path: '/log',
      icon: 'ContainerOutlined',
      routes: [
        {
          path: '/log',
          redirect: '/log/optLog',
        },
        {
          title: 'menu.log.operate',
          path: '/log/optLog',
          component: './log/OptLog',
          wrappers: ['@/wrappers/auth'],
        },
        {
          title: 'menu.log.login',
          path: '/log/loginLog',
          component: './log/LoginLog',
          wrappers: ['@/wrappers/auth'],
        },
        {
          title: 'menu.log.exception',
          path: '/log/exceptionLog',
          component: './log/ExceptionLog',
          wrappers: ['@/wrappers/auth'],
        },
      ],
    },
    {
      title: 'menu.development.title',
      path: '/development',
      icon: 'CodeOutlined',
      routes: [
        {
          path: '/development',
          redirect: '/development/menu',
        },
        {
          title: 'menu.development.menu',
          path: '/development/menu',
          component: './development/Menu',
          wrappers: ['@/wrappers/auth'],
        },
        {
          title: 'menu.development.api',
          path: '/development/api',
          component: './development/Api',
          wrappers: ['@/wrappers/auth'],
        },
      ],
    },
    {
      icon: 'smile',
      title: 'menu.permission',
      path: '/access',
      component: './Access',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/*',
      component: '@/pages/404',
    },
  ],
  npmClient: 'npm',
});
