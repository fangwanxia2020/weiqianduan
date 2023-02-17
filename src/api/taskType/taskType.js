import Vue from 'vue'
const selt = Vue.prototype

// 新增任务类型  
export function addTaskType (data) {
  return selt.request({
    url: `api/leadertask/RespTaskType/add`,
    method: 'post',
    data
  })
}
// 修改任务类型  
export function editTaskType (data) {
  return selt.request({
    url: `api/leadertask/RespTaskType/edit`,
    method: 'post',
    data
  })
}

// 获取任务类型  
export function getTaskType (id) {
  return selt.request({
    url: `api/leadertask/RespTaskType/get/${id}`,
    method: 'get',
  })
}
// 删除任务类型  
export function removeTaskType (id) {
  return selt.request({
    url: `api/leadertask/RespTaskType/remove/${id}`,
    method: 'DELETE',
  })
}