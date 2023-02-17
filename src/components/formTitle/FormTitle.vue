<template>
  <div class="form-title-container">
    <div :class="['form-title']">
      <span
        :class="['title']"
        :style="{color: titleColor}"
        >
        {{title}}
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "form-title",
    props: {
      //标题
      title: {
        type: String,
        default: '基本信息'
      },
      // 标题字体颜色
      titleColor: {
        type: String,
        default: '#333333'
      },
    },
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

  .form-title-container {
    height: 50px;
    .form-title {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
</style>
