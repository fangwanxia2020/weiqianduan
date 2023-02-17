import Vue from 'vue'
const selt = Vue.prototype
// 试题
// 新增
export function addTopic(data) {
    return selt.request({
        url: '/train/topic/addTopic',
        method: 'post',
        data
    })
}

// 详情
export function getTopicDetail(topicId) {
    return selt.request({
        url: `/train/topic/${topicId}`,
        method: 'get'
    })
}

// 修改
export function modifyTopic(data) {
    return selt.request({
        url: '/train/topic/editTopic',
        method: 'post',
        data
    })
}

// 删除
export function delTopic(topicIds){
    return selt.request({
        url: `/train/topic/removeByIds/${topicIds}`,
        method: 'post'
    })
}

// 课程培训课件查询
export function getCourseList(data) {
    return selt.request({
        url: '/train/coursewareTopicRel/list',
        method: 'get',
        params: data
    })
}

// 培训课件新增
export function addCourseRel(data) {
    return selt.request({
        url: '/train/coursewareTopicRel/addCoursewareTopicRelList',
        method: 'post',
        data
    })
}

// 培训课件单个新增
export function addSingleCourse(data) {
    return selt.request({
        url: '/train/coursewareTopicRel/addCoursewareTopicRel',
        method: 'post',
        data
    })
}

// 培训课件删除
export function delCourseRel(coursewareTopicRelIds) {
    return selt.request({
        url: `/train/coursewareTopicRel/removeByIds/${coursewareTopicRelIds}`,
        method: 'post'
    })
}


// 审核
export function topicAudit(data) {
    return selt.request({
        url: '/train/topic/auditTopic',
        method: 'post',
        data
    })
}

// 导入
export function importApi(data) {
    return selt.request({
        url: '/train/topic/upload',
        method: 'post',
        data
    })
}
// 模板下载
export function getTemp() {
    return selt.request({
        url: '/train/topic/downloadTopicTemplate',
        method: 'post'
    })
}

// 标签列表
export function getLabel(data) {
    return selt.request({
        url: '/train/userLabel/list',
        method: 'get',
        params: data
    })
}

// 新增标签
export function addLabel(data) {
    return selt.request({
        url: '/train/userLabel/addUserLabel',
        method: 'post',
        data
    })
}

// 用户标签
export function getUserLabel(data) {
    return selt.request({
        url: '/train/topicUserLabel/list',
        method: 'get',
        params: data
    })
}

// 添加单个用户标签
export function addSingleLabel(data) {
    return selt.request({
        url: '/train/topicUserLabel/addTopicUserLabel',
        method: 'post',
        data
    })
}

// 批量添加标签
export function addMulLabel(data) {
    return selt.request({
        url: '/train/topicUserLabel/addTopicUserLabelList',
        method: 'post',
        data
    })
}

// 批量添加多个用户的标签
export function addMulUserLabel(data) {
    return selt.request({
        url: '/train/topicUserLabel/addTopicUserLabelBatch',
        method: 'post',
        data
    })
}