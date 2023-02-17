import Vue from 'vue'
import App from './App.vue'
import commonStore from './store/globalStore'
import store from './store'
import mainroutes from './router'

import '@/assets/js/common'
import '@/assets/js/uiElement'
import '@/assets/styles/index.scss' // global css

//引入常用变量方法
import base from '@/assets/js/base'
Object.assign(Vue.prototype, base)

//全局工具方法
import '@/utils/mainUtils.js'
// 引入文件
import './public-path'

//引入ElementUI
import ElementUI from 'element-ui'
Vue.use(ElementUI)

//路由拦截
import '@/permission'

//引入全局变量
import plugins from '@/assets/js/plugins'
Vue.use(plugins)


// 注册用户信息相关的方法
import userUtils from '@/utils/userUtils.js';
Vue.prototype.userUtils = userUtils;

// hyit-select
// hyit-cascader
// 引入业务组件库(实验性)
import hyitComponents from 'hyit-components';
Vue.use(hyitComponents, {
  baseUrl: Vue.prototype.baseUrl,
  // 用户相关组件
  userUtils,
});

//初始化组件变量
import { initApi, setToken } from 'ty-pc/lib/utils/auth'
//一定要先设置baseUrl
Vue.prototype.baseUrl = process.env.VUE_APP_BASE_API
//m1:原先接口定义 m2:东云接口定义
Vue.prototype.request = initApi(
  {
    router: mainroutes,
    tokenkey: 'tyHseSubVue_token',
    outVue: Vue,
  },
  'm2'
)

Vue.config.productionTip = false

let instance = null
let router = null

function render(props = {}) {
  const { container } = props
  router = mainroutes
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(
    container ? container.querySelector('#app') : '#app'
  ) // 这里匹配的是public文件夹下面的index.html的id
}
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  //皮肤设置---------------------------------
  const theme = store.state.theme.theme
  store.dispatch('theme/setTheme', theme).then((theme) => {
    import(`@/assets/styles/theme/${theme}/element-variables.scss`)
  })

  // 这里是子应用独立运行的环境，实现子应用的登录逻辑
  // 独立运行时，也注册一个名为global的store module
  commonStore.globalRegister(store)
  // 模拟登录后，存储用户信息到global module
  const userInfo = {
    name: '微应用账号',
  } // 假设登录后取到的用户信息
  store.commit('global/setGlobalState', {
    user: userInfo,
    isInBaseSite: false,
  })
  render()
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}

export async function mount(props) {
  commonStore.globalRegister(store, props)
  // 独立运行时
  if (!window.__POWERED_BY_QIANKUN__) {
  } else {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    store.commit('global/setGlobalState', {
      isInBaseSite: true,
    })
  }
  Vue.prototype.parentProps = props
  //获取基座的token有就设置
  const { token } = store.state.global.user || {}
  //皮肤设置---------------------------------
  const theme = store.state.theme.theme
  store.dispatch('theme/setTheme', theme).then((theme) => {
    import(`@/assets/styles/theme/${theme}/element-variables.scss`)
  })
  if (token) {
    Vue.prototype.request = initApi(
      {
        router: mainroutes,
        tokenkey: 'tyHseSubVue_token',
        outVue: Vue,
      },
      'm2'
    )
    setToken(token)
    render(props)
  } else {
    render(props)
  }
}



// cool-admin
// 引入cl-crud
import CRUD from 'cl-admin-crud';
// 配置cl-crud默认配置
Vue.use(CRUD, {
  alias: 'cl-crud',
  table: {
    indexMethod: (index, crud) => {
      return index + 1 + (crud.params.page - 1) * crud.params.size;
    },
    size: 'mini',
  },
});



export async function unmount() {
  instance.$destroy()
  // instance.$el.innerHTML = ''
  instance = null
  router = null
}
