import Vue from 'vue'
const selt = Vue.prototype

//查询
export function getDepartListTree(data) {
  return selt.request({
    url: '/api/system/sys_dept/tree',
    method: 'post',
    data,
  })
}
