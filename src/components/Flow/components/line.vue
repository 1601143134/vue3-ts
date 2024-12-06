<template>
  <g @click="onPathSelected(line)" :style="{zIndex: line.zIndex}">
    <path class="lines" :d="line.d" fill="none"></path>
  </g>
</template>

<script setup>
import { ref,reactive,onMounted,computed } from "vue"
const props = defineProps({
  line: Object
})
</script>

<style lang="less" scoped>

</style>
