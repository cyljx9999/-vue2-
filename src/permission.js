import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  //设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  ///获取token
  const hasToken = getToken()

  //判断是否存在token
  if (hasToken) {
    //是否是从登录来的请求
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      //跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      //从store里面获取用户信息
      // const hasGetUserInfo = store.getters.name
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          //如果用户信息不存在，那么会从服务器获取用户信息
          const { roles } = await store.dispatch('user/getInfo')

          //生成路由数据，是一个数组
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          let obj =  { path: '*', redirect: '/404', hidden: true };
          accessRoutes.push(obj)
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
