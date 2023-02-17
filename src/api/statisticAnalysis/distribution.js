import Vue from 'vue'
const selt = Vue.prototype


// 任务完成情况
export function sys_org (data) {
  return selt.request({
    url: `api/system/sys_org/list`,
    method: 'post',
    data
  })
}