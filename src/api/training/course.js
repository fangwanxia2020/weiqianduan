import Vue from 'vue'
const selt = Vue.prototype

// 教育培训
// 列表
export function getCourseList(data) {
    return selt.request({
        url: '/train/courseware/list',
        method: 'get',
        params: data
    })
}
// 详情
export function getCourseDetail(coursewareId) {
    return selt.request({
        url: `/train/courseware/${coursewareId}`,
        method: 'get'
    })
}

// 新增
export function addCourse(data) {
    return selt.request({
        url: '/train/courseware/addCourseware',
        method: 'post',
        data
    })
}

// 修改
export function modifyCourse(data) {
    return selt.request({
        url: '/train/courseware/editCourseware',
        method: 'post',
        data
    })
}

// 删除
export function delCourse(coursewareIds) {
    return selt.request({
        url: `/train/courseware/removeByIds/${coursewareIds}`,
        method: 'post'
    })
}

// 课件评论列表
export function getComment(data) {
    return selt.request({
        url: '/train/coursewareComment/getList',
        method: 'get',
        params: data
    })
}

// 承包商
export function getOrgList(data) {
    return selt.request({
        url: '/system/contractorInfo/list',
        method: 'get',
        params: data
    })
}

// 审核
export function courseAudit(data) {
    return selt.request({
        url: '/train/courseware/auditCourseware',
        method: 'post',
        data
    })
}

// 课件使用情况
export function getUsage(coursewareId) {
    return selt.request({
        url: `/train/courseware/getCoursewareUse/${coursewareId}`,
        method: 'get'
    })
}

// 培训课件绑定查询
export function getListNoPage(data) {
    return selt.request({
        url: '/train/coursewareTopicRel/list',
        method: 'get',
        params: data
    })
}
// 课件关联题库新增
export function addRel(data) {
    return selt.request({
        url: '/train/coursewareTopicRel/addCoursewareTopicRelListNew',
        method: 'post',
        data
    })
}
// 课件关联题库删除
export function delRel(coursewareTopicRelIds) {
    return selt.request({
        url: `/train/coursewareTopicRel/removeByIds/${coursewareTopicRelIds}`,
        method: 'post'
    })
}