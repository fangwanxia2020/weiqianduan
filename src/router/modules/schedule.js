import Layout from '@/layout'

// 统计分析
const routerArr = [
    {
      path: '/leadertask/schedule',
      name: "leadertask",
      redirect: '/leadertask/schedule',
      component: Layout,
      alwaysShow: true,
      meta: {
        title: '进度巡检',
      },
      children: [
        {
          path: 'overdueTask',
          name: 'overdueTask',
          component: () => import('@/views/schedule/overdueTask/index'),
          meta: {
            title: '逾期任务',
          }
        },
        {
          path: 'taskPlan',
          name: 'taskPlan',
          component: () => import('@/views/schedule/taskPlan/index'),
          meta: {
            title: '任务进度巡检',
          }
        },
        {
          path: 'taskPlan/detail',
          name: 'taskPlanDetail',
          component: () => import('@/views/schedule/taskPlan/detail'),
          meta: {
            title: '任务进度巡检-查看',
          },
          hidden: true
        },
        {
          path: 'overdueTask/detail',
          name: 'taskPlanDetail',
          component: () => import('@/views/schedule/taskPlan/detail'),
          meta: {
            title: '逾期任务-查看',
          },
          hidden: true
        },
        {
          path: 'temporary',
          name: 'temporary',
          component: () => import('@/views/schedule/temporary/index'),
          meta: {
            title: '临时任务巡检',
          }
        },
 
        {
          path: 'personnel',
          name: 'personnel',
          component: () => import('@/views/schedule/personnel/index'),
          meta: {
            title: '人员进度显示',
          }
        },
    
      ]
    }
  ]
  
  export default routerArr;