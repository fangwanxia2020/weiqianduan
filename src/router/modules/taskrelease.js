import Layout from '@/layout'

// 任务发布
const routerArr = [
    {
      path: '/leadertask/taskrelease',
      name: "leadertask",
      redirect: '/leadertask/taskrelease',
      component: Layout,
      alwaysShow: true,
      meta: {
        title: '任务发布',
      },
      children: [
        // 草稿箱
        {
          path: 'draftBox',
          name: 'draftBox',
          component: () => import('@/views/taskrelease/draftBox/index'),
          meta: {
            title: '草稿箱',
          }
        },
        {
          path: 'draftBox/add',
          name: 'draftBox',
          component: () => import('@/views/taskrelease/draftBox/edit'),
          meta: {
            title: '新增任务',
          },
          hidden: true
        },
        {
          path: 'draftBox/check',
          name: 'draftBox',
          component: () => import('@/views/taskrelease/draftBox/check'),
          meta: {
            title: '查看任务',
          },
          hidden: true
        },
        {
          path: 'draftBox/amend',
          name: 'draftBox',
          component: () => import('@/views/taskrelease/draftBox/edit'),
          meta: {
            title: '修改任务',
          },
          hidden: true
        },
         // 已发布
         {
          path: 'havePublished',
          name: 'havePublished',
          component: () => import('@/views/taskrelease/havePublished/index'),
          meta: {
            title: '已发布',
          }
        },
        {
          path: 'havePublished/check',
          name: 'havePublished',
          component: () => import('@/views/taskrelease/havePublished/check'),
          meta: {
            title: '查看任务',
          },
          hidden: true
        },
        // 周期任务
        {
          path: 'taskcycle',
          name: 'taskcycle',
          component: () => import('@/views/taskrelease/taskcycle/index'),
          meta: {
            title: '周期任务',
          }
        },
        {
          path: 'taskcycle/add',
          name: 'taskcycleAdd',
          component: () => import('@/views/taskrelease/taskcycle/edit'),
          meta: {
            title: '新增周期任务',
          },
          hidden: true
        },
        {
          path: 'taskcycle/detail',
          name: 'taskcycleDetail',
          component: () => import('@/views/taskrelease/taskcycle/detail'),
          meta: {
            title: '查看周期任务',
          },
          hidden: true
        },
        {
          path: 'taskcycle/check',
          name: 'taskcycleCheck',
          component: () => import('@/views/taskrelease/taskcycle/check'),
          meta: {
            title: '查看详情',
          },
          hidden: true
        },
        {
          path: 'taskcycle/look',
          name: 'taskcycleLook',
          component: () => import('@/views/taskrelease/taskcycle/look'),
          meta: {
            title: '查看详情',
          },
          hidden: true
        },
      ]
    },
  ]
  
  export default routerArr;