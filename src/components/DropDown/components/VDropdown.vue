<template>
  <div class="v-dropdown">
    <div class="v-input">
      <input readonly :placeholder="placeholder" class="v-option-input" type="text">
      <span class="v-inpt-suffix"><i class="v-icon el-icon-arrow-down"></i></span>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted,useAttrs,computed,defineOptions,defineProps,withDefaults,defineModel } from "vue"
defineOptions({
  name: 'VDropdown',
  // 可以使用 useAttrs() 来获取透传的属性方法
  inheritAttrs: true // 默认继承透传 父组件中没有 被 props 声明的属性；当设置为false 时 age属性不会显示在子组件的 attributes 中
})
const props = withDefaults(defineProps<{
  placeholder?: string
}>(),{
  placeholder: '请选择'
})
</script>

<style lang="less" scoped>
.v-dropdown{
  padding-left: 10px;
  padding-right: 40px;
  border: 1px solid salmon;
  border-radius: 5px;
  width: 240px;
  .v-input{
    width: 100%;
    position: relative;
    .v-option-input{
      outline: 0;
      border: 0;
      height: 40px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .v-inpt-suffix{
      position: absolute;
      right: -40px;
      .v-icon{
        display: inline-block;
        height: 100%;
        line-height: 40px;
        width: 40px;
      }
    }
  }
}
</style>
