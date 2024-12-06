<template>
  <div class="container">
    12323213
    <img ref="img" src="../../assets/img/4k.jpg" alt="">
  </div>
</template>

<script setup>
import { ref,reactive,onMounted,computed } from "vue"
const img = ref(null)
function getImgSize(naturalWidth, naturalHeight, maxWidth, maxHeight) {
    // maxwidth\height 屏幕宽高
    // natualwidth height img宽高
    debugger
    const imgRatio = naturalWidth / naturalHeight;
    const maxRatio = maxWidth / maxHeight;
    console.log(imgRatio,maxRatio,'imgRatio---maxRatio')
    let width, height;
    // 如果图片实际宽高比例 >= 显示宽高比例
    if (imgRatio >= maxRatio) {
        // 图宽 > 屏宽
        if (naturalWidth > maxWidth) {
            width = maxWidth;
            // maxWidth / naturalWidth 求出缩小的比率 * naturalHeight 得出换算后的高度：即等比例缩小
            height = maxWidth / naturalWidth * naturalHeight;
        } else {
            width = naturalWidth;
            height = naturalHeight;
        }
    } else {
        if (naturalHeight > maxHeight) {
            width = maxHeight / naturalHeight * naturalWidth;
            height = maxHeight;
        } else {
            width = naturalWidth;
            height = naturalHeight;
        }
    }
    return { width: width, height: height }
}
onMounted(() => {
  img.value.addEventListener('load', () => {
    let result = getImgSize(img.value.naturalWidth, img.value.naturalHeight, window.innerWidth, window.innerHeight);

    img.value.style.width = result.width + 'px';
    img.value.style.height = result.height + 'px';
  })


})
</script>

<style lang="less" scoped>
.container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, .5);
    overflow: hidden;
    img{
      position: absolute;
      width: 500px;
      transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s; 
    }
}

</style>
