<template>
    <div class="content">
        <div class="content_box">
            <el-row class="content_box_row" :gutter="10">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <div class="content_box_row_col_details">
                        <div class="content_box_row_col_details_title">
                            <div>{{info.name}}</div>
                            <div style="width: auto;height: 25px;display: flex;align-items: center;justify-content: center"
                                 @click="changeHeart()">
                                <img style="width:25px;heiget:25px" v-if="isActive==0"
                                     src="../../../assets/images/taskcycle/noHeart.png" alt="">
                                <img style="width:25px;heiget:25px" v-if="isActive==1"
                                     src="../../../assets/images/taskcycle/hasHeart.png" alt="">
                                <div>关注</div>
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
                                <div class="content_box_row_col_tabs_pane_tab_list">任务类型：<span>{{formatTaskType(infoData.taskTypeId)}}</span>
                                </div>

                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    创建人：<span>{{infoData.createName}}</span></div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    负责人：<span>{{infoData.principalName}}</span></div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    审核人：<span>{{infoData.veriftPsnName}}</span></div>
                                <div class="content_box_row_col_tabs_pane_tab_list">
                                    紧急程度：<span>{{infoData.urgencyName}}</span></div>
<!--                                <div class="content_box_row_col_tabs_pane_tab_list">-->
<!--                                    任务进度：<span>{{infoData.taskProgress}}</span></div>-->
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="任务的一生" name="second" class="content_box_row_col_tabs_pane">
<!--                            v-for="item in taskLifeList"-->
                            <div class="content_box_row_col_tabs_pane_tab">
<!--                                <div class="content_box_row_col_tabs_pane_tab_list">{{item}}</div>-->
                                <div class="content_box_row_col_tabs_pane_tab_list">由谁创建：{{infoData.createName}}于{{infoData.createTime&&infoData.createTime.substring(0,16)}}创建</div>
<!--                                <div class="content_box_row_col_tabs_pane_tab_list">评审时间：{{infoData.createTime&&infoData.createTime.substring(0,16)}}</div>-->
<!--                                <div class="content_box_row_col_tabs_pane_tab_list">由谁作废：{{infoData.createTime&&infoData.updateTime.substring(0,16)}}</div>-->
                                <div class="content_box_row_col_tabs_pane_tab_list">最后修改：{{infoData.updateName}}于{{infoData.createTime&&infoData.updateTime.substring(0,16)}}修改</div>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </el-col>
            </el-row>
            <el-row class="content_box_row" :gutter="10">
                <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
                    <history-record :taskId="taskId"></history-record>
                </el-col>
                <el-col :span='8'>
                    <div class="content_box_row_col_adjunct">
                        <div class="content_box_row_col_adjunct_test">
                            <span class="content_box_row_col_adjunct_test_left">附件</span>
                            <span class="content_box_row_col_adjunct_test_mid">附件{{files.length}}个</span>
                            <span class="content_box_row_col_adjunct_test_rigth" @click="packDown">打包下载</span>
                        </div>
                        <div>
                            <div class="content_box_row_col_adjunct_list" v-for="(item) in files">
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
  import HistoryRecord from "@/components/HistoryRecord/HistoryRecord"
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import {downloadPackageByResourceId} from "@/api/taskrelease/draftBox"
  import {getInfoRespPeriodicTask, taskLife,getRespTaskType, getSetAttention, getFileInfos,getDownload} from "@/api/auditCenter/index"
  export default {
    components: {
      ButtonFooter,
      HistoryRecord
    },
    data() {
      return {
        taskId:'',
        isActive: 0,
        isCheck: false,
        activeName: 'first',
        files: [],
        info: {},
        // taskLifeList: [],
        taskTypeOptions: [],
        // infoData:{}
      }
    },
    computed: {
      infoData() {
        this.info.urgencyName = ['特急', '加急', '普通'][this.info.urgency]
        this.info.statusName = ['停用', '启用'][Number(this.info.enable)]
        return this.info
      }
    },
    created() {
      this.taskId=this.$route.query.id
      this.init()
      this.getRespTaskType()
      // this.taskLife()
    },
    methods: {
      // taskLife(){
      //   taskLife({
      //     id: this.$route.query.id
      //   }).then(response => {
      //     this.taskLifeList= response.data
      //   });
      // },
      lookHandle(url) {
        this.previewFile(url)
      },
      //打包下载
      async packDown(){
        if(!this.files.length) return
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
      async changeHeart() {
        if (this.isActive == 0) {
          this.isActive = 1
        } else {
          this.isActive = 0
        }
        let data = {}
        data.attention = this.isActive
        data.periodicTaskId = this.info.id
        const res = await getSetAttention(data)
        if (res.msg == '操作成功') {

          let info
          info = await getInfoRespPeriodicTask(this.$route.query.id, {})
          this.info = info.data
        }

      },
      formatTaskType(val) {
        for (let i = 0; i < this.taskTypeOptions.length; i++) {
          if (this.taskTypeOptions[i].id == val) {
            return this.taskTypeOptions[i].name
          }
        }
      },
      getRespTaskType() {
        getRespTaskType().then(response => {
          this.taskTypeOptions = response.data;
        });
      },
      async init() {
        const {id} = this.$route.query
        const info = await getInfoRespPeriodicTask(id, {})
        this.info = info.data
        // this.isActive = info.data.isAttention
        info.data.isAttention == 0 ? this.isActive = false : this.isActive = true

        await this.getFile(this.info.fileIds)

      },
      async getFile(fileIds) {
        this.files=[]
        const info = await getFileInfos(fileIds)
        this.files = info.data!=null ?info.data:[]
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
                        height: 280px;
                        overflow: auto;
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