<template>
    <div class="content">
        <div class="content_box">
            <el-row class="content_box_row" :gutter="10">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <div class="content_box_row_col_details">
                        <div class="content_box_row_col_details_title">
                            <div>{{tastObj.name}}</div>
                            <!--                            <div style="width: auto;height: 25px;display: flex;align-items: center;justify-content: center" @click="changeHeart()">-->
                            <!--                                <img style="width:25px;heiget:25px"  v-if="isActive==true" src="../../../assets/images/taskcycle/noHeart.png" alt="">-->
                            <!--                                <img style="width:25px;heiget:25px" v-else src="../../../assets/images/taskcycle/hasHeart.png" alt="">-->
                            <!--                                &lt;!&ndash;                                <img style="width: 30px;height: 25px" :src="isActive==true?'../../../assets/images/taskcycle/hasHeart.png':'../../../assets/images/taskcycle/noHeart.png'" alt="" >&ndash;&gt;-->
                            <!--                            <div>关注</div>-->
                            <!--                            </div>-->
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
                                <div class="content_box_row_col_tabs_pane_tab_list">截止时间：<span>{{tastObj.deadlineTime&&tastObj.deadlineTime.substring(0, 16)||'无'}}</span>
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
                            <div class="content_box_row_col_tabs_pane_tab" v-for="item in taskLifeList">
                                <div class="content_box_row_col_tabs_pane_tab_list">{{item}}</div>
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
                                <div>{{supportingInformation.updateTime&&supportingInformation.updateTime.substring(0, 16)}} 更新</div>
                            </div>
                            <div  v-for="(item, index) in fileIdList" :key="index">
                                <div class="content_box_row_col_adjunct_list" >
                                    <span class="content_box_row_col_adjunct_list_test">{{item.name}}</span>
                                    <span class="content_box_row_col_adjunct_list_size">{{item.fileSize/1000}}kb</span>
                                    <span class="content_box_row_col_adjunct_list_operator" @click="lookHandle(item.downloadUrl)" >预览</span>
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
                                <span class="content_box_row_col_adjunct_list_operator" @click="getDownload(item)">下载</span>
                            </div>

                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content_box_row">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <div class="content_box_row_col_history">
                        <div class="content_box_row_col_history_test">历史记录</div>
                        <div class="content_box_row_col_history_tab"   v-for="(item, index) in historyList"
                             :key="index">
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
                </el-col>
            </el-row>
        </div>
        <button-footer
                confirmText="确定任务完成"
                cancelText="驳回"
                @cancel="cancalHandle"
                @confirm="confirmHandle"
        ></button-footer>


        <!-- 驳回意见对话框 -->
        <el-dialog title="驳回意见" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="formTwo" :rules="rules" label-width="80px">

                <el-form-item label="评审意见:">
                    <el-input
                            v-model="formTwo.context"
                            type="textarea"
                            placeholder="意见内容(选填)"
                            maxlength="255"
                            show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div @click="openCancel" class="dialog-cancel">取消</div>
                <div @click="submitForm" class="dialog-submit">确定</div>
            </div>
        </el-dialog>

        <!-- 考核完成质量对话框 -->
        <el-dialog title="考核完成质量" label-position="left" :visible.sync="openTwo" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row class="system-score">
                    系统评分
                </el-row>
                <el-row style="display: flex">
                    <el-form-item label="完成速度:" style="display: flex;align-items: center;justify-content: flex-start">
                        <el-rate v-model="form.completeSpeed" disabled :max="5"  text-color="#ff9900" ></el-rate>
                    </el-form-item>
                </el-row>
                <div class="split-line"></div>
                <el-row class="system-score">
                    审核人评分
                </el-row>
                <el-row style="display: flex">
                    <el-form-item label="完成质量:" style="display: flex;align-items: center;justify-content: flex-start">
                        <el-rate v-model="form.score"  :allow-half="true" :max="5"  text-color="#ff9900" ></el-rate>
                    </el-form-item>
                </el-row>

                <el-form-item label="评审意见:">
                    <el-input
                            v-model="form.context"
                            type="textarea"
                            placeholder="意见内容(选填)"
                            maxlength="255"
                            show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div @click="openCancelReviewer" class="dialog-cancel">取消</div>
                <div @click="submitFormReviewer" class="dialog-submit">确定</div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import {getRespTaskDetails, taskLife,getRespCommitRec,addRespApproval,addReject,getDownload,getCompleteSpeed,getSupportingInformation,getFileInfos} from "@/api/auditCenter/index";
  import {downloadPackageByResourceId} from "@/api/taskrelease/draftBox"
  export default {
    components: {
      ButtonFooter
    },
    data() {
      return {
        taskLifeList: [],
        files: [],
        supportingInformation:{},

        scope: 3.7,
        openTwo: false,
        open: false,
        totalFiles: [],
        historyList: [],
        fileIdList: [],
        checkScope: '',
        isCheck: false,
        isActive: true,
        activeName: 'first',
        tastObj: {},
        formTwo: {
          taskId: this.$route.query.id,
          taskInstanceId: this.$route.query.taskInstanceId
        },
        form: {
          score:0,
          context:'',
          completeSpeed:0,
          taskId: this.$route.query.id,
          taskInstanceId: this.$route.query.taskInstanceId
        },
        rules: {},
      }
    },
    created() {
      this.getList();
      this.getRespCommitRec();
      this.getCompleteSpeed();
      this.getSupportingInformation();
      this.taskLife();
    },
    methods: {
      taskLife(){
        taskLife({
          id: this.$route.query.taskInstanceId
        }).then(response => {
          this.taskLifeList= response.data
        });
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
      getFile(fileIds) {
        getFileInfos(fileIds).then(response => {
          this.fileIdList=response.data
        });
      },
      //预览
      lookHandle(url) {
        this.previewFile(url)
      },
      //打包下载
      async packDown(){
        if(!this.totalFiles.length) return
        const res =  await downloadPackageByResourceId(this.$route.query.id)
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

      openCancelReviewer(){
        this.openTwo = false
      },
      submitFormReviewer(){
        let data={
          taskId:this.form.taskId,
          taskInstanceId:this.form.taskInstanceId,
          completeSpeed:this.form.completeSpeed*2,
          context:this.form.context,
          score:this.form.score*2,
        }
        addRespApproval(data).then((res) => {
          if (res.code == 200) {
            this.messageSuccess("审核成功！");
            this.openTwo = false
            this.$router.push({
              path: "/leadertask/auditCenter/toBeReviewed",
            });
          }
        });

      },
      cancalHandle() {
        this.open = true
      },
      confirmHandle() {
        this.openTwo = true

      },
      openCancel() {
        this.open=false
      },
      submitForm() {
        addReject(this.formTwo).then((res) => {
          if (res.code == 200) {
            this.messageSuccess("驳回成功！");
            this.open = false
            this.$router.push({
              path: "/leadertask/auditCenter/toBeReviewed",
            });
          }
        });
      },
      changeHeart() {
        this.isActive = !this.isActive
      },
      commitFormat(val) {
        let commit = {
          1: '创建',
          2: '修改',
          3: '发布',
          4: '更新进度',
          5: '提交审批',
          6: '驳回',
          7: '审核通过',
        }
        return commit[val]
      },

      getCompleteSpeed() {
        getCompleteSpeed(this.$route.query.taskInstanceId).then(response => {
          this.form.completeSpeed = response.data/2;
        });
      },

      getRespCommitRec() {
        getRespCommitRec({
          taskId: this.$route.query.id,
          taskInstanceId: this.$route.query.taskInstanceId
        }).then(response => {
          this.historyList = response.data;
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
          this.totalFiles=response.data!=null ?response.data :[]
        });
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
    .split-line {
        width: 100%;
        border-bottom: 1px #AAAAAA dashed;
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
                                    margin-top: 6px;
                                    color: #666;
                                }
                            }
                        }
                    }

                    &_history {
                        background: #fff;
                        height: 200px;
                        overflow: auto;
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
                            margin-top: 5px;

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