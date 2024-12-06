<template>
  <g>
    <rect 
      v-if="type == 1" 
      :x="rect.x" 
      :y="rect.y" 
      :width="rect.width" 
      :height="rect.height" 
      :rx="rect.rx" 
      :ry="rect.rx" 
      :fill="rect.fill"
      :stroke="rect.stroke"
      :stroke-width="rect.strokeWidth"></rect>
    <ellipse
     v-if="type == 2" 
     :cx="rect.cx" 
     :cy="rect.cy" 
     :rx="rect.rx" 
     :ry="rect.ry" 
     :fill="rect.fill"
     :stroke="rect.stroke"
     :stroke-width="rect.strokeWidth"></ellipse>
  </g>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted,computed } from "vue"
interface Rect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
  fill?: string;
  cx: number;
  cy: number;
  r: number;
  type: number;
}
interface Circle {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
}

interface Graphic {
  rect: Rect;
  type: number;
  id: string;
}

const props = defineProps<Graphic>()



</script>

<style lang="less" scoped>

</style>
