<template>
  <div class="post-new">
    <!--用户数据-->
    <!-- showSelect：列表是否显示复选框 -->
<!--    @sortMethod="sortMethod"-->
<!--    :outSiderQuery="{sort:'',order:''}"-->
<!--    :isGetListByQuery="true"-->
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
      @sortMethod="sortMethod"
      :customSort="true"
      :outSiderQuery="outSiderQuery"
      :isGetListByQuery="true"
      :showSearchFields="['name', 'tackTypeId','createName','responsiblePersonName']"
      ref="materialCrud"
      @resetSearch="resetSearchFun"
      @search="handleSearch"
      @highSearchChange="highSearchChangeFun"
      @checkedChange="handleSelectionChange"
      @filterChange="tableFilterChange"
    >
    <template slot="search">
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
            <label class="el-form-item__label">发起时间:</label>
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
      <template slot="urgency" slot-scope="{ data }">
        <el-tag v-if="data.urgency==0" type="danger">特急</el-tag>
        <el-tag  v-if="data.urgency==1"  type="warning">加急</el-tag>
        <el-tag  v-if="data.urgency==2"  type="success">普通</el-tag>
      </template>
      <!-- 查询字段的插槽，在查询表单中字段比较难处理的时候使用这种自定义方式 -->
      <template v-slot:rowOperator="scope">
        <el-button
          class="handle-text-btn"
          size="mini"
          :icon="$editIcon"
          type="text"
          @click="handleEdit(scope.row)"
          >审核
        </el-button>
      </template>
    </ty-business-crud1>
  </div>
</template>
<script>
  import {getRespTaskType} from "@/api/auditCenter/index";
export default {
  data() {
   
    return {
      outSiderQuery:{
      },
      title: "",
      treeSelectData: [],
      //是否展示查询时间段
      searchDateRangShow: false,
     
      selectRows: [], //当前选中的数据
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      searchUpDate: [], //查询时间段的值
      searchSetDate: [], //查询时间段的值
      //列表查询接口信息
      getListInterface: {
        url: "/api/leadertask/respTask/checkPage",
        methodType: "post",
        resFormatFun: this.getListResFormatFun,
        params: {
          status:40
        },
      },
      //列表字段定义
      columns: [
        {
          label: "任务名称",
          align: "left",
          baseSearch: true,
          prop: "name",
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
          align: "left",
          baseSearch: true,
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
              interfaceType: "POST",
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
          width: 140,
          type: "slot",
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
        },
        {
          label: "截止时间",
          prop: "deadlineTime",
          sortable:"custom",
          width: 160,
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
        },
        {
          label: "创建人",
          prop: "createName",
          baseSearch: true,
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入",
            },
          },
        },
        {
          label: "负责人",
          prop: "responsiblePersonName",
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入",
            },
          },
        },
        {
          label: "发起时间",
          prop: "checkTime",
          sortable:"custom",
          width: 160,
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
        },
        {
          prop: "operation",
          label: "操作",
          type: "operation",
          width: 120,
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
  methods: {
    getRespTaskType() {
      getRespTaskType().then(response => {
        this.taskTypeOptions = response.data;
      });
    },
    taskTypeFormat(value) {
      for (let i = 0; i < this.taskTypeOptions.length; i++) {
        if (this.taskTypeOptions[i].id ==value) {
          return this.taskTypeOptions[i].name
        }
      }
    },
    //高级搜索切换展开收起方法
    highSearchChangeFun(val) {
      this.searchDateRangShow = val;
    },
    //排序方法
    sortMethod(val,arr){
      // r1.createTime        审核时间
      // r2.createTime        发起时间
      // c.deadlineTime       截止时间
      if(arr.length == 0) {
        this.outSiderQuery = {}
        return
      }
      let sortType=arr[0].sortType=='desc'?'DESC':'ASC'
      if(arr[0].key=='deadlineTime'){
        this.outSiderQuery = {
          sort : sortType,
          order : 'c.deadlineTime'
        }
      }else if(arr[0].key=='checkTime'){
        this.outSiderQuery = {
          sort : sortType,
          order : 'r2.createTime'
        }
      }else {
        this.outSiderQuery = {
          sort : sortType,
          order :  arr[0].key
        }
      }

    },
    handleEdit(row){
      this.$router.push({
        path: `/leadertask/auditCenter/toBeReviewed/detail`,
        query : {
          id: row.id,
          taskInstanceId:row.taskInstanceId
        }
      });
    },
    handleAdd(){
      let obj = {
        path: "/leadertask/taskrelease/draftBox/add",
      };
      this.$router.push(obj);
    },
    tableFilterChange(val) {
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
    handleSearch() {
      if (this.searchUpDate && this.searchUpDate.length > 0) {
        this.getListInterface.params.deadlineBeginTime = this.toDateUtil.formatDateTime(
                this.searchUpDate[0],
                "yyyy-MM-dd HH:mm:ss"
        );
        this.getListInterface.params.deadlineEndTime = this.toDateUtil.formatDateTime(
                new Date(this.searchUpDate[1].toString().replace("00:00:00", "23:59:59")),
                "yyyy-MM-dd HH:mm:ss"
        );
      }
      //
      if (this.searchSetDate && this.searchSetDate.length > 0) {
        this.getListInterface.params.checkBeginTime = this.toDateUtil.formatDateTime(
                this.searchSetDate[0],
                "yyyy-MM-dd HH:mm:ss"
        );
        this.getListInterface.params.checkEndTime = this.toDateUtil.formatDateTime(
                new Date(this.searchSetDate[1].toString().replace("00:00:00", "23:59:59")),
                "yyyy-MM-dd HH:mm:ss"
        );
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

    //高级搜索切换展开收起方法
    highSearchChangeFun(val) {
      this.searchDateRangShow = val;
    },
    //重置查询
    resetSearchFun() {
      this.searchUpDate = []
      this.searchSetDate = []
      this.getListInterface.params = {
        status:40
      };

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
