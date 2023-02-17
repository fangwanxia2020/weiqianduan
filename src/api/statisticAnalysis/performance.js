import Vue from 'vue'
const selt = Vue.prototype


// 任务完成情况
export function getTaskCompleteSituation (data) {
  return selt.request({
    url: `api/leadertask/StatisticalAnalysis/getTaskCompleteSituation`,
    method: 'post',
    data
  })
}
// 组织列表
export function sys_org () {
  return selt.request({
    url: `api/system/sys_org/list`,
    method: 'post',
  })
}