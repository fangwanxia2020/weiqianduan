<template>
    <div class="content">
        <div class="content_box">
            <el-row class="content_box_row" :gutter="10">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <div class="content_box_row_col_details">
                        <div class="content_box_row_col_details_title">
                            <div>{{info.taskName}}</div>
                            <div style="display: flex;">
                                <div class="heart-sty" style="margin-right: 30px" @click="changeHeart()">
                                    <img class="img-sty" v-if="!isActive"
                                         src="../../../assets/images/taskcycle/noHeart.png" alt="">
                                    <img class="img-sty" v-else
                                         src="../../../assets/images/taskcycle/hasHeart.png" alt="">
                                    <div>关注</div>
                                </div>
                                <div class="heart-sty" style="margin-right: 30px" @click="handleUrge">
                                    <img :src="oversee_hl" class="img-sty" v-show="urge">
                                    <img :src="oversee" class="img-sty" v-show="!urge">
                                    <span>督办</span>
                                </div>
                                <div class="heart-sty" @click="handleSubtask" v-if="this.deptList.length!=0">
                                    <img :src="searchimg" class="img-sty">
                                    <span>子任务</span>
                                </div>
                            </div>
                        </div>
                        <div class="content_box_row_col_details_one">任务内容</div>
                        <div class="content_box_row_col_details_two">{{info.taskContent}}</div>
                    </div>
                </el-col>
                <el-col :span='8' class="content_box_row_col">
                    <el-tabs v-model="activeName" @tab-click="handleClick" class="content_box_row_col_tabs">
                        <el-tab-pane label="基础信息" name="first" class="content_box_row_col_tabs_pane">
                            <div class="content_box_row_col_tabs_pane_tab">
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    任务状态：<span>{{infoData.statusName}}</span></div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    任务类型：<span>{{infoData.tackTypeName}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">截止时间：<span>{{infoData.deadlineTime&&infoData.deadlineTime.substring(0,16)||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">创建人：<span>{{infoData.createName||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">负责人：<span>{{infoData.personName||'无'}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    审核人：<span>{{infoData.veriftPen||'无'}}</span></div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    紧急程度：<span>{{infoData.urgencyName}}</span>
                                </div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    任务进度：<span>{{infoData.taskProgress|| 0}}%  </span></div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="任务的一生" name="second" class="content_box_row_col_tabs_pane">
                            <div class="content_box_row_col_tabs_pane_tab" v-for="item in taskLifeList">
                                <div class="content_box_row_col_tabs_pane_tab_list">{{item}}</div>
                                <!--                                <div class="content_box_row_col_tabs_pane_tab_list">评审时间：暂无</div>-->
                                <!--                                <div class="content_box_row_col_tabs_pane_tab_list">由谁作废：暂无</div>-->
                                <!--                                <div class="content_box_row_col_tabs_pane_tab_list">最后修改：黄善鸿 于 2022-03-23 16:00</div>-->
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </el-col>
            </el-row>
            <el-row class="content_box_row" :gutter="10">
                <el-col :span='16'>
                    <div class="left-data">
                        <div class="data-title">佐证资料</div>
                        <div class="data-content">
                            <div class="flex-space-between padding-bottom-10">
                                <div>{{supportingInformation.context}}</div>
                                <div>{{supportingInformation.updateTime&&supportingInformation.updateTime.substring(0, 16)}}更新</div>
                            </div>
                            <div v-for="(item, index) in fileIdList" :key="index">
                                <div class="content_box_row_col_adjunct_list">
                                    <span class="content_box_row_col_adjunct_list_test">{{item.name}}</span>
                                    <span class="content_box_row_col_adjunct_list_size">{{item.fileSize/1000}}kb</span>
                                    <span class="content_box_row_col_adjunct_list_operator"
                                          @click="lookHandle(item.downloadUrl)">预览</span>
                                    <span class="content_box_row_col_adjunct_list_operator" @click="getDownload(item)">下载</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span='8'>
                    <div class="content_box_row_col_adjunct">
                        <div class="content_box_row_col_adjunct_test">
                            <span class="content_box_row_col_adjunct_test_left">附件</span>
                            <span class="content_box_row_col_adjunct_test_mid">附件{{this.totalFiles.length}}个</span>
                            <span class="content_box_row_col_adjunct_test_rigth" @click="packDown">打包下载</span>
                        </div>
                        <div>
                            <div class="content_box_row_col_adjunct_list" v-for="(item) in totalFiles">
                                <span class="content_box_row_col_adjunct_list_test">{{item.name}}</span>
                                <span class="content_box_row_col_adjunct_list_size">{{item.fileSize/1000}}kb</span>
                                <span class="content_box_row_col_adjunct_list_operator"
                                      @click="lookHandle(item.downloadUrl)">预览</span>
                                <span class="content_box_row_col_adjunct_list_operator"
                                      @click="getDownload(item)">下载</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content_box_row">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <div class="content_box_row_col_history">
                        <div class="content_box_row_col_history_test">历史记录</div>
                        <div style="overflow: auto;height:200px ">
                            <div class="content_box_row_col_history_tab"   v-for="(item, index) in historyList"
                                 :key="index" >
                                <div class="content_box_row_col_history_tab_list" v-if="item.commit!=9&&item.commit!=10">{{item.context}}</div>
                                <!--                            <div class="content_box_row_col_history_tab_list">{{index+1}}.{{item.createTime}},由{{item.createName}}{{commitFormat(item.commit)}} </div>-->
                                <!--                            <div class="content_box_row_col_history_tab_list">     1.2022-03-29 22:02, 由 黄善鸿 创建。 </div>-->
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

                    </div>
                </el-col>
            </el-row>

            <el-dialog
                    style="width: 100%"
                    title="子任务"
                    :visible.sync="dialogVisible"
            >
                <el-table  style="width: 100%"
                           :data="tableDataList"
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
                            <el-progress type="circle" :width="35"
                                         :percentage="scope.row.taskProgress || 0"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="text"
                                    @click="navigater(`/leadertask/myTask/jobJacket/planDetail?id=${scope.row.id}&viewType=1`)"
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
        </div>
        <button-footer
                :showConfirm="!isCheck"
                :showCancel="isCheck"
                :confirmText="'返回'"
                @confirm="navigater('/leadertask/taskrelease/taskcycle')"
        ></button-footer>
    </div>
</template>
<script>
  import {downloadPackageByResourceId} from "@/api/taskrelease/draftBox"
  import {getlistPage } from "@/api/auditCenter/index";
  import {addAndCancel} from "@/api/taskrelease/havePublished"
  import {urgeTask} from "@/api/myTask/jobJacket"
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import { getInfoTaskTwo} from "@/api/taskrelease/draftBox"
  import {
    taskLife,
    getDownload,
    getSupportingInformation,
    getFileInfos,
    getInfoRespPeriodicTask,
    getRespCommitRec
  } from "@/api/auditCenter/index";
  import oversee from "@/assets/images/taskcycle/oversee.png"
  import oversee_hl from "@/assets/images/taskcycle/oversee_hl.png"
  import searchimg from "@/assets/images/taskcycle/search.png"

  export default {
    components: {
      ButtonFooter
    },
    data() {
      return {
        deptList: [],
        total: 0,
        loading: true,
        queryParams: {
          pageNum: 1,
          currPage: 1,
          pageSize: 10,
          isPeriodicTask: 1,
          query: {
            isPeriodicTask: 1,
            // periodicTaskId:  this.info.periodicTaskId,
          }
        },
        oversee,
        oversee_hl,
        searchimg,
        urge: false,
        isActive: false,
        dialogVisible: false,
        isCheck: false,
        activeName: 'first',
        totalFiles: [],
        fileIdList: [],
        deptList: [],
        taskLifeList: [],
        historyList: [],
        tableData: [],
        supportingInformation: {},
        info: {}
      }
    },
    computed: {
      infoData() {
        this.info.urgencyName = ['特急', '加急', '普通'][this.info.urgency]
        this.info.statusName = ['草稿', '进行中', '逾期', '待审核', '完成', '作废'][Number(this.info.status) / 10 - 1]
        return this.info
      },
      tableDataList() {
        if (this.deptList.length != 0) {
          return this.deptList.filter(item => {
            return item.statusName = ['草稿', '进行中', '逾期', '待审核', '完成', '作废'][Number(item.status) / 10 - 1]
          })
        }
      }
    },
    async created() {
      await this.init()
      await this.taskLife()
      await this.getRespCommitRec();
    },
    mounted() {
      this.getSupportingInformation();
    },
    methods: {
      getRespCommitRec() {
        getRespCommitRec({
          taskId: this.$route.query.id,
          taskInstanceId: this.$route.query.idOne
        }).then(response => {
          this.historyList = response.data
        });
      },
      //分页
      handleSizeChange(val) {
        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = val;
        this.getList();
      },
      //分页
      handleCurrentChange(val) {
        this.queryParams.pageNum = val;
        this.getList();
      },
      async handleSubtask() {
        this.dialogVisible = true
        await this.getList()
      },
      getList() {
        this.loading = true;
        getlistPage(this.queryParams).then(response => {
          this.deptList = response.data.list
          this.total = response.data.pagination.total;
          this.loading = false;
        });
      },
      //督办
      handleUrge() {
        if (this.urge) return
        let data = {taskInstanceId: this.$route.query.idOne}
        urgeTask(data).then(response => {
          let urgeTask = response
          console.error(urgeTask)
          if (response.code == '200') {
            this.urge = !this.urge
            this.messageSuccess('操作成功')
          }
        });
      },
      getFileTastObj(fileIds) {
        this.totalFiles = []
        getFileInfos(fileIds).then(response => {
          this.totalFiles = response.data
        });
      },
      getSupportingInformation() {
        getSupportingInformation({
          taskId: this.$route.query.id,
          taskInstanceId: this.$route.query.idOne
        }).then(response => {
          this.supportingInformation = response.data
          if (response.data.fileIdList != null && response.data.fileIdList.length != 0) {
            this.getFile(response.data.fileIdList)
          }
        });
      },
      getFile(fileIds) {
        getFileInfos(fileIds).then(response => {
          this.fileIdList = response.data
        });
      },
      //预览
      lookHandle(url) {
        this.previewFile(url)
      },
      //打包下载
      async packDown(){
        if(!this.totalFiles.length) return
        const res =  await downloadPackageByResourceId(this.$route.query.idOne)
        const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'})
        this.createDownLoadClick(blob, '打包文件.zip');
      },
      //下载
      getDownload(item) {
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

      taskLife() {
        taskLife({
          taskId: this.$route.query.id
        }).then(response => {
          this.taskLifeList = response.data
        });
      },
      async changeHeart() {
        let data = {}
        // this.concern ? data.id = this.info.taskPsnAttentionId : data.taskId = this.info.id
        this.isActive ? data.id = this.info.taskPsnAttentionId : data.taskId = this.$route.query.id
        const res = await addAndCancel(data)
        if (res.msg == '操作成功') {
          this.isActive = !this.isActive
        }
      },
      async init() {
        const {idOne} = this.$route.query
        const info = await getInfoTaskTwo(idOne)
        this.info = info.data
        this.urge = info.data.isUrge || info.data.isTaskPsnUrge
        this.queryParams.query.periodicTaskId=this.info.periodicTaskId
        info.data.isTaskPsnAttention == 0 ? this.isActive = false : this.isActive = true
        if (this.info.fileIds) {
          this.getFileTastObj(this.info.fileIds)
        }
        this.queryParams.query.parentId=this.info.id
        await this.getList()
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
    }
  }
</script>
<style lang="scss" scoped>
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

    .botton_nav {
        width: 100%;
        text-align: center;
        padding: 40px 0px;
    }

    .img-sty {
        width: 25px;
        heiget: 25px
    }

    .heart-sty {
        width: auto;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

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

    .padding-bottom-10 {
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

    .history-bohui {
        padding: 20px 10px;
        background-color: #F2F2F2;
    }

    .app-main .app-main-wrap .app-main-ctn > .content {
        padding: 0 !important;
        overflow: hidden;
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

                        &_title {
                            font-weight: 600;
                            padding-bottom: 8px;
                            border-bottom: 1px solid #f0f2f5;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
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
                                font-size: 14px;
                                color: #999;
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