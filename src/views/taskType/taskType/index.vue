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
      :showSearchFields="['name', 'code','updateName']"
      ref="materialCrud"
      @sortMethod="sortMethod"
      @resetSearch="resetSearchFun"
      @highSearchChange="highSearchChangeFun"
      @checkedChange="handleSelectionChange"
    >
   
    <template slot="search" >
        <template v-if="searchDateRangShow">
          <div class="el-form-item el-form-item--medium">
            <label class="el-form-item__label">更新时间:</label>
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
      <div
        slot="operator"
        style="display: flex; justify-content: flex-end"
        class="flex-operator handle-group"
      >
        <div class="creationJob">
          <!--      handleAdd()    handleEditFun('add')-->
          <el-button type="primary" @click="handleAdd()">
            <ty-icon type="whp_add"></ty-icon>
            <span class="btn-text">新增</span>
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
          @click="handleEdit(scope.row)"
          >修改
        </el-button>
       <del-popover
        :valText="scope.row.name"
        @submitFun="handleDelete(scope.row)"
      ></del-popover>
      </template>
    </ty-business-crud1>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      width="450px"
      left
      >
      <div>
          <el-form>
            <el-row>
              <el-col :span='24'>
                <ty-multi-text
                :label="'类型名称'"
                v-model="editData.name"
                :allowUpdate="!isCheck"
                :allowNull="(isUpdate || isCheck)"
                :formErrorMsg.sync="editDataErrorMsg.name"
                :validate="editDataRules.name"
                >
                </ty-multi-text>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
               <ty-multi-text
                :label="'类型编号'"
                v-model="editData.code"
                :allowUpdate="!isCheck"
                :allowNull="(isUpdate || isCheck)"
                :formErrorMsg.sync="editDataErrorMsg.name"
                :validate="editDataRules.name"
                >
                </ty-multi-text>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span='24'>
              <ty-multi-text
                  :label="'备注'"
                  :type="'textarea'"
                  :showWordLimitInInput ="true"
                  :maxlength="140"
                  v-model="editData.info"
                >
                </ty-multi-text>
            </el-col>
          </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="centerDialogVisible = false">取消</el-button>

        <el-button type="primary" size="small" @click="hendleSave">确认</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>
  import {addTaskType,editTaskType,getTaskType,removeTaskType} from "@/api/taskType/taskType"
  import utils from "@/assets/js/validator";

export default {
  name: "PostNew",
  data() {
   
    return {
      outSiderQuery:{},
      title: "",
      dialogTitle:'新增-任务类型',
      treeSelectData: [],
      taskTypeOptions: [],
      searchDateRangShow:false,
      centerDialogVisible:false,
      isUpdate: false,
      isCheck: false,
      editData:{
        name:'',
        code:'',
        info:'',
      },
      //校验错误显示信息
      editDataErrorMsg: {
        name: '',//类型名称
        code:'',//类型编号
      },
      editDataRules: {
        name: { required: true, validator: utils.validateNull },
        code: { required: true, validator: utils.validateNull },
      },
      selectRows: [], //当前选中的数据
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      searchUpDate: [], //查询截止时间段的值
      searchSetDate: [], //查询创建时间段的值
      //列表查询接口信息
      getListInterface: {
        url: "/api/leadertask/RespTaskType/listPage",
        methodType: "post",
        resFormatFun: this.getListResFormatFun,
        params: {
        },
      },
      //列表字段定义
      columns: [
        {
          label: "类型名称",
          baseSearch: true,
          prop: "name",
          width:200,
          align: "left",
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入类型名称",
            },
          },
        },
        {
          label: "类型编号",
          prop: "code",
          baseSearch: true,
          align: "left",
          width:180,
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入类型编号",
            },
        },
        },
        {
          label: "备注",
          prop: "info",
          align: "left",
          width:240,
        },
        {
          label: "更新者",
          prop: "updateName",
          align: "left",
          baseSearch: true,
          formFormat: {
            options: {
              clearable: true,
              placeholder: "请输入更新者",
            },
          },
        },
         {
          label: "更新时间",
          prop: "updateTime",
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
  },
  activated(){
    this.$refs.materialCrud._getListData();
  },
  watch: {
    //当更新时间段发生改变同步列表查询字段
    searchUpDate(timeRang) {
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
      this.resetData()
      this.dialogTitle = '新增-任务类型',
      this.centerDialogVisible = true
    },
    hendleSave(){
      this.formValidate(
        this.editData,
        this.editDataRules,
        this.editDataErrorMsg
      ).then(async (formDataOk) => {
        console.log(formDataOk)
        if(!formDataOk) return
        let res,msg
        if(this.dialogTitle.split('-')[0] == '修改'){
          this.editData.id = this.dataId
          res = await editTaskType(this.editData)
          msg = '修改成功！'
        }else{
          res = await addTaskType(this.editData)
          msg = '新增成功！'
        }
        return msg
      }).then( (msg)=>{
        if(!msg) return
        this.centerDialogVisible = false
        this.$refs.materialCrud._getListData();
        this.$message.success(msg);
      })
    },
    //修改
    handleEdit(data){
      this.resetData()
      this.dialogTitle = '修改-任务类型-'+data.name,
      this.dataId = data.id
      this.editData = {
        name:data.name,
        code:data.code,
        info:data.info || null
      }
      this.centerDialogVisible = true
    },
    //重置数据
    resetData(){
      this.editData = {
        name:null,
        code:null,
        info:null
      }
    },
    formValidate(formData, rules, errorMsg, scroll = true, target = this) {
        return new Promise((resolve) => {
          utils.clearErrorMsg(errorMsg); //清除错误提示
          utils.validateData(formData, rules).then((err) => {
            if (err) {
              err.forEach((value) => {
                errorMsg[value.field] = value.message;
              });
              resolve(false);
            } else {
              resolve(true);
            }
          });
      });
    },
     //排序方法
    sortMethod(val,arr){
      let sortType=arr[0].sortType=='desc'?'DESC':'ASC'
      this.outSiderQuery = {
        sort : sortType,
        order : arr[0].key
      }
    },
    //删除
    async handleDelete(e){
      const res = await removeTaskType(e.id);
      if(res.code == '200'){
        this.$message.success("删除成功");
        this.$refs.materialCrud._getListData();
      }else{
        this.$message.error("删除失败");
      }
    },
    handleSelectionChange(selection) {
      console.log(selection)
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
      this.getListInterface.params = {
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
  margin-left: 10px;
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
