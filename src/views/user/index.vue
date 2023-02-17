<template>
  <div>
    <!-- 
           searchMode: String  (default,base,high)  查询模式===default:默认模式新建，操作按钮在查询后面，===base:基础模式新建，操作按钮换行显示， ===high：高级模式带折叠查询
           showIndex: Boolean  显示序号
           buttonType: String 按钮类型
           mainKey： 列表唯一标识 当canSetsearchField为true时，必传
           canSetsearchField：是否可以设置查询字段 Boolean
           showSearchFields:与columns的prop值匹配,及表格上方查询input的字段 string[]
           id:与后端返回的列表id匹配
           title：表格名称
           showSearch：是否显示表格上方的查询功能 默认 true boolean
           hidePage:隐藏分页
           showMoreOperator：是否显示更多形式的按钮
           btnOptions：更多形式按钮选项  object[]
           [
                // {
                //   btnName: "导出",
                //   buttonType: "primary",
                //   buttonSize: "small",
                //   btnMethods: "",
                // }
           ]
           pageFormat: 分页字段配置
            默认： {
                     pageNum: "pageNum",
                     pageSize: "pageSize",
                     }
           pageInfo：分页信息
            默认：{
                pageNo: 1,
                limit: 10,
                sizes: [5, 10, 20],
                total: 0,
                };
           getListInterface:查询方法
           delInterface:删除方法
           saveInterface：保存方法
           updateInterface:修改方法

                {
                url: "", //接口地址
                params："",//传参数据 delete方法不接收params
                methodType: "", //接口请求类型
                resFormatFun: null, //删除接口参数格式化方法
                }
            columns：列表字段值 object []
                [{
                    baseSearch: true,
                    label: "", //字段名
                    prop: "", //字段key
                    edit: true, //是否出现在新增修改
                    formatter: (val) => {
                    //格式化数据
                    return val == 0 ? "正常" : "停用";
                     },
                    formFormat: {}, //表单的数据对应表单设计器的数据
                    width: 200,
                    type: "operation",["link","image","money",'datetime', 'date', 'month', 'year', 'time',"solt"] 可选值
                    fixed: "right",表格列固定
                    align: "right",对齐方式 
                }]
            插槽：
            搜索框 
               <slot name="search"></slot>
            搜索框更多
              <slot name="operator"></slot>
              <slot name="operatorMore"></slot>
              outSiderQuery // 分页查询参数
        -->
    <ty-business-crud1
      :mainKey="'ty-userList'"
      :showSelect="true"
      ref="userListCrud1"
      :searchMode="'default'"
      :showIndex="false"
      :buttonType="'text'"
      :showSearchFields="['nickname', 'isLock']"
      :id="'id'"
      :title="'用户列表'"
      :showSearch="true"
      :hidePage="false"
      :showMoreOperator="false"
      :btnOptions="[]"
      :showOperation="['update', 'delete']"
      :getListInterface="getListInterface"
      :isGetListByQuery="true"
      :delInterface="{
        // 删除接口
        url: 'api/system/sys_user/remove',
        methodType: 'DELETE',
        resFormatFun: this.delResFormatFun,
      }"
      :updateInterface="{
        // 修改接口
        url: 'api/system/sys_user/save',
        methodType: 'PUT',
      }"
      :columns="columns"
      @checkedChange="hanldSelectList"
      @resetSearch="resetSearchFun"
    >
      <div slot="operator">
        <div class="handle-group">
          <el-button type="primary" size="small" @click="dialogVisible = true">
            <ty-icon type="whp_add"></ty-icon>
            <span class="btn-text">新增</span>
          </el-button>

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            >批量删除</el-button
          >
        </div>
      </div>
      <template slot="rowOperator" slot-scope="item">
        <el-button type="text" size="small" @click="showResetDialog(item)"
          >重置密码</el-button
        >
      </template>
    </ty-business-crud1>
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="ruleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isLock">
          <el-select v-model="ruleForm.isLock" placeholder="请选择状态">
            <el-option label="启用" value="false"></el-option>
            <el-option label="停用" value="true"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="重置密码" :visible.sync="resetDialog" width="30%">
      <div class="head-title">请输入用户{{ resetObj.username }}的新密码</div>
      <el-form
        :model="resetForms"
        :rules="resetRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetForms.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDialog = false">取消</el-button>
        <el-button type="primary" @click="resetPassword">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, delsUser } from '@/api/system/user.js'
export default {
  name: 'user',
  data() {
    return {
      resetDialog: false,
      multiple: true,
      resetObj: {},
      ids: [],
      resetForms: {
        password: '',
      },
      resetRules: {
        password: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur',
          },
        ],
      },
      ruleForm: {
        username: '',
        nickname: '',
        isLock: null, //是否锁定  布尔类型
        password: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
        isLock: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'change',
          },
        ],
      },
      dialogVisible: false,
      addObj: {
        createId: null, // 数字类型 根据id去修改，自己传了也没用
        id: null, // 为空或者数据库没有时为新增，数据库没有后端生成，传了也没用，直接传空
        createName: '测试用户',
        createTime: '2022-02-23 15:24:46',
        isActive: true,
        isResetPwd: true,
        orgId: 0,
        password: '21232f297a57a5a743894a0e4a801fc3',
        roles: null,
        systemAdmin: true,
        tenantAdmin: true,
        tenantId: 0,
        updateId: 123456,
        updateName: '测试用户',
        updateTime: '2022-04-25 16:28:41',
        // phone: ''
      },
      columns: [
        {
          label: '创建用户编码', //字段名
          prop: 'createId', //字段key
          // showOverflowTooltip: true,
          width: 150,
        },
        {
          label: '用户名',
          prop: 'username',
          edit: true,
        },
        {
          label: '用户昵称',
          prop: 'nickname',
          edit: true,
        },
        // {
        //     label: "用户密码",
        //     prop: "password",
        //     edit: true,
        // },
        {
          label: '状态',
          prop: 'isLock',
          edit: true,
          formatter: (val) => {
            return !val ? '启用' : '停用'
          },
          formFormat: {
            type: 'select',
            name: '状态',
            options: {
              defaultValue: '',
              // disabled: false, // 是否禁用
              placeholder: '用户状态',
              showLabel: false,
              width: '',
              options: [
                {
                  value: false,
                  label: '启用',
                },
                {
                  value: true,
                  label: '停用',
                },
              ],
              interfaceId: 1650503699000,
              // resList: "data.records",
              // interfaceType: "get",
              // tipFont: "",
              // dictKey: "",
              // props: {
              // 	value: "dictValue",
              // 	label: "dictLabel"
              // }
            },
          },
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 160,
          baseSearch: true,
          // type:'datetime',
          // edit: true,
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16)
            }
          },
        },
        {
          prop: 'operation',
          label: '操作',
          width: 200,
          type: 'operation',
          fixed: 'right',
          align: 'right',
        },
      ],
      getListInterface: {
        // 获取列表接口
        url: 'api/system/sys_user/page', //接口地址
        //params: '', //传参数据
        methodType: 'post', //接口请求类型
        resFormatFun: this.getListResFormatFun, //返回数据格式方法,返回包含list和total的对象
      },
    }
  },
  created() {},

  activated() {
    this.$refs.userListCrud1._getListData()
  },
  methods: {
    // 打开重置密码框
    showResetDialog(item) {
      this.resetDialog = true
      this.resetObj = item.row
    },
    // 重置密码
    async resetPassword() {
      this.resetObj.password = this.$md5(this.resetForms.password)
      let res = await addUser(this.resetObj)
      if (res.code == 200) {
        this.$message.success('重置成功!')
        this.resetDialog = false
        this.$refs.crud1._getListData()
        this.resetForms.password = ''
      }
    },
    // 重置表单
    resetForm() {
      ;(this.ruleForm.password = ''),
        (this.ruleForm.username = ''),
        (this.ruleForm.nickname = ''),
        (this.ruleForm.isLock = null)
    },

    //格式化列表返回值
    getListResFormatFun(res) {
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      }
    },
    // 删除接口传参格式
    delResFormatFun(res) {
      return res.id
    },

    async save() {
      this.ruleForm.password = this.$md5(this.ruleForm.password)
      let data = {
        ...this.addObj,
        ...this.ruleForm,
      }
      let res = await addUser(data)
      if (res.code == 200) {
        this.$message.success('增加成功!')
        this.dialogVisible = false
        this.$refs.userListCrud1._getListData()
        this.resetForm()
      }
    },
    //格式化列表返回值
    getListResFormatFun(res) {
      console.log(res, '表单数据')
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      }
    },
    // 删除接口传参格式
    delResFormatFun(res) {
      return res.id
    },
    //批量删除
    handleDelete() {
      this.$confirm('是否确认批量删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // return delOperlog(operIds)
        delsUser(this.ids).then((res) => {
          // console.log(res)
          this.msgSuccess('删除成功')
          this.resetSearchFun()
          this.$refs.userListCrud1._getListData()
        })
      })
    },
    hanldSelectList(selection) {
      this.ids = selection.map((item) => item.id)
      this.multiple = !selection.length
    },
    //重置查询
    resetSearchFun() {
      this.getListInterface.params = {}
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/customSearch.scss';
@import '~@/assets/styles/fromSearch/fromSearch.scss';
@include handle-group;

.head-title {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
