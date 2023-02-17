<template>
  <div class="content_box_row_col_history">
    <div class="content_box_row_col_history_test">历史记录</div>
      <div style="overflow: auto;">
          <div class="content_box_row_col_history_tab"   v-for="(item, index) in historyList"
                :key="index" >
              <div class="content_box_row_col_history_tab_list" v-if="item.commit!=9&&item.commit!=10">{{item.context}}</div>
              <div class="history-content" v-if="item.commit==9">
                  <div class="yijian">评审意见：{{item.context}}</div>
                  <div class="system-score">系统评分</div>
                  <div class="flex">
                      <div class="speed">完成速度:</div>
                      <el-rate
                        v-model="item.completeSpeed/2"
                        disabled
                        text-color="#ff9900"
                        :max="5"
                        score-template="{value}">
                      </el-rate>
                  </div>
                  <div class="split-line"></div>
                  <div class="system-score">审核人评分</div>
                  <div class="flex">
                      <div class="speed">完成质量:</div>
                      <el-rate v-model="item.score/2"  disabled  text-color="#ff9900" score-template="{value}" :max="5" :allow-half="true"></el-rate>
                  </div>
              </div>
              <div class="history-bohui" v-if="item.commit==10">
                  <div>评审意见：{{item.context}}</div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import {commitList} from "@/api/taskrelease/draftBox"
  export default {
    name: "history-record",
    props:{
      taskId: {
        type: [String,Number],
        default: ''
      },
      sonType: {
        type: [String,Number],
        default: 0
      },
      selectPersonType: {
        type: [String,Number],
        default: ''
      },
      sonName: {
        type: [String],
        default: 'taskId'
      },
    },
    data(){
      return{
        historyList:[]
      }
    },
    watch:{
      sonName:{
        handler:'init',
        immediate: true
      }
    },
    // mounted(){
    //   this.init()
    // },
    methods:{
      async init(){
        if(this.sonName == '') return
        let historyData = { [this.sonName]:this.taskId,parentId:this.sonType,selectPersonType:this.selectPersonType}
        const historyList = await commitList(historyData)
        this.historyList = historyList.data
      }
    }
  }
</script>

<style scoped lang="scss" >
.history-content {
        width: 100%;
        min-height: 250px;
        background-color: #F2F2F2;
        padding: 20px 10px;
    }
    .content {
        background: rgb(240, 242, 245);
        &_box {
            &_row {
                &_col {
                    &_history {
                      background: #fff;
                      height: 280px;
                      padding: 20px;
                      box-sizing: border-box;
                      overflow: auto;
                      &_test {
                          font-weight: 500;
                      }
                      &_tab {
                          margin-top: 5px;
                          font-size: 14px;
                          color: #999;
                          &_list {
                              margin-top: 5px;
                          }
                      }
                    }
                }
            }
        }
    }
</style>
