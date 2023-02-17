import Layout from '@/layout'

// 统计分析
const routerArr = [
    {
      path: '/leadertask/statisticAnalysis',
      name: "leadertask",
      redirect: '/leadertask/statisticAnalysis',
      component: Layout,
      alwaysShow: true,
      meta: {
        title: '统计分析',
      },
      children: [
        {
          path: 'taskOverview',
          name: 'taskOverview',
          component: () => import('@/views/statisticAnalysis/taskOverview/index'),
          meta: {
            title: '任务情况总览',
          }
        },
        {
          path: 'performance',
          name: 'performance',
          component: () => import('@/views/statisticAnalysis/performance/index'),
          meta: {
            title: '任务完成情况',
          }
        },
        {
          path: 'distribution',
          name: 'distribution',
          component: () => import('@/views/statisticAnalysis/distribution/index'),
          meta: {
            title: '任务分配情况',
          }
        },
        {
          path: 'responsivity',
          name: 'responsivity',
          component: () => import('@/views/statisticAnalysis/responsivity/index'),
          meta: {
            title: '响应度分析',
          }
        },
      ]
    }
  ]
  
export default routerArr;