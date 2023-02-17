import Vue from 'vue'
const selt = Vue.prototype

// 人员进度显示  
export function getTask (data) {
  return selt.request({
    url: `api/leadertask/respTask/listPsnScheduleInspection`,
    method: 'post',
    data
  })
}

// 人员进度数  
export function getCount (type) {
  return selt.request({
    url: `api/leadertask/respTask/getScheduleCount/${type}`,
    method: 'get',

  })
}