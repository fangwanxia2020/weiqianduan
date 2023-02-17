import Vue from 'vue'
const selt = Vue.prototype

// 文件夹列表
export function listByType () {
  return selt.request({
    url: `/api/leadertask/folder/listByType`,
    method: 'get',
  })
}
// 添加文件夹
export function addFolder (data) {
  return selt.request({
    url: `/api/leadertask/folder/add`,
    method: 'post',
    data
  })
}
// 修改文件夹
export function editFolder (data) {
  return selt.request({
    url: `/api/leadertask/folder/edit`,
    method: 'post',
    data
  })
}
// 分解任务
export function breakTask (data) {
  return selt.request({
    url: `/api/leadertask/respTask/breakTask`,
    method: 'post',
    data
  })
}
// 提交/撤回 任务
export function respCommitRec (data) {
  return selt.request({
    url: `/api/leadertask/RespCommitRec/add`,
    method: 'post',
    data
  })
}
// 任务进度更新
export function updateProgress (data) {
  return selt.request({
    url: `/api/leadertask/RespCommitRec/updateProgress`,
    method: 'post',
    data
  })
}
// 删除文件夹
export function removeFolder (id) {
  return selt.request({
    url: `/api/leadertask/folder/remove/${id}`,
    method: 'DELETE',
  })
}
// 文件夹上移下移
export function moveFolder (data) {
  return selt.request({
    url: `/api/leadertask/folder/moveFolder`,
    method: 'post',
    data
  })
}
//获取进度值
export function getTaskProgress (taskId,personId) {
  return selt.request({
    url: `/api/leadertask/respTaskInstance/getTaskProgress/${taskId}${personId?'?personId='+personId : ''}`,
    method: 'get'
  })
}
//子任务获负责人
export function getTaskPersonName (taskId,personId) {
  return selt.request({
    url: `/api/leadertask/respTaskInstance/getTaskPersonName/${taskId}${personId?'?personId='+personId : ''}`,
    method: 'get'
  })
}
//任务督办
export function urgeTask (data) {
  return selt.request({
    url: `/api/leadertask/urge/add`,
    method: 'post',
    data
  })
}
//转移文件
export function transferTask (data) {
  return selt.request({
    url: `/api/leadertask/folder/transferTask`,
    method: 'post',
    data
  })
}
// // 任务详情1
// export function getInfoByTaskId (id) {
//   return selt.request({
//     url: `/api/leadertask/respTaskInstance/getInfoByTaskId/${id}`,
//     method: 'get',
//   })
// }
// 任务详情1
export function getInfo (id) {
  return selt.request({
    url: `/api/leadertask/respTask/getInfo/${id}`,
    method: 'get',
  })
}
