import Layout from '@/layout'

const financeDataRouter = {
  path: '/finance-data',
  component: Layout,
  redirect: '/finance-data/list',
  alwaysShow: true,
  id: 646,
  name: 'finance-data',
  meta: {
    title: '财务数据',
    icon: 'excel'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/finance-data/list'),
      name: 'finance-data-list',
      id: 652,
      meta: { title: '财务数据列表', noCache: true }
    },
    {
      path: 'overdue-order',
      component: () => import('@/views/finance-data/overdue-order'),
      name: 'overdue-order-list',
      id: 665,
      meta: { title: '分时过期订单', noCache: true }
    },
  ]
}

export default financeDataRouter
