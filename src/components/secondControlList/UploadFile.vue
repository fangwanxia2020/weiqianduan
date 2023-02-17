<template>
  <div class="">
    <div :class="['item-line',{'flex-align-items': !allowUpdate}]">
      <div class="item-label" v-if="label" :style="labelStyle">
        <div>
          <em v-if="!allowNull">*</em>
          <span>{{`${label}：`}}</span>
        </div>
        <slot name="label"></slot>
      </div>
      <template>
        <ty-upload-file1
          :length="length"
          :style="uploadFileStyle"
          class="upload-file"
          width="none"
          v-model="file"
          :uploadFileText="uploadFileText"
          v-hideBtn="allowUpdate"
          :action="action"
          resFormat="data"
          @change="handleImport"
        >
        <span
          v-if="isShowPreview"
          class="fileOp"
          slot="fileOperator"
          slot-scope="{ data }"
          @click="previewFile(data.url)"
        >预览</span>
        </ty-upload-file1>
      </template>
      <div v-if="showTip" class="limit-hint">最多上传10个文件，单个文件不能超过500MB</div>
    </div>
    <p
      class="limit-world"
      :style="{marginLeft: labelStyle.width}"
    >
      <span>{{formErrorMsg ? formatError(formErrorMsg,'选择') : ''}}</span>
    </p>
  </div>
</template>

<script>
import validatorUtils from '@/assets/js/validator';
import secondCtlMixins from '@/assets/js/mixins/secondCtlMixins';

export default {
  mixins:[secondCtlMixins],
  props: {
    showTip:{
      type: Boolean,
      default: true
    },
    length:{
      type: Number,
      default: 10
    },
    // 上传按钮样式
    uploadFileStyle: {
      type: Object,
      default: () => {}
    },
    // 上传按钮文本
    uploadFileText: {
      type: String,
      default: '上传文件'
    },
    // 上传url地址
    action: {
      type: String,
      default: '/api/sysfile/file_info/upload'
    },
    //是否显示预览插槽
    isShowPreview: {
      type: Boolean,
      default: true
    },
    //值
    value: [],
    //错误提示
    formErrorMsg: {
      type: [String, Boolean],
      default: ''
    },
    //校验方法
    validate: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.file = val
        if (Array.isArray(val) && val.length) {
          if (!this.$isEmptyObj(this.validate)) {
            validatorUtils.validateData({ key: this.value }, { key: this.validate }).then(err => {
              this.$emit('update:formErrorMsg', err ? err[0].message : '');
            });
          }
        }
      }
    },
  },
  data() {
    return {
      file:[],
    }
  },
  methods: {
    handleImport(data) {
      const value = data.value
      this.$emit("input", value);
      this.$emit('change')
    },
      /**
       * 错误提示
       * @param data
       * @param words
       * @returns {*}
       */
      formatError(data, words = '上传') {
        if (!data) {
          return this.removeColon(`请${words}${this.label}`);
        } else {
          return this.removeColon(`${data}${this.label}`);
        }
      },
  },
  directives: {
    hideBtn: {
      update(el,binding){
        if( el.firstChild && !binding.value) {
          el.firstChild.style.display ="none"
        }
      },
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/controlList/controlList.scss";
    .limit-hint{
      height: 43px;
      line-height: 43px;
      color: #868A97;
      font-size: 14px;
      position: absolute;
      left: 240px;
      white-space:nowrap;
    }
  ::v-deep .ty-upload-file {
    height: fit-content;
    .el-upload {
      .el-button {
        width: 100px;
        height: 36px;
        background: #026DFF;
        border-radius: 4px;
      }
    }
  }
  .item-line {
    position: relative;
    flex-wrap:nowrap;
    display: flex;
    &.flex-align-items {
      align-items: flex-start;
    }
    .item-label {
      height: 36px;
      line-height: 42px;
      padding-right: 10px;
      text-align: right;
      font-size: 14px;
      color: #868A97;
      white-space: nowrap;
      em {
        padding-left: 4px;
        color: #F56C6C;
        font-size: 14px;
      }
    }
  }
  .limit-world {
      height: 22px;
      line-height: 22px;
      width: 230px;
      text-align: right;
      color: #ccc;
      margin: 0px;
      font-size: 12px;
      // position: absolute;
      bottom: -17px;
      span {
        float: left;
        // margin-right: .16rem;
        color: #f00;
      }
    }
</style>
