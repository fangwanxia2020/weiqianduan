<!--- 菜单管理 --->
<template>
    <div class="design-form-wrap">
        <div class="design-form-wrap__ctnwrap">
            <form-title :title="'基础信息'"></form-title>

            <el-row>
                <el-col :span='$colSpan'>
                    <ty-dropdown
                            label="任务类型"
                            :value.sync="editData.taskTypeId"
                            :fieldMapperList="fgflList"
                            :allowUpdate="!isCheck"
                            :allowNull="(isUpdate || isCheck)"
                            :validate="editDataRules.taskTypeId"
                            :formErrorMsg.sync="editDataErrorMsg.taskTypeId"
                    >
                    </ty-dropdown>
                </el-col>
                <el-col :span='$colSpan+$colSpan'>
                    <ty-radio2
                            label="紧急程度"
                            :allowNull="false"
                            :radioOptions="validityPeriodOptions"
                            :value.sync="editData.urgency"
                            :validate="editDataRules.urgency"
                            :formErrorMsg.sync="editDataErrorMsg.urgency"
                    ></ty-radio2>
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
                            :showWordLimitInInput="true"
                            :maxlength="100"
                    >
                    </ty-multi-text>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span='$colSpan + 4'>
                    <div class="item-line1">
                        <div class="item-label">
                            <div>
                                <em>*</em>
                                <span>负责人：</span>
                            </div>
                        </div>
                        <hyit-select v-show="checked"
                                     v-bind="$getModule('person')"
                                     menuType="pop"
                                     style="width:80%"
                                     v-model="form.principalIds2"
                                     :name="personName2"
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

                        <hyit-select v-show="!checked"
                                     v-bind="$getModule('person')"
                                     menuType="pop"
                                     style="width:80%"
                                     v-model="form.principalIds"
                                     :name="personName"
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
                    <span v-show="form.show || form.showTwo" class="verify">请选择负责人</span>

                </el-col>
                <el-col :span='5'>
                    <div class="design-form-wrap__ctnwrap_check">
                        <el-checkbox v-model="checked">多人任务</el-checkbox>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='$colSpan'>
                    <div class="item-line1">
                        <div class="item-label">
                            <div>
                                <em>*</em>
                                <span>审核人：</span>
                            </div>
                        </div>
                        <hyit-select
                                style="width:100%"
                                v-bind="$getModule('person')"
                                menuType="pop"
                                v-model="form.veriftPsnId"
                                :name="veriftPen"
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
                    <span v-show="form.showThree" class="verify verify1">请选择审核人</span>

                </el-col>
                <el-col :span='$colSpan'>
                    <ty-dropdown
                            label="通用任务夹"
                            :value.sync="editData.folderId"
                            :fieldMapperList="folderList"
                            :allowUpdate="true"
                            :allowNull="false"
                            :validate="editDataRules.folderId"
                            :formErrorMsg.sync="editDataErrorMsg.folderId"
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
                            :showWordLimitInInput="true"
                            :maxlength="1000"
                    >
                    </ty-multi-text>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='$colSpan'>
                    <upload-file
                            v-model="editData.fileIds"
                            :value.sync="editData.fileIds"
                            :label="'附件上传'"
                            :allowUpdate="true"
                            :allowNull="true"
                            :formErrorMsg.sync="editDataErrorMsg.fileIds"
                            :validate="editDataRules.fileIds"
                    ></upload-file>
                </el-col>
            </el-row>

            <form-title :title="'周期设置'"></form-title>
            <el-row>
                <el-col :span='$colSpan'>
                    <ty-dropdown
                            @change="changecycleFrequency()"
                            label="重复频率"
                            :value.sync="editData.cycleFrequency"
                            :fieldMapperList="cycleFrequencyList"
                            :allowUpdate="true"
                            :allowNull="false"
                            :validate="editDataRules.cycleFrequency"
                            :formErrorMsg.sync="editDataErrorMsg.cycleFrequency"
                    >
                    </ty-dropdown>
                </el-col>

                <el-col :span='$colSpan' v-if="editData.cycleFrequency==3">
                    <ty-dropdown
                            @change="changeFrequency()"
                            label="频率"
                            :value.sync="editData.frequency"
                            :fieldMapperList="frequencyList"
                            :allowUpdate="true"
                            :allowNull="false"
                            :validate="editDataRules.frequency"
                            :formErrorMsg.sync="editDataErrorMsg.frequency"
                    >
                    </ty-dropdown>

                </el-col>
                <el-col :span='$colSpan-4' style="margin-left: 10px" v-if="editData.cycleFrequency==3">
                    <dropdown-arr
                            @change="changeDayNums()"
                            :multiple="true"
                            :value.sync="editData.dayNums"
                            :fieldMapperList="dayNumsList"
                            :allowUpdate="true"
                            :allowNull="false"
                            :validate="editDataRules.dayNums"
                            :formErrorMsg.sync="editDataErrorMsg.dayNums"
                    >
                    </dropdown-arr>

                </el-col>
            </el-row>
            <el-row class="tip-sty" v-if="this.editData.generationDate==2">
                <el-col :span='24'><span style="color: #026DFF">每月</span> 任务将于每月最后一天重复</el-col>
            </el-row>
            <el-row class="tip-sty" v-else>
                <el-col :span='24'><span style="color: #026DFF">{{dayName}}</span> 任务将于{{days}}{{haoNumber}}重复</el-col>
            </el-row>
            <el-row class="tip-sty">
                <el-col :span='24'> 结束于{{endName}}共{{taskNums}}次任务</el-col>
            </el-row>
            <el-row v-if="this.editData.cycleFrequency==2">
                <el-col :span='$colSpan'>
                    <ty-dropdown
                            @change="changeGenerationDate()"
                            label="生成日期"
                            :value.sync="editData.generationDate"
                            :fieldMapperList="generationDateList"
                            :allowUpdate="true"
                            :allowNull="false"
                            :validate="editDataRules.generationDate"
                            :formErrorMsg.sync="editDataErrorMsg.generationDate"
                    >
                    </ty-dropdown>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='$colSpan'>
                    <date-time
                            label="任务开始时间"
                            :value.sync="editData.cycleStartDate"
                            :allowUpdate="true"
                            :allowNull="false"
                            :timeFormat="'yyyy-MM-dd'"
                            :pickerOptions="pickerOptions"
                            :formErrorMsg.sync="editDataErrorMsg.cycleStartDate"
                            :validate="editDataRules.cycleStartDate"
                            @change="changecycleStartDate"
                    />
                </el-col>
                <el-col :span='$colSpan' style="margin-left: 10px">
                    <time-select
                            label="时间"
                            placeholder="选择时间"
                            :value.sync="editData.cycleStartTime"
                            :allowUpdate="true"
                            :allowNull="false"
                            :pickerOptions="{
                                start: '00:00',
                                step: '00:30',
                                end: '23:30'
                              }"
                            :formErrorMsg.sync="editDataErrorMsg.cycleStartTime"
                            :validate="editDataRules.cycleStartTime"
                            @change="startTimeSelect()"
                    />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='$colSpan'>
                    <date-time
                            @change="cycleEndDateChange()"
                            label="任务结束时间"
                            :value.sync="editData.cycleEndDate"
                            :allowUpdate="true"
                            :timeFormat="'yyyy-MM-dd'"
                            :allowNull="false"
                            :pickerOptions="pickerOptions1"
                            :formErrorMsg.sync="editDataErrorMsg.cycleEndDate"
                            :validate="editDataRules.cycleEndDate"
                    />
                </el-col>
                <el-col :span='$colSpan' style="margin-left: 10px">
                    <time-select
                            label="时间"
                            placeholder="选择时间"
                            :value.sync="editData.cycleEndTime"
                            :allowUpdate="true"
                            :allowNull="false"
                            :pickerOptions="{
                                start: '00:00',
                                step: '00:30',
                                end: '23:30'
                              }"
                            :formErrorMsg.sync="editDataErrorMsg.cycleEndTime"
                            :validate="editDataRules.cycleEndTime"
                            @change="cycleEndTimeChange()"
                    />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='$colSpan'>
                    <ty-dropdown
                            label="结束重复"
                            :value.sync="editData.endRepeat"
                            :fieldMapperList="endRepeatList"
                            :allowUpdate="true"
                            :allowNull="false"
                            @change="endRepeatChange()"
                            :validate="editDataRules.endRepeat"
                            :formErrorMsg.sync="editDataErrorMsg.endRepeat"
                    >
                    </ty-dropdown>
                </el-col>
                <el-col style="margin-left: 10px" :span='$colSpan' v-if="editData.endRepeat==1">
                    <date-time
                            label="日期"
                            :value.sync="editData.repeatDate"
                            :allowUpdate="true"
                            :allowNull="false"
                            :timeFormat="'yyyy-MM-dd'"
                            :pickerOptions="pickerOptions1"
                            :formErrorMsg.sync="editDataErrorMsg.repeatDate"
                            :validate="editDataRules.repeatDate"
                            @change="repeatDateChange()"
                    />
                </el-col>
                <el-col :span='$colSpan' style="margin-left: 10px" v-if="editData.endRepeat==2">
                    <multi-text
                            label="次数"
                            @change="numsChange()"
                            type="number"
                            :maxNumber="50"
                            v-model="editData.nums"
                            :precision="0"
                            :allowNull="false"
                            :formErrorMsg.sync="editDataErrorMsg.nums"
                            :allowUpdate="true"
                            :validate="editDataRules.nums"
                    >
                    </multi-text>
                </el-col>
            </el-row>
        </div>

        <button-footer
                :showBackup="!isCheck"
                :showConfirm="!isCheck"
                :showCancel="isCheck"
                :backupText="'保存'"
                :confirmText="'取消'"
                @backup="handleSubmit"
                @confirm="navigater('/leadertask/taskrelease/draftBox')"
                @cancel="back"
        ></button-footer>
    </div>
</template>
<script>
  import utils from '@/assets/js/validator'
  import FormTitle from "@/components/formTitle/FormTitle"
  import DateTime from "@/components/secondControlList/DateTime"
  import DropdownArr from "@/components/secondControlList/DropdownArr"
  import MultiText from "@/components/secondControlList/MultiText"
  import TimeSelect from "@/components/secondControlList/TimeSelect"
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import {addRespPeriodicTask, getTaskCount, getListByAccess} from "@/api/auditCenter/index";
  import {getSespTaskType} from "@/api/taskrelease/draftBox"
  import DropDown1 from "@/components/secondControlList/Dropdown1.vue"
  import UploadFile from "@/components/secondControlList/UploadFile"
import { number } from 'echarts'

  export default {
    //vue
    components: {
      UploadFile,
      DropDown1,
      ButtonFooter,
      FormTitle,
      DropdownArr,
      MultiText,
      TimeSelect,
      DateTime
    },
    data() {
      return {
        time: '',
        folderList: [],
        timeArr: [],
        personName: '',
        personName2: '',
        checked: false,
        gflList: [],
        qzcdList: [],
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
        veriftPen: '',
        form: {
          show: false,
          showTwo: false,
          showThree: false,
          veriftPsnId: '',
          principalIds: '',
          principalIds2: [],
          // personId2: [],
          // personName2: [],
          personId: [123, 124],
          personName: ["测试名称", "测试名称2"],
          define1: 222,
          name1: "预设1",
          define2: [123, 456],
          name2: ["预设2-1", "预设2-2"],
          define3: 333,
          name3: "预设3",
          define4: [234, 567],
          name4: ["预设4-1", "预设4-2"],
        },
        isUpdate: false,
        endName: '',
        taskNums: '',
        isCheck: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() + 3600 * 1000 * 24 < Date.now();
          },
        },
        pickerOptions1: {},
        pickerOptions2: {},
        haoNumber: '',
        dayName: '每天',
        days: '每天',
        generationDateList: [
          {
            dictValue: '1',
            dictLabel: '生成于某天',
          },
          {
            dictValue: '2',
            dictLabel: '生成于月的最后一天',
          },
        ],
        endRepeatList: [
          {
            dictValue: '1',
            dictLabel: '结束于某天',
          },
          {
            dictValue: '2',
            dictLabel: '限定任务次数',
          },
        ],
        fgflList: [],
        frequencyList: [],
        dayNumsList: [],
        cycleFrequencyList: [
          {
            dictValue: '1',
            dictLabel: '每天',
          },
          {
            dictValue: '2',
            dictLabel: '每月',
          },
          {
            dictValue: '3',
            dictLabel: '自定义',
          },
        ],
        editData: {
          fileIds: [],
          name: '',
          folderId: '',
          taskTypeId: '',
          urgency: 2,
          taskContent: '',


          repeatDate: '',  //日期
          generationDate: '',//生成日期
          cycleFrequency: '1',//重复频率
          cycleStartDate: '',//任务开始时间
          cycleStartTime: '',//时间
          cycleEndDate: '', //任务结束时间
          cycleEndTime: '', //时间
          startDate: '',
          endRepeat: '1', //结束重复
          nums: '1', //次数
          frequency: 1,//频率
          dayNums: [],

        },
        editDataRules: {
          // fileIds: { required: true, validator: utils.validateNull },
          name: {required: true, validator: utils.validateNull},
          taskTypeId: {required: true, validator: utils.validateNoSelect},
          urgency: {
            required: true,
            validator: utils.validateNoSelect,
          },

          cycleStartTime: {required: true, validator: utils.validateNoSelect, tip: '任务开始时间不能早于当前'},
          cycleEndTime: {required: true, validator: utils.validateNoSelect, tip: '任务结束时间不能早于或等于任务开始'},
          cycleFrequency: {required: true, validator: utils.validateNoSelect},
          folderId: {required: true, validator: utils.validateNoSelect},
          generationDate: {required: true, validator: utils.validateNoSelect},
          endRepeat: {required: true, validator: utils.validateNoSelect},
          cycleStartDate: {required: true, validator: utils.validateNull},
          cycleEndDate: {required: true, validator: utils.validateNull},
          startDate: {required: true, validator: utils.validateNull},
          nums: {required: true, validator: utils.validateNull},
          frequency: {required: true, validator: utils.validateNull},
          dayNums: {required: true, validator: utils.validateNull},
          repeatDate: {required: true, validator: utils.validateNull},
        },
        editDataErrorMsg: {
          name: '',//任务名称
          taskTypeId: '',//任务类型
          urgency: '',//紧急程度
          taskContent: '',//任务内容
          // fileIds: '', //附件上传
          folderId: '',


          cycleStartTime: '',
          repeatDate: '',
          generationDate: '',
          cycleFrequency: '',
          cycleStartDate: '',
          cycleEndDate: '',
          startDate: '',
          endRepeat: '',
          nums: '',
          frequency: '',
          dayNums: '',
        },
      }
    },
    watch: {
      checked(newVal, oldVal) {
        this.form.show = false
        this.form.showTwo = false
      },
      'form.principalIds': {
        deep: true,
        handler(val, oldval) {
          this.form.show = false
        }
      },
      'form.principalIds2': {
        deep: true,
        handler(val, oldval) {
          this.form.showTwo = false
        }
      },
      'form.veriftPsnId': {
        deep: true,
        handler(val) {
          this.form.showThree = false
        }
      }
    },
    async created() {

      //审核人默认
      this.veriftPen = this.$store.state.user.personName
      this.form.veriftPsnId = this.$store.state.user.personId

      await this.init()
      await this.initFolderList()
      await this.initFrequencyList()
      await this.getSespTaskType()


    },
    methods: {
      endRepeatChange(){
        // if(this.editData.endRepeat==2){
        //   this.editData.nums=0
        // }
        this.getTaskCount()
    },
      changeGenerationDate() {


        if (this.editData.generationDate == '2') {
          this.editData.cycleStartDate = this.getCurrentMonthLast(this.editData.cycleStartDate.substring(0, 7))
          this.days = '每月' + this.editData.cycleStartDate.substring(7, 9).replace(/\//g, "-") + '号'
          this.editData.cycleEndDate = this.editData.cycleStartDate
          this.editData.repeatDate = this.editData.cycleStartDate
          this.pickerOptions1 = {
            disabledDate: (time) => {
              if (!this.editData.cycleStartDate) return false;
              if (this.editData.cycleStartDate) {
                let scoreCycle = this.editData.cycleStartDate
                return time.getTime() < (new Date(scoreCycle.trim()))
              } else {
                return false
              }
            }
          }
          if (this.editData.endRepeat == 1) {
            this.changeTip()
          } else {
            this.numsChange()
          }
        } else if (this.editData.generationDate == 1) {
          this.days = '每月' + this.editData.cycleStartDate.replace(/\//g, "-").split('-')[2].substring(0,2) + '号'
          if (this.editData.endRepeat == 1) {
            this.changeTip()
          } else {
            this.numsChange()
          }
        }
        // this.changeTip()
      },
      // validateMonth(){
      //
      // },
      // validateCustom(){
      //
      // },
      getNextMonth(nowTime, num) {
        //tttt为现在的日期 2022-2-9
        var d = new Date(nowTime);
        //最后的 +2 意思是获取下个月的今天
        //如果是 +5 意思是获取四个月后的今天
        //如果是 +10 意思是获取九个月后的今天  以此类推
        //      let month= num+1
        //    由于包含本月，所以不用加1
        let month = num
        d.setMonth((d.getMonth() - 1) + month);
        var yy1 = d.getFullYear();

        var mm1 = d.getMonth() + 1;
        var dd1 = d.getDate();
        if (mm1 < 10) {
          mm1 = '0' + mm1;
        }
        if (dd1 < 10) {
          dd1 = '0' + dd1;
        }
        var time = yy1 + '-' + mm1 + '-' + dd1;
        //最后打印可获取到 n 个月后的今天
        return time
      },

      nafterMonth(dtstr, n) {
        let a = Number(dtstr.substring(0, 4)) //年
        let b = Number(dtstr.substring(4, 6)) //月
        let c = Number(n) + b
        if(c > 12){
          let d = parseInt(c/12) //取整
          let e = c%12 //取余数
          a = a + d
          c = e || 12
        }
        // var dt = new Date(dtstr.substring(0, 4), dtstr.substring(4, 6), 1);
        // dt.setMonth(dt.getMonth() + n);
        // var yy1 = dt.getFullYear();
        // var mm1 = dt.getMonth();
        // if (mm1 < 10) {
        //   mm1 = "0" + mm1;
        // }
        return a + "" + c;
      },
      getData(val) {
        this.timeArr = []
        for (let i = 0; i < val; i++) {
          if (i == 0) {
            this.getNextMonthTwo(this.editData.cycleStartDate, this.editData.frequency)
            

          } else {
            this.getNextMonthTwo(this.time, this.editData.frequency)

          }
          this.timeArr.push(this.time)
        }
      },
      // getNextMonthTwo(nowTime, num) {
      //   console.log("1111111111111111",num)
      //   //nowTime为2022-08   num 为2， 2022-10
      //   var d = new Date(nowTime);
      //   //最后的 +2 意思是获取下个月的今天
      //   //如果是 +5 意思是获取四个月后的今天
      //   //如果是 +10 意思是获取九个月后的今天  以此类推
      //   let month =  num + 1
      //   d.setMonth((d.getMonth() - 1) + month);
      //   var yy1 = d.getFullYear();
      //   var mm1 = d.getMonth() + 1;
      //   var dd1 = d.getDate();
      //   if (mm1 < 10) {
      //     mm1 = '0' + mm1;
      //   }
      //   if (dd1 < 10) {
      //     dd1 = '0' + dd1;
      //   }
      //   this.time = yy1 + '-' + mm1 + '-' + dd1;

      //   	console.log("mm111111111",mm1)

      //   //最后打印可获取到 n 个月后的今天
      //   // return time
      // },
      getNextMonthTwo(nowTime, num) {
        //nowTime为2022-08   num 为2， 2022-10
        var d = new Date(nowTime);
        //最后的 +2 意思是获取下个月的今天
        //如果是 +5 意思是获取四个月后的今天
        //如果是 +10 意思是获取九个月后的今天  以此类推
        let month = num + 1
        d.setMonth((d.getMonth() - 1) + month);
        var yy1 = d.getFullYear();
        var mm1 = d.getMonth() + 1;
        var dd1 = d.getDate();
        if (mm1 < 10) {
          mm1 = '0' + mm1;
        }
        if (dd1 < 10) {
          dd1 = '0' + dd1;
        }
        // console.log(" mm1", mm1)
        this.time = yy1 + '-' + mm1 + '-' + dd1;
        //最后打印可获取到 n 个月后的今天
        // return time
      },


      async getSespTaskType() {
        const res = await getSespTaskType();
        if (res.code == 200 && Array.isArray(res.data)) {
          this.fgflList = res.data.map((v, index) => {
            if (!this.$route.query.id && index == 0) this.editData.taskTypeId = v.id
            return {
              dictValue: v.id,
              dictLabel: v.name,
            };
          });
        }
      },
      //保存
      handleSubmit() {
        //重复频率
        if (this.editData.cycleFrequency == '1') {
          this.editData.generationDate = ''
          this.editData.frequency = ''
          this.editData.dayNums = ''
          delete this.editDataRules.generationDate
          delete this.editDataErrorMsg.generationDate
          delete this.editDataRules.frequency
          delete this.editDataErrorMsg.frequency
          delete this.editDataRules.dayNums
          delete this.editDataErrorMsg.dayNums

        } else if (this.editData.cycleFrequency == '2') {
          this.editData.frequency = ''
          this.editData.dayNums = ''
          delete this.editDataRules.frequency
          delete this.editDataErrorMsg.frequency
          delete this.editDataRules.dayNums
          delete this.editDataErrorMsg.dayNums
        } else if (this.editData.cycleFrequency == '3') {
          this.editData.generationDate = ''
          delete this.editDataRules.generationDate
          delete this.editDataErrorMsg.generationDate
        }
        //结束于某天
        if (this.editData.endRepeat == '1') {
          this.editData.nums = ''
          delete this.editDataRules.nums
          delete this.editDataErrorMsg.nums
        } else {

          this.editData.repeatDate = ''
          delete this.editDataRules.repeatDate
          delete this.editDataErrorMsg.repeatDate
        }
        this.formValidate(this.editData, this.editDataRules, this.editDataErrorMsg).then(formDataOk => {
          if (this.form.principalIds2.length == 0 && this.checked) {//多人任务
            this.form.showTwo = true
          }
          if (this.form.principalIds.length == 0 && !this.checked) {//单人任务
            this.form.show = true
          }
          if (this.form.veriftPsnId.length == 0) {
            this.form.showThree = true
          }
          let arr = [this.checked ? this.form.showTwo : this.form.show, this.form.showThree]
          if (arr.includes(true)) return
          if (!formDataOk) return
          const getTimeTaskStartTime = this.editData.cycleStartDate.replace(/\//g, "-").substring(0, 11) + ' ' + this.editData.cycleStartTime + ':00';
          const getTimeTaskEndTime = this.editData.cycleEndDate.replace(/\//g, "-").substring(0, 11) + ' ' + this.editData.cycleEndTime + ':00';
          const periodicEndTime = this.editData.repeatDate.replace(/\//g, "-").substring(0, 11) + ' 23:59:59';
          let arrFile = this.editData.fileIds
          let fileIdsArrs = []
          for (let i = 0; i < arrFile.length; i++) {
            fileIdsArrs.push(arrFile[i].id)
          }
          let postData = {
            folderId: this.editData.folderId,
            fileIds: fileIdsArrs,
            name: this.editData.name,
            taskTypeId: this.editData.taskTypeId,
            urgency: this.editData.urgency,
            veriftPsnId: this.form.veriftPsnId,
            taskContent: this.editData.taskContent,
            periodicType: parseInt(this.editData.cycleFrequency),
            principalIds: this.checked == true ? this.form.principalIds2 : [this.form.principalIds],
            creationType: this.editData.generationDate,
            periodicEndType: parseInt(this.editData.endRepeat),
            periodicEndTime: periodicEndTime,
            taskFrequency: this.editData.nums,
            customizeFrequency: this.editData.frequency,
            customizeFrequencyNum: this.editData.dayNums.length != 0 ? this.editData.dayNums.toString() : '',
            taskStartTime: getTimeTaskStartTime,
            taskEndTime: getTimeTaskEndTime,
          }
          // 结束重复为2时，不需要选日期
          if (this.editData.endRepeat == '2') {
            delete postData.periodicEndTime
          }

          this.addRespPeriodicTask(postData);
        })
      },
      getTaskCount() {
        let cycleStartTime;
        if (!this.editData.cycleStartTime) {
          cycleStartTime = '23:58:00';
        } else {
          cycleStartTime = this.editData.cycleStartTime + ':00'
        }
        let cycleEndTime;
        if (!this.editData.cycleEndTime) {
          cycleEndTime = '23:59:59'
        } else {
          cycleEndTime = this.editData.cycleEndTime + ':00'
        }
        if (this.editData.generationDate == '2') {
          this.editData.cycleStartDate = this.getCurrentMonthLast(this.editData.cycleStartDate.substring(0, 7))
        }
        const getTimeTaskStartTime = this.editData.cycleStartDate.replace(/\//g, "-").substring(0, 11) + ' ' + cycleStartTime;
        let getTimeTaskEndTime = this.editData.cycleEndDate.replace(/\//g, "-").substring(0, 11) + ' ' + cycleEndTime;
        const periodicEndTime = this.editData.repeatDate.replace(/\//g, "-").substring(0, 11) + ' 23:59:59';
        let dayNums = this.editData.dayNums.toString().split(',')
        let sortDays = dayNums.sort(this.func)
        let postData = {
          fileIds: this.editData.fileIds,
          name: this.editData.name,
          taskTypeId: this.editData.taskTypeId,
          urgency: this.editData.urgency,
          veriftPsnId: this.form.veriftPsnId,
          taskContent: this.editData.taskContent,
          periodicType: parseInt(this.editData.cycleFrequency),
          principalIds: this.checked == true ? this.form.principalIds2 : [this.form.principalIds],
          creationType: this.editData.generationDate,
          periodicEndType: parseInt(this.editData.endRepeat),
          periodicEndTime: periodicEndTime,
          taskFrequency: this.editData.nums,
          customizeFrequency: this.editData.frequency,
          customizeFrequencyNum: sortDays.length != 0 ? sortDays.toString() : '',
          taskStartTime: getTimeTaskStartTime,
          taskEndTime: getTimeTaskEndTime,
        }
        if (this.editData.cycleFrequency == 2) {
          if (!postData.creationType || !postData.periodicType || !postData.taskStartTime ||
            !postData.taskEndTime || !postData.periodicEndType || !postData.periodicEndTime
            ||!this.editData.repeatDate||!this.editData.cycleStartDate||!this.editData.cycleEndDate) {
            // this.msgSuccess('请填写完成周期设置')
            return
          }
        } else if (this.editData.cycleFrequency == 3) {
          if (!postData.customizeFrequency || !postData.customizeFrequencyNum || !postData.periodicType
            || !postData.taskStartTime || !postData.taskEndTime || !postData.periodicEndType
            || !postData.periodicEndTime ||!this.editData.repeatDate||!this.editData.cycleStartDate||!this.editData.cycleEndDate) {
            // this.msgSuccess('请填写完成周期设置')
            return
          }
        }
        // 结束重复为次数，选次数的时候这个设为null或者不传
            if(postData.periodicEndType==2){
             delete postData.periodicEndTime
            }
        getTaskCount(postData).then((res) => {
          if (res.code == 200) {
            this.taskNums = res.data.count
            if(res.data.endTime){
              this.endName = res.data.endTime.substring(0, 10)
            }
          }
        });
      },
      addRespPeriodicTask(data) {
        addRespPeriodicTask(data).then((res) => {
          if (res.code == 200) {
            this.messageSuccess("新增成功！");
            this.$router.push({
              path: "/leadertask/taskrelease/taskcycle",
            });
          }
        });
      },
      back() {
        let path = "/leadertask/taskrelease/taskcycle";
        this.navigater(path);
      },
      addWords(num) {
        return num < 10 ? '0' + num : num;
      },
      //获取最近多少天的日期
      fun_date(dayNumber) {
        var dateTime = new Date(this.editData.cycleStartDate);
        var dateEnd = new Date(dateTime);
        dateEnd.setDate(dateTime.getDate() + dayNumber);
        var endTime = dateEnd.getFullYear() + "-" + this.addWords(dateEnd.getMonth() + 1) + "-" + this.addWords(dateEnd.getDate());
        return endTime;
      },
      //获取指定时间的最后一天
      getCurrentMonthLast(date) {
        var endDate = new Date(date); //date 是需要传递的时间如：2018-08
        var month = endDate.getMonth();
        var nextMonth = ++month;
        var nextMonthFirstDay = new Date(endDate.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        var dateString = new Date(nextMonthFirstDay - oneDay);
        // console.log(dateString) //Wed Oct 31 2018 00:00:00 GMT+0800 (中国标准时间)
        let aa = dateString.toLocaleDateString()

        return aa; //toLocaleDateString() 返回 如：2018/8/31

      },
      //按日查询
      getDayAll(begin, end) {
        Date.prototype.format = function () {
          var time = '';
          time += this.getFullYear() + '-';          // 获取年份。
          time += (this.getMonth() + 1) + "-";         // 获取月份。
          time += this.getDate();                 // 获取日。
          return (time);                          // 返回日期。
        };

        var dateAllArr = new Array();
        var startTime = begin.split("-");
        var endTime = end.split("-");
        var currentTime = new Date();
        currentTime.setUTCFullYear(startTime[0], startTime[1] - 1, startTime[2]);
        var currentTime2 = new Date();
        currentTime2.setUTCFullYear(endTime[0], endTime[1] - 1, endTime[2]);
        var unixDb = currentTime.getTime();
        var unixDe = currentTime2.getTime();
        for (var k = unixDb; k <= unixDe;) {
          dateAllArr.push((new Date(parseInt(k))).format().toString());
          k = k + 24 * 60 * 60 * 1000;
        }
        return dateAllArr;
      },
      func(a, b) {
        return a - b;
      },
      getDateArry(startDate, endDate) {
        var d1 = startDate;
        var d2 = endDate;
        var dateArry = new Array();
        var s1 = d1.split("-");
        var s2 = d2.split("-");
        var mCount = 0;
        if (parseInt(s1[0]) < parseInt(s2[0])) {
          mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1]) + 1;
        } else {
          mCount = parseInt(s2[1]) - parseInt(s1[1]) + 1;
        }
        if (mCount > 0) {
          var startM = parseInt(s1[1]);
          var startY = parseInt(s1[0]);
          for (var i = 0; i < mCount; i++) {
            if (startM < 12) {
              dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
              startM += 1;
            } else {
              dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
              startM = 1;
              startY += 1;
            }
          }
        }
        return dateArry;
      },

      aa(data, nums) {
        let type = nums //近n个月的
        let month = new Date(data).getMonth() + 1 //当前月份
        let year = new Date(data).getFullYear() //今年
        for (let i = 1; i <= type; i++) {
          let date = ''
          if (month >= i) {
            date = year + '-' + (month - i + 1)
          } else {
            date = (year - 1) + '-' + (12 + month - i + 1)
          }
          console.log(date)
        }
      },
      numsChange() {
        if (this.editData.cycleFrequency == 1) {
          this.endName = this.fun_date(this.editData.nums - 1)
          this.taskNums = this.editData.nums
        } else if (this.editData.cycleFrequency == 2) {
          this.getTaskCount()
          // if (this.editData.generationDate == 2) {
            // this.taskNums = this.editData.nums
            // let cycleStartDateSplit = this.editData.cycleStartDate.split('/')
            // let  numsAll=this.editData.nums-1
            // let afterMonth = this.nafterMonth(cycleStartDateSplit[0] + cycleStartDateSplit[1], numsAll)
            // this.endName = this.getCurrentMonthLast(afterMonth.substring(0, 4) + '-' + afterMonth.substring(4, 6)).replace(/\//g, "-")
          // } else {
            // this.taskNums = this.editData.nums
            // this.endName = this.getNextMonth(this.editData.cycleStartDate, this.editData.nums)
          // }
        } else {
          // this.customAndNum()
          this.taskNums = this.editData.nums
          this.getTaskCount()
        }
      },
      customAndNum() {
        this.taskNums = this.editData.nums
        //50为次数的最大值
        // this.getData(50)
        //
        // this.timeArr.unshift(this.editData.cycleStartDate);
        // let formatTimeArr = this.timeArr.map(item => {
        //   return item.substring(0, 7)
        // })
        // let gg = []
        // let sortNums = this.editData.dayNums.sort(this.func)
        // for (let j = 0; j < formatTimeArr.length; j++) {
        //   for (let i = 0; i < sortNums.length; i++) {
        //     gg.push(new Date(formatTimeArr[j] + '-' + sortNums[i].replace("-", "/")))
        //   }
        // }
        // let start = new Date(this.editData.cycleStartDate.replace("-", "/"))
        // let newArr = []
        // for (let i = 0; i < gg.length; i++) {
        //   if (gg[i] >= start) {
        //     newArr.push(gg[i])
        //   }
        // }
        // this.endName = this.toDateUtil.formatDateTime(newArr[this.editData.nums - 1], "yyyy-MM-dd");
      },
      repeatDateChange() {
        this.changeTip()
      },

      changeTip() {
        //  每天
        if (this.editData.cycleFrequency == 1) {
          if (this.editData.endRepeat == 1) {
            this.taskNums = this.getDistanceDays(this.editData.repeatDate.substring(0, 10), this.editData.cycleStartDate.substring(0, 10)) + 1
            this.endName = this.editData.repeatDate.substring(0, 11)
          } else if (this.editData.endRepeat == 2) {
            // this.getTaskCount()
            this.endName = this.fun_date(this.editData.nums - 1)
            this.taskNums = this.editData.nums
          }
          //  每月
        } else if (this.editData.cycleFrequency == 2) {
          if (this.editData.generationDate == 2) {
            this.editData.cycleStartDate = this.getCurrentMonthLast(this.editData.cycleStartDate.substring(0, 7)).replace(/-/g, '/')
            // this.endName = this.getNextMonth(this.editData.cycleStartDate, this.editData.nums)
            // this.getTaskCount()
          // } else {
          //   this.getTaskCount()
            // this.endName = this.getNextMonth(this.editData.cycleStartDate, this.editData.nums)
          }
          this.getTaskCount()
          //  自定义
        } else {
          this.getTaskCount()
        }
      },


      cycleEndDateChange() {


        this.changeTip()
      },
      // 任务开始时间改变事件
      changecycleStartDate() {
        //如果是生成于某个月最后一天，无论选哪一天，都变为最后一天
        if (this.editData.generationDate == '2') {
          this.$nextTick(() => {
            this.editData.cycleStartDate = this.getCurrentMonthLast(this.editData.cycleStartDate.substring(0, 7)).replace(/\//g, "-")
            this.days = '每月' + this.editData.cycleStartDate.split('-')[2] + '号'
            this.editData.repeatDate = this.editData.cycleStartDate
            this.editData.cycleEndDate = this.editData.cycleStartDate
          })
          this.changeTip()
        } else if (this.editData.generationDate == 1) {
          this.days = '每月' + this.editData.cycleStartDate.substring(8, 10) + '号'
        }
        this.pickerOptions1 = {
          disabledDate: (time) => {
            if (!this.editData.cycleStartDate) return false;
            if (this.editData.cycleStartDate) {
              let scoreCycle = this.editData.cycleStartDate
              return time.getTime() + 3600 * 1000 * 24 < (new Date(scoreCycle.trim()))
            } else {
              return false
            }
          }
        }

        // //假设修改任务开始日期，晚于结束重复的日期，结束重复的日期也会统一改成相同的日期。
        //任务开始日期
        var strtime = this.editData.cycleStartDate;
        var date = new Date(strtime.replace(/-/g, '/'));
        let timeStart = date.getTime();
        //结束重复的日期
        var strtime2 = this.editData.repeatDate;
        var date2 = new Date(strtime2.replace(/-/g, '/'));
        let timeRepeat = date2.getTime();
        if (timeStart > timeRepeat) {
          this.editData.repeatDate = this.editData.cycleStartDate
        }


        //自定义时，默认选中当前
        this.editData.dayNums = []
        let day = this.editData.cycleStartDate.substring(0, 11).split('-')[2]
        let intDay = parseInt(day).toString();
        this.editData.dayNums.push(intDay)

        //假设修改任务开始日期，晚于任务结束时间的日期，任务结束时间的日期也会统一改成相同的日期。
        //任务开始日期
        var strtime = this.editData.cycleStartDate;
        var date = new Date(strtime.replace(/-/g, '/'));
        let time1 = date.getTime();
        //任务结束日期
        var strtime2 = this.editData.cycleEndDate;
        var date2 = new Date(strtime2.replace(/-/g, '/'));
        let time2 = date2.getTime();
        if (time1 > time2) {
          this.editData.cycleEndDate = this.editData.cycleStartDate
          this.editData.repeatDate = this.editData.cycleStartDate
          this.endName = this.editData.repeatDate.substring(0, 10)
        }

        this.changeTip()
      },
      formValidate(formData, rules, errorMsg, scroll = true, target = this) {
        return new Promise(resolve => {
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
          })
        });
      },
      // 计算两个日期距离的天数
      getDistanceDays(date1, date2) {
        // date1例如:'2022-03-05',date2例如:'2022-03-06'
        const date1_timeStamp = this.toTimeStamp(date1)
        const date2_timeStamp = this.toTimeStamp(date2)
        let max = '', min = ''
        if (date1_timeStamp > date2_timeStamp) {
          max = date1_timeStamp
          min = date2_timeStamp
        } else {
          max = date2_timeStamp
          min = date1_timeStamp
        }
        // 例如返回:'1'
        return (max - min) / (24 * 60 * 60 * 1000)
      },
      // 指定时间转换为时间戳
      toTimeStamp(dateString) {
        // dateString例如:'2022-03-05'
        // 例如返回:1646611200000
        return new Date(dateString) - 0
      },
      initFolderList() {
        getListByAccess({
          access: 0
        }).then(response => {
          this.folderList = response.data.map((v) => {
            if (v.name == '日度计划' && !this.$route.query.id) this.editData.folderId = v.id
            return {
              dictValue: v.id,
              dictLabel: v.name,
            };
          });
        });
      },
      init() {
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() + 3600 * 1000 * 24 < Date.now();
          },
        }
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() + 3600 * 1000 * 24 < Date.now();
          },
        }
        const today = this.toDateUtil.formatDateTime(new Date(), "yyyy-MM-dd");
        this.editData.cycleStartDate = today
        this.editData.cycleEndDate = today
        this.editData.startDate = today
        this.editData.repeatDate = today
        this.dayNumsList = []
        for (let i = 1; i <= 31; i++) {
          this.dayNumsList.push({dictValue: i.toString(), dictLabel: i + '日',})
        }
        this.endName = this.editData.repeatDate
        this.taskNums = '1'

      },
      initFrequencyList() {
        this.frequencyList = []
        for (let i = 1; i <= 12; i++) {
          this.frequencyList.push({dictValue: i, dictLabel: '每' + i,})
        }
      },
      cycleEndTimeChange() {
        var strtime = this.editData.cycleEndDate.subtimegetDatastring(0, 11) + ' ' + this.editData.cycleEndTime + ':00';
        var date = new Date(strtime.replace(/-/g, '/'));
        let time1 = date.getTime();

        const date2 = new Date(this.editData.cycleStartDate.substring(0, 11) + ' ' + this.editData.cycleStartTime + ':00').getTime();
        if (time1 <= date2 || time1 < Date.now()) {
          this.editData.cycleEndTime = ''
          return false
        }
      },
      startTimeSelect() {
        var strtime = this.editData.cycleStartDate.substring(0, 11) + ' ' + this.editData.cycleStartTime + ':00';
        var date = new Date(strtime.replace(/-/g, '/'));
        let time1 = date.getTime();
        if (time1 < Date.now()) {
          // this.messageErr('任务开始日期不能早于当前时间')
          this.editData.cycleStartTime = ''
          return false
        }
      },

      changeFrequency() {
        this.initFrequencyList()
        let arr = this.frequencyList.filter((item) => {
          if (item.dictValue == this.editData.frequency) return item.dictLabel
        })
        if (arr.length != 0) {
          this.days = arr[0].dictLabel + '个月'
        } else {
          this.days = '每1个'
        }
        this.changeTip()
      },
      changeDayNums() {
        let day = this.editData.cycleStartDate.substring(0, 11).split('-')[2]
        let intDay = parseInt(day).toString();

        if (this.editData.dayNums.indexOf(intDay) == -1) {
          this.$message({
            type: 'warning',
            message: `当前日程为${parseInt(this.editData.cycleStartDate.substring(8, 10))}日,无法取消选择`
          })
          this.editData.dayNums.splice(intDay - 1, 0, intDay)
          //                   下标，长度，要替换的值
          // this.value1.splice(1, 0, '2')
        }
        let dayNums = this.editData.dayNums.toString().split(',')
        let sortDays = dayNums.sort(this.func)
        let hao = sortDays.map(item => {
          return item + '日'
        })

        this.haoNumber = hao.join('、')
        this.changeTip()
      },
      changecycleFrequency() {
        let arr = this.cycleFrequencyList.filter((item) => {
          if (item.dictValue == this.editData.cycleFrequency) return item.dictLabel
        })
        this.dayName = arr[0].dictLabel
        if (this.editData.cycleFrequency != 3) {
          this.haoNumber = ''
          if (arr[0].dictLabel == '每月') {
            //重复频率切换为每月
            this.days = arr[0].dictLabel + this.editData.cycleStartDate.substring(8, 10) + '号'
            this.editData.generationDate = '1'
            this.changeGenerationDate()
            this.init()
            this.days = '每月' + this.editData.cycleStartDate.substring(8, 10) + '号'
          } else {
            //重复频率切换为每天
            this.days = arr[0].dictLabel

            this.init()
          }
        } else {
          //重复频率为自定义
          this.initFrequencyList()
          let arr = this.frequencyList.filter((item) => {
            if (item.dictValue == this.editData.frequency) return item.dictLabel
          })
          if (arr.length != 0) {
            this.days = arr[0].dictLabel + '个月'
          } else {
            this.days = '每1个'
          }
          this.init()
          this.editData.dayNums = []
          let day = this.editData.cycleStartDate.substring(0, 11).split('-')[2]
          let intDay = parseInt(day).toString();
          this.editData.dayNums.push(intDay);
          this.haoNumber = `${parseInt(this.editData.cycleStartDate.substring(8, 10))}日`
        }
        //重复频率
        if (this.editData.cycleFrequency == 1 || this.editData.cycleFrequency == 3) {
          this.editData.generationDate = ''
        }
      },
      handleAdd() {
        this.$router.push({
          path: `/taskrelease/taskcycle/edit`
        });
      }
    },
  }
</script>
<style lang="scss" scoped>

    ::v-deep .el-upload-list__item a {
        max-width: 700px;
    }

    .item-line1 {
        position: relative;
        display: flex;
        color: #f56c6c;
        font-size: 14px;
        margin-bottom: 22px;

        .item-label {
            display: flex;
            align-items: center;
            text-align: right;
            padding-right: 10px;
        }

        div {
            width: 126px;
        }

        span {
            color: #868a97;
        }
    }

    .verify {
        position: absolute;
        top: 40px;
        left: 131px;
        color: red;
        font-size: 12px;
    }

    .verify1 {
        left: 126px;
    }

    ::v-deep .button-container.design-form-wrap__btnwrap {
        border-bottom: 0;
    }

    .design-form-wrap__ctnwrap_check {
        height: 40px;
        display: flex;
        align-items: center;
    }

    ::v-deep .el-button--primary {
        background-color: #026DFF;
        border-radius: 3px;
        height: 30px;
    }

    ::v-deep .el-form-item__label {
        font-size: 14px;
        color: #868a97;
        margin-left: 56px;
        font-weight: normal;
    }

    ::v-deep .el-form-item__content {
        white-space: nowrap;
        margin-right: 130px;

    }

    ::v-deep .el-input--mini .el-input__inner {
        height: 40px !important;
    }

    .tip-sty {
        margin-left: 130px;
        color: #868a97;
        font-size: 14px;
        padding-bottom: 10px;
    }

    .custom-con {
        padding: 20px;
    }

    .listFieldUl,
    .listFieldUl li {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .hse-form {
        ::v-deep {
            .el-form-item__label {
                width: 84px !important;
            }
        }
    }

    ::v-deep .el-radio {
        margin-right: 16px !important;
    }

    .flex-input {
        width: 100%;
        height: 38px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border: solid 1px #dcdfe6;
        border-radius: 4px;
        padding: 0 10px;
    }

    .el-input__icon {
        color: #333 !important;
        margin-right: 10px;
        position: relative;
    }

    .el-icon-circle-close {
        font-size: 18px;
        color: #f38383;
        line-height: 36px;
        cursor: pointer;
        position: absolute;
        right: 10px;
    }

</style>
