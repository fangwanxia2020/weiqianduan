import Layout from '@/layout'

// 审核中心
const routerArr = [
    {
      path: '/leadertask/auditCenter',
      name: "auditCenter",
      redirect: '/auditCenter/auditCenter',
      component: Layout,
      alwaysShow: true,
      meta: {
        title: '审核中心',
      },
      children: [
        // 已审核
        {
          path: 'reviewed',
          name: 'reviewed',
          component: () => import('@/views/auditCenter/reviewed/index'),
          meta: {
            title: '已完成',
          }
        },
        {
          path: 'reviewed/detail',
          name: 'reviewedDetail',
          component: () => import('@/views/auditCenter/reviewed/detail'),
          meta: {
            title: '查看审核详情',
          },
          hidden: true
        },
        // 待审核
        {
          path: 'toBeReviewed',
          name: 'toBeReviewed',
          component: () => import('@/views/auditCenter/toBeReviewed/index'),
          meta: {
            title: '待审核',
          }
        },
        {
          path: 'toBeReviewed/detail',
          name: 'toBeReviewedDetail',
          component: () => import('@/views/auditCenter/toBeReviewed/detail'),
          meta: {
            title: '审核',
          },
          hidden: true
        },
      ]
    },
  ]
  
  export default routerArr;