import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url:baseUrl + '/user/login',
    method: 'post',
    params:data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url:baseUrl + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: baseUrl + '/user/logout',
    method: 'post'
  })
}
