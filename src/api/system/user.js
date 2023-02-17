import Vue from 'vue'
const selt = Vue.prototype

// 新增用户
export function addUser(data) {
  return selt.request({
    url: '/api/system/sys_user/save',
    method: 'PUT',
    data,
  })
}
// 批量删除用户
export function delsUser(data) {
  return selt.request({
    url: `/api/system/sys_user/remove`,
    method: 'DELETE',
    data,
  })
}
