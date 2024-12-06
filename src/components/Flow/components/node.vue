<template>
  <div 
    ref="element"
    :id="node.id" 
    :style="{ 
      width: node.width + 'px',
      height: node.height + 'px',
      left: '0px',
      top: '0px',
      zIndex: node.zIndex,
      transform: `translate3d(${node.x}px,${node.y}px,0) scale(${1})`
    }"
    class="node"
    :class="{ selected: isActive }"
    @mousedown.stop="pointDown"
    @mouseup="pointUp"
    @mouseleave="onMouseleave"
    draggable="true">
    <div class="content">
      <span>盒子：{{ node.name }}</span>
    </div>
    <!-- 连线操作条 -->
    <div @mousedown.stop="barDown($event, 'left')" class="left bar"></div>
    <div @mousedown.stop="barDown($event, 'right')" class="right bar"></div>
    <div @mousedown.stop="barDown($event, 'top')" class="top bar"></div>
    <div @mousedown.stop="barDown($event, 'bottom')" class="bottom bar"></div>

    <!-- 宽高操作点 -->
     <template v-if="activityNodeIds.length == 1">
      <div draggable="true" @mousedown.stop="resize($event, '1')" :class="{ hidden: !isActive }" class="circle left-top"></div>
      <div draggable="true" @mousedown.stop="resize($event, '2')" :class="{ hidden: !isActive }" class="circle right-top"></div>
      <div draggable="true" @mousedown.stop="resize($event, '3')" :class="{ hidden: !isActive }" class="circle left-bottom"></div>
      <div draggable="true" @mousedown.stop="resize($event, '4')" :class="{ hidden: !isActive }" class="circle right-bottom"></div>
     </template>
    
  </div>
</template>

<script setup>
import { ref,reactive,onMounted,computed,defineEmits,getCurrentInstance } from "vue"
const regex = /translate3d\((\d+)\s*px,\s*(\d+)\s*px,/;
const emits = defineEmits([
  'lineStart', 
  'lineMove', 
  'lineEnd',
  'activityNode',
  'getNodeDom',
  'cancelMove',
  'nodeResize'
])

// 点击高亮
const isActive = computed(() => props.activityNodeIds.includes(props.node.id))
const nodeIns = getCurrentInstance()
const props = defineProps({
  zIndex: Number,
  left: Number,
  top: Number,
  width: Number,
  height: Number,
  nodeArray: Array,
  wrapper: Object,
  node: Object,
  flowDraw: Object,
  isCtrl: Boolean,
  activityNodeIds: Array
})
let down = false, id = ref(''), element = ref(null)
let offset = { x: 0, y: 0 }, nodesInView = [], curTarget = null, allPoints = []

const conor = ['左上角','右上角','左下角','右下角','中心点',]

const resize = (e, type) => {
  e.preventDefault();
  const params = {
    nodeId: props.node.id,
    x: e.clientX,
    y: e.clientY,
    type
  }
  emits('nodeResize', params)
  console.log(type,'type')
}

// 线条按下
const barDown = (e,type) => {
  console.log('线条按下')
  e.preventDefault()
  const x = e.clientX + props.wrapper.scrollLeft  - props.wrapper.getBoundingClientRect().left
  const y = e.clientY + props.wrapper.scrollTop - props.wrapper.getBoundingClientRect().top
  // 获取x, y 
  const params = {
    id: 'line' + (+new Date()),
    x,
    y,
    d: `M${x},${y}`,
    startDir: type,  // 起始node的边
    targetDir: '',   // 目标node的边
    beginNode: props.node.id,
    targetNode: null, // 线条终点Node
    position: {
      begin: { x:0,y:0 },
      end: { x:0,y:0 },
      d: ''
    },   // 线条位置信息
    begin: { x:0,y:0 },
    end: { x:0,y:0 },
  }
  emits('lineStart', params, props.node)
}

const cl = () => {
  console.log(3333)
}
// 按下
function pointDown(e, type) {
  console.log('pointDown')
  e.preventDefault()
  offset.x = e.clientX - (props.node.x - props.wrapper.scrollLeft)
  offset.y = e.clientY - (props.node.y - props.wrapper.scrollTop)
  down = true
  emits('activityNode', {
    nodes:props.node,
    offsetXY: offset,
    nodeId: props.node.id
  })
}


// 松开
function pointUp(e) {
  handleLeave()
  emits('cancelMove')
}

const onMouseleave = () => {
  console.log('onMouseleave')
  handleLeave()
}

const handleLeave = () => {
  if (down) {
    down = false;
    curTarget = null
    nodesInView = []
    console.log(props.nodeArray)
  }
}

// 是否在可视区域内
function isInterect(node) {  
  return (node.left <= window.innerWidth + props.wrapper.scrollLeft) && (node.top <= window.innerHeight + props.wrapper.scrollTop)
}

function getPoints(rect) {
  return [
    { x: rect.x, y: rect.y }, // 左上角
    { x: rect.x + rect.width, y: rect.y },          // 右上角
    { x: rect.x, y: rect.y + rect.height },         // 左下角
    { x: rect.x + rect.width, y: rect.y + rect.height }, // 右下角
    { x: rect.x + (rect.width / 2), y: rect.y + (rect.height / 2) }, // 中心点
  ];
}
</script>

<style lang="less" scoped>
.node{
  position: absolute;
  top: 200px;
  left: 500px;
  // border: 1px solid black;
  user-select: none;
  // transition: left top .1s linear;
  background-color: transparent;
  transform-origin: -50% -50%;
  cursor: move;
  // padding: 10px; 
  border-radius: 3px;
  background: #ffffff;
  box-shadow:  0 0 2px 0 rgb(0 0 0 / 10%),
    0 2px 4px 0 rgb( 0 0 0 / 10%);
    // transition: transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s; 
  // overflow: hidden;  
  .content{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .bar{
    cursor: pointer;
    position: absolute;
    z-index: 99;
    // background-color: #fff;
    background-color: rgba(0,0,0,0);
  }
  .top{
    width: calc(100% - 2px);
    height: 10px;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
  }
  .bottom{
    width: calc(100% - 2px);
    height: 10px;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
  }
  .left{
    width: 10px;
    height: calc(100% - 2px);
    left: -1px;
    top: 50%;
    transform: translateY(-50%);
  }
  .right{
    width: 10px;
    height: calc(100% - 2px);
    right: -1px;
    top: 50%;
    transform: translateY(-50%);
  }
  .circle {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 1px solid rgb(20, 123, 227);
    position: absolute;
    background: #fff;
    z-index: 99;
  }
  .left-top{
    top: 0;
    left: 0;
    transform: translate(-50%,-50%);
    cursor: se-resize;
  }
  .right-top{
    top: 0;
    right: 0;
    transform: translate(50%,-50%);
    cursor: ne-resize;
  }
  .left-bottom{
    bottom: 0;
    left: 0;
    transform: translate(-50%,50%);
    cursor: ne-resize;
  }
  .right-bottom{
    bottom: 0;
    right: 0;
    transform: translate(50%,50%);
    cursor: se-resize;
  }
}
.selected{
  border: 1px solid rgb(20, 123, 227);
  // background-color: rgb(86, 155, 225);
}
.hidden{
  display: none;
}
</style>
