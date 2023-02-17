<template>
  <el-dialog  :visible.sync="dialogVisibel" :title="title" :width="type=='system'?'90%':'80%'"
    :appendToBody="true">
    <div class="people-dialog" :class="{'radioMode':!multiple}">
      <people-view v-if="show&&type=='system'" :multiple="multiple" :data="data" ref="peopleView"></people-view>
      <contractor-people v-if="show&&type=='contractor'" :contractorId="contractorId" :multiple="multiple" :data="data"
        ref="peopleView"></contractor-people>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibel = false" class="dialog-cancel-btn-edu" >取 消</el-button>
      <el-button type="primary" class="dialog-submit-btn"  @click="okFun">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import PeopleView from "./PeopleView";
  import ContractorPeople from "./ContractorPeople"
  export default {
    name: "PeopleDialog",
    components: {
      PeopleView,
      ContractorPeople
    },
    props: {
      show: {
        //弹出窗的显示隐藏
        type: Boolean,
        default: false
      },
      data: {
        //选择的人员
        type: Array
      },
      title: {
        //标题
        type: String,
        default: "选择人员"
      },
      //多选模式
      multiple: {
        type: Boolean,
        default: false
      },
      //类型
      type: {
        type: String,
        default: "system"
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
        dialogVisibel: false,
      };
    },
    watch: {
      //不能直接修改props的值所以要定义多一个变量
      show(val) {
        this.dialogVisibel = val;
        if (!this.show) return;
      },
      //弹出窗组件显示隐藏状态发生改变要同步触发父级元素的修改
      dialogVisibel(val) {
        this.$emit("update:show", val);
      },
      data(val) {}
    },
    created() {},
    mounted() {},
    methods: {
      okFun() {
        this.dialogVisibel = false;
        const checkList = this.$refs.peopleView.getCheckList();
        this.$emit("onOk", checkList);
      },
    }
  };
</script>
<style lang="scss" scoped>
  .people-dialog {
    margin-top: -20px;
  }

  .radioMode {
    ::v-deep .el-table--border th:first-child .cell .el-checkbox {
      display: none;
    }
  }
</style>