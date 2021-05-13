import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/system-configuration',
  alwaysShow: true,
  id: 10,
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'system'
  },
  children: [
    {
      path: 'user-manage',
      component: () => import('@/views/system-manage/user-manage'),
      name: 'user-manage',
      id: 11,
      meta: { title: '用户管理', noCache: true }
    },
    {
      path: 'backstage-role-manage',
      component: () => import('@/views/system-manage/backstage-role-manage'),
      name: 'backstage-role-manage',
      id: 12,
      meta: { title: '后台角色管理', noCache: true }
    },
    {
      path: 'hotel-role-manage',
      component: () => import('@/views/system-manage/hotel-role-manage'),
      name: 'hotel-role-manage',
      id: 132,
      meta: { title: '酒店角色管理', noCache: true }
    },
    {
      path: 'service-role-manage',
      component: () => import('@/views/system-manage/service-role-manage'),
      name: 'service-role-manage',
      id: 133,
      meta: { title: '服务商角色管理', noCache: true }
    },
    {
      path: 'commission-role-list',
      component: () => import('@/views/commission-role/commission-role-list'),
      name: 'commission-role-list',
      id: 636,
      meta: { title: '分佣角色列表', noCache: true }
    },
    {
      path: 'member-level-list',
      component: () => import('@/views/member-level/member-level-list'),
      name: 'member-level-list',
      id: 637,
      meta: { title: '会员等级列表', noCache: true }
    },
    {
      path: 'system-configuration',
      component: () => import('@/views/system-manage/system-configuration'),
      name: 'system-configuration',
      id: 29,
      meta: { title: '系统配置', noCache: true }
    },
    {
      path: 'score-sign',
      component: () => import('@/views/system-manage/score-sign'),
      name: 'score-sign',
      id: 638,
      meta: { title: '权益标识列表', noCache: true }
    },
    {
      path: 'commissions-log',
      component: () => import('@/views/system-manage/commissions-log'),
      name: 'commissions-log',
      id: 639,
      meta: { title: '佣金明细', noCache: true }
    },
    // {
    //   path: 'system-menu',
    //   component: () => import('@/views/system-manage/system-menu'),
    //   name: 'system-menu',
    //   id: 11,
    //   meta: { title: '系统菜单', noCache: true }
    // },
    // {
    //   path: 'operation-log',
    //   component: () => import('@/views/system-manage/operation-log'),
    //   name: 'operation-log',
    //   id: 13,
    //   meta: { title: '操作日志', noCache: true }
    // }
  ]
}

export default systemRouter
