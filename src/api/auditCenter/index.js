import Vue from 'vue'
const selt = Vue.prototype

// 获取详情
export function getRespTaskDetails (id) {
  return selt.request({
    url: `/api/leadertask/respTask/getInfo/${id}`,
    method: 'get'
  })
}
//历史记录
export function getRespCommitRec (data) {
  return selt.request({
    url: '/api/leadertask/RespCommitRec/commitList',
    method: 'post',
    data
  })
}
//新增周期
export function addRespPeriodicTask (data) {
  return selt.request({
    url: '/api/leadertask/respPeriodicTask/add',
    method: 'post',
    data
  })
}
//任务类型
export function getRespTaskType (data) {
  return selt.request({
    url: '/api/leadertask/RespTaskType/list',
    method: 'post',
    data
  })
}

//下发情况
export function getlistPage (data) {
  return selt.request({
    url: '/api/leadertask/respTask/listPage',
    method: 'post',
    data
  })
}


//获取下发次数
export function getTaskCount (data) {
  return selt.request({
    url: '/api/leadertask/respPeriodicTask/taskCount',
    method: 'post',
    data
  })
}

//负责人情况
export function getRespTaskInstance (data) {
  return selt.request({
    url: '/api/leadertask/respTaskInstance/listPage',
    method: 'post',
    data
  })
}

//启用，停用
export function changeEnable (id,enable) {
  const data = {
    id,
    enable
  }
  return selt.request({
    url: '/api/leadertask/respPeriodicTask/changeEnable',
    method: 'post',
    data
  })
}
//周期详情
export function getInfoRespPeriodicTask (id,data) {
  return selt.request({
    url: `/api/leadertask/respPeriodicTask/getInfo/${id}`,
    method: 'post',
    data
  })
}
//确定任务完成
export function addRespApproval (data) {
  return selt.request({
    url: '/api/leadertask/RespCommitRec/approval',
    method: 'post',
    data
  })
}

//驳回
export function addReject (data) {
  return selt.request({
    url: '/api/leadertask/RespCommitRec/reject',
    method: 'post',
    data
  })
}

//佐证资料
export function getSupportingInformation (data) {
  return selt.request({
    url: '/api/leadertask/RespCommitRec/supportingInformation',
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

//通用任务夹
export function getListByAccess (data) {
  return selt.request({
    url: '/api/leadertask/folder/listByAccess',
    method: 'post',
    data
  })
}

// 关注/取消关注周期任务
export function getSetAttention (data) {
  return selt.request({
    url: '/api/leadertask/attention/setAttention',
    method: 'post',
    data
  })
}
//获取文件
export function getFileInfo (id) {
  return selt.request({
    url: `/api/sysfile/file_info/get/${id}`,
    method: 'get',
  })
}
//批量获取文件
export function getFileInfos (data) {
  return selt.request({
    url: `/api/sysfile/file_info/listByIds`,
    method: 'post',
    data
  })
}

// 获取完成速度
export function getCompleteSpeed (taskInstanceId) {
  return selt.request({
    url: `/api/leadertask/RespCommitRec/getCompleteSpeed/${taskInstanceId}`,
    method: 'get'
  })
}

//任务的一生
export function taskLife (data) {
  return selt.request({
    url: `/api/leadertask/respTaskInstance/taskLife`,
    method: 'post',
    data
  })
}