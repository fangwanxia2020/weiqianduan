<template>
  <div class="org">
    <div class="org_header">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="filterText"
        :clearable="true"
        size="mini"
        style="width: 150px"
      >
      </el-input>
      <div class="org_headerRight">
        <el-button type="primary" size="mini" @click="saveOrgRole"
          >保存</el-button
        >
        <el-button type="primary" size="mini" @click="selectAll"
          >全选</el-button
        >
        <el-button type="primary" size="mini" @click="clearSelect"
          >清空</el-button
        >
        <el-button type="primary" size="mini" @click="refresh">刷新</el-button>
      </div>
    </div>
    <div class="org_content">
      <div class="title">{{ title }}</div>
      <div class="tree_list">
        <el-tree
          :data="treeList"
          show-checkbox
          node-key="id"
          :expand-on-click-node="false"
          class="tree_container"
          empty-text="暂无数据"
          :highlight-current="true"
          :filter-node-method="filterNode"
          ref="orgListTree"
          @node-click="nodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
            <span>
              <el-button type="text" size="mini"> (7/18部门授权) </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: '',
    }
  },
  props: {
    title: {
      type: String,
      default: '树形列表',
    },
    treeList: {
      type: Array,
      default: () => [],
    },
    defaultList: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    filterText(val) {
      this.$refs.orgListTree.filter(val)
    },
    defaultList: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.orgListTree.setCheckedKeys(val)
        })
      },
      immediate: true,
    },
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    saveOrgRole() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.orgListTree.getCheckedKeys()
      // 半选中的菜单节点
      // let halfCheckedKeys = this.$refs.orgListTree.getHalfCheckedKeys()
      // checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      this.$emit('saveTreeList', checkedKeys)
    },
    clearSelect() {
      this.treeList.forEach((node) => {
        this.$nextTick(() => {
          this.$refs.orgListTree.setChecked(node.id, false, true)
        })
      })
    },
    selectAll() {
      this.treeList.forEach((node) => {
        this.$nextTick(() => {
          this.$refs.orgListTree.setChecked(node.id, true, true)
        })
      })
    },
    nodeClick(node) {
      this.$emit('selectNode', node)
    },
    refresh() {
      this.$emit('refresh')
    },
    selectCheck() {
      return this.$refs.orgListTree.getCheckedKeys()
    },
  },
}
</script>

<style lang="scss" scoped>
.org {
  width: 49%;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  .org_header {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(247, 250, 253);
    padding: 4px;
    .org_headerRight {
      width: 60%;
      display: flex;
      justify-content: flex-end;
    }
    ::v-deep .el-button--mini {
      width: 40px;
      padding: 7px 0;
    }
  }
  .org_content {
    .title {
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: rgb(99, 142, 171);
      background-color: rgb(216, 235, 250);
      padding: 0 8px;
    }
    .tree_list {
      width: 100%;
      height: 400px;
      overflow: auto;
    }
  }
}

::v-deep .tree_container {
  .el-tree-node {
    position: relative;
    padding-left: 8px;
  }
  .el-tree-node__children {
    padding-left: 8px;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: unset;
  }
  // 竖线
  .el-tree-node::before {
    content: '';
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #52627c;
  }
  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: '';
    width: 24px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px dashed #52627c;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }
}
</style>
