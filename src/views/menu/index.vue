<!--- 菜单管理 --->
<template>
  <div class="custom-con">
    <div class="hse-form">
      <el-form :inline="true">
        <el-form-item label="所属类型：">
          <el-select
            v-model="queryParams.clientType"
            placeholder="菜单所属类型"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in belongTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入菜单名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            v-model="queryParams.isHidden"
            placeholder="全部"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in visibleOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="handleQuery"
          >查询</el-button
        >
        <el-button size="mini" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div class="handle-group" style="display: flex; justify-content: flex-end">
      <div>
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          @click="handleAdd(null)"
        >
          <!-- v-hasPermi="['system:menu:add']" -->

          <ty-icon type="whp_add"></ty-icon>
          <span class="btn-text">新增</span>
        </el-button>
      </div>
    </div>
    <div class="searchBox-high-operator-bar"></div>
    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="name"
        label="名称"
        :show-overflow-tooltip="true"
        width="160"
      ></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <ty-icon :type="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="perms"
        label="权限标识"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="props"
        label="json配置"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="component"
        label="组件路径"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="clientType"
        label="所属类型"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <!-- :formatter="belongTypeFormat" -->
      <el-table-column
        prop="status"
        label="状态"
        width="80"
        :formatter="visibleFormat"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        width="160"
        prop="createTime"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        align="right"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.menuType != 'V'">
            <!--TODO  v-hasPermi="['system:menu:edit']" -->
            <span class="operation-btn" @click="handleUpdate(scope.row)"
              >修改</span
            >
            <span
              class="operation-btn"
              @click="handleAdd(scope.row)"
              v-if="scope.row.menuType != 'T'"
              >新增</span
            >
            <!--TODO v-hasPermi="['system:menu:remove']" -->
            <!-- v-hasPermi="['system:menu:add']" -->

            <del-popover
              style="margin-left: 10px"
              :valText="scope.row.name"
              @submitFun="handleDelete(scope.row)"
            ></del-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="438px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级菜单">
          <treeselect
            v-model="form.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单所属类型" prop="menuType">
          <el-radio-group
            v-model="form.clientType"
            :disabled="disabledBelongType"
          >
            <el-radio label="PC">PC</el-radio>
            <el-radio label="WeChat">移动端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="form.menuType">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
            <el-radio label="T">列表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.menuType != 'F' && form.menuType != 'T'"
          label="菜单图标"
        >
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            v-model="iconVisible"
            @show="$refs['iconSelect'].reset()"
          >
            <div class="flex-input" slot="reference">
              <ty-icon
                v-if="form.icon"
                :type="form.icon"
                class="el-input__icon"
                :size="18"
              />
              <i class="el-icon-circle-close" @click.stop="delIcon"></i>
              <span class="put_visi">点击选择图标</span>
            </div>
            <IconSelect ref="iconSelect" @selected="selected" />
          </el-popover>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            controls-position="right"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            :min="0"
            :max="9999"
          />
        </el-form-item>
        <el-form-item v-if="form.menuType == 'C'" label="类型">
          <el-radio-group v-model="form.componentType">
            <el-radio label="LINK">外链</el-radio>
            <el-radio label="COMPONENT">组件</el-radio>
            <el-radio label="QIANKUN">微应用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.menuType == 'C' || form.menuType == 'M'"
          label="唯一标识"
          prop="path"
        >
          <el-input v-model="form.path" placeholder="请输入路由唯一标识" />
        </el-form-item>
        <el-form-item
          v-if="form.componentType == 'LINK' && form.menuType == 'C'"
          label="外链路径"
          prop="component"
        >
          <el-input v-model="form.component" placeholder="请输入http外链路径" />
        </el-form-item>
        <el-form-item
          v-if="form.menuType == 'C' && form.componentType == 'COMPONENT'"
          label="组件路径"
          prop="component"
        >
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          label="微应用路径"
          prop="component"
          v-if="form.menuType == 'C' && form.componentType == 'QIANKUN'"
        >
          <el-input v-model="form.component" placeholder="请输入微应用路径" />
        </el-form-item>
        <el-form-item v-if="form.menuType != 'M'" label="权限标识">
          <el-input v-model="form.perms" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          v-if="form.menuType == 'C' && form.componentType == 'COMPONENT'"
          label="json配置"
          prop="props"
        >
          <el-input
            v-model="form.props"
            type="textarea"
            autosize
            placeholder="请输入json格式字符串"
          />
        </el-form-item>

        <el-form-item
          v-if="form.menuType != 'F' && form.menuType != 'T'"
          label="显示状态"
        >
          <el-radio-group
            :disabled="isAllowUpdateVisible"
            v-model="form.isHidden"
          >
            <el-radio
              v-for="dict in visibleOptions"
              :key="dict.dictValue == 0 ? false : true"
              :label="dict.dictValue == 0 ? false : true"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.componentType == 'LINK' && form.menuType == 'C'"
          label="新窗口打开"
        >
          <el-radio-group v-model="form.isTab">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.menuType == 'T'" label="列表字段">
          <ul v-if="form.fieldLists" class="listFieldUl">
            <li v-for="(item, index) in form.fieldLists" :key="index">
              <el-input
                :style="{ width: '100px' }"
                size="mini"
                v-model="item.fieldValue"
                placeholder="值"
              ></el-input>
              <el-input
                style="width: 100px"
                size="mini"
                placeholder="标签"
                v-model="item.fieldLabel"
              ></el-input>
              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px; margin-left: 5px"
              ></el-button>
            </li>
          </ul>
          <el-link style="line-height: 18px" type="primary" @click="addFiledFun"
            >添加字段</el-link
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div @click="cancel" class="dialog-cancel">取消</div>
        <div @click="submitForm" class="dialog-submit">确定</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listMenu, getMenu, delMenu, saveMenu } from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
export default {
  name: 'menus',
  components: {
    Treeselect,
    IconSelect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否编辑
      isEdit: false,
      disabledBelongType: false,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 菜单所属类型
      belongTypeOptions: [],
      // 查询参数
      queryParams: {
        name: null,
        status: null,
        clientType: null,
      },
      // 表单参数
      form: {},
      // 菜单图片
      // menuImgs: [],
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur',
          },
        ],
        orderNum: [
          {
            required: true,
            message: '排序不能为空',
            trigger: 'blur',
          },
        ],
        path: [
          {
            required: true,
            message: '唯一标识不能为空',
            trigger: 'blur',
          },
        ],
        component: [
          {
            required: true,
            message: '路径不能为空',
            trigger: 'blur',
          },
        ],
      },
      iconVisible: false,
    }
  },
  computed: {
    // ...mapState("user", {
    //   org: (state) => state.userInfo.org,
    // }),
    //TODO
    /** 禁用商户端修改权限 */
    // disabledTenantEdit() {
    //   // return this.org.orgType != 1 && this.isEdit;
    //   return this.isEdit;
    // },
    /**
     * @description: 管委会才可以操作显示状态
     * @param {*}
     * @return {*}
     */
    isAllowUpdateVisible() {
      return localStorage.getItem('roleKey') !== 'admin'
    },
  },
  created() {
    this.getList()
    //TODO
    this.belongTypeOptions = [
      {
        dictLabel: 'PC',
        dictValue: 'PC',
        dictType: 'PC',
      },
      {
        dictLabel: '微信小程序',
        dictValue: 'WeChat',
        dictType: 'WeChat',
      },
    ]
    this.visibleOptions = [
      {
        dictLabel: '显示',
        dictValue: '0',
        dictType: '0',
      },
      {
        dictLabel: '隐藏',
        dictValue: '1',
        dictType: '1',
      },
    ]
  },
  activated() {
    this.getList()
  },
  methods: {
    //删除字段
    handleOptionsRemove(index) {
      this.form.fieldLists.splice(index, 1)
    },
    //添加字段
    addFiledFun() {
      const fieldArr = this.form.fieldLists || []
      fieldArr.push({
        fieldValue: '',
      })
      this.$set(this.form, 'fieldLists', fieldArr)
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      const data = {
        ...this.queryParams,
        isHidden:
          this.queryParams.isHidden == 1
            ? true
            : this.queryParams.isHidden == 0
            ? false
            : null,
      }
      listMenu(data).then((response) => {
        this.menuList = this.handleTree(response.data, 'id')
        this.loading = false
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      const children =
        node.children === null || node.children === undefined
          ? []
          : node.children
      if (Array.isArray(children) && children.length === 0) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then((response) => {
        this.menuOptions = []
        const menu = {
          id: 0,
          name: '主类目',
          children: [],
        }
        menu.children = this.handleTree(response.data, 'id')
        this.menuOptions.push(menu)
      })
    },
    // 显示状态字典翻译 TODO
    visibleFormat(row) {
      if (row.status == 1) {
        return '显示'
      } else {
        return '隐藏'
      }
      // return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    // 菜单状态字典翻译
    // statusFormat(row) {
    //   if (row.menuType == "F") {
    //     return "";
    //   }
    //   return this.selectDictLabel(this.statusOptions, row.status);
    // },
    // // 菜单所属类型字典翻译
    // belongTypeFormat(row) {
    //   return this.selectDictLabel(this.belongTypeOptions, row.clientType);
    // },
    // 表单重置
    // 表单重置
    reset() {
      this.form = {
        alwaysShow: true,
        code: '',
        component: '',
        isHidden: false,
        link: '',
        path: '',
        perms: '',
        props: '',
        redirect: '',
        remark: '',
        id: undefined, // ID 为空时则是新增路由，否则是修改
        parentId: 0, // 父级ID
        name: undefined, // 菜单名字
        icon: undefined, // 图标
        menuType: 'M', // 菜单类型
        orderNum: undefined, // 显示顺序
        // visible: "0", // 显示状态
        isTab: false, // 是否标签页 布尔值
        status: '1', //状态 DEFATUL为正常 UNUSED为停用 ---大小写敏感
        clientType: 'PC', // 终端类型
        componentType: 'COMPONENT', //组件类型  组件是外链还是微应用还是组件（COMPONENT，LINK,QIANKUN） -- 大小写敏感
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    handleReset() {
      this.queryParams = {
        name: null,
        status: null,
        clientType: null,
      }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      let disabledBelongType = false
      this.reset()
      this.getTreeselect()
      // 表单是否编辑
      this.isEdit = false
      this.form.orderNum = 1
      if (row != null) {
        disabledBelongType = true
        this.form.parentId = row.id
        if (row.id != null) {
          // 此标记用于，新增二级，三级..时，不能修改，菜单所属类型
          this.form.clientType = row.clientType.toString() || null
          this.isEdit = true
        }
      }
      this.disabledBelongType = disabledBelongType
      this.open = true
      this.title = '添加菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getMenu(row.id).then((response) => {
        const resData = response.data
        this.form = {
          ...resData,
          orderNum: resData.orderNum || 1,
          // alwaysShow:false
        }
        this.form.clientType = resData.clientType.toString() || null
        this.isEdit = true
        // this.form.isTab = String(this.form.isTab);
        this.disabledBelongType = true
        this.open = true
        this.title = '修改菜单'
        // this.menuImgs = resData.menuImgs || [];  // TODO: 菜单图片回显
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.fieldLists) {
            const isempty = this.form.fieldLists.find(
              (item) => !item.fieldValue || !item.fieldLabel
            )
            if (isempty) {
              this.msgError('请完善列表字段！')
              return
            }
          }
          if (this.form.id != undefined) {
            this.status = !this.isHidden ? 1 : 0
            this.form.alwaysShow = this.form.menuType == 'M' ? true : false
            Object.keys(this.form).forEach(
              (key) => this.form[key] == null && delete this.form[key]
            )
            saveMenu(this.form).then((response) => {
              if (response.code == 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            this.status = !this.isHidden ? 1 : 0
            this.form.alwaysShow = this.form.menuType == 'M' ? true : false
            Object.keys(this.form).forEach(
              (key) => this.form[key] == null && delete this.form[key]
            )
            saveMenu(this.form).then((response) => {
              if (response.code == 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      delMenu(row.id).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    // 删除图标
    delIcon() {
      this.form.icon = ''
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/customSearch.scss';
@import '~@/assets/styles/fromSearch/fromSearch.scss';
@include el-form;
@include handle-group;

// ::v-deep .searchBox-high-operator-bar {
//   display: flex;
//   justify-content: flex-end;
//   padding: 10px 20px !important;
// }
// ::v-deep .el-input--prefix .el-input__inner {
//   padding-left: 40px !important;
// }
.custom-con {
  padding: 20px;
}

.listFieldUl,
.listFieldUl li {
  list-style: none;
  padding: 0;
  margin: 0;
}

// .tip {
//   &-title,
//   &-text {
//     font-size: 14px;
//     line-height: 18px;
//     margin: 0 0 12px;
//     font-weight: normal;
//     color: #999;
//   }
// }
.hse-form {
  ::v-deep {
    .el-form-item__label {
      width: 84px !important;
    }
  }
}

::v-deep .el-radio {
  margin-right: 16px !important;
}

.flex-input {
  width: 100%;
  height: 38px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: solid 1px #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
}

.el-input__icon {
  color: #333 !important;
  margin-right: 10px;
  position: relative;
}

.el-icon-circle-close {
  font-size: 18px;
  color: #f38383;
  line-height: 36px;
  cursor: pointer;
  position: absolute;
  right: 10px;
}

.put_visi {
  color: #666;
  font-size: 12px;
  margin-left: 10px;
}
</style>
