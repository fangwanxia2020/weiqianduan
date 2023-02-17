import Vue from 'vue'
const selt = Vue.prototype

// 我的考试
// 根据规则生成试题
export function getGenerateTopic(trainPlanId) {
    return selt.request({
        url: `/train/topic/generateTopic/${trainPlanId}`,
        method: 'get'
    })
}

//新增我的考卷(交卷)
export function addExamPaper(data) {
    return selt.request({
        url: `/train/examPaper/addExamPaper`,
        method: 'post',
        data
    })
}

//查询考卷详情(考试回看)
export function getExamPaper(examPaperId) {
    return selt.request({
        url: `/train/examPaper/${examPaperId}`,
        method: 'get'
    })
}


//获取培训计划考核维护详细信息
export function getPlanAssessment(trainPlanId) {
    return selt.request({
        url: `/train/planAssessment/${trainPlanId}`,
        method: 'get'
    })
}


//新增试题反馈
export function addExamFeedback(data) {
    return selt.request({
        url: `/train/examFeedback/addExamFeedback`,
        method: 'post',
        data
    })
}

//查询试题反馈列表
export function getExamFeedback(params) {
    return selt.request({
        url: `/train/examFeedback/list`,
        method: 'get',
        params
    })
}

//生成试题校验
export function generateTopicCheck(trainPlanId) {
    return selt.request({
        url: `/train/topic/generateTopicCheck/${trainPlanId}`,
        method: 'get'
    })
}

//我的考试详情查看
export function getExamInfo(trainPlanId) {
    return selt.request({
        url: `/train/trainPlan/getExamInfo/${trainPlanId}`,
        method: 'get'
    })
}
