<template>
  <div class="people-dialog-view">
    <!--承包商用户数据-->
    <ty-business-crud1
      size="mini"
      :id="'id'"
      class="high-search-crud"
      mainKey="ty-list"
      searchMode="detault"
      :pageInfo="{ limit: 5 }"
      ref="peopleCrud"
      :getListInterface="getListInterface"
      :columns="columns"
      :showSearchFields="['number', 'xm']"
      :showIndex="false"
      :showOperation="[]"
      :showSelect="true"
      title=""
      @checkedChange="checkedChangeFun"
      @select="selectChangeFun"
    >
    </ty-business-crud1>
    <el-row :gutter="20">
      <el-col
        :span="3"
        :xs="24"
      >
        <div style="text-align:right;line-height:30px;">已选人员</div>
      </el-col>
      <el-col
        :span="21"
        :xs="24"
      >
        <el-tag
          v-for="tag in checkList"
          :key="tag.id"
          closable
          @close="closeTagFun(tag)"
        >
          {{tag.xm}}
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
    //承包商id,当类型为contractor时生效
    contractorId: {
      type: [String, Number],
      default: ""
    },
  },
  computed: {},
  data() {
    return {
      //记录当选选中的行
      selectionRow: null,
      //人员类型数据字典数据
      personTypeOptions: [],
      //选择的人员
      checkList: this.data,
      getListInterface: {
        url: "/system/outsiderInfo/selectRpOutsiderList",
        methodType: "get",
        params: {
          id: this.contractorId
        },
        resFormatFun: this.getListResFormatFun,
      },
      columns: [{
        label: "用户编号",
        prop: "number",
      }, {
        label: "姓名",
        prop: "xm",
      }, {
        label: "性别",
        prop: "sex",
        formatter: val => {
          return val == 0 ? '男' : '女'
        },
        width: 50,
      }, {
        label: "证件号码",
        prop: "zjhm",
        width: 180,
      }, {
        label: "人员类型",
        prop: "rylx",
        formatter: (val, row) => {
          return this.sjzdFormat(row.rylx);
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
    setTimeout(() => {
      this.$refs.peopleCrud.setCheckList(this.data);
    }, 1);
  },
  mounted() {},
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
      }
      else {
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
    //删掉tag
    closeTagFun(tag) {
      this.$refs.peopleCrud.setCheckList(this.checkList.filter(item => item.id != tag.id));
    }
  }
};

</script>
<style
  lang="scss"
  scoped
>
.people-dialog-view {
  .el-tag {
    margin: 0 10px 10px 0;
  }
}

</style>
