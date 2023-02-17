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
      :isGetListByQuery="true"
      :customSort="true"
      :showSearchFields="['name', 'tackTypeId','veriftPen','personName']"
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
        <div class="slot_name_text">{{data.name}}</div>
        <img :src="hasHeart" v-if="data.isTaskPsnAttention">
      </div>
    </template>
    <template slot="taskProgress" slot-scope="{ data }">
      <div> 
          <el-progress  type="circle" :width="35"  :percentage="data.taskProgress"></el-progress>
      </div>
    </template>
    <template slot="urgency" slot-scope="{ data }">
      <el-tag v-if="data.urgency==0" type="danger">特急</el-tag>
      <el-tag  v-if="data.urgency==1"  type="warning">加急</el-tag>
      <el-tag  v-if="data.urgency==2"  type="success">普通</el-tag>
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

      <!-- <div slot="name" slot-scope="{ data }">
       
        <span>{{ data.name }}</span>
      </div> -->
      <div
        slot="operator"
        style="display: flex; justify-content: flex-end"
        class="flex-operator handle-group"
      >
     

        
      </div>
      <!-- 查询字段的插槽，在查询表单中字段比较难处理的时候使用这种自定义方式 -->
    
      <template v-slot:rowOperator="scope">
        <el-button
          v-if="![40,50,60].includes(scope.row.status)"
          class="handle-text-btn"
          size="mini"
          :icon="$editIcon"
          type="text"
          @click="handleDelete(scope.row)"
          >作废
        </el-button>
         <el-button
          class="handle-text-btn"
          size="mini"
          :icon="$editIcon"
          type="text"
          @click="navigater(`/leadertask/taskrelease/havePublished/check?id=${scope.row.id}&viewType=${scope.row.personIds.length>1?0:1}`)"
          >查看
        </el-button>
         
      
        
       
      </template>
    </ty-business-crud1>
  </div>
</template>
<script>
  import {cancelTaskType} from "@/api/taskrelease/havePublished"
  import {getRespTaskType} from "@/api/auditCenter/index";
  import hasHeart from "@/assets/images/taskcycle/hasHeart.png"

export default {
  data() {
   
    return {
      hasHeart,
      outSiderQuery:{},
      searchDateRangShow:false,
      title: "",
      taskTypeOptions: [],
      treeSelectData: [],
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
          statusList:[20,30,40,50,60]
        },
      },
      //列表字段定义
      columns: [
        {
          label: "任务名称",
          baseSearch: true,
          prop: "name",
          type:'slot',
          width:200,
          align: "left",
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
          width:120,
          type:'slot',
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
          label: "负责人",
          prop: "personName",
          align: "left",
          baseSearch: true,
          width:"200",
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
          prop: "operation",
          label: "操作",
          type: "operation",
          width: 180,
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
  created() {
    this.outSiderQuery = {
      sort : 'DESC',
      order : 'createTime'
    }
    
    this.getRespTaskType();

  },
  activated(){
    this.$refs.materialCrud._getListData();
  },
  methods: {
   
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
          this.outSiderQuery = {
            sort : 'DESC',
            order : 'createTime'
          }
          
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
      this.outSiderQuery = {
      sort : 'DESC',
      order : 'createTime'
     }
      this.getListInterface.params = {
        statusList:[20,30,40,50,60]
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
.handle-text-btn{
  margin-right: 10px;
}
.post-new {
  padding: 20px;
}
.slot_name{
  display: flex;
  align-items: center;
  &_text{
    text-overflow:ellipsis;
    overflow:hidden;
  }
  img{
    margin-left: auto;
    height: 16px;
    width: 20px;
    position: absolute;
    right: -5px;
    z-index: 999;
  }
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
