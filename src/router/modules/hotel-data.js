import Layout from '@/layout'

const hoteDataRouter = {
  path: '/hotel-data',
  component: Layout,
  redirect: '/hotel-data/list',
  alwaysShow: true,
  id: 643,
  name: 'hotel-data',
  meta: {
    title: '酒店数据',
    icon: 'hotel'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/hotel-data/list'),
      name: 'hotel-data-list',
      id: 649,
      meta: { title: '酒店数据列表', noCache: true }
    },
  ]
}

export default hoteDataRouter
