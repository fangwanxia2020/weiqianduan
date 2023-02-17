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
                <div class="content_box_row_col_details_title_handle_concern" v-if="viewType == 1 && sonDataList.length"  @click="dialogVisible = true">
                  <img :src="search" >
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
                <div class="content_box_row_col_tabs_pane_tab_list">任务状态：<span>{{infoData.statusName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">任务类型：<span>{{infoData.tackTypeName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">截止时间：<span>{{infoData.deadlineTime?infoData.deadlineTime.substring(0, 16):null}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">创建人：<span>{{infoData.createName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">负责人：<span>{{infoData.personName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">审核人：<span>{{infoData.veriftPen}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">紧急程度：<span>{{infoData.urgencyName}}</span></div>
                <div class="content_box_row_col_tabs_pane_tab_list">任务进度：<span>{{infoData.taskProgress || 0}}%</span></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="任务的一生" name="second" class="content_box_row_col_tabs_pane">
              <div class="content_box_row_col_tabs_pane_tab" v-for="(item,index) in taskLifeList" :key="index">
                <div class="content_box_row_col_tabs_pane_tab_list">{{item}}</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="多人负责" name="third" class="content_box_row_col_tabs_pane" v-if="tableDataList.length > 1">
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
                    <el-progress type="circle" :width="35"  :percentage="scope.row.taskProgress || 0"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="navigater(`/leadertask/taskrelease/havePublished/check?id=${scope.row.id}&types=1&viewType=1&sonType=1`)"
                  >查看</el-button>
                </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row class="content_box_row"  :gutter="10" >
        <el-col :span='$colSpan + $colSpan' class="content_box_row_col" >
          <evidence-data :taskId="taskId" :sonName="sonType == 1?'taskInstanceId':'taskId'"></evidence-data>

          <history-record :taskId="taskId" :sonName="sonType == 1?'taskInstanceId':'taskId'"></history-record>
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
              @click="navigater(`/leadertask/myTask/jobJacket/planDetail?id=${scope.row.id}&viewType=1&sonType=1`)"
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
      @confirm="navigater('/leadertask/taskrelease/havePublished')"
    ></button-footer>
  </div>
</template>
<script>
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import {urgeTask} from "@/api/myTask/jobJacket"
  import {respTaskInstance,getInfoTask,listByIds,getDownload,downloadPackageByResourceId} from "@/api/taskrelease/draftBox"
  import {respTaskDetails,addAndCancel,respTaskList} from "@/api/taskrelease/havePublished"
  import hasHeart from "@/assets/images/taskcycle/hasHeart.png"
  import noHeart from "@/assets/images/taskcycle/noHeart.png"
  import HistoryRecord from "@/components/HistoryRecord/HistoryRecord"
  import EvidenceData from "@/components/EvidenceData/EvidenceData"
  import oversee from "@/assets/images/taskcycle/oversee.png"
  import oversee_hl from "@/assets/images/taskcycle/oversee_hl.png"
  import search from "@/assets/images/taskcycle/search.png"
  import { taskLife} from "@/api/auditCenter/index";
  export default {
    components:{
      ButtonFooter,
      HistoryRecord,
      EvidenceData
    },
    data() {         
      return{
        oversee,
        oversee_hl,
        search,
        urge:false,
        isCheck:false,
        dialogVisible:false,
        activeName: 'first',
        tableData: [],
        deptList:[],
        info:{},
        taskLifeList:[],
        total: 0,
        sonType:0,
        queryParams: {
          pageNum: 1,
          currPage: 1,
          pageSize: 10,
          isPeriodicTask: 1,
          query: {
            isPeriodicTask: 1,
          }
        },
        files:[],
        concern:false,
        viewType:'',
        hasHeart,
        noHeart
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
      sonDataList(){
        return this.deptList.filter(item =>{
          return item.statusName = ['草稿','进行中','逾期','待审核','完成','作废'][Number(item.status)/10 - 1]
        })
      }
    },
    async created(){
      await this.init()
      await this.taskLife()
    },
    methods:{
      async init(){
        const {id,types,viewType,sonType} = this.$route.query
        this.taskId = id
        this.viewType = viewType
        this.sonType = sonType
        
        let info
        if(types == 1){
          info = await respTaskDetails(id)
        }else{
          info = await getInfoTask(id)
        }
        this.types = types
        console.log(this.sonType)

        this.info = info.data
        this.urge = info.data.isUrge || info.data.isTaskPsnUrge
        this.concern = info.data.isTaskPsnAttention
        this.queryParams.query.periodicTaskId=this.info.periodicTaskId

        let data = {
          pageNum: 1,
          pageSize: 10,
          query: {taskId:id}
        }
        const res = await respTaskInstance(data)
        this.tableData = res.data.list || []
        if(this.info.fileIds) await this.getFile(this.info.fileIds)
        this.queryParams.query.parentId=this.info.id
        await this.getList()


      }, 
      //任务的一生
      taskLife(){
        let data = {}
        this.sonType == 1? data.id = this.info.id : data.taskId = this.info.id
        taskLife(data).then(response => {
          this.taskLifeList= response.data
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
        respTaskList(this.queryParams).then(response => {
          this.deptList = response.data.list
          this.total = response.data.pagination.total;
          this.loading = false;
        });
      },
      async handleConcern(){
        let data = {}
        if(this.types == 1){ //子取消或者新增关注
          this.concern ? data.id = this.info.taskPsnAttentionId : data.taskInstanceId = this.info.id
        }else{ //父取消或者新增关注
          this.concern ? data.id = this.info.taskPsnAttentionId : data.taskId = this.info.id
        }
        const res = await addAndCancel(data)
        if(res.msg == '操作成功'){
          this.concern = ! this.concern
          let info
          this.types == 1 ? info = await respTaskDetails(this.$route.query.id) : info = await getInfoTask(this.$route.query.id)
          this.info = info.data
        }

      },
      async getFile(fileIds) {
        this.files=[]
        const info = await listByIds(fileIds)
        this.files = info.data
      },
      //督办
      async handleUrge(){
        if(this.urge) return
        let data = {}
        this.types == 1? data.taskInstanceId = this.$route.query.id : data.taskId = this.$route.query.id
        
        const res = await urgeTask(data)
        if(res.msg == '操作成功'){
          this.urge = ! this.urge
          let info
          this.types == 1 ? info = await respTaskDetails(this.$route.query.id) : info = await getInfoTask(this.$route.query.id)
          this.info = info.data
        }
      },
      lookHandle(url) {
        this.previewFile(url)
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
.app-main .app-main-wrap .app-main-ctn > .content{
  padding: 0 !important;
  overflow: hidden;
}
// ::v-deep .button-container{
//   background-color: transparent;
// }
// ::v-deep .design-form-wrap__btnwrap{
//   background-color: transparent;
// }
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
           min-height: 200px;
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
           height: 280px;
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