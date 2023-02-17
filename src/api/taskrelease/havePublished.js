import Vue from 'vue'
const selt = Vue.prototype

// 任务作废
export function cancelTaskType (id) {
  return selt.request({
    url: `/api/leadertask/respTask/cancel/${id}`,
    method: 'post',
  })
}
// 多人任务详情
export function respTaskDetails (id) {
  return selt.request({
    url: `/api/leadertask/respTaskInstance/getInfo/${id}`,
    method: 'get',
  })
}
// 添加或取消关注
export function addAndCancel (data) {
  return selt.request({
    url: `/api/leadertask/respTaskPsnAttention/addAndCancel`,
    method: 'post',
    data
  })
}
// 子任务
export function respTaskList (data) {
  return selt.request({
    url: `/api/leadertask/respTask/listPage`,
    method: 'post',
    data
  })
}