import Vue from 'vue'
const selt = Vue.prototype

// 统计面板
export function getStatistics() {
    return selt.request({
        url: '/train/trainPlan/getTrainStatistics',
        method: 'get'
    })
}

// 柱状图数据
export function getLearningNum(data) {
    return selt.request({
        url: `/train/trainPerson/getTrainPersonStudyStatistics?type=${data}`,
        method: 'get'
    })
}