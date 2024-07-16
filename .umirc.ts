import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    compact: true,
  },
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: ''
  },
  proxy: {
    '/api': {
      'target': 'http://localhost:8080/',
      'changeOrigin': true,
    },
  },
  layout: {
    title: 'Nebula',
  },
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
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
      name: '首页',
      path: '/home',
      icon: 'smile',
      component: './Home',
      wrappers:['@/wrappers/auth'],
    },
    {
      name: '系统管理',
      path: '/system',
      icon: 'smile',
      routes: [
        {
          path: '/system',
          redirect: '/system/biz-unit',
          wrappers:['@/wrappers/auth'],
        },
        {
          name: '组织管理',
          path: '/system/biz-unit',
          component: './system/BizUnit',
          wrappers:['@/wrappers/auth'],
        },
        {
          name: '部门管理',
          path: '/system/dept',
          component: './system/Dept',
          wrappers:['@/wrappers/auth'],
        },
        {
          name: '人员管理',
          path: '/system/psn',
          component: './system/Psn',
          wrappers:['@/wrappers/auth'],
        },
        {
          name: '字典管理',
          path: '/system/dict',
          component: './system/Dict',
          wrappers:['@/wrappers/auth'],
        },
      ],
    },
    {
      name: '日志管理',
      path: '/log',
      icon: 'smile',
      routes: [
        {
          path: '/log',
          redirect: '/log/table1',
          wrappers:['@/wrappers/auth'],
        },
        {
          name: '操作日志',
          path: '/log/table1',
          component: './Table',
          wrappers:['@/wrappers/auth'],
        },
        {
          name: '登录日志',
          path: '/log/table2',
          component: './Table',
          wrappers:['@/wrappers/auth'],
        },
      ],
    },
    {
      icon: 'smile',
      name: '权限演示',
      path: '/access',
      component: './Access',
      wrappers:['@/wrappers/auth'],
    },
    {
      name: 'CRUD 示例',
      path: '/table',
      component: './Table',
      wrappers:['@/wrappers/auth'],
    },
  ],
  npmClient: 'npm',
});

