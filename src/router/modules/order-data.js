import Layout from '@/layout'

const orderDataRouter = {
  path: '/order-data',
  component: Layout,
  redirect: '/order-data/list',
  alwaysShow: true,
  id: 645,
  name: 'order-data',
  meta: {
    title: '订单数据',
    icon: 'list'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/order-data/list'),
      name: 'order-data-list',
      id: 651,
      meta: { title: '订单数据列表', noCache: true }
    },
  ]
}

export default orderDataRouter
