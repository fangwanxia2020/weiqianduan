import Vue from 'vue'
const selt = Vue.prototype

// 新增需求
export function addDemand(data) {
    return selt.request({
        url: '/train/trainDemand/addTrainDemand',
        method: 'post',
        data
    })
}

// 需求详情
export function getDemandDetail(trainDemandId) {
    return selt.request({
        url: `/train/trainDemand/${trainDemandId}`,
        method: 'get'
    })
}

// 修改需求
export function modifyDemand(data) {
    return selt.request({
        url: '/train/trainDemand/editTrainDemand',
        method: 'post',
        data
    })
}

// 岗位列表
// export function treeselect() {
//     return selt.request({
//       url: '/system/system/dept/treeselect',
//       method: 'get'
//     })
//   }

export function getPostList() {
    return selt.request({
        url: '/system/system/post/listOfOrg',
        method: 'get'
    })
}

// 删除
export function delDemand(trainDemandIds) {
    return selt.request({
        url: `/train/trainDemand/removeByIds/${trainDemandIds}`,
        method: 'post'
    })
}

// 获取需求相关
export function getDemandRel(data) {
    return selt.request({
        url: '/train/demandPlanRel/getList',
        method: 'get',
        params: data
    })
}

// 加入培训计划
export function addToPlan(data) {
    return selt.request({
        url: '/train/demandPlanRel/addDemandPlanRel',
        method: 'post',
        data
    })
}

// 计划列表
export function getPlan(data) {
    return selt.request({
        url: '/train/trainPlan/getList',
        method: 'get',
        params: data
    })
}