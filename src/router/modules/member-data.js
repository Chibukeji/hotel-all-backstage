import Layout from '@/layout'

const memberDataRouter = {
  path: '/member-data',
  component: Layout,
  redirect: '/member-data/list',
  alwaysShow: true,
  id: 642,
  name: 'member-data',
  meta: {
    title: '会员数据',
    icon: 'user'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/member-data/list'),
      name: 'member-data-list',
      id: 648,
      meta: { title: '会员数据列表', noCache: true }
    },
  ]
}

export default memberDataRouter
