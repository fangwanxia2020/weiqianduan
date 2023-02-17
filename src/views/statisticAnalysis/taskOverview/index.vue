<template>
  <div class="overView">
    <div class="overView_from">
      <div class="overView_from_one">
        <el-tabs :stretch="false" v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="周报" name="first"></el-tab-pane>
          <el-tab-pane label="月报" name="second"></el-tab-pane>
          <el-tab-pane label="季报" name="third"></el-tab-pane>
          <el-tab-pane label="半年报" name="fourth"></el-tab-pane>
          <el-tab-pane label="年报" name="five"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="overView_from_two">
        <el-select style="width:100%" v-model="value" size="medium" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.date"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select style="width:100%" v-model="value1" size="medium" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div  class="overView_from_three">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button>重置</el-button>
      </div>
    </div>

    <div class="overView_surface">
      <div>
        <div class="overView_surface_text">雷达图</div>
        <div id="main" style="width: 100%;height:400px;"></div>
      </div>
      <div class="overView_surface_case">
        <div class="overView_surface_text">任务情况 </div>
        <div class="overView_surface_case_taskText">新任务</div>
        <div class="overView_surface_case_num"><span>{{info.newTask}}</span>项</div>
        <div class="overView_surface_case_percent">
          同比
          <span :class="info.compareToLastTime > 100 ? 'up':'down'"></span> 
          <span :class="info.compareToLastTime > 100 ? 'up_color':'down_color'">{{info.compareToLastTime}}%</span></div>
        <div class="overView_surface_case_task">
          <div class="overView_surface_case_task_overdue">
            <img :src="overdue" >
            <div class="overView_surface_case_task_text">逾期任务</div>
            <div class="overView_surface_case_task_num">{{info.overdueTask}}</div>
          </div>
          <div class="overView_surface_case_task_temporary">
            <img :src="temporary" >
            <div class="overView_surface_case_task_text">临期任务</div>
            <div class="overView_surface_case_task_num">{{info.nearExpireTask}}</div>
          </div>
        </div>
      </div>
      <div class="overView_surface_tab">
        <div class="overView_surface_text">监督情况</div>
        <el-table
          :data="tableData"
          :border="true"
          style="width: 360px">
          <el-table-column
            prop="name"
            align="center"
            label="统计项"
            width="180">
          </el-table-column>
          <el-table-column
            prop="num"
            align="center"
            label="数量"
            width="180">
            <template slot-scope="scope">
                <div class="tab_num">{{scope.row.num}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>
<script>
var moment = require('moment');
import * as echarts from 'echarts';
import overdue from "@/assets/images/statisticAnalysis/overdue.png"
import temporary from "@/assets/images/statisticAnalysis/temporary.png"
import {sys_org,getTaskOverview} from "@/api/statisticAnalysis/taskOverview";

export default {
  data(){
    return{
      overdue,
      temporary,
      activeName: 'first',
      options: [],
      options1: [],
      value: '',
      value1: '',
      tableData:[],
      tabsIndex:'0',
      echartsValue:[],
      info:{},
      echartsOption:{
        tooltip:{
          show:true
        },
        radar: {
          indicator: [
            { name: '效率', max: 10 },
            { name: '质量', max: 10 },
            { name: '响应度', max: 10 },
            { name: '精准度', max: 10 },
          ]
        },
        series: [
          {
            type: 'radar',
            name: '雷达图',
            data: [
              {
                value: [],
              }
            ]
          }
      ]}
    }
  },
  mounted(){
    this.myChart = echarts.init(document.getElementById('main'));
  },
  async created(){
    await this.initWeek()
    await this.init()

    // await this.initMonth()
  },
  methods: {
    handleClick(tab, event) {
      this.tabsIndex = tab.index
      switch (tab.index){
        case '0':
          this.initWeek()
          break;
        case '1':
          this.initMonth()
          break;
        case '2':
          this.initQuarter()
          break;
        case '3':
          this.initSemester()
          break;
        case '4':
          this.initYear()
          break;
      }
      this.init()
    },
    async init(){
      const res = await sys_org()
      this.options1 = res.data
      this.value1 = res.data[0].id

      this.handleQuery()
    },
    async handleQuery(){
      let data = {}
      switch (this.tabsIndex){
        case '0'://周报
          let date = JSON.parse(this.value)
          data = {...date}
          data.beginTime = data.beginTime + " 00:00:00"
          data.endTime = data.endTime + " 23:59:59"
          data.lastBeginTime = moment(data.beginTime).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
          data.lastEndTime = moment(data.endTime).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '1'://月报
          data.beginTime = this.value
          data.endTime = moment(this.value).endOf('month').format("YYYY-MM-DD HH:mm:ss") 
          data.lastBeginTime = moment(data.beginTime).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss')
          data.lastEndTime = moment(moment(data.endTime).subtract(1,'months')).endOf('months').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '2'://季度报
          data.beginTime = this.value
          data.endTime = moment(moment().format(data.beginTime)).endOf('quarter').format("YYYY-MM-DD HH:mm:ss")
          data.lastBeginTime = moment(data.beginTime).subtract(3,'months').format('YYYY-MM-DD HH:mm:ss')
          data.lastEndTime =  moment(moment(data.endTime).subtract(3,'months')).endOf('months').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '3'://半年报
          data.beginTime = this.value
          data.endTime = moment(moment(data.beginTime).add(5,'months').endOf('months')).format("YYYY-MM-DD HH:mm:ss")
          data.lastBeginTime = moment(data.beginTime).subtract(6,'months').format('YYYY-MM-DD HH:mm:ss')
          data.lastEndTime = moment(moment(data.endTime).subtract(6,'months')).endOf('months').format('YYYY-MM-DD HH:mm:ss')
          break;
        case '4'://年报
          data.beginTime = this.value
          data.endTime = moment().endOf("year").format('YYYY-MM-DD HH:mm:ss')
          data.lastBeginTime = moment(data.beginTime).subtract(1,'year').format('YYYY-MM-DD HH:mm:ss')
          data.lastEndTime = moment(data.endTime).subtract(1,'year').format('YYYY-MM-DD HH:mm:ss')
          break;
      }
      data.orgId = this.value1
      
      const res = await getTaskOverview(data)
      this.info = res.data
      this.tableData = [{
        num:res.data.attentionTask,
        name:'被关注数'
      },{
        num:res.data.urgeTask,
        name:'被督办数'

      },{
        num:res.data.updateProgressTask,
        name:'更新进展数'
      }]
      let arr = [res.data.efficiency,res.data.quality,res.data.responsivity,res.data.accuracy]
      // let maxValue = Math.max.apply(null,arr)
      // if(maxValue > 10){
      //   this.echartsOption.radar.indicator.map(i=>{
      //     i.max = maxValue + 10
      //   })
      // }
      this.echartsOption.series[0].data[0].value = arr
      this.myChart.setOption(this.echartsOption);
    },
    //年报
    initYear(){
      let currentYear = moment().year()
      let monthData = [{
        date:`${currentYear}年`,
        value:`${currentYear}-01-01 00:00:00`
      }] 
      this.options = monthData
      this.value = monthData[monthData.length-1].value
    },
    //半年报
    initSemester(){
      let currentYear = moment().year() 
      let monthData = [{
        date:`${currentYear}年上半年`,
        value:`${currentYear}-01-01 00:00:00`
      }]
      let monthNum = moment().format("MM")
      if(monthNum >= 7){
        let obj ={
          date:`${currentYear}年下半年`,
          value:`${currentYear}-07-01 00:00:00`
        }
        monthData.push(obj)
      }
      this.options = monthData
      this.value = monthData[monthData.length-1].value
    },
    //季度报
    initQuarter(){
      let quarterData = []
      let quarterNum = moment().quarter()
      let currentYear = moment().year() // 当前年
      for (let i = 0; i < quarterNum; i++) {
        let obj = {}
        obj.date = `${moment().format('YYYY')}年第${i+1}季`
        obj.value = `${currentYear}-${i*3 + 1}-01 00:00:00`
        quarterData.push(obj)
      }
      this.options = quarterData
      this.value = quarterData[quarterData.length-1].value
    },
    //月报
    initMonth(){
      let monthData = []
      let monthNum = moment().format("MM")
      for (let i = 0; i < monthNum; i++) {
        let obj = {}
        obj.date = `${moment().format('YYYY')}年第${i+1}月`
        obj.value = `${moment().format('YYYY')}-${i+1}-01 00:00:00`
        monthData.push(obj)
      }
      this.options = monthData
      this.value = monthData[monthData.length-1].value
    },
    //周报
    initWeek(){
      // 对起止时间进行处理
      let beginTime = new Date(moment().format('YYYY')+'-01-01');
      // console.log(moment().format('YYYY')+'-01-01')
      let weekOfday1 = moment().format('E');
      //获取本周周末的日期
      let endTime = new Date(moment().add(7 - weekOfday1, 'days').format('YYYY-MM-DD'))
      // console.log(moment().add(7 - weekOfday1, 'days').format('YYYY-MM-DD'))
      // let endTime = new Date(moment().format("YYYY-MM-DD"));
      // console.log(moment().format("YYYY-MM-DD"))
      // 开始时间
      let bY = beginTime.getFullYear();
      let bM = beginTime.getMonth() + 1;
      bM = bM >= 10 ? bM : "0" + bM;
      let bD = beginTime.getDate();
      bD = bD >= 10 ? bD : "0" + bD;

      // 结束时间
      let eY = endTime.getFullYear();
      let eM = endTime.getMonth() + 1;
      eM = eM >= 10 ? eM : "0" + eM;
      let eD = endTime.getDate();
      eD = eD >= 10 ? eD : "0" + eD;

      let week = moment(`${eY}-${eM}-${eD}`).week() - moment(`${bY}-${bM}-${bD}`).week() ; // 计算周数 用来循环
      let weekOfDay = new Date(`${bY}-${bM}-${bD}`).getDay(); // 获取当前周几
      let weekDate = [] // 存放结果数据
      for (let i = 0; i < week; i++) {
        let next_monday = '', next_sunday = '', obj = {};
        next_monday = i == 0 ? `${bM}-${bD}` : moment(`${bY}-${bM}-${bD}`).add((7 - weekOfDay) + 7 * (i - 1) + 1, 'd').format('MM-DD'); 
        next_sunday = i == week - 1 ? `${eM}-${eD}` : moment(`${bY}-${bM}-${bD}`).add((7 - weekOfDay) + 7 * i, 'd').format('MM-DD');
        obj.date = `${moment().format('YYYY')}年第${i+1}周 ${next_monday} ~ ${next_sunday}`
        obj.value = JSON.stringify({'beginTime':`${moment().format('YYYY')}-${next_monday}`,'endTime':`${moment().format('YYYY')}-${next_sunday}`})
        weekDate.push(obj)
      }
      this.options = weekDate
      this.value = weekDate[weekDate.length-1].value
    },
  }
}
</script>
<style lang="scss" scoped>
.app-main-ctn .el-table {
  margin: 12px auto;
  .tab_num{
    color: #026dff;
    font-weight: bold;
  }
}

::v-deep .el-table--scrollable-x .el-table__body-wrapper{
	overflow-x:hidden ;
}
::v-deep .el-input__inner{
  height: 36px;
  width: 100%;
}
::v-deep .el-button{
  width: 100px;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 12px;
  box-sizing: border-box;
  cursor: pointer;
}
::v-deep .el-button--default{
  color: #026dff;
  border: 1px solid #026dff;
}
.overView{
  &_from{
    display: flex;
    padding-bottom: 30px;
    border-bottom: 1px solid rgb(233,233,233);
    &_two{
      margin: 0 30px;
      white-space: nowrap;
      max-width: 480px;
      flex-grow: 2;
      display: flex;
      .el-select{
        margin-right: 10px;
      }
    }
    &_three{
      margin-left: auto;
      display: flex;
      width: 280px;
    }
  }
  &_surface{
    padding-top: 30px;
    display: flex;
    &_case{
      text-align: center;
      &_taskText{
        color: rgb(170,170,170);
        font-size: 18px;
        font-weight: bold;
        margin-top: 30px;
      }
      &_num{
        font-size: 12px;
        margin-top: 15px;
        span{
          font-size: 18px;
          color: rgb(0,121,254);
        }
      }
      &_percent{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
        width: 100%;
        font-size: 14px;
        .up{
          margin: 0 3px;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 10px solid rgb(251,98,96);
        }
        .down{
          margin: 0 3px;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 10px solid #36eb3f;
        }
        .up_color{
          color: rgb(251,98,96);
        }
        .down_color{
          color: #36eb3f;
        }
        span{
          height: 100%;
          font-weight: bold;
        }
      }
      &_task{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40px;
        width: 100%;
        &_overdue{
          color: rgb(217,32,4);
          margin-right: 30px;
        }
        &_temporary{
          color: rgb(242,151,0);
        }
        &_text{
          font-size: 14px;
        }
        &_num{
          font-size: 18px;
          font-weight: bold;
        }
        img{
          width: 45px;
          height: 45px;
        }
      }
    }
    &_tab{
      .el-table{
        width: 100%;
      }
    }
    &_text{
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      color: rgb(102,102,102);
    }
    >div{
      width: 33.3%;
    }
  }
}
</style>