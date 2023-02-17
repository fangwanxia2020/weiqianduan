<template>
  <div class="left-data" v-if="supportingInformation.context || supportingInformation.fileIdList">
    <div class="data-title">佐证资料</div>
    <div class="data-content">
        <div class="flex-space-between padding-bottom-10">
            <div>{{supportingInformation.context}}</div>
            <div>{{supportingInformation.updateTime&&supportingInformation.updateTime.substring(0, 16)}}更新</div>
        </div>
        <div style="height:170px; overflow: auto;">
         <div  v-for="(item, index) in fileIdList" :key="index">
            <div class="content_box_row_col_adjunct_list" >
                <span class="content_box_row_col_adjunct_list_test">{{item.name}}</span>
                <span class="content_box_row_col_adjunct_list_size">{{item.fileSize/1000}}kb</span>
                <span class="content_box_row_col_adjunct_list_operator" @click="lookHandle(item.downloadUrl)" >预览</span>
                <span class="content_box_row_col_adjunct_list_operator" @click="getDownload(item)">下载</span>
            </div>
        </div>  
        </div>
       
    </div>
  </div>
</template>

<script>
  import {getSupportingInformation,getFileInfos} from "@/api/auditCenter/index";
  import {getDownload} from "@/api/taskrelease/draftBox"

  export default {
    name: "evidence-data",
    props: {
      taskId: {
        type: [String,Number],
        default: ''
      },
      selectPersonType: {
        type: [String,Number],
        default: ''
      },
      sonName: {
        type: [String],
        default: 'taskId'
      }
    },
    data(){
      return{
        supportingInformation: {},
        fileIdList:[]
      }
    },
    watch:{
      sonName:{
        handler:'init',
        immediate: true
      }
    },
    // mounted(){
    //   this.init()
    // },
    methods:{
      async init(){
        if(this.sonName == '') return
        let data = { [this.sonName]:this.taskId,selectPersonType:this.selectPersonType }
        getSupportingInformation(data).then(response => {
          this.supportingInformation = response.data
          if(response.data.fileIdList != null && response.data.fileIdList.length != 0){
            this.getFile(response.data.fileIdList)
          }
        });
        
      },
      getFile(fileIds) {
         getFileInfos(fileIds).then(response => {
           if(response.data.length != 0){
            this.fileIdList = response.data
            this.$emit('checkFile', response.data)
           }
         });
      },
      //下载
      getDownload(item){
        getDownload({id: item.id}).then((res) => {
          const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'})
          this.createDownLoadClick(blob, item.name);
        });
      },
      //创建a标签下载
      createDownLoadClick(content, fileName) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      },
      lookHandle(url) {
        this.previewFile(url)
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.left-data {
  padding: 20px;
  background-color: white;
  height: 300px;
  margin-bottom: 10px;
  .data-title {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
  }
  .data-content {
    width: 100%;
    min-height: 200px;
    background-color: #F2F2F2;
    padding: 10px 10px 30px 10px;
    .flex-space-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .padding-bottom-10{
      padding-bottom: 10px;
      border-bottom: 1px #AAAAAA dashed;
    }
  }
}
.content_box_row_col_adjunct_list {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
  &_operator {
    color: #026DFF;
    cursor: pointer;
  }
  span {
    margin-right: 8px;
  }
}
</style>
