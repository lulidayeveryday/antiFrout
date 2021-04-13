import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'



export function getRoutes(param) {
  return request({
    url: baseUrl + '/user/sourceQuxian',
    method: 'post',
    params:param
  })
}

export function getNewRoutes() {
  return request({
    url: baseUrl + '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
