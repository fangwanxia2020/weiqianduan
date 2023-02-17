<template>
  <div class="post-new">
    <!--用户数据-->
    <!-- showSelect：列表是否显示复选框 -->
    <ty-business-crud1
      class="high-search-crud"
      id="vehicleId"
      title
      searchMode="high"
      :showOperation="[]"
      :showIndex="$showIndex"
      :pageInfo="{ limit: 10 }"
      :getListInterface="getListInterface"
      :columns="columns"
      :outSiderQuery="outSiderQuery"
      :isGetListByQuery="true"
      :customSort="true"
      :showSearchFields="['name', 'tackTypeId','veriftPen','personName']"
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
        <div class="slot_name_text">{{data.name}}</div>
      </div>
    </template>
    <template slot="urgency" slot-scope="{ data }">
      <el-tag v-if="data.urgency==0" type="danger">特急</el-tag>
      <el-tag  v-if="data.urgency==1"  type="warning">加急</el-tag>
      <el-tag  v-if="data.urgency==2"  type="success">普通</el-tag>
    </template>
    <template slot="search" >
        <template v-if="searchDateRangShow">
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
      </template> 
      <div
        slot="operator"
        style="display: flex; justify-content: flex-end"
        class="flex-operator handle-group"
      >
        <div class="creationJob">
          <!--      handleAdd()    handleEditFun('add')-->
          <el-button type="primary" @click="handleAdd()">
            <ty-icon type="whp_add"></ty-icon>
            <span class="btn-text">普通任务</span>
          </el-button>
          <el-button type="primary" @click="navigater('/leadertask/taskrelease/taskcycle/add')">
            <ty-icon type="whp_add"></ty-icon>
            <span class="btn-text">周期任务</span>
          </el-button>
        </div>

        
      </div>
      <!-- 查询字段的插槽，在查询表单中字段比较难处理的时候使用这种自定义方式 -->
    
      <template v-slot:rowOperator="scope">
        
         <el-button
          class="handle-text-btn"
          size="mini"
          :icon="$editIcon"
          type="text"
          @click="navigater('/leadertask/taskrelease/draftBox/check?id='+scope.row.id)"
          >查看
        </el-button>
         <el-button
          class="handle-text-btn"
          size="mini"
          :icon="$editIcon"
          type="text"
          @click="navigater('/leadertask/taskrelease/draftBox/amend?id='+scope.row.id)"
          >修改
        </el-button>
        <el-button
          class="handle-text-btn"
          size="mini"
          :icon="$editIcon"
          type="text"
          @click="handleIssue(scope.row)"
          >发布
        </el-button>
      
        <!-- <el-button
          class="handle-text-btn"
          size="mini"
          :icon="$editIcon"
          type="text"
          @click="handleDelete(scope.row)"
          >删除
        </el-button> -->
       
       <del-popover
        :valText="scope.row.name"
        @submitFun="handleDelete(scope.row)"
      ></del-popover>
      </template>
    </ty-business-crud1>
  </div>
</template>
<script>
  import {removeRespTask,issueRespTask} from "@/api/taskrelease/draftBox"
  import {getRespTaskType} from "@/api/auditCenter/index";

export default {
  name: "PostNew",
  data() {
   
    return {
      outSiderQuery:{},
      title: "",
      treeSelectData: [],
      taskTypeOptions: [],
      searchDateRangShow:false,
      selectRows: [], //当前选中的数据
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      searchUpDate: [], //查询截止时间段的值
      searchSetDate: [], //查询创建时间段的值
      //列表查询接口信息
      getListInterface: {
        url: "/api/leadertask/respTask/listPage",
        methodType: "post",
        resFormatFun: this.getListResFormatFun,
        params: {
          statusList:[10]
        },
      },
      //列表字段定义
      columns: [
        {
          label: "任务名称",
          baseSearch: true,
          prop: "name",
          type:"slot",
          width:200,
          align: "left",
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
          align: "left",
          width:120,
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
              interfaceParam: {
               
              },
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
          align: "left",
          type:'slot',
          width:120,
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
          label: "负责人",
          prop: "personName",
          align: "left",
          baseSearch: true,
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入",
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
              placeholder: "请输入",
            },
          },
        },
         {
          label: "截止时间",
          prop: "deadlineTime",
          sortable:"custom",
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
          align: "left",
        },
        {
          label: "创建时间",
          prop: "createTime",
          sortable:"custom",
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
          align: "left",
        },
        {
          prop: "operation",
          label: "操作",
          type: "operation",
          width: 180,
          align: "right",
        },
      ],
    };
  },
  created() {
    this.getRespTaskType();
  },
  activated(){
    this.$refs.materialCrud._getListData();
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
  methods: {
    handleAdd(){
      let obj = {
        path: "/leadertask/taskrelease/draftBox/add",
      };
      this.$router.push(obj);
    },
    handleCheck(e){
       let obj = {
        path: "/leadertask/taskrelease/draftBox/check",
      };
      this.$router.push(obj);
    },
    //筛选
    tableFilterChange(val) {
      console.log(val,155641565555555)
        const {  urgency } = val;
        if (urgency) {
          if (urgency.length > 0)
            this.getListInterface.params.urgencyList = urgency;
          if (urgency.length == 0)
            delete this.getListInterface.params.urgencyList;
          this.$refs.materialCrud._getListData();
          return false;
        }
      },
    handleIssue(e){
      console.log(e)
       const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否确定发布'),
            h('span', { style: 'color: #0 26dff' }, `" ${e.name} "`),
            h('span', null, '任务？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(function() {
          console.log(e.id)
          return issueRespTask(e.id);
        }).then(() => {
          this.$message.success("发布成功");
          this.$refs.materialCrud._getListData();
        }).catch(function() {});
    },
     //排序方法
      sortMethod(val,arr){
        if(arr.length == 0) {
          this.outSiderQuery = {}
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
    //删除
    async handleDelete(e){
      const res = await removeRespTask(e.id);
      if(res.msg == '操作成功'){
        this.$message.success("删除成功");
        this.$refs.materialCrud._getListData();
      }else{
        this.$message.error("删除失败");
      }
    },
    handleSelectionChange(selection) {
      this.selectRows = selection;
      this.single = this.selectRows.length != 1;
      this.multiple = !this.selectRows.length;
    },
    //格式化列表返回值
    getListResFormatFun(res) {
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
      this.getListInterface.params = {
          statusList:[10]
      }
      this.searchUpDate = []
      this.searchSetDate = []
      this.searchDateRang = [];
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/fromSearch/fromSearch.scss";
@include handle-group;
::v-deep .el-button + .el-button{
  margin-right: 10px;
  margin-left: 0;
}
.creationJob{
  button{
    margin-right: 15px;
  }
}
.handle-text-btn{
  margin-right: 10px;
}
.slot_name{
  display: flex;
  align-items: center;
  &_text{
    margin: 0 5px;
    overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
  }
}
::v-deep .searchBox-form {
  .el-form-item__label {
    width: 74px !important;
  }
}
::v-deep .el-date-editor--daterange.el-input__inner{
  width: 100%;
}
::v-deep .high-search-crud .searchBox-form .el-input__inner {
  line-height: 36px !important;
  height: 36px !important;
}
.post-new {
  padding: 20px;
}
  
::v-deep .high-search-crud .searchBox-high-operator-bar {
  border-top: none;
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px !important;
}
// .flex-operator {
//   width: 100%;
//   display: flex;
//   justify-content: flex-end;
//   padding: 10px
// }
::v-deep .el-tree {
  height: 72vh;
}

.flex-operator {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.flex-row {
  display: flex;
  flex-direction: row;
  // align-items: center;
}
::v-deep .searchBox-form {
  .el-form-item__label {
    width: 74px !important;
  }
}
::v-deep .high-search-crud .searchBox-high-operator-bar {
  padding: 0 !important;
}
</style>
