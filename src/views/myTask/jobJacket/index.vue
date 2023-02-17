<template>
  <div class="content">
    <el-row :gutter="10" >
        <el-col :span='4'>
          <div class="content_right">
            <div class="content_right_add">
              <div>任务夹</div>
              <el-button size='mini' type="primary" icon="el-icon-circle-plus" @click="addJob">添加</el-button>
            </div>
            <div class="content_right_box" v-for="(item,index) in jobJacketList" :key="index">
              <div class="content_right_box_title">
                {{item.name}}
              </div>
              <div class="content_right_box_task"
               v-for="(list,indexs) in item.jacketList" 
               :key="indexs"
               :class="{'content_right_box_checked':list.jobShow}" 
               
              >
                <div style="flex-grow:2;height: 55px;line-height: 55px;" @click="handleSwitch(index,indexs,list.name)">{{list.name}}</div>
                <div>
                  <span>{{list.taskNum}}</span>
                  <el-popover
                    popper-class="popper_handle"
                    placement="right"
                    width="50"
                    trigger="click"
                    :ref="`node-popover-${list.id}`"
                    v-show="list.handleShow"

                    >
                    <div class="content_right_box_mytask_handle" @click="handleEdit(list.id,indexs)">修改</div>
                    <div class="content_right_box_mytask_handle" @click="handleDeleteJob(list.id,indexs)">删除</div>
                    <div class="content_right_box_mytask_handle" 
                      v-if="indexs != 0" 
                      @click="handleMove('up',list.id,item.jacketList[indexs-1].id,indexs)"
                    >上移</div>
                    <div class="content_right_box_mytask_handle" 
                      v-if="indexs != item.jacketList.length-1" 
                      @click="handleMove('down',list.id,item.jacketList[indexs+1].id,indexs)"
                    >下移</div>
                    <el-button class="content_right_box_mytask_operator" type="text" slot="reference" @click="visible = true">···</el-button>
                  </el-popover>
                </div>
              </div>
            </div> 
          </div>
        </el-col>
        <el-col :span='20' class="business_crud">
          <ty-business-crud1
            class="high-search-crud"
            id="treeIndex"
            title
            searchMode="high"
            :showOperation="[]"
            :showIndex="$showIndex"
            :pageInfo="{ limit: 10 }"
            :getListInterface="getListInterface"
            :columns="columns"
            :isGetListByQuery="true"
            :customSort="true"
            :treeProps="treeProps"
            :showSearchFields="['name', 'tackTypeId','createName','veriftPen']"
            :outSiderQuery="outSiderQuery"
            ref="materialCrud"
            @sortMethod="sortMethod"
            @resetSearch="resetSearchFun"
            @search="handleSearch"
            @highSearchChange="highSearchChangeFun"
            @checkedChange="handleSelectionChange"
            @filterChange="tableFilterChange"
          >
            <template slot="name" slot-scope="{ data }">
              <div class="slot_name">
                <el-tag v-if="data.personIds.length > 1" size="mini">多人</el-tag>
                <div class="slot_name_text" >{{data.name}}</div>
                <img :src="hasHeart" v-if="data.isTaskPsnAttention">
              </div>
            </template>

            <template slot="taskProgress" slot-scope="{ data }">
              <div> 
                  <el-progress  type="circle" :width="35"  :percentage="data.taskProgress || 0"></el-progress>
              </div>
            </template>
            <template slot="urgency" slot-scope="{ data }">
              <el-tag v-if="data.urgency==0" type="danger">特急</el-tag>
              <el-tag  v-if="data.urgency==1"  type="warning">加急</el-tag>
              <el-tag  v-if="data.urgency==2"  type="success">普通</el-tag>
            </template>
            <template slot="speed" slot-scope="{ data }">
              <el-rate
                v-model="data.speed/2"
                disabled
                text-color="#ff9900"
                score-template="{data.speed}">
              </el-rate>
            </template>
             <template slot="score" slot-scope="{ data }">
              <el-rate
                v-model="data.score/2"
                disabled
                text-color="#ff9900"
                score-template="{data.score}">
              </el-rate>
            </template>
            <template slot="search">
                <template   v-if="searchDateRangShow">
                  <div class="el-form-item el-form-item--medium">
                    <label class="el-form-item__label">截止时间:</label>
                    <div class="el-form-item__content">
                      <el-date-picker
                              size="small"
                              v-model="searchUpDate"
                              type="daterange"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                      >
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="el-form-item el-form-item--medium">
                    <label class="el-form-item__label">创建时间:</label>
                    <div class="el-form-item__content">
                      <el-date-picker
                              size="small"
                              v-model="searchSetDate"
                              type="daterange"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                      >
                      </el-date-picker>
                    </div>
                  </div>
                </template>
                <template slot="name" slot-scope="{ data }">
                  <el-tag v-if="data.name==0" type="danger">全部</el-tag>
                  <el-tag  v-if="data.name==1"  type="warning">已关注</el-tag>
                  <el-tag  v-if="data.name==2"  type="success">未关注</el-tag>
                </template>
              </template>
              <div
                slot="operator"
                style="display: flex; justify-content: flex-end"
                class="flex-operator handle-group"
              >
              </div>
              <template v-slot:rowOperator="scope">
                <el-button
                  v-if="scope.row.subset ? false: scope.row.status == 20 || scope.row.status == 30"
                  class="handle-text-btn"
                  size="mini"
                  :icon="$editIcon"
                  type="text"
                  @click="navigater(`/leadertask/myTask/jobJacket/plan?id=${scope.row.id}&selectPersonType=${scope.row.selectPersonType}`)"
                  >进度
                </el-button>
                <el-button
                  v-if="scope.row.subset ? false: scope.row.status == 20 || scope.row.status == 30"
                  class="handle-text-btn"
                  size="mini"
                  :icon="$editIcon"
                  type="text"
                  @click="navigater(`/leadertask/myTask/jobJacket/disintegrate?id=${scope.row.id}&jobName=${scope.row.name}`)"
                  >分解
                </el-button>
                <el-button
                  v-if="scope.row.subset ? false: scope.row.status == 20 || scope.row.status == 30"
                  class="handle-text-btn"
                  size="mini"
                  :icon="$editIcon"
                  type="text"
                  @click="hendleCommit(scope.row.id,5,scope.row.taskProgress)"
                  >提交
                </el-button>
                <el-button
                  v-if="scope.row.subset ? false: scope.row.status == 40"
                  class="handle-text-btn"
                  size="mini"
                  :icon="$editIcon"
                  type="text"
                  @click="hendleCommit(scope.row.id,12)"
                  >撤回
                </el-button>
                <el-button
                  v-if="scope.row.subset ?  scope.row.status == 20 || scope.row.status == 30 : false"
                  class="handle-text-btn"
                  size="mini"
                  :icon="$editIcon"
                  type="text"
                  @click="handleDelete(scope.row)"
                  >作废
                </el-button>
                <el-button
                   v-if="scope.row.subset ? scope.row.status != 20 || scope.row.status != 30 : [10,40,50,60].includes(scope.row.status)"
                  class="handle-text-btn"
                  size="mini"
                  :icon="$editIcon"
                  type="text"
                  @click="navigater(`/leadertask/myTask/jobJacket/planDetail?id=${scope.row.id}&viewType=${scope.row.subset?'1':'2'}`)"
                  >查看
                </el-button>
              </template>
           </ty-business-crud1>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import {cancelTaskType} from "@/api/taskrelease/havePublished"
import {getRespTaskType} from "@/api/auditCenter/index";
import {listByType,addFolder,editFolder,respCommitRec,removeFolder,moveFolder} from "@/api/myTask/jobJacket";
import hasHeart from "@/assets/images/taskcycle/hasHeart.png"

export default {
  data() {
   
    return {
      hasHeart,
      outSiderQuery:{},
      searchDateRangShow:false,
      visible: false,
      title: "",
      backlogNum:0,
      jobJacketList:[{
        name:'',
        jacketList:[{
          name:'待办计划',
          jobShow:true,
          taskNum:0
        }]
      }],
      index:0,
      indexs:0,
      oldIndex:0,
      oldIndexs:0,
      
      treeProps:{
        children: 'secondaryTaskList',
        hasChildren: 'hasChildren'
      },
      taskTypeOptions: [],
      treeSelectData: [],
      selectRows: [], //当前选中的数据
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      searchUpDate: [], //查询截止时间段的值
      searchSetDate: [], //查询创建时间段的值
      jobData:[],
      //列表查询接口信息
      getListInterface: {
        url: "/api/leadertask/respTask/listPageByFolder",
        methodType: "post",
        resFormatFun: this.getListResFormatFun,
        params: {
          folderName:"待办计划"
        }
      },
      //列表字段定义
      columns: [
        {
          label: "任务名称",
          baseSearch: true,
          prop: "name",
          type:'slot',
          align: "left",
          width:200,
          filters: [
            {
              text: "全部",
              value: 0,
            },
            {
              text: "已关注",
              value: 1,
            },
            {
              text: "未关注",
              value: 2,
            },
          ],
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入任务名称",
            },
          },
        },
        {
          label: "任务类型",
          prop: "tackTypeId",
          baseSearch: true,
          width:120,
          align: "left",
          formFormat: {
            type: "select",
            icon: "icon-select",
            name: "下拉选择",
            flag: 0,
            options: {
              borderRadius: "no",
              defaultValue: "",
              multiple: false,
              disabled: false,
              clearable: true,
              placeholder: "请选择任务类型",
              required: false,
              showLabel: false,
              width: "100%",
              options: [],
              filterable: false,
              optionDataType: 2,
              interfaceMethod: "/api/leadertask/RespTaskType/list",
              interfaceParam: {},
              interfaceId: 1614917845100,
              resList: "data",
              interfaceType: "post",
              tipFont: "",
              dictKey: "",
              props: {
                value: "id",
                label: "name",
              },
            },
            key: 1614917844011,
            model: "tackTypeId",
            rules: [],
          },
          formatter: (val, row) => {
            return this.taskTypeFormat(row.tackTypeId);
          },
        },

        {
          label: "紧急程度",
          prop: "urgency",
          type:'slot',
          width:120,
          align: "left",
          filters: [
            {
              text: "特急",
              value: 0,
            },
            {
              text: "加急",
              value: 1,
            },
            {
              text: "普通",
              value: 2,
            },
          ],
          formFormat: {
            type: "select",
            icon: "icon-select",
            name: "下拉选择",
            flag: 0,
            options: {
              borderRadius: "no",
              defaultValue: "",
              multiple: false,
              disabled: false,
              clearable: false,
              placeholder: "",
              required: false,
              showLabel: false,
              width: "100%",
              options: [
             
              ],
              filterable: false,
              optionDataType: 1,
              interfaceMethod: "",
              interfaceParam: '{"dictType":"hse_TJLB"}',
              interfaceId: 1614917845020,
              resList: "rows",
              interfaceType: "get",
              tipFont: "",
              dictKey: "",
              props: {
                value: "dictValue",
                label: "dictLabel",
              },
            },
            key: 1614917842001,
            model: "urgency",
            rules: [],
          },
          formatter: (val) => {
            switch (val) {
              case 0:
                return "特急";
              case 1:
                return "加急";
              case 2:
                return "普通";
              default:
                return "";
            }
          },
        },
        {
          label: "截止时间",
          prop: "deadlineTime",
          width:180,
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
          sortable:"custom",
        },
        
        {
          label: "创建人",
          prop: "createName",
          align: "left",
          baseSearch: true,
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入创建人",
            },
          },
        },
         {
          label: "审核人",
          prop: "veriftPen",
          align: "left",
          // baseSearch: true,
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入审核人",
            },
          },
        },
        {
          label: "负责人",
          prop: "personName",
          align: "left",
          width:"200",
        },
        {
          label: "阶段",
          prop: "status",
          align: "left",
          filters: [
            {
              text: "全部",
              value: -10,
            },
            {
              text: "进行中",
              value: 20,
            },
            {
              text: "已逾期",
              value: 30,
            },
            {
              text: "待审核",
              value: 40,
            },
            {
              text: "已完成",
              value: 50,
            },
            {
              text: "已关闭",
              value: 60,
            }
          ],
          formatter: (val) => {
            switch (val) {
              case 10:
                return "草稿";
              case 20:
                return "进行中";
              case 30:
                return "已逾期";
              case 40:
                return "待审核";
              case 50:
                return "已完成";
              case 60:
                return "已关闭";
              default:
                return "";
            }
          },
        },
         {
          label: "进度",
          prop: "taskProgress",
          type: "slot",
          width:"100",
          align: "left",
        },
        {
          label: "创建时间",
          prop: "createTime",
          sortable:"custom",
          width: 180,
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
          align: "left",
        },
        {
          label: "完成速度",
          prop: "speed",
          width: 160,
          align: "left",
          type:'slot'
        },
        {
          label: "完成质量",
          prop: "score",
          width: 160,
          align: "left",
          type:'slot'
        },
        {
          prop: "operation",
          label: "操作",
          type: "operation",
          width: 150,
          align: "right",
        },
      ],
    };
  },

  watch: {
    //当截止时间段发生改变同步列表查询字段
    searchUpDate(timeRang) {
      if (timeRang && timeRang.length > 0) {
        this.getListInterface.params.deadlineBeginTime = this.toDateUtil.formatDateTime(
          timeRang[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        this.getListInterface.params.deadlineEndTime = this.toDateUtil.formatDateTime(
          new Date(timeRang[1].toString().replace("00:00:00", "23:59:59")),
          "yyyy-MM-dd HH:mm:ss"
        );
      }
    },
    //当创建时间段发生改变同步列表查询字段
    searchSetDate(timeRang) {
      console.log(this.getListInterface.params)
      if (timeRang && timeRang.length > 0) {
        this.getListInterface.params.beginTime = this.toDateUtil.formatDateTime(
          timeRang[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        this.getListInterface.params.endTime = this.toDateUtil.formatDateTime(
          new Date(timeRang[1].toString().replace("00:00:00", "23:59:59")),
          "yyyy-MM-dd HH:mm:ss"
        );
      }
    },
  },
  computed:{
    dataList(){
      let num = 0
      this.jobData.filter(item => {
        if(item.folderTypeName == '通用任务夹'){
          num += Number(item.taskNum)
        }
      })
      let arr = [
        {
        name:'通用任务夹',
        jacketList:[...[{
            name:'全部计划',
            jobShow:false,
            taskNum:num
            }],
            ...this.jobData 
            .filter(item => item.folderTypeName == '通用任务夹')
            .map(job =>({
              ...job,
              jobShow:false
            }))]
          },
        {
          name:'我的文件夹',
          jacketList:this.jobData
          .filter(item => item.folderTypeName == '我的文件夹')
          .map(job =>({
            ...job,
            jobShow:false,
            handleShow:true
          }))
        }
      ]
      return arr
    },
  },
  async created() {
    await this.init()
    await this.getRespTaskType();
    document.getElementsByClassName('app-main-ctn')[0].style.backgroundColor = '#f0f2f5'
  },
  async activated(){
    this.$refs.materialCrud._getListData();
    await this.init()
    console.log(this.jobJacketList)
  },
  destroyed(){
    document.getElementsByClassName('app-main-ctn')[0].style.backgroundColor = '#ffffff'
  },
  methods: {
    async init(){
      this.jobJacketList =[{
        name:'',
        jacketList:[{
          name:'待办计划',
          jobShow:true,
          taskNum:0 
        }]
      }]
      const jobData = await listByType()
      this.jobData = jobData.data
      console.log(this.dataList)
      if(this.jobJacketList.length == 1) this.jobJacketList = [...this.jobJacketList,...this.dataList]
     
      // this.jobJacketList.push(this.dataList)
    },
    //切换任务夹
    handleSwitch(index,indexs,name){
      if(index == this.oldIndex && indexs == this.oldIndexs) return
      this.index = index
      this.indexs = indexs
      this.$set(this.jobJacketList[index].jacketList[indexs],'jobShow',true)
      this.$set(this.jobJacketList[this.oldIndex].jacketList[this.oldIndexs],'jobShow',false)
      this.oldIndex = index
      this.oldIndexs = indexs

      this.getListInterface.params.folderName = name
      this.$refs.materialCrud._getListData();

    },
    //提交、撤回
    hendleCommit(id,commitType,taskProgress){
      let text
      commitType == 12 ? text = '撤回任务' : text = '提交审批'
      this.$confirm('是否要' + text + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(text == '提交审批' && taskProgress < 100){
          this.$message({
            type: 'error',
            message: '请更新进度至100%才能提交审批！'
          });
          return false
        }
        const data ={
          taskId:id,
          commit:commitType
        }
        return respCommitRec(data)
      })
      .then((data) =>{
        console.log(data)
        if(data){
          this.$refs.materialCrud._getListData();
          this.$message({
            type: 'success',
            message: data.msg
          });
        }
        
      })
    },
    //添加任务夹
    addJob(){
      this.$prompt('新建任务夹', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:'任务夹名称（最多五个汉字）',
        inputPattern:  /^[\S]{1,5}$/,
        inputErrorMessage: '格式不正确'
      }).then(async ({ value })  => {
        const data = {
          name:value
        }
        const res = await addFolder(data)
        this.$message({
          type: res.code == 200?'success':'warning',
          message: res.msg
        });
        return value
      }).then(async (value) =>{
        const jobRes = await listByType()
        this.jobJacketList[2].jacketList.push({
            name:value,
            jobShow:false,
            taskNum:0,
            handleShow:true,
            id:jobRes.data[jobRes.data.length-1].id
        })
      })
    },
    //修改文件夹
    handleEdit(id,index){
      this.$prompt('修改任务夹名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:'任务夹名称（最多五个汉字）',
        inputPattern:  /^[\S]{1,5}$/,
        inputErrorMessage: '格式不正确'
      }).then(async ({ value })  => {
        const data = {
          name:value,
          id
        }
        const res = await editFolder(data)
        this.$message({
          type: res.code == 200?'success':'warning',
          message: res.msg
        });
        this.$set(this.jobJacketList[2].jacketList[index],'name',value)

      })
      
    },
    //移动文件夹
    async handleMove(type,sourceId,targetId,index){
      // moveFolder
      const data = {
        sourceFolderId:sourceId,
        targetFolderId:targetId
      }
      const res = await moveFolder(data)
      this.$message({
        type: res.code == 200?'success':'warning',
        message: res.msg
      });
      let temp = this.jobJacketList[2].jacketList[index];
      if(type == 'up'){//上移
        if(this.oldIndex == 2 && this.oldIndexs == index) this.oldIndexs = this.oldIndexs - 1
        this.$set(this.jobJacketList[2].jacketList,index,this.jobJacketList[2].jacketList[index-1])
        this.$set(this.jobJacketList[2].jacketList,index-1,temp)
      }else{
        if(this.oldIndex == 2 && this.oldIndexs == index) this.oldIndexs = this.oldIndexs + 1
        this.$set(this.jobJacketList[2].jacketList,index,this.jobJacketList[2].jacketList[index+1])
        this.$set(this.jobJacketList[2].jacketList,index+1,temp)
      }
      //关闭el-popove弹框
      this.$refs["node-popover-" + sourceId][0].showPopper = false;
    },
    //删除文件夹
    handleDeleteJob(id,index){
      this.$confirm('是否删除该文件夹?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeFolder(id)
        this.$message({
          type: res.code == 200?'success':'warning',
          message: res.msg
        });
        this.jobJacketList[2].jacketList.splice(index,1);
        console.log(this.jobJacketList[2].jacketList)
      })
    },
    //筛选
    tableFilterChange(val) {
        const {  urgency,name,status } = val;
        if (urgency) {
          if (urgency.length > 0)
            this.getListInterface.params.urgencyList = urgency;
          if (urgency.length == 0)
            delete this.getListInterface.params.urgencyList;
        }
         if (name) {
          if (name.length == 1 && name[0] != 0)
            this.getListInterface.params.isTaskPsnAttention = name[0];
          if (name.length == 0 || name.length > 1)
            delete this.getListInterface.params.isTaskPsnAttention;
        }
        if (status) {
          if (status.length > 0)
            this.getListInterface.params.statusList = status;
            if(status.includes(-10))this.getListInterface.params.statusList = [20,30,40,50,60];
          if (status.length == 0)
            this.getListInterface.params.statusList = [20,30,40,50,60];
        }
        this.$refs.materialCrud._getListData();
      },
   
     //排序方法
      sortMethod(val,arr){
        if(arr.length == 0) {
          return
        } 
        let sortType=arr[0].sortType=='desc'?'DESC':'ASC'
        this.outSiderQuery = {
          sort : sortType,
          order : arr[0].key
        }
      },
    handleSearch() {
      
    },
    //作废
    async handleDelete(e){
      this.$confirm("是否确认作废当前任务？" , "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }).then(function() {
          console.log(e.id)
          return cancelTaskType(e.id);
        }).then(() => {
          this.$message.success("作废成功");
          this.$refs.materialCrud._getListData();

      }).catch(function() {});
    },
    handleSelectionChange(selection) {
      this.selectRows = selection;
      this.single = this.selectRows.length != 1;
      this.multiple = !this.selectRows.length;
    },
    //格式化列表返回值
    getListResFormatFun(res) {
      const {jobJacketList,index,indexs} = this
      if(jobJacketList[index].jacketList[indexs].taskNum == 0) this.$set(jobJacketList[index].jacketList[indexs],'taskNum',res.data.pagination.total)
      res.data.list.map(i=> {
        if(i.secondaryTaskList){
          i.secondaryTaskList.map(v=> v.subset = true)
        }
      })
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      };
    },
    taskTypeFormat(value) {
        for (let i = 0; i < this.taskTypeOptions.length; i++) {
          if (this.taskTypeOptions[i].id == value) {
            return this.taskTypeOptions[i].name
          }
        }
      },
      getRespTaskType() {
        getRespTaskType().then(response => {
          this.taskTypeOptions = response.data;
        });
      },
    //高级搜索切换展开收起方法
    highSearchChangeFun(val) {
      this.searchDateRangShow = val;
    },
    //重置查询
    resetSearchFun() {
      const folderName = this.getListInterface.params.folderName
      this.getListInterface.params = {}
      this.getListInterface.params.folderName = folderName
      this.searchUpDate = []
      this.searchSetDate = []
      this.searchDateRang = [];
    },
  },
}
</script>
<style  lang="scss">
.popper_handle{
  min-width: 100px;
  padding: 0;
  :hover{
    background: rgb(236,245,255);
    color: #026DFF;
  }
}
</style>
<style lang="scss" scoped>
.app-main .app-main-wrap .app-main-ctn > .content{
   padding: 0 !important;
   background: #f0f2f5 !important; 
   overflow-x: hidden;
}
::v-deep .el-button + .el-button{
  margin-right: 10px;
  margin-left: 0;
}
::v-deep .el-table .cell.el-tooltip{
  display: flex;
}
::v-deep .el-table .cell.el-tooltip{
  width: 100%;
  >div{
    width: 100% ;
  }
  >.el-table__expand-icon{
    width: 20px;
  }
}
.slot_name{
  display: flex;
  align-items: center;
  &_text{
    // margin: 0 5px;
    text-overflow:ellipsis;
    overflow:hidden;
    flex-grow:2;
    max-width: 155px;
  }
  img{
    margin-left: auto;
    height: 16px;
    width: 20px;
  }
}
.handle-text-btn{
  margin-right: 10px;
}
.content{ 
  background: rgb(240,242,245);
  &_right{
    font-size: 14px;
    padding: 10px;
    border-radius: 10px;
    background: #fff;
    overflow: auto;
    height: 649px;
    &_add{
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div{
        font-size: 22px;
        font-weight: 600;
      }
    }
    &_box{
      &_task, &_mytask{
        height: 55px;
        border-radius: 10px;
        background: rgb(242,242,242);
        padding: 0 10px;
        border: 1px solid #E8E8EA;
        margin-bottom: 10px;
        cursor: pointer;
        &_operator{
          font-weight: 700;
          color: #999;
          margin-left: 5px;
        }
        &_handle{
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          
        }
        span{
          font-size: 12px;
        }
      }
      &_checked{
        color: #fff;
        background: #0079fe;
      }
      &_title{
        border-left: 3px solid #026DFF;
        color: #026DFF;
        padding-left: 5px;
        font-weight: 600;
        margin: 10px 0;
      }
      >div{
         display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
   
    
    
  }
}
.business_crud{
  background: #fff;
  border-radius: 10px;
}

::v-deep .el-date-editor--daterange.el-input__inner{
  width: 100%;
}
::v-deep .searchBox-form .el-form-item .el-form-item__label, .searchBox-form .el-form-item label{
  width: 100px;
}

::v-deep .el-popove{
  min-width: 100px;
}
</style>