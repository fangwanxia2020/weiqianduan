<template>
  <div class="container" style="padding: 0px !important">
    <div class="header">
      <el-page-header
        @back="goBack"
        :content="`权限配置（角色名称: ${code} ${name})`"
      >
      </el-page-header>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" tab-position="left" type="card" stretch>
        <el-tab-pane label="菜单授权" name="first">
          <menu-permission
            :menuList="menuList"
            :roleId="roleId"
            :menuAuthList="menuAuthList"
            @saveMenu="saveMenu"
          >
          </menu-permission>
        </el-tab-pane>
        <el-tab-pane label="组织授权" name="second">
          <div class="orgAuth_container">
            <org-auth
              :title="'组织列表'"
              :treeList="orgList"
              :defaultList="defaultOrgList"
              @saveTreeList="saveOrgList"
              @selectNode="selectNode"
              @refresh="refreshOrgList"
            ></org-auth>
            <org-auth
              :title="'部门列表'"
              :treeList="departList"
              :defaultList="defaultDepartList"
              @refresh="refreshDeaprtList"
              @saveTreeList="saveDepartList"
              ref="departTree"
            ></org-auth>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getRoleByOrg,
  saveRoleByOrg,
  getRoleByDeaprt,
  saveRoleByDepart,
  post_By_Menu,
  list_MenuID,
  saveMenuByOrg,
} from '@/api/system/role.js'
import { getOrgListTree } from '@/api/system/org.js'
import { getDepartListTree } from '@/api/system/depart.js'
import { getTreeId } from '@/utils/tool.js'
import { foo, authShow, test } from '@/utils/menu.js'

import OrgAuth from './orgAuth.vue'
import menuPermission from './menu_Permission.vue'
export default {
  name: 'rolePermission',
  data() {
    return {
      activeName: 'first',
      roleId: this.$route.query.roleId,
      code: this.$route.query.code,
      name: this.$route.query.name,
      menuList: [], // 全部菜单授权
      menuAuthList: [], //菜单已授权列表
      orgList: [],
      departList: [],
      defaultOrgList: [],
      defaultDepartList: [],
    }
  },
  created() {
    //修改基座的标签
    const { tagTitleObj } = this.$store.state.global.user || {}
    this.$store.dispatch('global/setGlobalState', {
      user: {
        tagTitleObj: {
          ...tagTitleObj,
          [this.$route.path]: '角色授权',
        },
      },
    })
    if (this.roleId) {
      this.get_list_MenuID()
      this.handleRoleOrgList()
      this.handleRoleDepartList()
      this.handleOrgListTree()
      this.get_Menu_tree()
    }
  },
  components: {
    OrgAuth,
    menuPermission,
  },
  methods: {
    handleRoleOrgList() {
      getRoleByOrg(this.roleId).then((res) => {
        if (res) {
          this.defaultOrgList = res.data || []
        }
      })
    },
    handleRoleDepartList() {
      getRoleByDeaprt(this.roleId).then((res) => {
        if (res) {
          this.defaultDepartList = res.data || []
        }
      })
    },
    handleOrgListTree() {
      getOrgListTree(this.roleId).then((res) => {
        if (res.data) {
          this.orgList = res.data
          if (res.data.length) {
            this.handleDepartListTree(res.data[0].id)
          }
        }
      })
    },
    handleDepartListTree(id) {
      getDepartListTree({
        orgId: id,
      }).then((res) => {
        if (res) {
          this.departList = res.data || []
        }
      })
    },
    selectNode(e) {
      const currentSelect = this.$refs.departTree.selectCheck()
      const treeListIds = getTreeId(this.departList)
      const preclude = treeListIds.filter(
        (item) => !currentSelect.includes(item)
      )
      this.defaultDepartList = [
        ...new Set(
          this.defaultDepartList
            .filter((item) => !preclude.includes(item))
            .concat(currentSelect)
        ),
      ]
      this.handleDepartListTree(e.id)
    },
    saveOrgList(e) {
      const body = {
        orgIds: e,
        roleId: this.roleId,
      }
      saveRoleByOrg(body).then((res) => {
        this.messageSuccess('保存成功')
        this.refreshOrgList()
      })
    },
    saveDepartList(e) {
      const treeListIds = getTreeId(this.departList)
      const preclude = treeListIds.filter((item) => !e.includes(item))
      this.defaultDepartList = [
        ...new Set(
          this.defaultDepartList
            .filter((item) => !preclude.includes(item))
            .concat(e)
        ),
      ]
      const body = { deptIds: this.defaultDepartList, roleId: this.roleId }
      saveRoleByDepart(body).then((res) => {
        this.messageSuccess('保存成功')
        this.refreshDeaprtList()
      })
    },
    refreshOrgList() {
      this.handleRoleOrgList()
      // this.handleOrgListTree()
    },
    refreshDeaprtList() {
      this.handleRoleDepartList()
    },
    goBack() {
      this.$router.push('/systems/role')
    },

    // 获取全部菜单授权
    async get_Menu_tree() {
      let res = await post_By_Menu()
      let arr = authShow(res.data, this.menuAuthList)
      if (res.data) {
        this.menuList = foo(arr)
      }
      this.menuList = test(this.menuList)
      console.log(this.menuList, 'sssdadasdad')
    },
    // 获取角色菜单授权编号
    async get_list_MenuID() {
      let res = await list_MenuID(this.roleId)
      if (res.data) this.menuAuthList = res.data
    },
    // 保存菜单授权
    async saveMenu(list) {
      let res = await saveMenuByOrg({
        menuIds: list,
        roleId: this.roleId,
      })
      this.messageSuccess('保存成功')
      this.get_Menu_tree()
      this.get_list_MenuID()
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: rgb(240, 242, 245);

  .header {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  ::v-deep .content {
    width: 100%;
    min-height: 85%;
    background-color: #fff;
    border-radius: 8px;
    padding: 12px;

    .el-tabs--left,
    .el-tabs--right {
      display: flex;
      justify-content: space-between;

      .el-tabs__content {
        margin-left: 30px;
        width: 80%;
      }
    }

    .el-tabs--left .el-tabs__nav-wrap.is-left {
      min-width: 150px;
    }

    .el-tabs--left.el-tabs--card .el-tabs__item.is-left {
      text-align: center;
      background-color: rgb(216, 235, 250);
    }

    .el-tabs__item.is-active {
      color: #fff;
      background-color: rgb(64, 158, 255) !important;
    }
  }

  .orgAuth_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
