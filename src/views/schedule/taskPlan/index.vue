<template>
    <div class="schedule">
        <div class="schedule_title">工作进度巡检</div>
        <div class="schedule_listArry">
            <div v-for="(item,index) in  listArry" style="cursor : pointer" :key="index" @click="option(index)"  :class="item.active?'active':''">
                <div>{{item.label}}</div>
                <div>{{item.value}}项</div>
            </div>
        </div>
        <div class="schedule_list" 
          v-for="(item,index) in tableData" 
          :key="index"  
          @click="navigater(`/leadertask/schedule/taskPlan/detail?id=${item.id}`)"
        >
          <div class="schedule_list_item">
              <div class="item_1">
              <el-tag v-if="item.urgency==0" type="danger">特急</el-tag>
            <el-tag  v-if="item.urgency==1"  type="warning">加急</el-tag>
            <el-tag  v-if="item.urgency==2"  type="success">普通</el-tag>
                  <span class="item_name">{{item.name}}</span>
              </div>
              <div class="item_2">
                <span class="item_2_1">截止：{{item.deadlineTime.substring(0, 16)}}</span>
                <span  :class="item.comingToEndDateType?'item_2_2':'item_2_3'">{{item.comingToEndDateType?'剩余':'逾期'}}{{item.comingToEndDateTime}}</span>
              </div>
              <div></div>
          </div>
        </div>
        <el-pagination 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange"
          style="text-align:left;margin-top:20px"
          :current-page="form.pageNum" :page-sizes="[10, 20, 30]" :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total"
        >
        </el-pagination>
    </div>
</template>
<script>
    import {
        getTask,
        getCount
    } from "@/api/schedule/taskPlan";
    export default {
        data() {
            return {
                tableData: [],
                form: {
                    pageNum: 1,
                    pageSize: 10,
                    query: {
                        dateType: 0,
                    }
                },
                  listArry: [{
                        value: '',
                        label: '今天有进度',
                        date: 1,
                        active: true
                    },
                    {
                        value: '',
                        label: '3天内有进度',
                        date: 2,
                        active: false
                    },
                    {
                        value: '',
                        label: '7天内有进度',
                        date: 3,
                        active: false
                    },
                    {
                        value: '',
                        label: '7天外有进度',
                        date: 4,
                        active: false
                    },
                    {
                        value: '',
                        label: '超7天无进度',
                        date: 5,
                        active: false
                    },
                ],
                total: 0
            }
        },
        async created() {
         this.getCount()
            this.listTab()
        },
        methods: {
               listTab() {
                for (let item of this.listArry) {
                    if (item.active == true) {
                        this.form.query.dateType = item.date
                        this.getList()
                    }
                }
            },
            async getList() {
                const res = await getTask(this.form)
                this.tableData = res.data.list
                this.total = res.data.pagination.total
            },

           async getCount(){
                   const res = await getCount('task')
                   for( let index in res.data){
                    this.listArry[index].value = res.data[index]
                   }
            },
            handleSizeChange(val) {
                this.form.pageSize = val
                this.getList()
            },
            handleCurrentChange(val) {
                 this.form.pageNum = val
                this.getList()
            },
            option(index) {
                this.form.pageNum = 1
                this.form.pageSize = 10

                for (let i in this.listArry) {
                    if (this.listArry[index].active == this.listArry[i].active && this.listArry[index].active == true) {
                        return
                    }
                    this.listArry[i].active = false
                }
                this.listArry[index].active = true

                this.listTab()
            }
        }
    }
</script>
<style lang="scss" scoped>
.schedule {
  &_title {
    font-size: 26px;
    font-weight: 600;
    margin: 20px;
    margin-left: 0;
  }
  &_listArry{
    width: 70%;
    text-align: center;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    cursor: pointer;
  }
  &_total {
    height: 60px;
    margin: 10px 0;
    .total_title {
      font-size: 20px;
      height: 50px;
      line-height: 50px;
      font-weight: 600;
      margin-right: 10px;
    }
    .total_count {
      color: #0079FE;
      font-size: 26px;
      height: 50px;
      line-height: 50px;
    }
  }
  &_list {
    margin-bottom: 6px;
    width: 70%;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    &_item {
      background-color: rgba(247,247,247);
      overflow: hidden;
      padding: 10px 20px;
      .item_1 {
        height: 30px;
      }
      .item_2 {
        float: right;
        height: 30px;
        min-width: 320px;
        text-align: left;
        font-size: 14px;
        &_1 {
          margin-right: 20px;
        }
        &_2 {
          color: #0079FE;
        }
        &_3 {
          color: rgb(251,98,96);
        }
      }
    }
  }
}
::v-deep .el-form-item {
  margin-right: 70px;
}
.item_name{
  margin-left: 10px;
  font-weight: bold;
}
    .active {
        color: rgb(0, 121, 254);
        border-bottom: 1rpx solid rgb(0, 121, 254);
    }
</style>