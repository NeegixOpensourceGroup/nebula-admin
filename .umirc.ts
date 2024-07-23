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
    },
    {
      name: '系统管理',
      path: '/system',
      icon: 'smile',
      routes: [
        {
          path: '/system',
          redirect: '/system/biz-unit',
        },
        {
          name: '组织管理',
          path: '/system/biz-unit',
          component: './system/BizUnit',
        },
        {
          name: '部门管理',
          path: '/system/dept',
          component: './system/Dept',
        },
        {
          name: '人员管理',
          path: '/system/psn',
          component: './system/Psn',
          access: 'system:psn:list',
        },
        {
          name: '字典管理',
          path: '/system/dict',
          component: './system/Dict',
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
        },
        {
          name: '操作日志',
          path: '/log/table1',
          component: './Table',
        },
        {
          name: '登录日志',
          path: '/log/table2',
          component: './Table',
        },
      ],
    },
    {
      icon: 'smile',
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: 'CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      path: '/*',
      component: '@/pages/404'
    }
  ],
  npmClient: 'npm',
});

