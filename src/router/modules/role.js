// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const routerArr = [
  {
    path: '/systems/role',
    name: 'role',
    redirect: '/systems/role',
    component: Layout,
    hidden: false,
    meta: {
      title: '角色管理',
      icon: 'platformManage',
    },
    children: [
      {
        path: '',
        name: 'role',
        component: () => import('@/views/role/index'),
        meta: {
          title: '角色管理',
          activeMenu: '/systems/role',
        },
      },
      {
        path: 'rolePermission',
        component: () => import('@/views/role/rolePermission/index'),
        name: 'rolePermission',
        meta: {
          title: '授权设置',
          activeMenu: '/systems/role',
        },
        hidden: true,
      },
    ],
  },
]

export default routerArr
