// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const routerArr = [
  {
    path: '/systems/menu',
    name: 'menus',
    redirect: '/systems/menu',
    component: Layout,
    hidden: false,
    meta: {
      title: '菜单管理',
      icon: 'platformManage',
    },
    children: [
      {
        path: '',
        name: 'menus',
        component: () => import('@/views/menu/index'),
        meta: {
          title: '菜单管理',
          activeMenu: '/systems/menu',
        },
      },
    ],
  },
]

export default routerArr
