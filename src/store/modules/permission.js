import { constantRoutes } from '@/router'
import { getMenuList } from '@/api/user'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  //循环每一个路由
  routes.forEach(route => {
    // console.log(route)
    const tmp = { ...route }
    // console.log(tmp)
    //判断是否有权限
    if (hasPermission(roles, tmp)) {
      const component = tmp.component;
      if(route.component){
        if(component == 'Layout'){
          tmp.component = Layout;
        }else{
          tmp.component = (resolve) => require([`@/views${component}`],resolve)
        }
      }
      //判断是否有下级
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    //把过滤出来有权限的路由添加到不需要权限的路由里面去
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve,reject)=>{
      //存的是有权限的路由，是一个数组
      getMenuList().then(res => {
        let accessedRoutes;
        if(res.code === 200){
          accessedRoutes = filterAsyncRoutes(res.data, roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error=>{
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
