<template>
    <div class="post-new">
        <div style="display: flex;width: 100%">
            <div style="margin-right: 30px;width: 50%">
                <!--   表格1    -->
                <el-form :inline="true">
                    <el-form-item label="下发日期：">
                        <el-date-picker
                                size="small"
                                v-model="searchDateRang"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>

                </el-form>
                <div style="text-align: left;display: flex;align-items: center;justify-content: flex-start;color: #026DFF">
                    <div style="width: 5px;height: 19px;background-color: #026DFF;margin-right: 5px"></div>
                    <div>下发情况</div>
                </div>
                <el-table
                        style="width: 100%"
                        v-loading="loading"
                        :data="deptList"
                        fit
                        :row-class-name="tableRowClassName"
                        @row-click="rowClick"
                        @sort-change="sortChange"
                        :row-style="{'height':'67px'}"
                >
                    <el-table-column
                            sortable="custom"
                            prop="periodicTaskNum"
                            label="任务序号">
                    </el-table-column>
                    <el-table-column
                            v-if="false"
                            prop="taskId"
                            label="taskId">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="下发日期">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime.substring(0,16)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="截止时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.deadlineTime.substring(0,16)}}</span>
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

            </div>
            <div style="margin-top: 60px;width: 50%">
                <div style="text-align: left;display: flex;align-items: center;justify-content: flex-start;color: #026DFF">
                    <div style="width: 5px;height: 19px;background-color: #026DFF;margin-right: 5px"></div>
                    <div>负责人情况</div>
                </div>
                <!--      表格2-->
                <el-table
                        style="width: 100%"
                        v-loading="loadingTwo"
                        :data="tableDataList"
                        fit
                       >

                    <el-table-column
                            prop="personName"
                            label="负责人">
                    </el-table-column>
                    <el-table-column
                            prop="statusName"
                            label="阶段">
                    </el-table-column>
                    <el-table-column
                            prop="taskProgress"
                            label="进度">
                        <template slot-scope="scope">
                            <div>
                                <el-progress v-if="scope.row.taskProgress==null" type="circle" :width="35"
                                             :percentage="0"></el-progress>
                                <el-progress v-if="scope.row.taskProgress!=null" type="circle" :width="35"
                                             :percentage="scope.row.taskProgress"></el-progress>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row.taskId,scope.row.id)" type="text" size="small"
                                       class="handle-text-btn">查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="botton_nav">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            layout="total, sizes,prev, pager, next,jumper"
                            :current-page.sync="queryParamsTwo.currPage"
                            :page-size="queryParamsTwo.pageSize"
                            :page-sizes="[10, 15, 20]"
                            :total="totalTwo"
                    >
                    </el-pagination>
                </div>

            </div>
        </div>
        <div class="bottom-btnde">
            <button-footer
                    :showConfirm="!isCheck"
                    :showCancel="isCheck"
                    :confirmText="'返回'"
                    @confirm="navigater('/leadertask/taskrelease/taskcycle')"
            ></button-footer>
        </div>
    </div>
</template>
<script>
  import {getlistPage, getRespTaskInstance} from "@/api/auditCenter/index";
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  export default {
    name: "taskcycle-detail",
    components: {
      ButtonFooter
    },
    data() {
      return {
        isCheck: false,
        deptList: [],
        deptListTwo: [],
        // 遮罩层
        loadingTwo: false,
        rowClickTip: false,
        loading: true,
        queryParams: {
          pageNum: 1,
          currPage: 1,
          pageSize: 10,
          isPeriodicTask: 1,
          query: {
            isPeriodicTask: 1,
            periodicTaskId: this.$route.query.id,
          }
        },
        queryParamsTwo: {
          pageNum: 1,
          currPage: 1,
          pageSize: 10,
          query: {}
        },
        outSiderQuery: {
          sort: 'DESC',
          order: 'createTime'
        },
        toNowTime: '',
        getAllDataList: [],
        total: 0,
        totalTwo: 0,
        title: "",
        treeSelectData: [],
        selectRows: [], //当前选中的数据
        single: true, // 非单个禁用
        multiple: true, // 非多个禁用
        searchDateRang: [], //查询时间段的值
        getListInterface2: {
          url: "/api/leadertask/respTaskInstance/listPage",
          methodType: "post",
          resFormatFun: this.getListResFormatFun,
          params: {},
        },
        //列表字段定义
        columns: [
          {
            label: "任务序号",
            prop: "nums",
            type: 'slot'
          },
          {
            label: "下发日期",
            prop: "vehicleKind",
          },
          {
            label: "截止时间",
            prop: "deadlineTime",
          },
          {
            prop: "operation",
            label: "操作",
            type: "operation",
            width: 120,
          },
        ],
        //列表字段定义
        columns2: [
          {
            label: "负责人",
            prop: "personName",
          },
          {
            label: "阶段",
            prop: "status",
            formatter: val => {
              let statusVal = {
                10: '草稿',
                20: '进行中',
                30: '逾期',
                40: '待审核',
                50: '完成',
                60: '作废',
              }
              return statusVal[val] || '无'
            }
          },
          {
            label: "进度",
            prop: "taskProgress",
            type: "slot",
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

    watch: {
      //当时间段发生改变同步列表查询字段
      searchDateRang(timeRang) {
        if (timeRang && timeRang.length > 0) {
          this.queryParams.query.beginTime = this.toDateUtil.formatDateTime(
            timeRang[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.queryParams.query.endTime = this.toDateUtil.formatDateTime(
            new Date(timeRang[1].toString().replace("00:00:00", "23:59:59")),
            "yyyy-MM-dd HH:mm:ss"
          );
          this.getList()
          this.deptListTwo = []
        } else {
          this.queryParams.pageNum = 1;
          this.queryParams.pageSize = 10;
          this.queryParams.currPage = 1;
          delete this.queryParams.query.beginTime
          delete this.queryParams.query.endTime
          this.getList();
        }
      },
    },
    created() {
      this.getList()
      this.getAlldata()

    },
    computed: {
      tableDataList() {
        return this.deptListTwo.filter(item => {
          return item.statusName = ['草稿', '进行中', '逾期', '待审核', '完成', '作废'][Number(item.status) / 10 - 1]
        })
      }
    },
    methods: {
      //获取指定日期数组中的最接近当日的日期
      getToNowTime() {
        const findClosest = (data, accessor, target = Date.now()) =>
          data.reduce((prev, curr) => {
            const a = Math.abs(accessor(curr).getTime() - target);
            const b = Math.abs(accessor(prev).getTime() - target);
            return a - b < 0 ? curr : prev;
          });
        const processDateString = (dateString) => {
          const [date, month, year] = dateString.split(/\//g).map(Number);
          return new Date(year, month - 1, date);
        };
        let closest = findClosest(this.getAllDataList, ({date}) => processDateString(date));
        this.toNowTime = closest
        this.getResp(this.toNowTime.id)
      },
      async getResp(id) {
        this.deptListTwo = []
        this.queryParamsTwo.query.taskId = id
        getRespTaskInstance(this.queryParamsTwo).then(response => {
          this.deptListTwo = response.data.list
          this.totalTwo = response.data.pagination.total;
          this.loadingTwo = false;
        });
      },


      tableRowClassName({row, rowIndex}) {
        if (row.createTime.substring(0, 10) == this.toNowTime.date && this.rowClickTip == false) {
          return 'warning-row';
        } else if (this.rowClickTip == true) {
          return ''
        }
        return '';
      },
      //排序方法
      sortChange(column, prop, order) {
        if (column.order == null) {
          delete this.queryParams.sort
          delete this.queryParams.order
          this.getList()
          return
        }
        // 在方法触发时先获取并保存接口需要的字段,调用分页方法,分页方法中掉用了获取列表数据方法
        // 根据点击时打印出的colume.order判断是升序还是降序,并根据接口需要赋值0或1
        let sortType = column.order === "ascending" ? 'ASC' : 'DESC';//(descOrAce在全局data声明)
        this.queryParams.sort = sortType;
        // 根据点击时打印出的colume.prop判断是哪一列
        this.queryParams.order = column.prop;//(orderBy在全局data声明)
        this.getList()
      },
      handleClick(taskId, id) {
        let obj = {
          path: `/leadertask/taskrelease/taskcycle/look?id=${taskId}&&idOne=${id}`,
        };
        this.$router.push(obj);
      },
      async rowClick(row, column, event) {

        this.rowClickTip = true
        this.deptListTwo = []
        this.queryParamsTwo.query.taskId = row.id
        const response = await getRespTaskInstance(this.queryParamsTwo);
        this.deptListTwo = response.data.list
        this.totalTwo = response.data.pagination.total;
        this.loadingTwo = false;
      },
      async getList() {

        this.loading = true;
        const response = await getlistPage(this.queryParams);
        this.deptList = response.data.list
        this.total = response.data.pagination.total;
        this.loading = false;
      },
      async getAlldata() {
        let params = {
          pageNum: 1,
          currPage: 1,
          pageSize: 9999999,
          isPeriodicTask: 1,
          query: {
            isPeriodicTask: 1,
            periodicTaskId: this.$route.query.id,
          }
        }
        this.loading = true;
        const response = await getlistPage(params);
        this.getAllDataList = response.data.list.map(item => {
          return {date: item.createTime.substring(0, 10), id: item.id};
        });
        this.getToNowTime()
        this.total = response.data.pagination.total;
        this.loading = false;
      },
      //重置操作
      resetHadle() {
        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = 10;
        this.queryParams.currPage = 1;
        this.queryParams.deptName = undefined;
        this.getList();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.queryParams.currPage = 1;
        this.queryParams.pageSize = 10;
        this.getList();
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
      handleDetail(row) {
        this.getListInterface2.params.taskId = row.taskId;
      },

      sortMethod() {
        let sortType = arr[0].sortType == 'desc' ? 'DESC' : 'ASC'
        this.getListInterface.params.sort = sortType;
        this.getListInterface.params.order = arr[0].key
        // this.$refs.materialCrud._getListData();
      },
      handleEdit(row) {
        this.$router.push({
          path: `/leadertask/taskrelease/taskcycle/detail`
        });
      },

      handleLook() {
        this.$router.push({
          path: `/leadertask/taskrelease/taskcycle/detail`
        });
      },
      handleAdd() {
        this.$router.push({
          path: `/leadertask/taskrelease/taskcycle/add`
        });
      },

      handleSearch() {
        this.getListInterface.params = {
          belongId: this.treeSelectData,
        };
      },

      handleSelectionChange(selection) {
        this.selectRows = selection;
        this.single = this.selectRows.length != 1;
        this.multiple = !this.selectRows.length;
      },
      //格式化列表返回值
      getListResFormatFun(res) {
        return {
          list: res.data.records,
          total: res.data.total,
        };
      },

      //高级搜索切换展开收起方法
      highSearchChangeFun(val) {
        this.searchDateRangShow = val;
      },
      //重置查询
      resetSearchFun() {
        this.getListInterface.params = {};
        this.searchDateRang = this.checkDateRang = [];
      },
    },
  };
</script>
<style lang="scss" scoped>
    @import "~@/assets/styles/fromSearch/fromSearch.scss";
    @include handle-group;

    ::v-deep .el-table thead{
        height: 40px !important;
    }
    .post-new {
        padding: 20px;
        height: 100%;
        position: relative;
    }
    .bottom-btnde {
        position: absolute;
        bottom: 0px;
        right: 50%;
    }
    ::v-deep .el-table .warning-row {
        background: #EAEEF3 !important;
    }

    .botton_nav {
        width: 100%;
        text-align: center;
        padding-top: 40px;
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
