import { login, logout, getInfo } from '@/api/user'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getCookie('Claw-Token'),
    name: '',
    avatar: '',
    uid: '',
    role_code: null
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
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log('login', response)
        if (response.code === 0) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setCookie('uid', data.uid)
          setCookie('role_code', data.role_code)
          setCookie('token', data.token)
          setCookie('username', data.username)
          setCookie('avatar', data.avatar)
          resolve()
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({uid: getCookie('uid')}).then(response => {
        const { data } = response
        if (!data) {
          return reject('获取用户信息失败，请重新登陆')
        }

        const { name, avatar } = data

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeCookie() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeCookie() // must remove  token  first
      commit('RESET_STATE')
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

