<template>
    <div class="respons">
       <div class="respons_title">响应度排行榜</div>  

        <div class="respons_from">
      <div class="respons_from_one">
        <el-tabs :stretch="false" v-model="form.query.beginType" type="card" @tab-click="handleClick">
          <el-tab-pane label="周报" name="0"></el-tab-pane>
          <el-tab-pane label="月报" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="respons_from_two">
        <el-select v-model="form.query.orgId" placeholder="请选择"  @change="changOrg" style="width:110%">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
</div>
<div class="respons-tab">
    <ty-table
    :columns='columns'
    :data='tableData'
    :pager='page'
    :showIndex="false"
    :border="false"
    @pageSizeChange='pageSizeChange'
    @pageCurrentChange='pageCurrentChange'
    :stripe='false'
    >
          <template slot="rank" slot-scope="{ data }">
              <el-tag  v-if="data.rank==1"   color="rgba(255, 59, 48, 1)" >{{data.rank}}</el-tag>
              <el-tag  v-else-if="data.rank==2" color="rgba(254, 148, 0, 1)" >{{data.rank}}</el-tag>
              <el-tag  v-else-if="data.rank==3" color="rgba(24, 144, 255, 1)">{{data.rank}}</el-tag>
              <el-tag  v-else color="rgba(215, 215, 215, 1)">{{data.rank}}</el-tag>

            </template>
    </ty-table>
</div>
    </div>
</template>
<script>
import {sys_org,getTask } from "@/api/statisticAnalysis/responsivity";
export default{
    data(){
        return{
          value :'',
             options: [],
               page: {
        pageNo: 1,
        limit: 10,
        sizes: [5, 10, 20],
        total: 0
      },
      form:{
        	pageNum: 1,
	pageSize: 10,
        query:{
          beginType:0,
          orgId:""
        }
      },
      tableData:[],
      columns:[
        { 
          prop: "rank",
          label: "排名",
          width:'100',
                type:'slot'
        },
           { 
          prop: "personName",
          label: "姓名"
        },
           { 
          prop: "responsivity",
          label: "响应度"
        }
      ]
        }
    },
   async created(){
     await this.init()
     this.getList()
    },
    methods:{
      changOrg(){
        console.log("this.form",this.form)
         this.getList()
      },
      handleClick(e){
     this.getList()

      },
          async init(){
      const res = await sys_org()
      this.options = res.data
      this.form.query.orgId = res.data[0].id
    },
   async getList(){
     const res = await getTask(this.form)
     this.tableData = res.data.list
     this.page.total = res.data.pagination.total
    },
    pageSizeChange(e){
      this.form.pageSize = e
       this.getList()
    },
    pageCurrentChange(){
this.form.pageNum = this.page.pageNo
       this.getList()

    }
    }
}
</script>

<style lang="scss" scoped>
.respons{

&_title{
    font-size: 26px;
    font-weight: 600;
    margin: 20px;
    margin-left: 0;

}
  &_from{
    display: flex;
   padding-bottom: 30px;
    border-bottom: 1px solid rgb(233,233,233);
    &_two{
      margin: 0 60px;
      .el-select{
        margin-right: 30px;
      }
    }
  }
}


::v-deep .el-tag{
  color: #ffffff;
  width: 32px;
  height: 32px;

  border-radius: 16px;
  font-size: 14px;
}
.respons-tab{
  width:60%
}
</style>