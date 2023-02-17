import Vue from 'vue'
const selt = Vue.prototype

// 组织列表
export function sys_org () {
  return selt.request({
    url: `api/system/sys_org/list`,
    method: 'post',
  })
}
// 逾期任务
export function getTask (data) {
  return selt.request({
    url: `api/leadertask/respTask/listOverdueTask`,
    method: 'post',
    data
  })
}