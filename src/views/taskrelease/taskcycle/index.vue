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
                :showIndex="false"
                :pageInfo="{ limit: 10 }"
                :getListInterface="getListInterface"
                :columns="columns"
                @sortMethod="sortMethod"
                :customSort="true"
                :outSiderQuery="outSiderQuery"
                :isGetListByQuery="true"
                :showSearchFields="['name', 'taskTypeId','principalName','veriftPsnName']"
                ref="materialCrud"
                @resetSearch="resetSearchFun"
                @search="handleSearch"
                @highSearchChange="highSearchChangeFun"
                @checkedChange="handleSelectionChange"
                @filterChange="tableFilterChange"
        >
            <div slot="id" slot-scope="data" >
                <el-link style="color: #026dff" :underline="false">
                    <router-link
                            :to="{
                path: '/leadertask/taskrelease/taskcycle/detail',
                query: {id:data.data.id},
              }">
                        <span>查看详情</span>
                    </router-link>
                </el-link>
            </div>
            <template slot="enable" slot-scope="{ data }">
                <el-switch
                        @change="handleStatusChange(data)"
                        v-model="data.enable"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#026DFF"
                        :width="50"
                ></el-switch>
            </template>
            <template slot="search">
                <template  v-if="searchDateRangShow">
                    <!--                    <div class="el-form-item el-form-item&#45;&#45;medium">-->
                    <!--                        <label class="el-form-item__label">截止时间:</label>-->
                    <!--                        <div class="el-form-item__content">-->
                    <!--                            <el-date-picker-->
                    <!--                                    size="small"-->
                    <!--                                    v-model="searchUpDate"-->
                    <!--                                    type="daterange"-->
                    <!--                                    range-separator="-"-->
                    <!--                                    start-placeholder="开始日期"-->
                    <!--                                    end-placeholder="结束日期"-->
                    <!--                            >-->
                    <!--                            </el-date-picker>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                    <div class="el-form-item el-form-item--medium">
                        <label class="el-form-item__label">创建时间:</label>
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
                </template>

            </template>
            <template slot="name" slot-scope="{ data }">
                <div class="slot_name">
                    <el-tag v-if="data.principalIds.length > 1" size="mini">多人</el-tag>
                    <div class="slot_name_text">{{data.name}}</div>
                    <img :src="hasHeart" v-if="data.isAttention">
                </div>
            </template>


            <template slot="urgency" slot-scope="{ data }">
                <el-tag v-if="data.urgency==0" type="danger">特急</el-tag>
                <el-tag v-if="data.urgency==1" type="warning">加急</el-tag>
                <el-tag v-if="data.urgency==2" type="success">普通</el-tag>
            </template>
            <!-- 查询字段的插槽，在查询表单中字段比较难处理的时候使用这种自定义方式 -->
            <template v-slot:rowOperator="scope">
                <el-button
                        class="handle-text-btn"
                        size="mini"
                        :icon="$editIcon"
                        type="text"
                        @click="handleEdit(scope.row)"
                >查看
                </el-button>
            </template>
        </ty-business-crud1>
    </div>
</template>
<script>
  import {getRespTaskType, changeEnable} from "@/api/auditCenter/index";
  import hasHeart from "@/assets/images/taskcycle/hasHeart.png"

  export default {
    data() {

      return {
        hasHeart,
        outSiderQuery:{},
        //是否展示查询时间段
        searchDateRangShow: false,
        title: "",
        treeSelectData: [],
        taskTypeOptions: [],
        selectRows: [], //当前选中的数据
        single: true, // 非单个禁用
        multiple: true, // 非多个禁用
        searchUpDate: [], //查询时间段的值
        //列表查询接口信息
        getListInterface: {
          url: "/api/leadertask/respPeriodicTask/listPage",
          methodType: "post",
          resFormatFun: this.getListResFormatFun,
          params: { },
        },
        //列表字段定义
        columns: [
          {
            label: "任务名称",
            align: "left",
            type:'slot',
            width:220,
            baseSearch: true,
            prop: "name",
            filters: [
              {
                text: "全部",
                value: 2,
              },
              {
                text: "已关注",
                value: 1,
              },
              {
                text: "未关注",
                value: 0,
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
            prop: "taskTypeId",
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
              model: "taskTypeId",
              rules: [],

            },
            formatter: (val, row) => {
              return this.taskTypeFormat(row.taskTypeId);
            },
          },

          {
            label: "紧急程度",
            prop: "urgency",
            type: "slot",
            width: 120,
            align: "left",
            filters: [
              {
                text: "普通",
                value: 2,
              },
              {
                text: "加急",
                value: 1,
              },
              {
                text: "特急",
                value: 0,
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
                options: [],
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
            label: "负责人",
            prop: "principalName",
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
            prop: "veriftPsnName",
          },
          // 周期描述
          {
            label: "周期描述",
            prop: "id",
            type: "slot",
          },
          {
            label: "已下发次数",
            prop: "taskReleasesNum",
            width: 120,
          },
          {
            label: "状态",
            prop: "enable",
            type: "slot",
            filters: [
              {
                text: "启用",
                value: 1,
              },
              {
                text: "停用",
                value: 0,
              },
            ],
          },
          {
            label: "创建时间",
            prop: "createTime",
            width: 160,
            formatter: (val) => {
              if (val) {
                return val.substring(0, 16);
              }
            },
            sortable: "custom",
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
      // 角色状态修改
      handleStatusChange(row) {
        // 0-不启用 1-启用
        let text = row.enable === 0 ? "停用" : "启用";
        this.$confirm(
          '确认要"' + text + '""' + row.name + '"吗?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(function () {
            return   changeEnable(row.id, row.enable);
          })
          .then(() => {
            this.msgSuccess(text + "成功");
          })
          .catch(function () {
            row.enable = row.enable === 0 ? 1 : 0;
          });
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
      handleAdd() {
        let obj = {
          path: "/leadertask/taskrelease/taskcycle/detail",
        };
        this.$router.push(obj);
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
          order :  arr[0].key
        }
      },
      handleEdit(row) {
        this.$router.push({
          path: `/leadertask/taskrelease/taskcycle/check`,
          query: {
            id: row.id,
          }
        });
      },

      tableFilterChange(val) {
        const {urgency,name,enable} = val;

        if (urgency) {
          if (urgency.length > 0)
            this.getListInterface.params.urgencyList = urgency;
          if (urgency.length == 0)
            delete this.getListInterface.params.urgencyList;
          this.$refs.materialCrud._getListData();
          return false;
        }
        if (enable) {
          if (enable.length > 0)
            this.getListInterface.params.enableList = enable;
          if (enable.length == 0)
            delete this.getListInterface.params.enableList;
          this.$refs.materialCrud._getListData();
          return false;
        }
        if (name) {
          if (name.length > 0 && name[0] != 2)
          this.getListInterface.params.isAttention = name[0];
          if (name.length == 0 || name.length > 1|| name[0] == 2)
            delete this.getListInterface.params.isAttention;
          this.$refs.materialCrud._getListData();
          return false;
        }
      },
      handleSearch() {
        if (this.searchUpDate && this.searchUpDate.length > 0) {
          this.getListInterface.params.startCreateTime = this.toDateUtil.formatDateTime(
            this.searchUpDate[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.getListInterface.params.endCreateTime = this.toDateUtil.formatDateTime(
            new Date(this.searchUpDate[1].toString().replace("00:00:00", "23:59:59")),
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

        this.getListInterface.params = {};
        this.searchUpDate=[]
      },
    },
  };
</script>
<style lang="scss" scoped>
    @import "~@/assets/styles/fromSearch/fromSearch.scss";

    @include handle-group;
    .slot_name{
        display: flex;
        align-items: center;
        &_text{
            text-overflow:ellipsis;
            overflow:hidden;
        }
        img{
            height: 16px;
            width: 20px;
            position: absolute;
            right: -5px;
            z-index: 999;
        }
    }
    ::v-deep .el-date-editor--daterange.el-input__inner{
        width: 100%;
    }
    ::v-deep .el-switch__core::before {
        content: "停用";
        position: absolute;
        font-size: 12px;
        top: -1px;
        right: 5px;
        color: #fff;
    }

    .is-checked ::v-deep .el-switch__core::before {
        content: "启用";
        position: absolute;
        font-size: 12px;
        top: -1px;
        left: 5px;
        color: #fff;
    }

    ::v-deep .searchBox-form {
        .el-form-item__label {
            width: 74px !important;
        }
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
