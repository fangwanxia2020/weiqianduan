import Layout from '@/layout'

// 任务发布
const routerArr = [
    {
      path: '/leadertask/myTask',
      name: "leadertask",
      redirect: '/leadertask/myTask',
      component: Layout,
      alwaysShow: true,
      meta: {
        title: '我的任务',
      },
      children: [
        // 任务夹
        {
          path: 'jobJacket',
          name: 'jobJacket',
          component: () => import('@/views/myTask/jobJacket/index'),
          meta: {
            title: '任务夹',
          }
        },
        {
          path: 'jobJacket/disintegrate',
          name: 'jobJacket',
          component: () => import('@/views/myTask/jobJacket/disintegrate'),
          meta: {
            title: '分解任务',
          },
          hidden: true
        },
        {
          path: 'jobJacket/plan',
          name: 'jobJacket',
          component: () => import('@/views/myTask/jobJacket/plan'),
          meta: {
            title: '更新进度',
          },
          hidden: true
        },
        {
          path: 'jobJacket/planDetail',
          name: 'planDetail',
          component: () => import('@/views/myTask/jobJacket/plan'),
          meta: {
            title: '查看详情',
          },
          hidden: true
        }
      ]
    },
  ]
  
  export default routerArr;