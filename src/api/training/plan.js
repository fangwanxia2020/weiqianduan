
import Vue from 'vue'
const selt = Vue.prototype
// 查询部门下拉树结构
export function treeselect() {
    return selt.request({
        url: '/system/system/dept/treeselect',
        method: 'get'
    })
}

// 详情
export function getPlanDetail(trainPlanId) {
    return selt.request({
        url: `/train/trainPlan/${trainPlanId}`,
        method: 'get'
    })
}

// 新增
export function addPlan(data) {
    return selt.request({
        url: '/train/trainPlan/addTrainPlan',
        method: 'post',
        data
    })
}

// 修改
export function modifyPlan(data) {
    return selt.request({
        url: '/train/trainPlan/editTrainPlan',
        method: 'post',
        data
    })
}

// 删除
export function delPlan(trainPlanIds) {
    return selt.request({
        url: `/train/trainPlan/removeByIds/${trainPlanIds}`,
        method: 'post'
    })
}

// 需求列表
export function getDemandList(data) {
    return selt.request({
        url: '/train/trainDemand/list',
        method: 'get',
        params: data
    })
}

// 详情列表
export function getRelList(data) {
    return selt.request({
        url: '/train/demandPlanRel/getList',
        method: 'get',
        params: data
    })
}

// 受训人员
// 列表
export function getTraineeList(data) {
    return selt.request({
        url: '/train/trainPerson/getList',
        method: 'get',
        params: data
    })
}

// add
export function addTrainee(data) {
    return selt.request({
        url: '/train/trainPerson/addTrainPerson',
        method: 'post',
        data
    })
}

// 批量add
export function mulAddTrainee(data) {
    return selt.request({
        url: '/train/trainPerson/addTrainPersonList',
        method: 'post',
        data
    })
}

// delete
export function delTrainee(trainPersonIds) {
    return selt.request({
        url: `/train/trainPerson/removeByIds/${trainPersonIds}`,
        method: 'post'
    })
}

// 课件
// list
export function getCourseList(data) {
    return selt.request({
        url: '/train/planCourseware/list',
        method: 'get',
        params: data
    })
}

// add
export function addCourseRel(data) {
    return selt.request({
        url: '/train/planCourseware/batchPlanCourseware',
        method: 'post',
        data
    })
}

// del
export function delCoureseRel(planCoursewareIds) {
    return selt.request({
        url: `/train/planCourseware/removeByIds/${planCoursewareIds}`,
        method: 'post'
    })
}

// preview
export function coursePreview(coursewareId) {
    return selt.request({
        url: `/train/courseware/${coursewareId}`,
        method: 'get'
    })
}

// 考题维护
// list
export function getMaintanceDetail(trainPlanId) {
    return selt.request({
        url: `/train/planAssessment/${trainPlanId}`,
        method: 'get'
    })
}
// 统计
export function getTotal(trainPlanId) {
    return selt.request({
        url: `/train/topic/selectByTrainPlan/${trainPlanId}`,
        method: 'get'
    })
}

// add
export function addMaintance(data) {
    return selt.request({
        url: '/train/planAssessment/addAndModifyPlanAssessment',
        method: 'post',
        data
    })
}

// delete
export function delMaintance(planAssessmentIds) {
    return selt.request({
        url: `/train/planAssessment/removeByIds/${planAssessmentIds}`,
        method: 'post'
    })
}

// 考题维护题目列表
export function getQuestionList(data) {
    return selt.request({
        url: '/train/topic/getTopicByTrainPlanId',
        method: 'get',
        params: data
    })
}

// 审核
export function planAudit(data) {
    return selt.request({
        url: '/train/trainPlan/auditTrainPlan',
        method: 'post',
        data
    })
}

// 模拟试题
export function getSimulation(trainPlanId) {
    return selt.request({
        url: `/train/topic/simulationTopic/${trainPlanId}`,
        method: 'get'
    })
}

//提交审核校验
export function getAuditCheck(trainPlanId) {
    return selt.request({
        url: `/train/trainPlan//auditCheck/${trainPlanId}`,
        method: 'get'
    })
}


// 受训人员下、添加受训人员
export function addTraineeNew(data) {
    return selt.request({
        url: `/train/trainPerson/addTrainPersonByDept`,
        method: 'post',
        data
    })
} 

// 受训人员 - 外部查询
export function getOutTree(data) {
    return selt.request({
        url: '/system/contractorInfo/listNoPage',
        method: 'post',
        data
    })
}

// 受训人员 -- 外部列表
export function getOutList(data) {
    return selt.request({
        url: '/system/outsiderInfo/listOutsider',
        method: 'get',
        params: data
    })
}

// 确认新需求加入---需求列表
export function getNewDemandSure(data) {
    return selt.request({
        url: '/train/demandPlanRel/getList',
        method: 'get',
        params: data
    })
}

// 确认新需求加入
export function sureAddNew(data){
    return selt.request({
        url: '/train/demandPlanRel/updateNewDemandStatus',
        method: 'post',
        data
    })
}