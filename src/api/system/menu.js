import Vue from 'vue'
const selt = Vue.prototype
export function treeList(data) {
  return selt.request({
    url: '/api/system/sys_menu/tree',
    method: 'post',
    data,
  })
}
// 查询菜单列表
export function listMenu(queryParams) {
  return selt.request({
    url: '/api/system/sys_menu/list',
    method: 'post',
    data: queryParams,
  })
}
// 查询菜单详细
export function getMenu(menuId) {
  return selt.request({
    url: '/api/system/sys_menu/get/' + menuId,
    method: 'get',
  })
}
// 查询菜单下拉树结构
export function treeselect() {
  return selt.request({
    url: '/system/system/menu/treeselect',
    method: 'get',
  })
}
// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId, belongType) {
  return selt.request({
    url: '/system/system/menu/roleMenuTreeselect/' + roleId + '/' + belongType,
    method: 'get',
  })
}
// 新增菜单
export function addMenu(data) {
  return selt.request({
    url: '/system/system/menu',
    method: 'post',
    data: data,
  })
}
// 新增/修改菜单
export function saveMenu(data) {
  return selt.request({
    url: '/api/system/sys_menu/save',
    method: 'put',
    data: data,
  })
}
// 删除菜单
export function delMenu(menuId) {
  return selt.request({
    url: '/api/system/sys_menu/remove/' + menuId,
    method: 'delete',
  })
}
