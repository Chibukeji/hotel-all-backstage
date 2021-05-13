import Layout from '@/layout'

const memberActiveRouter = {
  path: '/member-active',
  component: Layout,
  redirect: '/member-active/member-active-list',
  alwaysShow: true,
  id: 640,
  name: 'member-active',
  meta: {
    title: '会员活跃',
    icon: 'peoples'
  },
  children: [
    {
      path: 'member-active-list',
      component: () => import('@/views/member-active/member-active-list'),
      name: 'member-active-list',
      id: 647,
      meta: { title: '会员活跃列表', noCache: true }
    },
  ]
}

export default memberActiveRouter
