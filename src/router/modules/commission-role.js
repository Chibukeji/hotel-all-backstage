import Layout from '@/layout'

const commissionRoleRouter = {
  path: '/commission-role',
  component: Layout,
  redirect: '/commission-role/commission-role-list',
  alwaysShow: true,
  id: 10,
  name: 'commission-role',
  meta: {
    title: '分佣角色管理',
    icon: 'rate'
  },
  children: [
    {
      path: 'commission-role-list',
      component: () => import('@/views/commission-role/commission-role-list'),
      name: 'commission-role-list',
      id: 11,
      meta: { title: '分佣角色列表', noCache: true }
    },
  ]
}

export default commissionRoleRouter
