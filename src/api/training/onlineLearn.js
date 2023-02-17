import Vue from 'vue'
const selt = Vue.prototype

// 在线学习
// 详情
export function getTrainPlanDetail(trainPlanId) {
    return selt.request({
        url: `/train/trainPlan/${trainPlanId}`,
        method: 'get'
    })
}

//参加学习-查询教育培训课件列表
export function getListByPlan(trainPlanId) {
    return selt.request({
        url: `/train/courseware/getListByPlan/${trainPlanId}`,
        method: 'get'
    })
}


//新增课件评论
export function addCoursewareComment(data) {
    return selt.request({
        url: `/train/coursewareComment/addCoursewareComment`,
        method: 'post',
        data
    })
}

//查询计划中所有课件评论列表
export function getCoursewareCommentListByPlan(trainPlanId) {
    return selt.request({
        url: `/train/coursewareComment/getListByPlan/${trainPlanId}`,
        method: 'get'
    })
}

//查询课件评论列表
export function getCoursewareCommentList(query) {
    return selt.request({
        url: `/train/coursewareComment/getList`,
        method: 'get',
        params: query
    })
}



//了解更多计划(计划列表)
export function getPlanList(query) {
    return selt.request({
        url: `/train/trainPlan/getPlanListByUser`,
        method: 'get',
        params: query
    })
}


//模拟考试-查询所有试题
export function getTopicListByTrainPlanId(query) {
    return selt.request({
        url: `/train/topic/getTopicListByTrainPlanId`,
        method: 'get',
        params: query
    })
}

//更新点击量和学习数
export function updateNum(trainPlanId) {
    return selt.request({
        url: `/train/trainPlan/updateNum/${trainPlanId}`,
        method: 'post'
    })
}


//新增用户学习课件记录
export function addStudyCourseware(data) {
    return selt.request({
        url: `/train/studyCourseware/addStudyCourseware`,
        method: 'post',
        data
    })
}

// 文件学习记录
export function addCoursewareFileStudy(data) {
    return selt.request({
        url: '/train/coursewareFileStudy/addCoursewareFileStudy',
        method: 'post',
        data
    })
}