<template>

  <div class="re-wrapper">
    <!-- <div class="wheel"></div> -->
    <img src="../../assets/img/4k.jpg" alt="" class="wheel">
    <div class="info">

    </div>
  </div>
</template>
<!-- 缩放 -->
<script setup lang="ts">
import { ref,reactive,onMounted,computed } from "vue"
let scale = 1
let maxScale = 5
let minScale = 0.5
let image, rect, x = 0, y = 0
onMounted(() => {
  image = document.querySelector('.wheel')
  rect = image.getBoundingClientRect()
  // x = (window.innerWidth - rect.width) * 0.5;
  // y = (window.innerHeight - rect.height) * 0.5;
  const wheel: HTMLElement = document.querySelector('.wheel')
  wheel.addEventListener('wheel', (e: MouseEvent) => {
    let d = e.deltaY < 0 ? 0.1 : -0.1;
    let ratio = 1 + d;
    console.log(rect,'rect-')
    let temp_scale = scale * ratio;
    if (temp_scale > maxScale) return
    if (temp_scale < minScale) return
    scale = temp_scale

    if (e.target.tagName === "IMG") {
      const max = {
        x: (d * rect.width) / 2,
        y: (d * rect.height) / 2,
      };
      const mouseOffset = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y
      }
      // 计算每次的偏移量
      x -= d * (mouseOffset.x - x) - max.x;
      y -= d * (mouseOffset.y - y) - max.y;
      image.style.transform = "translate3d(" + x + "px, " + y + "px, 0) scale(" + scale + ")";
    }
    e.preventDefault();
    // let ratio = 1.1
    // if(evt.deltaY > 0) {
    //   ratio = 1 / 1.1;
    // }
    // scale = scale * ratio
    
    // // 
    // // console.log(,'evt-')
    // console.log(evt.clientX,evt.clientY,'x-y')
    // console.log(evt.clientX * ratio, evt.clientY * ratio,' * ratio')
    // const ratioX = (evt.clientX * ratio) - evt.clientX
    // const ratioY = (evt.clientY * ratio) - evt.clientY
    // // wheel.style.transform = `translate(${-ratioX}px,${-ratioY}px)  scale(${scale.toFixed(5)})`
    // wheel.style.transform = `scale(${scale.toFixed(5)})`
  })
})
const modalShow = ref<Boolean>(false)
const viewWrapper = ref<HTMLElement | null>(null)
let originPos = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
}
const target = {
  w: 800,
  h: 400
}
const afterLeave = () => {
  viewWrapper.value.classList.remove('move')
  viewWrapper.value.style.transform = `translate(${0}px, ${0}px)`
}
const close = () => {
  viewWrapper.value.style.width = originPos.w + 'px'
  viewWrapper.value.style.height = originPos.h + 'px'
  viewWrapper.value.style.transform = `translate(${originPos.x}px, ${originPos.y}px)`
  modalShow.value = false
}

const toggleScale = (evt: MouseEvent): void => {
  const viewRect = {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  }
}
</script>

<style lang="less" scoped>
.mycss-enter-from,
.mycss-leave-to{
  opacity: 0;
}
.mycss-enter-active,
.mycss-leave-active{
  transition: opacity .4s ease;
}
.move{
  // transition: width .4s, height .4s, transform .6s cubic-bezier(.18,.23,.12,.99);
  // 设置不同的时间，动画的轨迹会有差别  
  // transition: width .4s, height .4s, transform .4s ease; 
  transition: width .4s, height .4s, transform .4s cubic-bezier(.12,.41,.23,.9); 
}
.re-wrapper{
  width: 1000px;
  height: 600px;
  margin: 0 auto;
  // border: 1px solid salmon;
  padding: 10px;
  .wheel{
    width: 500px;
    // height: 300px;
    transform-origin: 0 0; // 左上角
    border: 1px solid sandybrown;
    // background: url('../../../img/1232.png') no-repeat;
    // background-size: contain;
  }



  .list{
    display: flex;
    flex-wrap: wrap;
    .item{
      height: 50px;
      width: 50px;
      border-radius: 5px;
      border: 1px solid seagreen;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .modal{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .view-wrapper{
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    border: 1px solid slategray;
    border-radius: 5px;
    z-index: 999;
    width: 50px;
    height: 50px;    
    .view-content{
      width: 800px;
      height: 400px;
      background-color: #fff;
    }
  }
}
</style>
