<template>
  <div class="elTable">
    <div class="saveBtn">
      <el-button @click="saveMenu" type="primary">保存</el-button>
    </div>
    <el-table
      :data="menuList"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children' }"
      ref="table"
    >
      <el-table-column prop="date" label="序号" width="60" type="index">
      </el-table-column>
      <el-table-column prop="date" label="模块名称" width="180">
        <!--  -->
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.allAutoValue"
            @change="AllAuthSelect(scope.row)"
          >
            <i :class="scope.row.whp_transport"></i>{{ scope.row.name }}
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="按钮权限" width="500">
        <template slot-scope="scope" v-if="scope.row.F != null">
          <el-checkbox
            v-model="scope.row.FAuthValue"
            @change="Allselect(scope.row.F, scope.row)"
            >全选
          </el-checkbox>
          <template v-for="(item, idx) of scope.row.F">
            <el-checkbox
              v-model="item.authValue"
              :key="idx"
              @change="itemChange(scope.row, 1)"
              >{{ item.name }}
            </el-checkbox>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="列表权限">
        <template slot-scope="scope" v-if="scope.row.T != null">
          <el-checkbox
            v-model="scope.row.TAuthValue"
            @change="Allselect(scope.row.T, scope.row)"
            >全选
          </el-checkbox>
          <template v-for="(item, idx) of scope.row.T">
            <el-checkbox
              v-model="item.authValue"
              :key="idx"
              @change="itemChange(scope.row, 0)"
              >{{ item.name }}
            </el-checkbox>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
    menuAuthList: {
      // 已授权编号
      type: Array,
      default: () => [],
    },
    roleId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      FAllChange: false,
    }
  },
  created() {},
  activated() {},
  computed: {},
  methods: {
    saveMenu() {
      this.$emit('saveMenu', this.menuAuthList)
    },
    // 项单选择框
    itemChange(data, num) {
      let Fbool = data.F.every((item) => {
        return item.authValue == true
      })
      let Tbool = data.T.every((item) => {
        return item.authValue == true
      })
      if (Fbool && Tbool) {
        data.allAutoValue = true
      } else {
        data.allAutoValue = false
      }
      if (num) {
        if (Fbool) {
          data.FAuthValue = true
        } else {
          data.FAuthValue = false
        }
        data.F.forEach((item) => {
          this.pushItem(item)
        })
      } else {
        if (Tbool) {
          data.TAuthValue = true
        } else {
          data.TAuthValue = false
        }
        data.T.forEach((item) => {
          this.pushItem(item)
        })
      }
    },
    // 筛选授权数组
    pushItem(data) {
      if (data.authValue) {
        this.menuAuthList.push(data.id)
      } else {
        this.menuAuthList.splice(this.menuAuthList.indexOf(data.id), 1)
      }
      this.menuAuthList = [...new Set(this.menuAuthList)]
    },
    // 项全选框
    Allselect(data, list) {
      let bool = list.F.every((item) => {
        return item.authValue == true
      })
      if (list.TAuthValue && list.FAuthValue) {
        list.allAutoValue = true
      } else {
        list.allAutoValue = false
      }
      data.forEach((item) => {
        if (bool) {
          item.authValue = false
        } else {
          item.authValue = true
        }
        this.pushItem(item)
      })
    },
    AllAuthSelect(data) {
      if (data.allAutoValue) {
        data.FAuthValue = true
        data.TAuthValue = true
        if (data.F instanceof Array) {
          data.F.forEach((item) => {
            item.authValue = true
            this.pushItem(item)
          })
        }
        if (data.T instanceof Array) {
          data.T.forEach((item) => {
            item.authValue = true
            this.pushItem(item)
          })
        }
      } else {
        data.FAuthValue = false
        data.TAuthValue = false
        if (data.F instanceof Array) {
          data.F.forEach((item) => {
            item.authValue = false
            this.pushItem(item)
          })
        }
        if (data.T instanceof Array) {
          data.T.forEach((item) => {
            item.authValue = false
            this.pushItem(item)
          })
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.elTable {
  .saveBtn {
    display: flex;
    justify-content: flex-end;
  }

  ::v-deep .el-table--border th {
    background: rgb(216, 235, 250) !important;
  }
}
</style>
