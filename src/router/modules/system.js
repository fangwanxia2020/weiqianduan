// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const systemManagement = [{
    path: '/system',
    name: "系统管理",
    redirect: '/system',
    component: Layout,
    meta: {
        title: '系统管理',
        icon: 'platformManage'
    },
    children: [
        {
            path: '/system/menu',
            name: 'organizationChart',
            component: () => import('@/views/menu/index'),
            meta: {
                title: '菜单管理',
                activeMenu: '/system/menu'
            }
        },
        {
            path: '/system/organization',
            name: 'organizationChart',
            component: () => import('@/views/organizationChart/index'),
            meta: {
                title: '组织架构',
                activeMenu: '/system/organization'
            }
        },

    ]
}]

export default systemManagement