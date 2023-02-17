import Vue from 'vue'
const selt = Vue.prototype

// 组织列表
export function sys_org () {
  return selt.request({
    url: `api/system/sys_org/list`,
    method: 'post',
  })
}
// 任务情况总览  
export function getTaskOverview (data) {
  return selt.request({
    url: `api/leadertask/StatisticalAnalysis/getTaskOverview`,
    method: 'post',
    data
  })
}