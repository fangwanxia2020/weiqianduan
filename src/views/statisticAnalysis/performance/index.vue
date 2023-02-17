<template>
  <div class="post-new">
    <!--用户数据-->
    <!-- showSelect：列表是否显示复选框 -->
    <!--    @sortMethod="sortMethod"-->
    <!--    :outSiderQuery="{sort:'',order:''}"-->
    <!--    :isGetListByQuery="true"-->
    <ty-business-crud1 class="high-search-crud" id="vehicleId" title :showOperation="[]" :showIndex="$showIndex"
      :pageInfo="{ limit: 10 }" :getListInterface="getListInterface" :columns="columns" :customSort="true"
      :outSiderQuery="outSiderQuery" :isGetListByQuery="true" :showSearchFields="['personName']" ref="materialCrud"
      @resetSearch="resetSearchFun"  @search="handleSearch">
      <template slot="rank" slot-scope="{ data }">
        <el-tag v-if="data.rank==1" color="rgba(255, 59, 48, 1)">{{data.rank}}</el-tag>
        <el-tag v-else-if="data.rank==2" color="rgba(254, 148, 0, 1)">{{data.rank}}</el-tag>
        <el-tag v-else-if="data.rank==3" color="rgba(24, 144, 255, 1)">{{data.rank}}</el-tag>
        <el-tag v-else color="rgba(215, 215, 215, 1)">{{data.rank}}</el-tag>

      </template>
      <template slot="search">

        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label">局办:</label>
          <div class="el-form-item__content">
            <el-select clearable v-model="orgId" style="width:110%">
              <el-option
              v-for='item in  options'
              :key='item.id'
              :label="item.name"
              :value="item.id"
              >
                <!-- <el-tree
                 :data='datas'
                show-checkbox
                > </el-tree> -->
              </el-option>
            </el-select>
          </div>
        </div>



      </template>
       <template slot="rank" slot-scope="{ data }">
          <el-tag  v-if="data.rank==1"   color="rgba(255, 59, 48, 1)" >{{data.rank}}</el-tag>
          <el-tag  v-else-if="data.rank==2" color="rgba(254, 148, 0, 1)" >{{data.rank}}</el-tag>
          <el-tag  v-else-if="data.rank==3" color="rgba(24, 144, 255, 1)">{{data.rank}}</el-tag>
          <el-tag  v-else color="rgba(215, 215, 215, 1)">{{data.rank}}</el-tag>
        </template>
        <template slot="efficiency" slot-scope="{ data }">
          <div class="progressBox"> 
            <el-progress :show-text="false" :percentage="data.efficiency?data.efficiency:0"></el-progress>
            <div>{{data.efficiency}}%</div>
          </div>
        </template>
        <template slot="quality" slot-scope="{ data }">
          <div class="progressBox"> 
            <el-progress :show-text="false" :percentage="data.quality?data.quality:0"></el-progress>
            <div>{{data.quality}}%</div>
          </div>
        </template>
        <template slot="responsivity" slot-scope="{ data }">
          <div class="progressBox"> 
            <el-progress :show-text="false" :percentage="data.responsivity?data.responsivity:0"></el-progress>
            <div>{{data.responsivity}}%</div>
          </div>
        </template>


    </ty-business-crud1>
  </div>
</template>
<script>
import {sys_org} from "@/api/statisticAnalysis/distribution";
  export default {
    name: "PostNew",
    data() {

      return {
        // 组织Id
 options:[],
 orgId:'',
        outSiderQuery: {},
        title: "",
        treeSelectData: [],

        //列表查询接口信息
        getListInterface: {
          url: "api/leadertask/StatisticalAnalysis/getTaskCompleteSituation",
          methodType: "post",
          resFormatFun: this.getListResFormatFun,
  params: {
          
        },
        },
        //列表字段定义
        columns: [{ 
            prop: "rank",
            label: "排名",
            width:'100',
            type:'slot'
          },
          { 
            prop: "personName",
            label: "姓名",
            width:'100',
            formFormat: {
              options: {
                clearable: true,
                placeholder: "请输入姓名",
              },
            },
          },
          { 
            prop: "count",
            width:'100',
            label: "完成数"
          },
          {
            label: "平均耗时",
            prop: "timeConsuming",
            width: 140,
          },
          {
            label: "工作效率",
            prop: "efficiency",
            type: "slot",
          },
          {
            label: "工作质量",
            prop: "quality",
            type: "slot",
          },
          { 
            prop: "responsivity",
            type:'slot',
            label: "响应度"
          }]
,
      };
    },
    created() {
    this.getSys_org()
    },
    methods: {
 
// 获取组织Id
async getSys_org(){
  const res = await sys_org()
  this.options  = res.data
},
      //格式化列表返回值
      getListResFormatFun(res) {
        for (let item of res.data.list) {
          item.proportion = item.proportion + "%"
        }
        return {
          list: res.data.list,
          total: res.data.pagination.total,
        };
      },


      //重置查询
      resetSearchFun() {

        this.getListInterface.params = {

        };
        this.orgId = ''

      },
      handleSearch(){
        console.log("this.orgId",this.orgId)
              if(this.orgId == ""){
        delete this.getListInterface.params.orgIdList
       }else{
 this.getListInterface.params.orgIdList = []
           this.getListInterface.params.orgIdList[0] = this.orgId
       }
      }
    },
  };
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/fromSearch/fromSearch.scss";
  @include handle-group;
  ::v-deep .searchBox-form .el-form-item__label {
    width: 45px !important;
  }
  ::v-deep .el-tag {
    color: #ffffff;
    width: 32px;
    height: 32px;

    border-radius: 16px;
    font-size: 14px;
  }
::v-deep .el-select-dropdown__item{
  height: 200px !important;
}
.progressBox{
  display: flex;
  align-items: center;
  .el-progress{
    width: 80%;
    margin-right: 10px;
  }
}

</style>