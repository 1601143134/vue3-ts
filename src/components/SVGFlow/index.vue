<template>
  <div 
    ref="svgWrapperRef" 
    class="wrapper"
    @mousemove="throttleMove"
    @mousedown="onMousedown"
    @mouseup="onMouseup">
    <svg
      id="svgElement"
      ref="svgRef"
      class="svg-element"
      :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`"
      @wheel="handleWheel"
      width="100%"
      height="100%"
    >
      <node v-for="(n) in nodeArry" :key="n.id" :rect="n.rect" :type="n.type" :id="n.id"></node>

      <circle cx="500" cy="500" r="100" fill="salmon"></circle>
      <g>
        <rect x="100" y="100" width="280" height="180" rx="15" ry="15" fill="salmon" />
      </g>

      <ellipse cx="100" cy="100" rx="50" ry="50" fill="blue" stroke="black" stroke-width="2" />
    </svg>

    <!-- 工具栏 -->
    <div ref="toolBar" class="tool-bar" :style="{ 
      left: '0px',top: '0px',
      transform: `translate3d(${toolBarRect.x}px,${toolBarRect.y}px,0) scale(${1})`
      }">
      <div @mousedown="onToolMove" class="block">
        <div class="handle" />
      </div>
      <div 
        v-for="(item, index) in rectInfo" 
        :key="index" 
        @mousedown.stop="onToolBar(item)" 
        class="block" 
        :class="[ createType.type == item.type ? 'active' : '']">
        <div class="add-block">
          <img :src="requireImg(item.imgUrl)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 思考：坐标系放大，scale = 1.5 坐标原本1px的距离是不是也会跟着放大？
import { ref,reactive,onMounted,computed,watch } from "vue"
import { useElementBounding,useMagicKeys } from '@vueuse/core'
import node from './component/node.vue'
import circle from './component/circle.vue'
import { v4 as uuidv4 } from 'uuid'
defineOptions({
  name: 'SvgComponent',
})
const svgWrapperRef = ref(null);
const svgRef = ref(null)
const viewBox = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

let tempNode = null
let nodeArry = ref([
  {
    id: 'string',
    rect: {
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      rx: 15,
      ry: 15,
      fill: 'blue',
      cx: 200,
      cy: 200,
      r: 15,
    },
    type: 1,
  }
])

const setViewPort = () => {
  if (!svgWrapperRef.value) return;
  viewBox.value.width = svgWrapperRef.value.offsetWidth;
  viewBox.value.height = svgWrapperRef.value.offsetHeight;
};
onMounted(() => {
  setViewPort();
});
// 鼠标滚轮
const { ctrl, shift } = useMagicKeys()
let scale = 1, min = 0.2, max = 5, step = 30
function handleWheel(e) {
  e.preventDefault();
  if(shift.value) {
    if(e.deltaY > 0) {
      viewBox.value.x += (step * scale)
    }else{
      viewBox.value.x -= (step * scale)
    }
  }else if(!ctrl.value) {
    if(e.deltaY > 0) {
      viewBox.value.y += (step * scale)
    }else{
      viewBox.value.y -= (step * scale)
    }
  }else{
    zoomViewPort(e);
  }
  
}

function zoomViewPort(e) {
  let startClient = {
    x: e.clientX,
    y: e.clientY
  }
  // // 将屏幕坐标转换为 SVG 坐标
  let newSVGPoint = svgRef.value.createSVGPoint()
  newSVGPoint.x = startClient.x
  newSVGPoint.y = startClient.y

  let CTM = svgRef.value.getScreenCTM()
  let startSVGPoint = screen2svg(e.clientX, e.clientY)
  let r = 1.1
  if (e.deltaY < 0) {
    r = 1/1.1
  }
  const _scale = scale * r;
  if (_scale > max) {
    r = max / scale;  
    scale = max;
  } else if (_scale < min) {
    r = min / scale;  
    scale = min;
  } else {
    scale = _scale;
  }
  svgRef.value.setAttribute('viewBox', `${viewBox.value.x} ${viewBox.value.y} ${viewBox.value.width * r} ${viewBox.value.height * r}`)

  CTM = svgRef.value.getScreenCTM()
  let moveToSVGPoint = newSVGPoint.matrixTransform(CTM.inverse())

  let delta = {
    dx: startSVGPoint.x - moveToSVGPoint.x,
    dy: startSVGPoint.y - moveToSVGPoint.y
  }

  let middleViewBox = svgRef.value.getAttribute('viewBox').split(' ').map( n => parseFloat(n))
  updateViewPort(middleViewBox[0] + delta.dx, middleViewBox[1] + delta.dy, middleViewBox[2], middleViewBox[3]);
}

function updateViewPort(x,y,w,h) {
 viewBox.value.x = x 
 viewBox.value.y = y 
 viewBox.value.width = w 
 viewBox.value.height = h 
}

// 鼠标点击操作
const onMousedown = (e) => {
  console.log('onMousedown')
  startPoint.value.x = e.clientX;
  startPoint.value.y = e.clientY;
  if(isOnCreate.value) {
    isAddNew.value = true
    nodeArry.value.push(createNode())
    console.log(nodeArry.value[nodeArry.value.length - 1])
    tempNode = nodeArry.value[nodeArry.value.length - 1]
  }
}

const onMouseup = (e) => {
  if(toolHandleMove.value) toolHandleMove.value = false

  if(isOnCreate.value && isAddNew.value) {
    // 检验是否创建模式 按下 并没有移动鼠标设置大小
    if(!isDraw.value) {
      // const node = nodeArry.value[nodeArry.value.length - 1]
      // if(node.rect.width == 0 && node.rect.height == 0) {
      //   nodeArry.value.splice(nodeArry.value.length - 1, 1)
      // }
      nodeArry.value.splice(nodeArry.value.length - 1, 1)
      console.log('删除无效node')
    }
    isDraw.value = false
    isAddNew.value = false
  }
  
}

// 移动
const move = (e) => {
  e.preventDefault();
  let _h = svgWrapperRef.value.offsetHeight 
  let _w = svgWrapperRef.value.offsetWidth
  lastPoint.value.x = e.clientX
  lastPoint.value.y = e.clientY
  // 创建图形
  if(isOnCreate.value && isAddNew.value) {
    if(!isDraw.value) isDraw.value = true
    let start = screen2svg(startPoint.value.x, startPoint.value.y)
    const {x, y, w, h} = generateSize(start.x, start.y, e)
    switch(createType.value.type) {
      case 1: 
        // 圆角矩形
        tempNode.rect.x = x
        tempNode.rect.y = y
        tempNode.rect.width = w
        tempNode.rect.height = h
        tempNode.rect.rx = 15
        tempNode.rect.ry = 15
        break
      case 2: 
        // 圆形，设置圆心、半径
        tempNode.rect.cx = x + (w/2)
        tempNode.rect.cy = y + (h/2)
        tempNode.rect.rx = w/2
        tempNode.rect.ry = h/2
        break
        
    }
    
  }
  // 移动工具栏
  else if(toolHandleMove.value) {
    let left = e.clientX - toolBarRect.value.ox
    let top = e.clientY - toolBarRect.value.oy
    left = Math.min(Math.max(0,left),_w - toolBar.value.offsetWidth) // 左右边界
    top = Math.min(Math.max(0,top),_h - toolBar.value.offsetHeight)   // 上下边界
    toolBarRect.value.x = left
    toolBarRect.value.y = top
  }
}
const throttleMove = throttle(move, 10)

// 工具栏
let startPoint = ref({x: 0, y: 0})
let lastPoint = ref({x: 0, y: 0})
let toolBarRect = ref({x: 1000, y: 35, ox: 0,oy: 0})
let toolHandleMove = ref(false)
let toolBar = ref(null)
let createType = ref({
  name: '',
  type: null,
  imgUrl: ''
})
let isOnCreate = ref(false)  // 选择创建类型
let isAddNew = ref(false)    // 已添加了图形，未开始绘制
let isDraw = ref(false)
const onToolMove = (e) => {
  e.preventDefault()
  toolHandleMove.value = true
  toolBarRect.value.ox = e.clientX - (toolBarRect.value.x)
  toolBarRect.value.oy = e.clientY - (toolBarRect.value.y)
}

// 选择创建类型
const onToolBar = (type) => {
  if(type.type !== createType.value.type) {
    isOnCreate.value = true
    return createType.value = type
  }
  isOnCreate.value = false
  createType.value = {name: '',type: null,imgUrl: ''}
  
}
// vue3 + vite 动态引入图片方式
const requireImg = (name) => {
  return new URL(`/src/assets/${name}`, import.meta.url).href
}
let rectInfo = ref([
  {
    name: '圆角矩形',
    type: 1,
    imgUrl: 'juxing.png',
  },
  {
    name: '圆形',
    type: 2,
    imgUrl: '圆形.png'
  },
])

// 屏幕坐标转svg坐标
function screen2svg(x, y) {
  let newSVGPoint = svgRef.value.createSVGPoint()
  newSVGPoint.x = x
  newSVGPoint.y = y
  let CTM = svgRef.value.getScreenCTM()
  let startSVGPoint = newSVGPoint.matrixTransform(CTM.inverse())
  return startSVGPoint
}

// 生成图形大小及坐标
function generateSize(ox,oy,e) {

  let curPos = screen2svg(e.clientX, e.clientY)
  //div 的left和top：如果鼠标当前位置>鼠标起始位置，则为鼠标起始位置（鼠标往右拉）；如果鼠标当前位置<鼠标起始位置，则为鼠标当前位置(鼠标往左拉)
  let x = Math.min(ox,curPos.x) 
  let y = Math.min(oy,curPos.y) 

  //通过当前坐标x/y-鼠标起始坐标x/y得到要生成的div的宽度 ，如果往左拉，鼠标当前坐标-起始坐标可能为负数，所以，需要使用绝对值函数Math.abs()
  let w = Math.abs(curPos.x - ox)
  let h = Math.abs(curPos.y - oy) 
  return {x, y, w, h}
}

function throttle(fn, delay = 18) {
  let timer = Date.now()
  return function () {
    if((+new Date()) - timer >= delay){
      timer = Date.now()
      fn.apply(this,arguments)
    }
  }
}

function createNode() {
  const { x,y } = screen2svg(startPoint.value.x, startPoint.value.y)
  return {
    id: createType.value.name + uuidv4(),
    rect: {
      x,
      y,
      width: 0,
      height: 0,
      rx: 0,
      ry: 0,
      fill: 'transparent',
      cx: 0,
      cy: 0,
      r: 0,
      stroke: 'salmon',
      strokeWidth: 3
    },
    type: createType.value.type,
  }
}

</script>

<style lang="less" scoped>
.wrapper{
  overflow: hidden;
  // height: 80%;
  // width: 80%;
  height: 100%;
  position: relative;
  background-color: rgb(250,250,250);
  background: radial-gradient(circle at 1px 1px,rgb(201, 201, 202) 2px,rgb(243,243,245) 0); 
  background-size: 49.5px 49.5px; 
  .svg-element{
    width: 100%;
    height: 100%;
  }
  .tool-bar{
    position: fixed;
    background-color: #fff;
    box-shadow: 0px 6px 20px rgba(25,25,26,.06), 0px 2px 12px rgba(25,25,26,.04);
    min-width: 200px;
    height: 52px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 8px 20px;
    .block{
      width: 40px;
      height: 40px;
      margin-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      &.active{
        background-color: rgb(233, 231, 231);
      }
      .handle{
        width: 28px;
        height: 28px;
        background: url('./img/拖动.png') no-repeat;
        background-size: contain;
        cursor: move;
      }
      .add-block{
        width: 32px;
        height: 32px;
        cursor: pointer;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
