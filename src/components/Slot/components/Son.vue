<template>
  <div class="">
    <slot name="header" info="来自son的数据"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
import { ref,reactive,onMounted,computed } from "vue"

</script>

<style lang="less" scoped>

</style>
