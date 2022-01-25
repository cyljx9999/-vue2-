import { login, loginOutApi, getInfo} from '@/api/user'
import {getToken, setToken, removeToken, setUserId, removeUserId, clearSession} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password,userType } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password,userType:userType }).then(response => {
        const { data } = response

        setToken(data.token);
        //保存用户id到cookies
        setUserId(data.userId);
        commit('SET_TOKEN', data.token)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject("获取用户信息失败，请登录")
        }

        const { name, avatar,roles } = data
        if (!roles || roles.length <= 0) {
          return reject('getInfo: 用户的权限信息必须是一个数组!')
        }
        //把权限字段放到sessionStorage里面
        sessionStorage.setItem('codeList',JSON.stringify(roles))
        //把roles存到store里面
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit,dispatch, state }) {
    return new Promise((resolve, reject) => {
      loginOutApi(state.token).then(() => {
        removeToken() // must remove  token  first
        removeUserId();
        clearSession();
        resetRouter()
        commit('RESET_STATE')
        dispatch('tagsView/delAllViews',{}, {root: true})
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit ,dispatch}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUserId();
      clearSession();
      commit('RESET_STATE')
      dispatch('tagsView/delAllViews',{}, {root: true})
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

