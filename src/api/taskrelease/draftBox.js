import Vue from 'vue'
const selt = Vue.prototype

// 获取字典-任务类型
export function getSespTaskType () {
  return selt.request({
    url: `/api/leadertask/RespTaskType/list`,
    method: 'post',
    data:{}
  })
}

// 新增任务
export function addTaskType (data) {
  return selt.request({
    url: `/api/leadertask/respTask/add`,
    method: 'post',
    data
  })
}
// 修改任务
export function editTaskType (data) {
  return selt.request({
    url: `/api/leadertask/respTask/edit`,
    method: 'post',
    data
  })
}

// 删除任务
export function removeRespTask (id) {
  return selt.request({
    url: `/api/leadertask/respTask/removeRespTask/${id}`,
    method: 'post',
  })
}
// 发布任务
export function issueRespTask (id) {
  return selt.request({
    url: `/api/leadertask/respTask/release/${id}`,
    method: 'post',
  })
}
// 任务详情1
export function getInfoTask (id) {
  return selt.request({
    url: `/api/leadertask/respTask/getInfo/${id}`,
    method: 'get',
  })
}

// 任务详情1
export function getInfoTaskTwo (id) {
  return selt.request({
    url: `/api/leadertask/respTaskInstance/getInfo/${id}`,
    method: 'get',
  })
}
// 任务详情2
export function respTaskInstance (data) {
  return selt.request({
    url: `/api/leadertask/respTaskInstance/listPage`,
    method: 'post',
    data
  })
}
// 历史记录
export function commitList (data) {
  return selt.request({
    url: `/api/leadertask/RespCommitRec/commitList`,
    method: 'post',
    data
  })
}
//根据id批量获取文件详细信息
export function listByIds (data) {
  return selt.request({
    url: `/api/sysfile/file_info/listByIds`,
    method: 'post',
    data
  })
}
//下载
export function getDownload (data) {
  return selt.request({
    url: '/api/sysfile/file_info/download',
    method: 'get',
    responseType: 'blob', // 表明返回服务器返回的数据类型
    params: data
  })
}
//打包下载
export function downloadPackageByResourceId (resourceId) {
  return selt.request({
    url: `/api/leadertask/respTaskFile/downloadPackageByResourceId/${resourceId}`,
    method: 'get',
    responseType: 'blob', // 表明返回服务器返回的数据类型
  })
}

