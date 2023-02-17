// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const routerArr = [
  {
    path: '/systems/user',
    name: 'user',
    redirect: '/systems/user',
    component: Layout,
    hidden: false,
    meta: {
      title: '用户管理',
      icon: 'platformManage',
    },
    children: [
      {
        path: '',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: {
          title: '用户管理',
          activeMenu: '/systems/user',
        },
      },
    ],
  },
]

export default routerArr
