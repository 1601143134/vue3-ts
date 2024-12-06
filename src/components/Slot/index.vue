<template>
  <div class="">
    <Son>
      <template #header="info">
        <h1>{{ info }}</h1>
      </template>
    </Son>


    
  </div>
</template>

<script setup>
import Son from './components/Son.vue'
import { ref,reactive,onMounted,computed } from "vue"
const data = ref({
  message:1
})

const info = '123'
</script>

<style lang="less" scoped>

</style>
