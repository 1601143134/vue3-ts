<template>
  <div class="v-option">
  </div>
</template>

<script setup>
import { ref,reactive,onMounted,computed,defineOptions } from "vue"
defineOptions({
  name: 'VOptions'
})
</script>

<style lang="less" scoped>
.v-option{
  .v-option-input{
    outline: 0;
  }
}
</style>
