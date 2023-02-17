<template>
  <div class="people-dialog-view">
    <el-row :gutter="20">
      <el-col :span="5" :xs="24">
        <div class="tree-box">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
            :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <ty-business-crud1 size="mini" :id="'enterprisePersonId'" class="high-search-crud" mainKey="ty-list"
          searchMode="detault" :pageInfo="{ limit: 5 }" ref="peopleCrud" :getListInterface="getListInterface"
          :columns="columns" :showSearchFields="[ 'nickName']" :showIndex="false" :showOperation="[]"
          :showSelect="true" title="" @checkedChange="checkedChangeFun" @select="selectChangeFun">
        </ty-business-crud1>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="2" :xs="24">
        <div style="text-align:right;line-height:30px;">已选人员</div>
      </el-col>
      <el-col :span="22" :xs="24">
        <el-tag v-for="tag in checkList" :key="tag.enterprisePersonId" closable @close="closeTagFun(tag)">
          {{tag.nickName}}
        </el-tag>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {
    treeselect
  }
  from "@/api/system/dept";
  export default {
    name: "PeopleDialogView",
    props: {
      data: {
        //选择的人员
        type: Array
      },
      //多选模式
      multiple: {
        type: Boolean,
        default: false
      },
    },
    computed: {},
    data() {
      return {
        //记录当选选中的行
        selectionRow: null,
        //岗位数据字典数据
        personTypeOptions: [],
        //选择的人员
        checkList: this.data,
        // 部门树选项
        deptOptions: undefined,
        defaultProps: {
          children: "children",
          label: "label"
        },
        getListInterface: {
          url: "/system/enterprisePerson/list",
          methodType: "get",
          params: {},
          resFormatFun: this.getListResFormatFun,
        },
        columns: [
          // {
          // label: "工号",
          // prop: "personNum",
          // },
          {
          label: "姓名",
          prop: "nickName",
            formFormat:{
              options: {
                clearable: true,
                placeholder: "请输入姓名",
              }
            },
        }, {
          label: "性别",
          prop: "sex",
          formatter: val => {
            return val == 0 ? '男' : '女'
          },
        }, {
          label: "证件号码",
          prop: "papersNum",
          width: "200"
        }, {
          label: "岗位",
          prop: "personType",
          formatter: (val, row) => {
            return this.sjzdFormat(row.personType);
          }
        }],
      };
    },
    watch: {
      data(val) {}
    },
    created() {
      this.getDicts("hse_personType").then(response => {
        this.personTypeOptions = response.data;
      });
      this.getTreeselect();
      setTimeout(() => {
        this.$refs.peopleCrud.setCheckList(this.data);
      }, 1);
    },
    mounted() {
      // this.$nextTick(() => {
      //   console.log(this.$refs.peopleCrud);
      //   //this.$refs.peopleCrud.resetFields();//去除验证
      // });
    },
    methods: {
      getCheckList() {
        return this.checkList;
      },
      //点击复选框事件
      selectChangeFun({
        row
      }) {
        this.selectionRow = row;
      },
      //字典翻译
      sjzdFormat(value) {
        return this.selectDictLabel(this.personTypeOptions, value);
      },
      //复选框切换
      checkedChangeFun(selection) {
        if ((!this.multiple) && (selection.length > 1)) {
          const selectionRow = this.selectionRow || selection[selection.length - 1];
          this.$refs.peopleCrud.setCheckList([selectionRow]);
          this.checkList = [selectionRow];
        } else {
          this.checkList = selection;
        }
      },
      //格式化列表返回值
      getListResFormatFun(res) {
        return {
          list: res.data.records,
          total: res.data.total,
        };
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.getListInterface.params.deptId = data.id;
        this.$refs.peopleCrud._getListData();
      },
      //删掉tag
      closeTagFun(tag) {
        this.$refs.peopleCrud.setCheckList(this.checkList.filter(item => item.enterprisePersonId != tag
          .enterprisePersonId));
      }
    }
  };
</script>
<style lang="scss" scoped>
  .people-dialog-view {
    .tree-box {
      width: 100%;
      overflow: auto;
      height: 330px;
      border: 1px solid #dfe6ec;

      ::v-deep .el-tree-node>.el-tree-node__children {
        overflow: initial;
      }
    }

    .el-tag {
      margin: 0 10px 10px 0;
    }
  }
</style>