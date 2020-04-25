import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import VueCookie from 'vue-cookie'
import { userInfo } from './api'

const picLoading = 'http://p8wyuj0a5.bkt.clouddn.com/demo/shop/images/loading.gif'
const picError = 'http://p8wyuj0a5.bkt.clouddn.com/demo/shop/images/error.png'
const bigPicLoading = 'http://p8wyuj0a5.bkt.clouddn.com/demo/shop/images/loading-big.gif'

Vue.use(ElementUI)
Vue.use(infiniteScroll)
Vue.use(VueCookie)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: picError,
  loading: picLoading,
  attempt: 3,
  filter: {
    bigPics (listener) {
      const height = listener.el.clientHeight
      const width = listener.el.clientWidth
      if (width > 400 || height > 300) {
        listener.loading = bigPicLoading
      }
    }
  }
})
Vue.config.productionTip = false

// 不需要登录的页面 => 白名单
const whiteList = ['/home', '/goods', '/login', '/goodsDetails']
// 路由拦截
router.beforeEach(function (to, from, next) {
  userInfo().then(res => {
    // 没登录
    if (res.status) {
      // 白名单
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('/login')
      }
    } else {
      store.commit('RECORD_USERINFO', {info: res.result})
      //  跳转到
      if (to.path === '/login') {
        next({path: '/'})
      }
      next()
    }
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
