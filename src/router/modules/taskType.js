import Layout from '@/layout'

// 任务类型
const routerArr = [
    {
      path: '/leadertask/taskType',
      name: "leadertask",
      redirect: '/leadertask/taskType',
      component: Layout,
      alwaysShow: true,
      meta: {
        title: '任务类型',
      },
      children: [
        // 任务类型
        {
          path: 'taskType',
          name: 'taskType',
          component: () => import('@/views/taskType/taskType/index'),
          meta: {
            title: '任务类型',
          }
        }
      ]
    },
  ]
  
  export default routerArr;