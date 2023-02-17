<template>
  <!-- 日期控件 -->
  <div style="width: 100%">
    <div :class="['item-line', 'mb22', { 'flex-align-items': !allowUpdate }]">
      <!-- 一级label START -->
      <div class="item-label" v-if="label" :style="labelStyle">
        <div>
          <em v-if="!allowNull">*</em>
          <span>{{ `${label}：` }}</span>
        </div>
        <slot name="label"></slot>
      </div>
      <!-- 只读状态 START -->
      <template v-if="!allowUpdate">
        <div :class="['item-readonly']">
          <div class="readonly-value">
            {{ value | textFilter  }}
          </div>
          <!-- <div class="readonly-value">
            {{ value ? value.split(" ")[0] : readonlyValue }}
          </div> -->
          <slot></slot>
        </div>
      </template>
      <!-- 只读状态 END -->
      <template v-else>
        <el-time-select
                v-model="currentDate"
                :picker-options="pickerOptions"
                :placeholder="placeholderText"
                :class="[{'item-error':formErrorMsg || formErrorMsg === false}]"
                @visible-change="visibleChange($event)"
                @change="confirmDate()">

        </el-time-select>

<!--        <el-date-picker-->
<!--                v-model="currentDate"-->
<!--                :type="type"-->
<!--                :placeholder="placeholderText"-->
<!--                :start-placeholder="startPlaceholder"-->
<!--                :end-placeholder="endPlaceholder"-->
<!--                :picker-options="pickerOptions"-->
<!--                :clearable="clearable"-->
<!--                @change="confirmDate"-->
<!--        >-->
<!--        </el-date-picker>-->
        <p
                class="limit-world"
                v-if="formErrorMsg"
                :style="{ marginLeft: labelStyle.width }"
        >
          <span>{{ formatError(formErrorMsg, "选择") }}</span>
        </p>
      </template>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import secondCtlMixins from "@/assets/js/mixins/secondCtlMixins";
  export default {
    name: "dateTime",
    components: {},
    props: {
      //值
      value: {
        type: [String],
        default: "",
      },
      endPlaceholder: {
        type: String,
        default: "结束日期",
      },
      pickerOptions:{
        type: Object,
        default: () => {
          return {};
        }
      },
      startPlaceholder: {
        type: String,
        default: "开始日期",
      },

      //是否显示清除按钮
      clearable: {
        type: Boolean,
        default: true,
      },
    },
    mixins: [secondCtlMixins],
    computed: {
      placeholderText() {
        return this.placeholder
                ? this.placeholder
                : this.label
                        ? `请选择${this.removeColon(this.label)}`
                        : "";
      },
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val) {
              this.currentDate =val;
              this.onBlur();
            }
          }
        },
    },
    filters: {
      textFilter(val) {
        if (!val) return "暂无";
        return val;
      },
    },
    data() {
      return {
        currentDate: "",
      };
    },
    methods: {
      visibleChange(callback,vc) {
        if(!callback) {
          this.onBlur();
        }
      },
      /**
       * 点击日期弹出框确认按钮时触发的事件
       * @param value
       */
      confirmDate(value) {
        this.$emit("update:value", this.currentDate)
        this.$emit('change')
        this.$nextTick(() => {
          this.onBlur();
        });
      },
      /**
       * 错误提示
       * @param data
       * @param words
       * @returns {*}
       */
      formatError(data, words = "填写") {
        if (!data) {
          return this.removeColon(`请${words}${this.label}`);
        } else {
          return this.removeColon(`${data}${this.label}`);
        }
      },
      /**
       *  日期转化成GMT时间
       * @param time
       * @returns {Date}
       */
      strToGMT(time) {
        if (time) {
          return new Date(time);
        } else {
          // return new Date(new Date())
        }
      },
    },
  };
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~@/assets/styles/controlList/controlList.scss";
  .item-line {
    position: relative;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    &.flex-align-items {
      align-items: flex-start;
    }
    .item-label {
      padding-right: 10px;
      text-align: right;
      font-size: 14px;
      color: #868a97;
      em {
        padding-left: 4px;
        color: #f56c6c;
        font-size: 14px;
      }
    }
    .el-date-editor {
      flex: 1;
    }
    .el-input {
      // width: 230px;
      flex: 1;
    }
    .el-textarea {
      // width: 300px;
      flex: 1;
    }
    .item-readonly {
      text-align: left;
      font-size: 14px;
      color: #333333;
      .readonly-value {
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .limit-world {
      width: 230px;
      text-align: right;
      color: #ccc;
      margin: 0 0 0 200px;
      font-size: 12px;
      position: absolute;
      bottom: -17px;
      span {
        float: left;
        // margin-right: .16rem;
        color: #f00;
      }
    }
  }
</style>
