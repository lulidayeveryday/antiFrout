import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'

export function fetchuserList(param) {
  return request({
    url: baseUrl + '/user/list',
    method: 'post',
    params: param
  })
}

export function resetPass(param) {
  return request({
    url: baseUrl + '/user/resetPass',
    method: 'post',
    params: param
  })
}

export function fetcheditUser(param) {
  return request({
    url: baseUrl + '/user/edit',
    method: 'post',
    params: param
  })
}

export function fetchRole() {
  return request({
    url: baseUrl + '/user/roles',
    method: 'get',
  })
}

export function fetchroleList(param) {
  return request({
    url: baseUrl + '/role/list',
    method: 'post',
    params: param
  })
}

export function fetchtreeAllList() {
  return request({
    url: baseUrl + '/role/resources',
    method: 'get'
  })
}

export function fetchtreeSelList(param) {
  return request({
    url: baseUrl + '/role/resourcesRoleId',
    method: 'post',
    params: param
  })
}

export function editTreeSelList(param) {
  return request({
    url: baseUrl + '/role/edit',
    method: 'post',
    params: param
  })
}

export function fetchaddRole(param) {
  return request({
    url: baseUrl + '/role/add',
    method: 'post',
    params: param
  })
}

export function fetchOrgList() {
  return request({
    url:baseUrl + '/org/list',
    method:'get'
  })
}

export function addOrg(param) {
  return request({
    url: baseUrl + '/org/add',
    method: 'post',
    params: param
  })
}

export function editOrg(param) {
  return request({
    url: baseUrl + '/org/edit',
    method: 'get',
    params: param
  })
}

export function delOrg(param) {
  return request({
    url: baseUrl + '/org/remove',
    method: 'get',
    params: param
  })
}

export function channelAndDeveList(param) {
  return request({
    url: baseUrl + '/channelAndDeve/list',
    method: 'post',
    params: param
  })
}

export function fetchAddchannel(param) {
  return request({
    url: baseUrl + '/channelAndDeve/addchannel',
    method: 'post',
    params: param
  })
}

export function fetchEditchannel(param) {
  return request({
    url: baseUrl + '/channelAndDeve/editchannel',
    method: 'post',
    params: param
  })
}

export function fetchDelchannel(param) {
  return request({
    url: baseUrl + '/channelAndDeve/removechannel',
    method: 'post',
    params: param
  })
}

export function fetchAdddevelop(param) {
  return request({
    url: baseUrl + '/channelAndDeve/adddevelop',
    method: 'post',
    params: param
  })
}

export function fetchEditdevelop(param) {
  return request({
    url: baseUrl + '/channelAndDeve/editdevelop',
    method: 'post',
    params: param
  })
}

export function fetchDeldevelop(param) {
  return request({
    url: baseUrl + '/channelAndDeve/removedevelop',
    method: 'post',
    params: param
  })
}

export function addUsers(param) {
  return request({
    url: baseUrl + '/user/insertUser',
    method: 'post',
    params: param
  })
}

export function fetchdowntimeWhiteAdd(param) {
  return request({
    url: baseUrl + '/smzApi/result/getReportRnsStatic',
    method: 'post',
    params: param
  })
}
