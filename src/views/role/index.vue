<template>
  <div>
    <ty-business-crud1
      ref="roleCrud"
      id="id"
      class="high-search-crud"
      mainKey="ty-list"
      :buttonType="'text'"
      :isGetListByQuery="true"
      searchMode="base"
      :pageInfo="{ limit: 5 }"
      :columns="columns"
      :showSearchFields="['name', 'status']"
      :showIndex="$showIndex"
      :showOperation="['delete']"
      title=""
      @resetSearch="resetSearchFun"
      :getListInterface="getListInterface"
      :delInterface="delInterface"
      :outSiderQuery="outSiderQuery"
    >
      <div slot="operator">
        <div class="handle-group">
          <el-button type="primary" size="small" @click="dialogVisible = true">
            <ty-icon type="whp_add"></ty-icon>
            <span class="btn-text">新增</span>
          </el-button>
        </div>
      </div>
      <template slot="status" slot-scope="{ data }">
        <el-switch
          v-model="data.status"
          :active-value="1"
          :inactive-value="0"
          active-color="#026DFF"
          :width="50"
          @change="handleStatusChange(data)"
        ></el-switch>
      </template>
      <template slot="rowOperator" slot-scope="item">
        <el-button type="text" size="small" @click="showDialog(item)"
          >修改</el-button
        >
        <el-button type="text" size="small" @click="push(item)">权限</el-button>
      </template>
      <template slot="search">
        <span class="el-form-item el-form-item--medium">
          <label class="el-form-item__label">创建时间:</label>
          <div class="el-form-item__content">
            <el-date-picker
              size="small"
              v-model="searchDateRang"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
            >
            </el-date-picker>
          </div>
        </span>
      </template>
    </ty-business-crud1>

    <el-dialog :title="diologTitle" :visible.sync="dialogVisible" width="25%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addUser } from '@/api/system/role.js'
export default {
  name: 'role',
  data() {
    return {
      diologTitle: '新增角色',
      dialogVisible: false,
      ruleForm: {
        name: '',
        code: '',
        status: '', //是否锁定  布尔类型
        remark: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'change',
          },
        ],
      },
      addObj: {
        createTime: '',
        updateTime: '',
      },
      searchDateRang: [],
      getListInterface: {
        url: '/api/system/sys_role/pageByQueryExpr',
        methodType: 'post',
        params: {},
        resFormatFun: this.getListResFormatFun,
      },
      delInterface: {
        url: '/api/system/sys_role/remove',
        methodType: 'DELETE',
        resFormatFun: this.delResFormatFun,
      },
      columns: [
        {
          prop: 'name',
          label: '角色名称',
          width: '400',
          showOverflowTooltip: true,
          align: 'left',
        },
        {
          prop: 'status',
          label: '状态',
          type: 'slot',
          align: 'left',
          filters: [
            {
              value: '1',
              text: '启用',
            },
            {
              value: '0',
              text: '停用',
            },
          ],
          formFormat: {
            type: 'select',
            name: '状态',
            options: {
              defaultValue: '',
              showLabel: false,
              width: '',
              options: [
                {
                  value: '1',
                  label: '启用',
                },
                {
                  value: '0',
                  label: '停用',
                },
              ],
            },
          },
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: '180',
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16)
            }
          },
          align: 'left',
        },
        {
          prop: 'operation',
          label: '操作',
          width: '240',
          type: 'operation',
          fixed: 'right',
        },
      ],
      outSiderQuery: {},
    }
  },
  watch: {
    searchDateRang(timeRang) {
      if (timeRang && timeRang.length > 0) {
        const beginTime = this.toDateUtil.formatDateTime(
          timeRang[0],
          'yyyy-MM-dd HH:mm:ss'
        )
        const endTime = this.toDateUtil.formatDateTime(
          timeRang[1],
          'yyyy-MM-dd HH:mm:ss'
        )
        if (beginTime == endTime) {
          endTime = beginTime.split(' ')[0] + ' 23:59:59'
        }
        this.outSiderQuery = {
          expr: [
            {
              expression: 'AND',
              value: [
                {
                  expression: 'GE',
                  key: 'updateTime',
                  value: beginTime,
                },
                {
                  expression: 'LE',
                  key: 'updateTime',
                  value: endTime,
                },
              ],
            },
          ],
        }
      }
    },
  },
  activated() {
    this.$refs.roleCrud._getListData()
  },
  created() {},
  methods: {
    push(item) {
      this.$router.push({
        path: '/systems/role/rolePermission',
        query: {
          roleId: item.row.id,
          code: item.row.code,
          name: item.row.name,
        },
      })
    },
    //格式化列表返回值
    getListResFormatFun(res) {
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      }
    },
    // 删除接口参数
    delResFormatFun(res) {
      return res.id
    },
    //重置查询
    resetSearchFun() {
      this.getListInterface.params = {}
      this.searchDateRang = []
      this.outSiderQuery = {}
      // this.$refs.roleCrud.outSiderQuery = {}
    },
    // 重置表单
    resetForm() {
      this.dialogVisible = false
      this.ruleForm.name = ''
      this.ruleForm.code = ''
      this.ruleForm.status = ''
      this.ruleForm.remark = ''
      this.addObj.id = ''
      this.addObj.createTime = ''
      this.addObj.updateTime = ''
    },
    // 状态开关
    handleStatusChange(data) {
      this.addObj = data
      this.save()
    },
    // 修改按钮
    showDialog(item) {
      this.dialogVisible = true
      this.diologTitle = '修改角色'
      this.ruleForm.name = item.row.name
      this.ruleForm.code = item.row.code
      this.ruleForm.status = item.row.status
      this.ruleForm.remark = item.row.remark
      this.addObj.id = item.row.id
      this.addObj.createTime = item.row.createTime
      this.addObj.updateTime = item.row.updateTime
    },
    // 新增角色
    async save() {
      let data = {
        ...this.ruleForm,
        ...this.addObj,
      }
      console.log(data)
      let res = await addUser(data)
      if (res.code == 200) {
        if (this.diologTitle == '新增角色' && !data.id) {
          this.$message.success('增加成功!')
        } else {
          this.$message.success('修改成功!')
        }
        this.$refs.roleCrud._getListData()
        this.resetForm()
        this.diologTitle = '新增角色'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/customSearch.scss';
@import '~@/assets/styles/fromSearch/fromSearch.scss';
@include handle-group;
@include el-form;

::v-deep .el-switch__core::before {
  content: '停用';
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: '启用';
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}

// ::v-deep .searchBox-form .el-form-item__label {
//   width: 74px !important;
// }

// ::v-deep .el-form-item__content {
//   width: 74px !important;
// }
</style>
