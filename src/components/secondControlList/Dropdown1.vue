<template>
    <!-- 下拉菜单控件 -->
    <div>
        <div :class="['item-line','mb22',{'flex-align-items': !allowUpdate}]">
            <!-- 一级label START -->
            <div class="item-label" v-if="label" :style="labelStyle">
                <div>
                    <em v-if="!allowNull">*</em>
                    <span>{{`${label}：`}}</span>
                </div>
                <slot name="label"></slot>
            </div>
            <template >
              <hyit-select
              v-bind="$getModule('person')"
              menuType="pop"
              v-model="personIds"
              :placeholder="placeholderText"
              :name="personName"
              :multiple="true"
              @visible-change="visibleChange($event)"
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
              @change="changeValue()"
              ></hyit-select>
      
              <p
                class="limit-world"
                v-if="formErrorMsg"
                :style="{marginLeft: labelStyle.width}"
              >
                <span>{{formatError(formErrorMsg,'选择')}}</span>
              </p>
            </template>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import secondCtlMixins from '@/assets/js/mixins/secondCtlMixins';

  export default {
    name: 'dropdown',
    props: {
      //值
      value: {
        type: [String,Array],
        default: "",
      },
      personName: {
        type: String,
        default: "",
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      //错误提示
      formErrorMsg: {
        type: [String, Boolean],
        default: ''
      },
    },
    mixins: [secondCtlMixins],
    data() {
      return {
        personIds:''
      }
    },
    computed: {
      placeholderText() {
        return this.placeholder ? this.placeholder : this.label ? `请选择${this.removeColon(this.label)}` : '';
      },
    },
    watch: {

      value: {
        immediate: true,
        handler(val) {
          if (val) {
            this.personIds =val;
            this.onBlur();
          }
        }
      },
      personIds(val){
        this.$emit("update:value",val)
      }
    },
    methods: {
      visibleChange(callback,vc) {
        if(!callback) {
          this.onBlur();
        }
      },
      changeValue() {
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
      formatError(data, words = '填写') {
        if (!data) {
          return this.removeColon(`请${words}${this.label}`);
        } else {
          return this.removeColon(`${data}${this.label}`);
        }
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/less">
    @import "~@/assets/styles/controlList/controlList.scss";
    .mb22 {
        margin-bottom: 22px;
    }
    .item-line {
        position: relative;
        flex-wrap:wrap;
        display: flex;
        align-items: center;
        &.flex-align-items {
            align-items: flex-start;
        }
        .item-label {
            padding-right: 10px;
            text-align: right;
            font-size: 14px;
            color: #868A97;
            em {
                padding-left: 4px;
                color: #F56C6C;
                font-size: 14px;
            }
        }
        ::v-deep .el-select{
            flex: 1;
            .el-input {
                width: 100%;
            }
            // width: 230px;
        }
        .item-readonly {
            text-align: left;
            font-size: 14px;
            color: #333333;
        }
        .limit-world {
            width: 230px;
            text-align: right;
            color: #ccc;
            margin: 0px;
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
