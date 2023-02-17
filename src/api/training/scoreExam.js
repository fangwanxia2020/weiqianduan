import Vue from 'vue'
const selt = Vue.prototype

// 试卷评分
//试卷评分-查询详情
export function getExamInfo(examPaperId) {
    return selt.request({
        url: `/train/examPaper/getExamInfo/${examPaperId}`,
        method: 'get'
    })
}

//查询考试评价列表
export function getExamEvaluate(params) {
    return selt.request({
        url: `/train/examEvaluate/list`,
        method: 'get',
        params
    })
}


//新增考试评价
export function addExamEvaluate(data) {
    return selt.request({
        url: `/train/examEvaluate/addExamEvaluate`,
        method: 'post',
        data
    })
}

//老师评卷-提交
export function editExamPaper(data) {
    return selt.request({
        url: `/train/examPaper/editExamPaper`,
        method: 'post',
        data
    })
}



