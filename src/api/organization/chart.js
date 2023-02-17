import Vue from 'vue'
const selt = Vue.prototype


// 获取 组织架构的树形数据
export function organizationChart (data) {
    return selt.request({
      url: '/api/system/sys_org/tree',
      method: 'post',
      data
    })
}


// 获取组织详情
export function getOrganizationDetails (id) {
    return selt.request({
      url: `/api/system/sys_org/get/${id}`,
      method: 'GET'
    })
}

// 删除组织
export function deleteOrganization (id) {
  return selt.request({
    url: `/api/system/sys_org/remove/${id}`,
    method: 'DELETE'
  })
}


// 新增 或者 编辑  组织
export function addOrganization (data) {
  return selt.request({
    url: `/api/system/sys_org/save`,
    method: 'PUT',
    data
  })
}

// 根据组织ID 获取部门树状图
export function developmentChart (data) {
    return selt.request({
      url: '/api/system/sys_dept/tree',
      method: 'post',
      data
    })
}

// 获取部门详情
export function getDepartDetails (id) {
  return selt.request({
    url: `/api/system/sys_dept/get/${id}`,
    method: 'GET'
  })
}


// 删除部门
export function deletePart (id) {
  return selt.request({
    url: `/api/system/sys_dept/remove/${id}`,
    method: 'DELETE'
  })
}

// 新增 或者 编辑  部门
export function addDepartment (data) {
  return selt.request({
    url: `/api/system/sys_dept/save`,
    method: 'PUT',
    data
  })
}


// 根据部门ID 获取岗位树状图
export function postChart(deptId) {
    return selt.request({
      url: `/api/system/sys_post/listByDeptId/${deptId}`,
      method: 'post'
    })
}

// 获取岗位详情
export function getPeopleDetails (id) {
  return selt.request({
    url: `/api/system/sys_post/get/${id}`,
    method: 'GET'
  })
}

// 删除岗位
export function deletePeople (id) {
  return selt.request({
    url: `/api/system/sys_post/remove/${id}`,
    method: 'DELETE'
  })
}

// 新增 或者 编辑  岗位
export function addPost (data) {
  return selt.request({
    url: `/api/system/sys_post/save`,
    method: 'PUT',
    data
  })
}

