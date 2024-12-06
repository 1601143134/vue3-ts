<template>
  <div class="">
    <slot></slot>

    <!-- <template> -->
      <span>556</span>
      <!-- <MyComponent :item="'name'" :model="props.model"></MyComponent> -->
      <testItem :item="'name'" :model="props.model"></testItem>
      <!-- <MyTsxTest :item="'name'" :model="props.model"></MyTsxTest> -->
    <!-- </template> -->
  </div>
</template>

<script setup>
import MyComponent from './components/test-item.ts'
import testItem from "./components/test-item.vue";
import MyTsxTest from './components/testTsx.tsx'
import { ref,reactive,onMounted,computed,defineProps, provide } from "vue"
const props = defineProps({
  model: Object
})

const columns = ref([])

provide('columns', columns.value)
</script>

<style lang="less" scoped>

</style>
