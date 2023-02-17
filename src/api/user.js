//用户管理----------
import Vue from 'vue';
const selt = Vue.prototype;
import store from '@/store'

export function login(data) {
  const {grant_type,client_id,client_secret,password,username}=data
  return selt.request({
    url: `auth/oauth/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&username=${username}&password=${password}`,
    method: 'post',
  })
}
export function getInfo() {
  return selt.request({
    url: `/auth/user/profile`,
    method: 'get'
  })
}
export function logout() {
  return selt.request({
    url: '/system/loginOut',
    method: 'get'
  })
}
export function getRouters() {
  return selt.request({
    url: `/api/system/sys_menu/route`,
    method: 'get'
  })
}


export function getAllRouters() {
  return selt.request({
    url: '/system/getAllRouters',
    method: 'get'
  })
}


// 根据tenantcode查询信息
export function getInfoByTenantcode(tenantCode) {
  return selt.request({
    url: `/system/tenant/getPersonalityInfo/${tenantCode}`,
    method: 'get'
  })
}


export function sendResetPhone(data) {
  return selt.request({
    url: '/system/sendResetPhone',
    method: 'post',
    data
  })
}
export function resetPassword(data) {
  return selt.request({
    url: '/system/resetPassword',
    method: 'post',
    data
  })
}

// 微信登录
export function loginByWeChat(data) {
  return selt.request({
    url: '/system/loginByWeChat',
    method:'post',
    data
  })
}

// 微信绑定
export function addSysOauth(data) {
  return selt.request({
    url: '/system/oauth/addSysOauth',
    method: 'post',
    data
  })
}
// 微信是否绑定
export function checkAuth(userId) {
  return selt.request({
    url: `/system/oauth/isAssociate/${userId}`,
    method: 'get',
  })
}
// 微信解绑
export function removeAuth(oauthIds) {
  return selt.request({
    url: `/system/oauth/removeByIds/${oauthIds}`,
    method:'post'
  })
}