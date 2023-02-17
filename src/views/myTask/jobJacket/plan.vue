<template>
  <div class="content">
    <div class="content_box">
      <el-row class="content_box_row" :gutter="10">
        <el-col :span='$colSpan + $colSpan' class="content_box_row_col">
          <div class="content_box_row_col_details">
            <div class="content_box_row_col_details_title">
              <div>{{info.name || info.taskName}}</div>
              <div class="content_box_row_col_details_title_handle">
                <div class="content_box_row_col_details_title_handle_concern"  @click="handleConcern">
                  <img :src="hasHeart" v-show="concern">
                  <img :src="noHeart" v-show="!concern">
                  <span>关注</span>
                </div>
                <div class="content_box_row_col_details_title_handle_concern" v-if="viewType == 1"  @click="handleUrge">
                  <img :src="oversee_hl" v-show="urge">
                  <img :src="oversee" v-show="!urge">
                  <span>督办</span>
                </div>
                <div  v-if="viewType == 0 || viewType == 2" @click="taskShow = true">
                  任务夹> 
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
                <div class="content_box_row_col_tabs_pane_tab_list">任务状态：<span>{{infoData.statusName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">任务类型：<span>{{infoData.tackTypeName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">截止时间：<span>{{infoData.deadlineTime?infoData.deadlineTime.substring(0, 16):null}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">创建人：<span>{{infoData.createName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">负责人：<span>{{personName || infoData.personName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">审核人：<span>{{infoData.veriftPen}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">紧急程度：<span>{{infoData.urgencyName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">任务进度：<span>{{editData.taskProgress || 0}}%</span></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="任务的一生" name="second" class="content_box_row_col_tabs_pane">
              <div class="content_box_row_col_tabs_pane_tab" v-for="(item,index) in taskLifeList" :key="index">
                <div class="content_box_row_col_tabs_pane_tab_list">{{item}}</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="多人负责" name="third" class="content_box_row_col_tabs_pane" v-if="tableDataList.length > 1 && viewType != 0 && viewType != 2">
              <el-table
              :data="tableDataList"
              style="width: 100%">
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
                  label="任务进度"
                  width="120"
                  >
                  <template slot-scope="scope">
                    <el-progress  type="circle" :width="35"  :percentage="scope.row.taskProgress || 0"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                <template  slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="navigater(`/leadertask/myTask/jobJacket/planDetail?id=${scope.row.id}&taskId=${scope.row.taskId}&personId=${scope.row.personId}&viewType=1&sonType=1`)"
                   >查看</el-button>
                </template>
              </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row class="content_box_row"  :gutter="10">
        <el-col :span='$colSpan + $colSpan'>
          <evidence-data 
          ref="evidenceMethod" 
          :taskId="taskId" 
          :sonName="sonType == 1?'taskInstanceId':'taskId'" 
          :selectPersonType="selectPersonType"
          @checkFile="checkFile"
          ></evidence-data>
          
          <history-record 
          ref="historyMethod" 
          :taskId="taskId" 
          :sonType="sonType" 
          :selectPersonType="selectPersonType" 
          :sonName="sonType == 1?'taskInstanceId':'taskId'"></history-record>
        </el-col>
        <el-col :span='8'>
          <div class="content_box_row_col_adjunct">
            <div class="content_box_row_col_adjunct_test">
              <span class="content_box_row_col_adjunct_test_left">附件</span>
              <span class="content_box_row_col_adjunct_test_mid">附件{{files.length}}个</span>
              <span class="content_box_row_col_adjunct_test_rigth" @click="packDown">打包下载</span>
            </div>
          <div style="height:200px;overflow: auto;">
            <div class="content_box_row_col_adjunct_list" v-for="(item,index) in files " :key="index">
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

    <el-dialog
      title="佐证资料"
      :visible.sync="centerDialogVisible"
      width="700px"
      center
      >
      <div>
          <el-form>
            <el-row>
              <el-col :span='24'>
                <ty-multi-text
                        :label="'更新说明'"
                        :type="'textarea'"
                        v-model="editData.context"
                        :allowUpdate="!isCheck"
                >
                </ty-multi-text>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <upload-file
                  v-model="editData.fileVal"
                  :label="'附件上传'"
                  :allowUpdate="!(isUpdate || isCheck)"
                  :formErrorMsg.sync="editDataErrorMsg.fileVal"
                  :validate="editDataRules.fileVal"
                ></upload-file>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span='24'>
              <div class="progress_update">
                <div class="progress_update_text"><span class="demonstration">更新进度：</span></div>
                <div class="progress_update_slider"><el-slider v-model="editData.taskProgress"></el-slider></div>
                <div class="progress_update_num">
                  {{editData.taskProgress}}
                </div>
              </div>
            </el-col>
          </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="hendleSave">保存提交审核</el-button>
        <el-button type="primary" size="small" @click="hendleUpdate">更新进度</el-button>
        <el-button size="small" @click="centerDialogVisible = false">返 回</el-button>
      </span>
    </el-dialog>
    

    <el-dialog
      title="任务夹"
      :visible.sync="taskShow"
      width="500px"
      center
      >
      <div>
          <div class="jobTest">通用任务夹</div>
          <el-radio-group v-model="radio1">
            <el-radio disabled v-for="item in fixedFolder" :label="item.id" :key="item.id">{{item.name}}</el-radio>
          </el-radio-group>
          <div class="jobTest">我的文件夹</div>
          <el-radio-group v-model="radio2">
            <el-radio 
            v-for="item in folderData" 
            :label="item.id" 
            :key="item.id"  
            @click.native.prevent="handleChangeitem(item.id)"
          >
            {{item.name}}
          </el-radio>
          </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <div @click="taskShow = false" class="dialog-cancel">取消</div>
        <div @click="hendleFolder" class="dialog-submit">完成</div>
      </span>
    </el-dialog>


    <button-footer
      :showBackup="viewType == 0"
      :showConfirm="!isCheck"
      :showCancel="isCheck"
      :backupText="'编辑'"
      :confirmText="'返回'"
      @backup="hendleBackup"
      @confirm="navigater(`/leadertask/myTask/jobJacket`)"
    ></button-footer>
    
  </div>
</template>
<script>
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import {respTaskInstance,listByIds,getDownload,downloadPackageByResourceId} from "@/api/taskrelease/draftBox"
  import UploadFile from "@/components/secondControlList/UploadFile"
  import {updateProgress,getTaskProgress,respCommitRec,urgeTask,listByType,transferTask,getInfo,getTaskPersonName} from "@/api/myTask/jobJacket"
  import {addAndCancel,respTaskDetails} from "@/api/taskrelease/havePublished"
  import {taskLife} from "@/api/auditCenter/index";

  import HistoryRecord from "@/components/HistoryRecord/HistoryRecord"
  import EvidenceData from "@/components/EvidenceData/EvidenceData"

  import hasHeart from "@/assets/images/taskcycle/hasHeart.png"
  import noHeart from "@/assets/images/taskcycle/noHeart.png"
  import oversee from "@/assets/images/taskcycle/oversee.png"
  import oversee_hl from "@/assets/images/taskcycle/oversee_hl.png"
  export default {
    components:{
      ButtonFooter,
      UploadFile,
      HistoryRecord,
      EvidenceData
    },
    data() {         
      return{
        hasHeart,
        noHeart,
        oversee,
        oversee_hl,
        isCheck:false,
        concern:false,
        urge:false,
        taskId:'',
        selectPersonType:'',
        personName:'',
        isUpdate:false,
        centerDialogVisible:false,
        taskShow:false,
        activeName: 'first',
        radio1:'1',
        radio2:1,
        tableData: [],
        taskLifeList:[],
        jobData:[],
        files:[],
        info:{},
        viewType:0,
        sonType:0,
        editData:{
          context:'',
          taskProgress:0,
          fileVal:[]
        },
        editDataErrorMsg:{
        },
        editDataRules:{
        }
      }
    },
    computed:{
      infoData(){
        this.info.urgencyName = ['特急','加急','普通'][this.info.urgency]
        this.info.statusName = ['草稿','进行中','逾期','待审核','完成','作废'][Number(this.info.status)/10 - 1]
        return this.info
      },
      tableDataList(){
        return this.tableData.filter(item =>{
          return item.statusName = ['草稿','进行中','逾期','待审核','完成','作废'][Number(item.status)/10 - 1]
        })
      },
      fixedFolder(){
        return this.jobData.filter(item => item.folderTypeName == '通用任务夹')
      },
      folderData(){
        return this.jobData.filter(item => item.folderTypeName == '我的文件夹')
      }
    },
  
  
    async created(){
      await this.init()
      await this.taskLife()
    },
    methods:{
      async init(){
        const {id,viewType,sonType,selectPersonType} = this.$route.query
        this.viewType = viewType || 0
        this.selectPersonType = selectPersonType || ''
        this.taskId = id
        this.sonType = sonType
        
        if(!sonType){
          let data = {
            pageNum: 1,
            pageSize: 10,
            query: {taskId:id}
          }
          const res = await respTaskInstance(data)
          this.tableData = res.data.list
        }
        

        let info
        sonType == 1? info = await getInfo(this.$route.query.taskId) : info = await getInfo(this.$route.query.id)
        
        this.info = info.data
        this.concern = info.data.isTaskPsnAttention
        this.urge = info.data.isUrge || info.data.isTaskPsnUrge
        let progress
        sonType == 1? progress = await getTaskProgress(this.$route.query.taskId,this.$route.query.personId) : progress = await getTaskProgress(this.$route.query.id)

        this.editData.taskProgress = progress.data
        if(this.info.fileIds)await this.getFile(this.info.fileIds)
        
        let personName
        sonType == 1? personName = await getTaskPersonName(this.$route.query.taskId,this.$route.query.personId) : personName = await getTaskPersonName(this.$route.query.id)
        this.personName = personName.data

        const jobData = await listByType()
        this.jobData = jobData.data
        if(sonType !=1){
          this.radio1 = info.data.folderId
          info.data.myFolderIds ? this.radio2 = info.data.myFolderIds[0] : this.radio2 = ''
          
        }
      },
      //任务的一生
      taskLife(){
        let data = {}
        this.sonType == 1? data.id = this.$route.query.id : data.taskId = this.$route.query.id
        taskLife(data).then(response => {
          this.taskLifeList= response.data
        });
      },
      handleChangeitem(e){
        console.log(e)
        e == this.radio2 ? this.radio2 = '' : this.radio2 = e
      },
      //移动文件
      async hendleFolder(){
        if(this.radio2 == '' && !this.info.myFolderIds){
          this.taskShow = false
          return
        }
        const data = {
          sourceFolderId:this.radio2 == '' ? '' : this.radio1, 
          targetFolderId:this.radio2 == '' ? this.info.myFolderIds[0] : this.radio2,
          taskId:this.taskId
        }

        const res = await transferTask(data)
        this.$message({
          type: res.code == 200?'success':'warning',
          message: res.msg
        });
        this.taskShow = false
      },
      async getFile(fileIds) {
        this.files=[]
        const info = await listByIds(fileIds)
        this.files = info.data
      },
      lookHandle(url) {
        this.previewFile(url)
      },
      checkFile(val){
        this.editData.fileVal = []
        val.map((item) => {
          this.editData.fileVal.push({
            res: {
              ...item,
            },
            name: item.name,
            id: item.id,
            status: 'success',
            url: item.downloadUrl,
          });
        });
        console.log( this.editData.fileVal)

      },
      //打包下载
      async packDown(){
        if(!this.files.length) return
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

      hendleBackup(){
        this.centerDialogVisible = true
        // this.editData.fileVal = []
        this.editData.context = ''
        
      },
      //关注
      async handleConcern(){
        let data = {}
        if(this.sonType == 1){ //子取消或者新增关注
          this.concern ? data.id = this.info.taskPsnAttentionId : data.taskInstanceId = this.$route.query.id
        }else{ //父取消或者新增关注
          this.concern ? data.id = this.info.taskPsnAttentionId : data.taskId = this.$route.query.id
        }
        const res = await addAndCancel(data)
        if(res.msg == '操作成功'){
          this.concern = ! this.concern
          let info
          this.sonType == 1? info = await getInfo(this.$route.query.taskId) : info = await getInfo(this.$route.query.id)
          this.info = info.data
        }
      },
      //督办
      async handleUrge(){
        if(this.urge) return
        let data = {}
        this.sonType == 1? data.taskInstanceId = this.$route.query.id : data.taskId = this.$route.query.id
        const res = await urgeTask(data)
        if(res.msg == '操作成功'){
          this.urge = ! this.urge
          let info
          this.sonType == 1? info = await getInfo(this.$route.query.taskId) : info = await getInfo(this.$route.query.id)

          this.info = info.data
        }
      },
      //进度更新
      async hendleUpdate(){
        let fileIdList = []
        console.log(this.editData.fileVal)
        if(this.editData.fileVal){
            this.editData.fileVal.map(i=>{
            fileIdList.push(i.id)
         })
        }
        let data = {
          ...this.editData,
          fileIdList,
          taskId:this.$route.query.id
        }
        delete data.fileVal
        const res = await updateProgress(data)
        this.$message({
          type: res.code == 200?'success':'warning',
          message: res.msg
        });
        this.init()
        this.$refs.historyMethod.init()
        this.$refs.evidenceMethod.init()
        this.centerDialogVisible = false
      },
      hendleSave(){
        if(this.editData.taskProgress != 100){
           this.$message({
            type: 'warning',
            message: '请更新进度至100%才能提交审批！'
          });
          return
        }
        let fileIdList = []
        if(this.editData.fileVal){
            this.editData.fileVal.map(i=>{
            fileIdList.push(i.id)
         })
        }
        let data = {
          ...this.editData,
          fileIdList,
          taskId:this.$route.query.id
        }
        delete data.fileVal
        updateProgress(data).then(res =>{
          const commiData = {
            taskId:this.taskId,
            commit:5
          }
          return respCommitRec(commiData)
        }).then( respCommi=>{
          this.$message({
            type: respCommi.code == 200?'success':'warning',
            message: respCommi.msg
          });
          this.$router.push({
              path: "/leadertask/myTask/jobJacket",
          });
        })
        
        // respCommitRec
      },
      handleClick(tab, event) {
        // console.log(tab, event);
      },
    }
  }
</script>
<style lang="scss" scoped>
::v-deep .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
  -webkit-box-shadow: 0 0 2px 2px #fff;
  box-shadow: 0 0 2px 2px #fff;
}
::v-deep .el-radio-button__inner {
  border-left: 1px solid #d8dce5;
}
::v-deep .app-main-ctn{
  overflow: auto !important;
}
::v-deep .el-tabs__item{
  height: 30px;
  line-height: 30px;
}
::v-deep .el-upload-list__item a{
  max-width: 400px;
}
::v-deep .button-container{
  background-color: transparent;
}
::v-deep .design-form-wrap__btnwrap{
  background-color: transparent;
}
::v-deep .el-radio-group{
  width: 60px;
  label{
    margin-top: 15px;
  }
}
.jobTest{
  font-weight: 900;
  font-size: 18px;
  padding: 20px 0;
  color: #026DFF;
  border-bottom: 1px dashed  #868A97;
}
.app-main .app-main-wrap .app-main-ctn > .content{
  padding: 0 !important;
  overflow: hidden;
}
.progress_update{
  color: #868A97;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  &_text{
    width: 116px;
    text-align: right;
  }
  &_slider{
    width: 70%;
    margin: 0 10px;
  }
  &_num{
    width: 40px;
  }
}
 .content{
   background: rgb(240,242,245);
   &_box{
     &_row{
       &_col{
         &_details{
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
                line-height: 21px;
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
           &_one{
             margin-top: 15px;
             font-weight: 500;
           }
           &_two{
             margin-top: 5px;
             font-size: 14px;
             color: #999;
           }
         }
         &_tabs{
           min-height: 420px;
           background: #fff;
           padding: 20px;

           &_pane{
             &_tab{
               &_list{
                 font-size: 14px;
                 margin-top: 10px;
                 color: #666;
               }
             }
           }
         }
         &_history{
           background: #fff;
           height: 300px;
           padding: 20px;

           &_test{
             font-weight: 500;
           }
           &_tab{
             margin-top: 5px;
             font-size: 14px;
             color: #999;
             &_list{
               margin-top: 5px;
             }
           }
         }
         &_adjunct{
           background: #fff;
           height: 300px;
           padding: 20px;

           &_test{
             padding-bottom: 10px;
             border-bottom: 1px solid #f0f2f5;
             &_left{
               color: #026DFF;
               font-weight: 600;
               padding-left: 5px;
               border-left: 4px solid #026DFF;
             }
             &_mid{
               padding: 0 10px;
               border-right: 1px solid #999;
             }
             &_rigth{
               color: #026DFF;
               margin-left: 5px;
               cursor: pointer;
             }
           }
           &_list{
             color: #999;
             font-size: 14px;
             margin-top: 10px;
             &_test{
             }
             &_operator{
               color: #026DFF;
               cursor: pointer;
             }
             span{
               margin-right: 8px;
             }
           }
         }
       }
     }
   }
 }
</style>