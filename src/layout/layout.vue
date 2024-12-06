<template>
  <div class="layout">
    <!-- <h2>header</h2> -->
    
    <slot></slot>

    <!-- <h2>footer</h2> -->
  </div>
</template>

<script setup>
import { ref,reactive,onMounted,computed } from "vue"
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
</script>

<style lang="less" scoped>
.layout{
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  position: relative;

  // display: flex;
  // justify-content: center;
  // align-content: center;

}
</style>
