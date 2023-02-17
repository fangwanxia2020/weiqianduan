import Vue from 'vue'
const selt = Vue.prototype

// 新增用户
export function addUser(data) {
  return selt.request({
    url: '/api/system/sys_role/save',
    method: 'PUT',
    data,
  })
}

// 查询角色组织授权编号
export function getRoleByOrg(data) {
  return selt.request({
    url: `/api/system/sys_role/listOrgIdsByRoleId/${data}`,
    method: 'POST',
  })
}

// 查询角色组织部门授权编号
export function getRoleByDeaprt(data) {
  return selt.request({
    url: `/api/system/sys_role/listDeptIdsByRoleId/${data}`,
    method: 'POST',
  })
}

//保存角色组织授权
export function saveRoleByOrg(data) {
  return selt.request({
    url: `/api/system/sys_role/saveRoleOrgs`,
    method: 'PUT',
    data,
  })
}
//保存角色组织授权
export function saveRoleByDepart(data) {
  return selt.request({
    url: `/api/system/sys_role/saveRoleDepts`,
    method: 'PUT',
    data,
  })
}
// 查询角色菜单授权编号
export function list_MenuID(id) {
  return selt.request({
    url: `/api/system/sys_role/listMenuIdsByRoleId/${id}`,
    method: 'POST',
  })
}
// 查询角色菜单
export function post_By_Menu() {
  return selt.request({
    url: '/api/system/sys_menu/treeByMenuTypes',
    method: 'POST',
    data: ['M', 'C', 'F', 'T'],
  })
}
//保存角色菜单授权
export function saveMenuByOrg(data) {
  return selt.request({
    url: '/api/system/sys_role/saveRoleMenus',
    method: 'PUT',
    data,
  })
}
