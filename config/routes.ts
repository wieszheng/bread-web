export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './User/Login'
      }
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome'
  },
  {
    path: '/account',
    icon: 'user',
    hideInMenu: true,
    routes: [
      {
        path: '/account/center',
        name: 'center',
        component: './Account/Center',
      },
      {
        path: '/account/settings',
        component: './Account/Settings',
      },
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page'
      },
      {
        path: '/admin/sub-page',
        name: '二级管理页',
        component: './Admin'
      },
    ],
  },
  {
    path: '/system',
    icon: 'lock',
    name: '后台管理',
    authority: ['superAdmin'],
    routes: [
      // {
      //   path: '/system/configure',
      //   name: '系统设置',
      //   component: './Config/SystemConfig',
      // },
      {
        path: '/system/user',
        name: '用户管理',
        component: './Manager/UserList',
        authority: ['superAdmin'],
      },
    ],
  },
  {
    path: '/config',
    icon: 'icon-config',
    name: '测试配置',
    authority: ['superAdmin', 'admin'],
    routes: [
      {
        path: '/config/environment',
        name: '环境管理',
        component: './Config/Environment',
      },
      {
        path: '/config/address',
        name: '网关配置',
        component: './Config/Address',
      },
    ],
  },
  {
    name: '查询表格',
    icon: 'table',
    path: '/list',
    component: './TableList'
  },
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '*',
    layout: false,
    component: './404'
  },
];
