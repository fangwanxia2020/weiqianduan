import Vue from 'vue'
const selt = Vue.prototype

//查询
export function getOrgListTree(data) {
  return selt.request({
    url: '/api/system/sys_org/tree',
    method: 'post',
  })
}

//登录页查询组织列表
export function getOrgList(data) {
  return selt.request({
    url: '/system/system/org/list',
    method: 'get',
    params: data,
  })
}

//所有组织列表
export function selectAllOrg(data) {
  return selt.request({
    url: '/system/system/org/selectAllOrg',
    method: 'post',
    data,
  })
}

//组织详情
export function getOrgDetail(id) {
  return selt.request({
    url: `/system/system/org/getInfo/${id}`,
    method: 'get',
  })
}
//新增组织
export function addOrg(data) {
  return selt.request({
    url: '/system/system/org/add',
    method: 'post',
    data,
  })
}
//修改组织
export function modifyOrg(data) {
  return selt.request({
    url: '/system/system/org/edit',
    method: 'post',
    data,
  })
}
//删除组织
export function removeOrg(ids) {
  return selt.request({
    url: `/system/org/remove/${ids}`,
    method: 'post',
  })
}
