<template>
  <div class="design-form-wrap">
          <el-form>

    <div class="design-form-wrap__ctnwrap">
      <form-title :title="'基础信息'"></form-title>
      
      <el-row>
        <el-col :span='$colSpan'>
          <ty-dropdown
          label="任务类型"
          :value.sync="editData.tackTypeId"
          :fieldMapperList="fgflList"
          :allowUpdate="!isCheck"
          :allowNull="(isUpdate || isCheck)"
          :validate="editDataRules.tackTypeId"
          :formErrorMsg.sync="editDataErrorMsg.tackTypeId"
          >
          </ty-dropdown>
        </el-col>
        <el-col :span='$colSpan'>
          <date-time
            label="截止时间"
            :value.sync="editData.deadlineTime"
            :allowUpdate="true"
            :allowNull="false"
            :type="'datetime'"
            :pickerOptions="pickerOptions"
            :formErrorMsg.sync="editDataErrorMsg.deadlineTime"
            :validate="editDataRules.deadlineTime"
          />

        </el-col>
      </el-row>
      <el-row>
        <el-col :span='$colSpan+8'>
          <ty-multi-text
          :label="'任务名称'"
          v-model="editData.name"
          :allowUpdate="!isCheck"
          :allowNull="(isUpdate || isCheck)"
          :formErrorMsg.sync="editDataErrorMsg.name"
          :validate="editDataRules.name"
          :showWordLimitInInput ="true"
          :maxlength="100"
          >
          </ty-multi-text>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span='$colSpan + 4'>
          <div class="item-line1">
            <div class="item-label" >
                <div>
                    <em >*</em>
                    <span>负责人：</span>
                </div>
            </div>
            <hyit-select
              v-bind="$getModule('person')"
              v-show="checked"
              style="width:80%"
              menuType="pop"
              v-model="editData1.personIds"
              :name="editData1.personName"
              :multiple="true"
              :search="[
                { label: '名称', prop: 'name' },
                {
                  label: '性别',
                  prop: 'gender',
                  type: 'select',
                  options: [
                    { value: '0', label: '男' },
                    { value: '1', label: '女' },
                    { value: '2', label: '不明' },
                  ],
                },
              ]"
            ></hyit-select>
             <hyit-select
              v-bind="$getModule('person')"
              v-show="!checked"
              style="width:80%"
              menuType="pop"
              v-model="editData2.personIds"
              :name="editData2.personName"
              :multiple="false"
              :search="[
                { label: '名称', prop: 'name' },
                {
                  label: '性别',
                  prop: 'gender',
                  type: 'select',
                  options: [
                    { value: '0', label: '男' },
                    { value: '1', label: '女' },
                    { value: '2', label: '不明' },
                  ],
                },
              ]"
            ></hyit-select>
          </div>
          <span v-show="editData2.show || editData1.show" class="verify">请选择负责人</span>
        </el-col>
        <el-col :span='5'>
          <div class="design-form-wrap__ctnwrap_check">
             <el-checkbox v-model="checked">多人任务</el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='$colSpan + 8'>
          <div class="item-line1">
            <div class="item-label" >
                <div>
                    <em >*</em>
                    <span>审核人：</span>
                </div>
            </div>
          <hyit-select
            v-bind="$getModule('person')"
            menuType="pop"
            style="width:100%"

            v-model="editData3.veriftPenId"
            :name="editData3.veriftPen"
            :search="[
              { label: '名称', prop: 'name' },
              {
                label: '性别',
                prop: 'gender',
                type: 'select',
                options: [
                  { value: '0', label: '男' },
                  { value: '1', label: '女' },
                  { value: '2', label: '不明' },
                ],
              },
            ]"
          ></hyit-select>
        </div>
          <span v-show="editData3.show" class="verify verify1">请选择审核人</span>

          
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='$colSpan'>
          <ty-radio2
            label="紧急程度"
            :allowNull="(isUpdate || isCheck)"
            :radioOptions="validityPeriodOptions"
            :value.sync="editData.urgency"
            :validate="editDataRules.urgency"
            :formErrorMsg.sync="editDataErrorMsg.urgency"
          ></ty-radio2>
        </el-col>
        <el-col :span='$colSpan'>
          <ty-dropdown
                  label="通用任务夹"
                  :value.sync="editData.createFolderId"
                  :fieldMapperList="folderList"
                  :allowUpdate="true"
                  :allowNull="false"
                  :validate="editDataRules.createFolderId"
                  :formErrorMsg.sync="editDataErrorMsg.createFolderId"
          >
          </ty-dropdown>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='$colSpan+$colSpan'>
          <ty-multi-text
          :label="'任务内容'"
          :type="'textarea'"
          v-model="editData.taskContent"
          :allowUpdate="!isCheck"
          :showWordLimitInInput ="true"
          :maxlength="1000"
          >
          </ty-multi-text>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='$colSpan*2'>
          <upload-file
                  :value="editData.fileVal"
                  :label="'附件上传'"
                  :allowUpdate="!(isUpdate || isCheck)"
                  :formErrorMsg.sync="editDataErrorMsg.fileVal"
                  :validate="editDataRules.fileVal"
          ></upload-file>
        </el-col>
        
      </el-row>
    </div>
    <!-- <drop-down1
      label="测试负责人"
      :personName="veriftPen"
      :multiple="checked1"
      :value.sync="editData.veriftPenId"
      :allowUpdate="!isCheck"
      :allowNull="(isUpdate || isCheck)"
      :validate="editDataRules.veriftPenId"
      :formErrorMsg.sync="editDataErrorMsg.veriftPenId"
    >
    </drop-down1>

    <div class="design-form-wrap__ctnwrap_check">
        <el-checkbox v-model="checked1">多人任务</el-checkbox>
    </div> -->


    
    <button-footer
            :showBackup="!isCheck"
            :showConfirm="!isCheck"
            :showCancel="isCheck"
            :backupText="'保存'"
            :confirmText="'取消'"
            @backup="handleSubmit"
            @confirm="navigater('/leadertask/taskrelease/draftBox')"
    ></button-footer>
         </el-form>

  </div>
</template>
<script>
  import {getSespTaskType,addTaskType,getInfoTask,editTaskType,listByIds} from "@/api/taskrelease/draftBox"
  import {getListByAccess} from "@/api/auditCenter/index";
  import utils from "@/assets/js/validator";

  

  //vue
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import UploadFile from "@/components/secondControlList/UploadFile"
  import DateTime from "@/components/secondControlList/DateTime"

  //vue
  import FormTitle from "@/components/formTitle/FormTitle"
  export default {
    components: {
      ButtonFooter,
      UploadFile,
      FormTitle,
      DateTime
    },
    data() {
      return {
        folderList: [],
        checked:false,
        checked1:false,
        //校验错误显示信息
        editDataErrorMsg: {
          createFolderId: '',//通用任务夹
          name: '',//任务名称
          tackTypeId:'',//任务类型
          deadlineTime:'',//截止时间
          urgency:'',//紧急程度
          taskContent:'',//任务内容
          // veriftPenId:''
        },
        editDataRules: {

          name: { required: true, validator: utils.validateNull },
          tackTypeId: { required: true, validator: utils.validateNoSelect },
          createFolderId: { required: true, validator: utils.validateNoSelect },
          deadlineTime: { required: true, validator: utils.validateNull },
          urgency: {
            required: true,
            validator: utils.validateNoSelect,
          },
          // veriftPenId: { required: true, validator: utils.validateNoSelect },

          
          // fileInfoVoList: {
          //   required: false,
          //   validator: utils.validateNull,
          //   tip: "请上传",
          // },
        },
        personName:'',
        personName2:'',
        veriftPen:'',
        editData1:{
          personIds:'',
          personName:'',
          show:false
        },
        editData2:{
          personIds:'',
          personName:'',
          show:false
        },
        editData3:{
          veriftPen:'',
          veriftPenId:'',
          show:false
        },
        editData: {
          createFolderId: '',
          name: '',
          tackTypeId:'',
          deadlineTime:'',
          urgency:2,
          taskContent:'',
          parentId:0,
          veriftPenId:'',
          fileVal:[]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() + 3600 * 1000 * 24 < Date.now();
          },
        },
        manyTasks:[
          {
            dictValue: 0, 
            dictLabel: "否",
          },
          {
            dictValue: 1,
            dictLabel: "是",
          }
        ],
        validityPeriodOptions: [ 
          {
            dictValue: 2, 
            dictLabel: "普通",
          },
          {
            dictValue: 1,
            dictLabel: "加急",
          },
          {
            dictValue: 0,
            dictLabel: "特急",
          }
        ],
     
        loading: false,
        options: [],
        fgflList: [],
        qzcdList: [],
        statuteId: null,
        isUpdate: false,
        isCheck: false,
        provinces: [],
        cities: [],
        counties: [],
      };
    },
   
    watch:{
      checked(newVal,oldVal){
        this.editData1.show = false
        this.editData2.show = false
      },
      'editData1.personIds':{
        deep:true,
        handler(val,oldval){
          this.editData1.show = false
        }
      },
      'editData2.personIds':{
        deep:true,
        handler(val,oldval){
          this.editData2.show = false
        }
      },
      'editData3.veriftPenId':{
        deep:true,
        handler(val){
          this.editData3.show = false
        }
      }
    },
    async created(){
      await this.init()
      await this.initFolderList()
      await this.getSespTaskType()
    },
    activated(){
      this.$refs.materialCrud._getListData();
    },
    methods: {
      initFolderList(){
        getListByAccess({
          access:0
        }).then(response => {
          this.folderList = response.data.map((v) => {
            if(v.name == '日度计划' && !this.$route.query.id) this.editData.createFolderId = v.id
            return {
              dictValue: v.id,
              dictLabel: v.name,
            };
          });
        });
      },
      async init(){
        const {id} = this.$route.query
        if(id){
          const res = await getInfoTask(id)
          let {name, tackTypeId,deadlineTime, urgency, taskContent,parentId,veriftPen,veriftPenId,createFolderId} = res.data
          let {personIds, personName} = res.data
          this.editData = {name, tackTypeId,deadlineTime, urgency, taskContent,createFolderId,parentId}
          this.editData.fileVal = []
          this.veriftPen = veriftPen

          personName = personName.toString().split(',')
          personIds = personIds.toString()
          if(personName.length == 1){
            personName = personName.toString()
            this.checked = false
            this.editData2 ={personIds, personName} 
          }else{
            personIds = personIds.split(',')
            this.checked = true
            this.editData1 ={personIds, personName} 
          } 
          this.editData3 ={veriftPen,veriftPenId}
          console.log(this.editData3)
          if(res.data.fileIds){
            
            // let arr = [String(res.data.fileIds[0])]
            const fileIdLists = await listByIds(res.data.fileIds)
            fileIdLists.data.map((item) => {
              this.editData.fileVal.push({
                res: {
                  ...item,
                },
                name: item.name,
                id: item.id,
                status: 'success',
                url: item.downloadUrl,
              });
            });
          }
        }else{
          this.editData3.veriftPen = this.$store.state.user.personName
          this.editData3.veriftPenId = this.$store.state.user.personId
        }
      },
     handleSubmit(){
       this.formValidate(
        this.editData,
        this.editDataRules,
        this.editDataErrorMsg
      ).then(async (formDataOk) => {

        if(this.editData1.personIds.length == 0 && this.checked){//多人任务
          this.editData1.show = true
        }
        if(this.editData2.personIds.length == 0 && !this.checked){//单人任务
          this.editData2.show = true
        }
        if(this.editData3.veriftPenId.length == 0){
            this.editData3.show = true
        }
        const arr = [this.checked ? this.editData1.show : this.editData2.show , this.editData3.show]
        if(arr.includes(true)) return
        if (!formDataOk) return;
        let data
        if(this.checked){
          
          data = {...this.editData}
          data.personIds = this.editData1.personIds.toString().split(',')
        }else{
          data = {...this.editData}
          data.personIds = this.editData2.personIds.toString().split(',')
        }
        data.veriftPenId = this.editData3.veriftPenId
        const {id} = this.$route.query
        let res
        data.fileIds = []
        console.log(data.fileVal)
        data.fileVal.map(i=> data.fileIds.push(i.id))
        delete data.fileVal
        if(id){
          data.id = id
          res = await editTaskType(data)
        }else{
          res = await addTaskType(data)
        }
        if (res.msg == '操作成功') {
           this.editData= {
              createFolderId: '',
              name: '',
              tackTypeId:'',
              deadlineTime:[],
              urgency:2,
              taskContent:'',
              parentId:0,
              veriftPenId:''
            }
            this.editData1={
              personIds:'',
              personName:'',
              show:false
            }
            this.editData2={
              personIds:'',
              personName:'',
              show:false
            }
            this.editData3={
              veriftPen:'',
              veriftPenId:'',
              show:false
            }
            this.checked = false
            this.messageSuccess("操作成功！");
            this.$router.push({
              path: "/leadertask/taskrelease/draftBox",
            });
          }
      });
     },
     async getSespTaskType(){
      const res = await getSespTaskType();
      if (res.code == 200 && Array.isArray(res.data)) {
        this.fgflList = res.data.map((v,index) => {
          if(!this.$route.query.id && index == 0) this.editData.tackTypeId = v.id
          return {
            dictValue: v.id,
            dictLabel: v.name,
          };
        });
      }
     },
      formValidate(formData, rules, errorMsg, scroll = true, target = this) {
        return new Promise((resolve) => {
          utils.clearErrorMsg(errorMsg); //清除错误提示
          utils.validateData(formData, rules).then((err) => {
            if (err) {
              err.forEach((value) => {
                errorMsg[value.field] = value.message;
              });
              resolve(false);
            } else {
              resolve(true);
            }
          });
      });
    },
    },
  };

</script>

<style lang="scss" scoped >
::v-deep .mb22 {
  flex-wrap: nowrap;
  .item-label{
    white-space: nowrap;
  }
  .el-radio{
    margin-right: 0 ;
  } 
}
::v-deep .el-radio-group{
  flex-grow: 2;
  max-width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
::v-deep .el-upload-list__item a{
  max-width: 700px;
}
::v-deep .design-form-wrap__btnwrap{
  background:transparent !important;
}
:v-deep .button-containe[data-v-031ce78f]{
  background:transparent !important;
}
.el-form{
  padding:30px 30px 90px  !important;
}
.design-form-wrap {
  overflow: auto;
}
.item-line1{
  position: relative;
  display: flex;
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 22px;
  .item-label{
    display: flex;
    align-items: center;
    text-align: right;
    padding-right: 10px;
  }
  div{
    width: 126px;
  }
  span{
    color: #868a97;
  }
}
.verify{
  position: absolute;
  top: 40px;
  left: 131px;
  color: red;
  font-size: 12px;
}
.verify1{
  left: 126px;
}
  
::v-deep .button-container.design-form-wrap__btnwrap{
  border-bottom:0;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #fff !important;
}
::v-deep .el-button--primary {
  background-color: #026DFF;
  border-radius: 3px;
  height: 30px;
}
::v-deep .el-form-item__label{
  font-size: 14px;
  color: #868a97;
  margin-left: 56px;
  font-weight: normal;
}
::v-deep .el-form-item__content{
  white-space: nowrap;
  margin-right: 130px;
}
::v-deep .el-input--mini .el-input__inner{
  height: 40px !important;
}
.design-form-wrap__ctnwrap_check{
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
