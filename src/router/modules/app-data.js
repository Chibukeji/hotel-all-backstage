import Layout from '@/layout'

const appDataRouter = {
  path: '/app-data',
  component: Layout,
  redirect: '/app-data/list',
  alwaysShow: true,
  id: 644,
  name: 'app-data',
  meta: {
    title: 'APP数据',
    icon: 'app'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/app-data/list'),
      name: 'app-data-list',
      id: 650,
      meta: { title: 'APP数据列表', noCache: true }
    },
  ]
}

export default appDataRouter
