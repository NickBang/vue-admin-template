import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/claw/login',
    method: 'post',
    data
  })
}
export function logout(header) {
  return request({
    url: '/claw/api/logout',
    headers: {
      ...header
    },
    method: 'get'
  })
}

export function getInfo(data) {
  return request({
    url: '/claw/api/user/detail',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/claw/api/user/update',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/claw/api/user/add',
    method: 'post',
    data
  })
}
export function updatePassword(data) {
  return request({
    url: '/claw/api/update_password',
    method: 'post',
    data
  })
}
// 查询二维码
export function queryQrCode(data) {
  return request({
    url: '/claw/api/money_qr_query',
    method: 'post',
    data
  })
}
// 保存二维码
export function saveQrCode(data) {
  return request({
    url: '/claw/api/system/dict/money_qr_save',
    method: 'post',
    data
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
