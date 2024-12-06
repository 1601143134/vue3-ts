<template>
  <div class="image-wrapper">
    <img ref="img" src="@/assets/img/1232.png">
  </div>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted,computed } from "vue"
let img = ref(null)
let scale = 1
let preScale = 1
onMounted(() => {
  img.value.addEventListener('load', function () {
    console.log(1)
  })

  img.value.addEventListener('wheel', (e: MouseEvent) => {
    let ratio = 1.1;
    // 缩小
    if (e.deltaY > 0) {
        ratio = 1 / 1.1;
    }

    preScale = scale
    let x = 0, y = 0


    
    const _scale = scale * ratio;

    scale = _scale

    /**
      记录鼠标在图片的起始位置，
      计算放大后的位置
      计算偏移量

      200 200 * 1.5
  
     */

     // 放大后的鼠标在图片内的位置，不乘scale，那么获取的位置永远都是原始大小的offset
     let originX = e.offsetX * scale
     let originY = e.offsetY * scale

     

     let scaleX = originX * _scale
     let scaleY = originY * _scale

     console.log('放大倍数：' + _scale)
     console.log('起始位置：' + originX, originY)
     console.log('放大位置：' + scaleX, scaleY)

     console.log('偏移量：' + x, y)
     console.log('')

    x -= e.offsetX * ((_scale / preScale) - 1)
    y -= e.offsetY * ((_scale / preScale) - 1)

     img.value.style.transform = `translate3d(${x}px,${y}px,0) scale(${_scale}) `
    //  img.value.style.transform = `scale(${_scale})`


  })
})

</script>

<style lang="less" scoped>
.image-wrapper{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    width: 500px;
    height: auto;
    transform-origin: 0 0;
  }
}
</style>
