import Layout from '@/layout'

const memberLevelRouter = {
  path: '/member-level',
  component: Layout,
  redirect: '/member-level/member-level-list',
  alwaysShow: true,
  id: 10,
  name: 'member-level',
  meta: {
    title: '会员等级管理',
    icon: 'member-level'
  },
  children: [
    {
      path: 'member-level-list',
      component: () => import('@/views/member-level/member-level-list'),
      name: 'member-level-list',
      id: 11,
      meta: { title: '会员等级列表', noCache: true }
    },
  ]
}

export default memberLevelRouter
