<template>
    <div class="content">
        <div class="content_box">
            <el-row class="content_box_row" :gutter="10">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <div class="content_box_row_col_details">
                        <div class="content_box_row_col_details_title">
                            <div>{{tastObj.name}}</div>
                          <div class="content_box_row_col_details_title_handle">
                            <div class="content_box_row_col_details_title_handle_concern" v-if="sonDataList.length"  @click="dialogVisible = true"> 
                              <img :src="search" >
                              <span>子任务</span>
                            </div>
                          </div>
                        </div>
                        <div class="content_box_row_col_details_one">任务内容</div>
                        <div class="content_box_row_col_details_two">{{tastObj.taskContent}}</div>
                    </div>
                </el-col>
                <el-col :span='8' class="content_box_row_col">
                    <el-tabs v-model="activeName" @tab-click="handleClick" class="content_box_row_col_tabs">
                        <el-tab-pane label="基础信息" name="first" class="content_box_row_col_tabs_pane">
                            <div class="content_box_row_col_tabs_pane_tab">
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    任务状态：<span>{{formatTackType(tastObj.status)||'无'}}</span></div>
                                <div class="content_box_row_col_tabs_pane_tab_list">任务类型：<span>{{tastObj.tackTypeName||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">截止时间：<span>{{tastObj.deadlineTime.substring(0, 16)||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">创建人：<span>{{tastObj.createName||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">负责人：<span>{{tastObj.personName||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    审核人：<span>{{tastObj.veriftPen||'无'}}</span></div>
                                <div class="content_box_row_col_tabs_pane_tab_list">紧急程度：<span>{{formatUrgency(tastObj.urgency)||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    任务进度：<span>{{tastObj.taskProgress|| 0}}%</span></div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="任务的一生" name="second" class="content_box_row_col_tabs_pane">
                            <div class="content_box_row_col_tabs_pane_tab" v-for="(item,index) in taskLifeList" :key="index">
                                <div class="content_box_row_col_tabs_pane_tab_list">{{item}}</div>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </el-col>
            </el-row>
            <el-row class="content_box_row" :gutter="10">
                <el-col :span='16'>
                    <evidence-data :taskId="taskId" :sonName="sonType == 1?'taskInstanceId':'taskId'"></evidence-data>

          <history-record :taskId="taskId" :sonName="sonType == 1?'taskInstanceId':'taskId'"></history-record>
                </el-col>
                <el-col :span='8'>
                    <div class="content_box_row_col_adjunct">
                        <div class="content_box_row_col_adjunct_test">
                            <span class="content_box_row_col_adjunct_test_left">附件</span>
                            <span class="content_box_row_col_adjunct_test_mid">附件{{this.totalFiles.length}}个</span>
                            <span class="content_box_row_col_adjunct_test_rigth" @click="packDown">打包下载</span>
                        </div>
                        <div style="height:200px;overflow: auto;">
                            <div class="content_box_row_col_adjunct_list" v-for="(item,index) in totalFiles" :key="index">
                                <span class="content_box_row_col_adjunct_list_test">{{item.name}}</span>
                                <span class="content_box_row_col_adjunct_list_size">{{item.fileSize/1000}}kb</span>
                                <span class="content_box_row_col_adjunct_list_operator"
                                      @click="lookHandle(item.downloadUrl)">预览</span>
                                <span class="content_box_row_col_adjunct_list_operator" @click="getDownload(item)">下载</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content_box_row">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <!-- <div class="content_box_row_col_history">
                        <div class="content_box_row_col_history_test">历史记录</div>
                        <div style="overflow: auto;height:200px ">
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
                                        <el-rate v-model="item.score/2" disabled  text-color="#ff9900" score-template="{value}" :max="5" :allow-half="true"></el-rate>
                                    </div>
                                </div>
                                <div class="history-bohui" v-if="item.commit==10">
                                    <div>评审意见：{{item.context}}</div>
                                </div>
                            </div>
                        </div>

                    </div> -->

                </el-col>
            </el-row>
        </div>
        <el-dialog
          style="width: 100%"
          title="子任务"
          :visible.sync="dialogVisible"
        >
          <el-table  style="width: 100%"
          :data="sonDataList"
          >
              <el-table-column
              prop="personName"
              label="负责人"
              >
              </el-table-column>
              <el-table-column
                prop="statusName"
                label="阶段">
              </el-table-column>
              <el-table-column
                  prop="taskProgress"
                  sortable
                  width="150"
                  label="任务进度">
                <template slot-scope="scope">
                    <el-progress type="circle" :width="35" :percentage="scope.row.taskProgress || 0"></el-progress>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                  size="mini"
                  type="text"
                  @click="navigater(`/leadertask/schedule/taskPlan/detail?id=${scope.row.id}&sonType=1`)"
                  >查看
                  </el-button>
                </template>
              </el-table-column>
          </el-table>
          <div class="botton_nav">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper"
            :current-page.sync="queryParams.currPage"
            :page-size="queryParams.pageSize"
            :page-sizes="[10, 15, 20]"
            :total="total"
            >
            </el-pagination>
          </div>
        </el-dialog>
        <button-footer
          :showConfirm="!isCheck"
          :showCancel="isCheck"
          :confirmText="'返回'"
          
          @confirm="goback()"
        ></button-footer>
    </div>
</template>
<script>
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import {downloadPackageByResourceId} from "@/api/taskrelease/draftBox"

  import {getRespTaskDetails, taskLife,getFileInfos,getRespCommitRec,getSupportingInformation,getDownload,getFileInfo} from "@/api/auditCenter/index";
  import {respTaskList} from "@/api/taskrelease/havePublished"
  import HistoryRecord from "@/components/HistoryRecord/HistoryRecord"
  import EvidenceData from "@/components/EvidenceData/EvidenceData"
  import search from "@/assets/images/taskcycle/search.png"

  export default {
    components: {
      ButtonFooter,
      HistoryRecord,
      EvidenceData
    },
    data() {
      return {
        search,
        taskLifeList:[],
        totalFiles:[],
        scope:3.7,
        fileIdList:[],
        historyList:[],
        deptList:[],
        checkScope: '',
        taskId:'',
        sonType:0,
        dialogVisible:false,
        isCheck: false,
        activeName: 'first',
        supportingInformation: {},
        tastObj: {},
        queryParams: {
          pageNum: 1,
          currPage: 1,
          pageSize: 10,
          isPeriodicTask: 1,
          query: {
            isPeriodicTask: 1,
          }
        },
        total: 0,
      }
    },
    computed:{
      sonDataList(){
        return this.deptList.filter(item =>{
          return item.statusName = ['草稿','进行中','逾期','待审核','完成','作废'][Number(item.status)/10 - 1]
        })
      }
    },
    created() {
      const {id,sonType} = this.$route.query
      this.taskId = id
      this.sonType = sonType
      this.getList();
      this.getRespCommitRec();
      this.getSupportingInformation();
      this.taskLife();
      this.queryParams.query.parentId= this.$route.query.id
      this.sonGetList()
    },
    methods: {
      //分页
      handleSizeChange(val) {
        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = val;
        this.sonGetList();
      },
      //分页
      handleCurrentChange(val) {
        this.queryParams.pageNum = val;
        this.sonGetList();
      },
      async handleSubtask() {
        this.dialogVisible = true
        await this.sonGetList()
      },
      sonGetList() {
        this.loading = true;
        respTaskList(this.queryParams).then(response => {
          this.deptList = response.data.list
          this.total = response.data.pagination.total;
          this.loading = false;
        });
      },
      //预览
      lookHandle(url) {
        this.previewFile(url)
      },
      //打包下载
      async packDown(){
        if(!this.totalFiles.length) return
        const res =  await downloadPackageByResourceId(this.taskId)
        console.log("res", res)
        const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'})
        this.createDownLoadClick(blob, '打包文件.zip');
      },
      //下载
      getDownload(item){
        getDownload({id: item.id}).then((res) => {
          const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'})
          this.createDownLoadClick(blob, item.name);
        });
      },
      //创建a标签下载
      createDownLoadClick(content, fileName) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      },

      commitFormat(val){
        let commit={
          1:'创建',
          2:'修改',
          3:'发布',
          4:'更新进度',
          5:'提交审批',
          6:'驳回',
          7:'审核通过',
        }
        return commit[val]
      },
      getSupportingInformation(){
        getSupportingInformation({
          taskId: this.$route.query.id,
          taskInstanceId: this.$route.query.taskInstanceId
        }).then(response => {
          this.supportingInformation= response.data
         if(response.data.fileIdList!=null&&response.data.fileIdList.length!=0){

           this.getFile(response.data.fileIdList)
         }
        });
      },
      taskLife(){
        taskLife({
          taskId: this.$route.query.id
        }).then(response => {
          this.taskLifeList= response.data
        });
      },

      goback(){
        this.$router.go(-1);
      },
       getFile(fileIds) {
         getFileInfos(fileIds).then(response => {
           if(response.data.length!=0){
             this.fileIdList=response.data
           }
         });
      },


      getRespCommitRec() {
        getRespCommitRec({
          taskId: this.$route.query.id,
          taskInstanceId: this.$route.query.taskInstanceId
        }).then(response => {
          this.historyList = response.data
        });
      },
      formatTackType(val) {
        if (val == 10) {
          return '草稿'
        } else if (val == 20) {
          return '进行中'
        } else if (val == 30) {
          return '逾期'
        } else if (val == 40) {
          return '待审核'
        } else if (val == 50) {
          return '完成'
        } else if (val == 60) {
          return '作废'
        }
      },
      formatUrgency(val) {
        if (val == 0) {
          return '特急'
        } else if (val == 1) {
          return '加急'
        } else if (val == 2) {
          return '普通'
        }
      },
      getList() {
        getRespTaskDetails(this.$route.query.id).then(response => {
          this.tastObj = response.data;
          if(this.tastObj.fileIds){
            this.getFileTastObj(this.tastObj.fileIds)
          }
        });
      },
      getFileTastObj(fileIds) {
        this.totalFiles=[]
        getFileInfos(fileIds).then(response => {
          this.totalFiles=response.data
        });
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
    }
  }
</script>
<style lang="scss" scoped>
::v-deep .botton_nav{
  margin-top: 12px !important;
  padding-bottom: 12px;
}
::v-deep .el-tabs__item{
  height: 30px;
  line-height: 30px;
}
    .history-content {
        width: 100%;
        min-height: 250px;
        background-color: #F2F2F2;
        padding: 20px 10px;
    }

    .yijian {
        padding-bottom: 10px;
        border-bottom: 1px #AAAAAA dashed;
    }

    .system-score {
        color: #026DFF;
        padding: 10px 0;
        font-weight: 600;
        font-size: 16px;
    }

    .flex {
        display: flex;
        width: 100%;
    }

    .flex-space-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .padding-bottom-10{
        padding-bottom: 10px;
        border-bottom: 1px #AAAAAA dashed;
    }
    .split-line {
        width: 100%;
        border-bottom: 1px #AAAAAA dashed;
    }

    .speed {

        font-size: 16px;
        padding-bottom: 30px;
    }

    .left-data {
        padding: 20px;
        background-color: white;
        min-height: 300px;
    }

    .data-title {
        font-size: 16px;
        font-weight: 600;
        padding-bottom: 10px;
    }

    .data-content {
        width: 100%;
        min-height: 200px;
        background-color: #F2F2F2;
        padding: 10px 10px 30px 10px;
    }
    .history-bohui{
        padding: 20px 10px;
        background-color: #F2F2F2;
    }
    .app-main .app-main-wrap .app-main-ctn > .content {
        padding: 0 !important;
    }

    .content {
        background: rgb(240, 242, 245);

        &_box {
            &_row {
                &_col {
                    &_details {
                        background: #fff;
                        min-height: 420px;
                        margin-bottom: 10px;
                        padding: 20px;

                        &_title{
                          font-weight: 600;
                          padding-bottom: 8px;
                          border-bottom: 1px solid #f0f2f5;
                          display: flex;
                          justify-content: space-between;
                          &_handle{
                            font-weight: 100;
                            font-size: 14px;
                            display: flex;
                            align-content: center;
                            &_concern{
                              display: flex;
                              align-content: center;
                              margin-right: 30px;
                            }
                            >div{
                              cursor:pointer;
                            }
                            img{
                              height: 20px;
                              width: 24px;
                              margin-right: 6px;
                            }
                            span{
                              line-height: 20px;
                            }
                          }
                        }

                        &_one {
                            margin-top: 15px;
                            font-weight: 500;
                        }

                        &_two {
                            margin-top: 5px;
                            font-size: 14px;
                            color: #999;
                        }
                    }

                    &_tabs {
                        min-height: 420px;
                        background: #fff;
                        padding: 20px;

                        &_pane {
                            &_tab {
                                &_list {
                                    font-size: 14px;
                                    margin-top: 10px;
                                    color: #666;
                                }
                            }
                        }
                    }

                    &_history {
                        background: #fff;
                        min-height: 200px;
                        padding: 20px;
                        margin-top: 10px;

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

                    &_adjunct {
                        background: #fff;
                        min-height: 200px;
                        padding: 20px;

                        &_test {
                            padding-bottom: 10px;
                            border-bottom: 1px solid #f0f2f5;

                            &_left {
                                color: #026DFF;
                                font-weight: 600;
                                padding-left: 5px;
                                border-left: 4px solid #026DFF;
                            }

                            &_mid {
                                padding: 0 10px;
                                border-right: 1px solid #999;
                            }

                            &_rigth {
                                color: #026DFF;
                                margin-left: 5px;
                                cursor: pointer;
                            }
                        }

                        &_list {
                            color: #999;
                            font-size: 14px;
                            margin-top: 10px;

                            &_test {
                            }

                            &_operator {
                                color: #026DFF;
                                cursor: pointer;
                            }

                            span {
                                margin-right: 8px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>