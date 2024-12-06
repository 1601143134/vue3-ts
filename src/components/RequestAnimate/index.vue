<template>
  <div class="re-wrapper">
    <div class="list">
      <div v-for="(item,index) in 50" @click="toggleScale" :key="index" class="item">{{ item }}</div>
    </div>

    <transition name="mycss" @after-leave="afterLeave">
      <div v-show="modalShow" class="modal"></div>
    </transition>
    
    <div ref="viewWrapper" class="view-wrapper">
      <div @click="close" class="view-content">
        哈哈哈哈
      </div>
    </div>
  </div>
</template>
<!-- 缩放 -->
<script setup lang="ts">
import { ref,reactive,onMounted,computed } from "vue"
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
  const itemRect = evt.target.getBoundingClientRect()
  const { clientHeight, clientWidth } = evt.target
  originPos = {
    x: itemRect.left,
    y: itemRect.top,
    w: clientWidth,
    h: clientHeight,
  }
  // 设置wrapper初始宽高
  viewWrapper.value.style.width = clientWidth + 'px'
  viewWrapper.value.style.height = clientHeight + 'px'
  viewWrapper.value.style.transform = `translate(${itemRect.left}px, ${itemRect.top}px)`
  // 设置偏移点
  const screenCenter = {
    x: (viewRect.width / 2) - (target.w / 2),
    y: (viewRect.height / 2) - (target.h / 2)
  }

  requestAnimationFrame(() => {
    modalShow.value = true
    viewWrapper.value.classList.add('move')
    // 设置放大宽高和偏移位置
    viewWrapper.value.style.width = target.w + 'px'
    viewWrapper.value.style.height = target.h + 'px'
    viewWrapper.value.style.transform = `translate(${screenCenter.x}px, ${screenCenter.y}px)`
  })
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
  transition: width .4s, height .4s, transform .4s ease; 
  // transition: width .4s, height .4s, transform .4s cubic-bezier(.12,.41,.23,.9); 
}
.re-wrapper{
  width: 1000px;
  height: 800px;
  margin: 0 auto;
  border: 1px solid salmon;
  padding: 10px;
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
