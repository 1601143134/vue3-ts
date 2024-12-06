<template>
  <div class="view">
    <div class="modal">
      <img id="viewImg" src="../../assets/img/4k.jpg" alt="测试">
    </div>
  </div>
</template>

<script setup>
import { ref,reactive,onMounted,computed } from "vue"
let scale = 1
const transform = {
  x: 0,
  y: 0,
};
onMounted(() => {
  const viewImg = document.querySelector('#viewImg')
  viewImg.addEventListener('wheel', (e) => {
    const { width, height } = viewImg.getBoundingClientRect();
    // 图片中心点
    let ratio = 1.1;
    if (e.deltaY > 0) {
      ratio = 1 / 1.1;
    }

    // viewImg.style.transform = 'translate3d(' + transform.x + 'px, ' + transform.y + 'px, 0) scale(' + scale + ')';


  })
})
</script>

<style lang="less" scoped>
.view{
  position: relative;
  width: 100%;
  height: 100%;
  .modal{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 500px;
    }
  }
}
</style>
