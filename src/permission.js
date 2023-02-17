import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from 'ty-pc/lib/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { needLogin } from '@/settings'
NProgress.configure({
  showSpinner: false,
})
const whiteList = [
  '/login',
  '/login/admin',
  '/404',
  '/index',
  '/activiti/definition/edit',
] //白名单
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()

  if (needLogin) {
    //是否需要登录，在设置页面设置
    if (hasToken) {
      // 判断是否有token

      if (to.path.indexOf('/login') == 0) {
        next({
          path: '/',
        })
        NProgress.done()
      } else {
        const userId = store.getters.userId
        console.log('+++++__________', userId)
        if (userId) {
          next()
        } else {
          try {
            const notFoundPageRoute = {
              path: '*',
              meta: {
                title: '这个页面好像不存在',
              },
              hidden: true,
              redirect: '/404',
            }
            // router.addRoute(notFoundPageRoute) // 添加404页
            await store.dispatch('user/getInfo') // 拉取info
            next({
              ...to,
              replace: true,
            })
          } catch (error) {
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login/${sessionStorage.getItem(`roleKey`) || 'admin'}`)
            NProgress.done()
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) >= 0 || to.path.indexOf('/login') >= 0) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login/${sessionStorage.getItem(`roleKey`) || 'admin'}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  } else {
    next()
  }
})
router.afterEach(() => {
  NProgress.done()
})
