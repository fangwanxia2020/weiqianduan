import Vue from 'vue'
const selt = Vue.prototype

// 任务进度显示  
export function getTask (data) {
  return selt.request({
    url: `api/leadertask/respTask/listTaskScheduleInspection`,
    method: 'post',
    data
  })
}

// 任务进度数  
export function getCount (type) {
  return selt.request({
    url: `api/leadertask/respTask/getScheduleCount/${type}`,
    method: 'get',

  })
}