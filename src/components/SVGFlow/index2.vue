<template>
  <div 
    ref="svgWrapperRef" 
    class="wrapper"
    @mousemove="throttleMove"
    @mousedown="onMousedown"
    @mouseup="onMouseup">
    <div @click="findFixPoint" ref="ball" class="ball"></div>
    <svg
      id="svgElement"
      ref="svgRef"
      class="svg-element"
      :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`"
      @wheel="handleWheel"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 定义箭头标记 -->
      <defs>
        <!-- 起点箭头 -->
        <marker id="startArrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
          <path d="M10 0 L0 5 L10 10 Z" fill="black" />
        </marker>
        <!-- 终点箭头 -->
        <marker id="endArrow" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="black" />
        </marker>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 Z" fill="black" />
    </marker>
      </defs>
      <node 
        v-for="(n) in nodeArry" 
        :key="n.id" 
        :rect="n.rect" 
        :type="n.type" 
        :id="n.id"
        @click="onClickNode(n)"
        @mouseover="onHoverNode(n)"
        @mouseleave="onMouseleaveNode(n)"></node>
   
      <g :transform="resizeRotate" @mousedown.stop="onResize" v-if="isResize" class="top">
        <rect :x="resizeBox.x" :y="resizeBox.y" :width="resizeBox.w" :height="resizeBox.h" fill="none" stroke="rgb(20, 123, 227)"></rect>
        <rect dir="lt" :x="resizeBox.x - (10/2)" :y="resizeBox.y - (10/2)" width="10" height="10" fill="white" stroke="rgb(20, 123, 227)" class="left-top"></rect>
        <rect dir="rt" :x="resizeBox.x + resizeBox.w - (10/2)" :y="resizeBox.y - (10/2)" width="10" height="10" fill="white" stroke="rgb(20, 123, 227)" class="right-top"></rect>
        <rect dir="rb" :x="resizeBox.x + resizeBox.w - (10/2)" :y="resizeBox.y + resizeBox.h - (10/2)" width="10" height="10" fill="white" stroke="rgb(20, 123, 227)" class="right-bottom"></rect>
        <rect dir="lb" :x="resizeBox.x - (10/2)" :y="resizeBox.y + resizeBox.h - (10/2)" width="10" height="10" fill="white" stroke="rgb(20, 123, 227)" class="left-bottom"></rect>
        <rect dir="rotate" :x="resizeBox.x - 20" :y="resizeBox.y - 20" width="10" height="10" fill="salmon"></rect>
      </g>

      <!-- line -->
      <!-- <g>
        <circle cx="500" cy="500" r="100" fill="salmon"></circle>
        <circle cx="500" cy="500" r="100" fill="salmon"></circle>
        <circle cx="500" cy="500" r="100" fill="salmon"></circle>
        <circle cx="500" cy="500" r="100" fill="salmon"></circle>
      </g> -->
         <!-- <polygon points="100,20 120,100 100,180 50,100" fill="none" stroke="black" stroke-width="2" /> -->
      <!-- <circle cx="500" cy="500" r="100" fill="salmon"></circle>
      <rect x="100" y="100" width="280" height="180" rx="15" ry="15" fill="salmon" />
      <ellipse cx="100" cy="100" rx="50" ry="50" fill="blue" stroke="black" stroke-width="2" /> -->
      <!-- <rect x="50" y="50" width="100" height="100" fill="blue"
        transform="rotate(45, 100, 100)" /> -->
        <!-- <polygon points="0,0 5,20 0,40" transform="rotate(90 50 50)" fill="black"/> -->
      <!-- resize -->
    </svg>

    <!-- 工具栏 -->
    <div 
      ref="toolBar" 
      class="tool-bar" 
      :style="{ 
        left: '0px',top: '0px',transform: `translate3d(${toolBarRect.x}px,${toolBarRect.y}px,0) scale(${1})`
      }">
      <div @mousedown="onToolMove" class="block">
        <div class="handle" />
      </div>
      <div 
        class="block" 
        v-for="(item, index) in rectInfo" 
        :key="index" 
        :class="[ createType.type == item.type ? 'active' : '']"
        @mousedown.stop="onToolBar(item)">
        <div class="add-block">
          
          <img v-if="item.imgUrl" :src="requireImg(item.imgUrl)" />
          <svg v-else>
            <path :d="item.d" fill="none" stroke="rgb(108,109,110)" stroke-width="2"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 连线框：鼠标移入时出现 -->
    <div class="connect-box">
      <div class="top-c"></div>
      <div class="right-c"></div>
      <div class="bottom-c"></div>
      <div class="left-c"></div>
    </div>

    <div class="rotate"></div>
  </div>
</template>

<script setup>
// 思考：坐标系放大，scale = 1.5 坐标原本1px的距离是不是也会跟着放大？
import { ref,reactive,onMounted,computed,watch } from "vue"
import { useElementBounding,useMagicKeys } from '@vueuse/core'
import node from './component/node.vue'
import circle from './component/circle.vue'
import { v4 as uuidv4 } from 'uuid'
import { 
  lineAngle,
  radianToAngle,
  lineRadian,
  rotate,
  distance,
  angleToRadian,
  midpoint,
  getIncreaseSize } from "./utils/helper"
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
let nodeArry = ref([])
// 设置大小
let isResize = ref(false)
let resizeDirection = ''
let resizePoint = { x: 0,y: 0 }
let resizeBox = ref({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  r: 0
})
// let resizeRotate = computed(() => {
//   return `rotate(${resizeBox.value.r},${resizeBox.value.x + resizeBox.value.w / 2},${resizeBox.value.y + resizeBox.value.h / 2})`
// })
let resizeRotate = ref('')
// 连线
let hoverConnectNode = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})


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
    tempNode = nodeArry.value[nodeArry.value.length - 1]
  }
  // isResize.value = false
}

const onMouseup = (e) => {
  if(toolHandleMove.value) toolHandleMove.value = false

  if(isOnCreate.value && isAddNew.value) {
    // 检验是否创建模式 按下 并没有移动鼠标设置大小
    if(!isDraw.value) {
      nodeArry.value.splice(nodeArry.value.length - 1, 1)
    }else{
      isDraw.value = false
      isOnCreate.value = false
      createType.value = {name: '', type: -1, imgUrl: ''}
    }
    isAddNew.value = false
  }

  if(isResize.value && resizeDirection) {
    resizeDirection = ''
  }

  isRotate = false
  // const { rect } = tempNode
  // calculateNewCenter(rect.x, rect.y, rect.width, rect.height, )

  // tempNode = null
}
const onClickNode = (node) => {
  console.log(node,'mo---')
  if(!isResize.value) isResize.value = true
  tempNode = node
  // 设置操作框的大小
  resizeBox.value.x = tempNode.rect.x
  resizeBox.value.y = tempNode.rect.y
  resizeBox.value.w = tempNode.rect.width
  resizeBox.value.h = tempNode.rect.height
  resizeBox.value.r = tempNode.rect.rotate

  // 获取resizeBox 鼠标坐标
  
}


const onHoverNode = (node) => {
  if(isDraw.value || isResize.value) return
  tempNode = node
}

const onMouseleaveNode = (node) => {

}

function getOppositeCorner(rect, clickedPoint) {
  const { x1, y1, x2, y2 } = rect; // 矩形的四个顶点
  const { px, py } = clickedPoint; // 点击的点

  // 计算矩形中心点
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  // 计算对角点
  const qx = 2 * cx - px;
  const qy = 2 * cy - py;

  return { qx, qy };
}
let ball = ref(null)
let isRotate = false;
let rotatePoint = null
let origin = null
let initPoint = { x:0, y:0}
let oppositePoint = { x:0, y:0}
const onResize = (e) => {
  const type = e.target.getAttribute('dir')
  const { rect } = tempNode
  if(type == 'rotate') {
    // console.log('roatte')
    isRotate = true
    // console.log(tempNode,'tempNode')
    // console.log(resizeBox.value,'tempNode')
    const center = {
      x: rect.x + (rect.width / 2),
      y: rect.y + (rect.height / 2)
    }
    console.log(center,'center')
    resizeRotate.value = `rotate(${resizeBox.value.r},${resizeBox.value.x + resizeBox.value.w / 2},${resizeBox.value.y + resizeBox.value.h / 2})`
    ball.value.style.left = resizeBox.value.x + resizeBox.value.w / 2 + 'px'
    ball.value.style.top = resizeBox.value.y + resizeBox.value.h / 2  + 'px'
  }
  else{
    // 无论落点在哪里，找到锚点的具体位置，根据锚点进行计算
    // 1、确定对角点
    switch(type) {
      case 'rb': 
        resizePoint.x = rect.x + rect.width
        resizePoint.y = rect.y + rect.height
        break;
      case 'lb':
        resizePoint.x = rect.x
        resizePoint.y = rect.y + rect.height
        break;
      case 'rt': 
        resizePoint.x = rect.x + rect.width
        resizePoint.y = rect.y
        break;
      case 'lt': 
        resizePoint.x = rect.x
        resizePoint.y = rect.y
        break;
    }

    resizeDirection = type
    console.log(resizeDirection,'resizeDirection')

    const center = {
      x: rect.x + (rect.width / 2),
      y: rect.y + (rect.height / 2)
    }

    // resizePoint：旋转度数后的锚点位置
    const p = rotate(resizePoint, resizeBox.value.r, center)
    // 对角点：resize时候对角点位置保持不变，锚点位置不断改变
    oppositePoint = calculateOtherEndpoint(center, p)

  }
  
}


const findFixPoint = () => {
  console.log('这里---')
  const { rect } = tempNode
  resizePoint.x = rect.x + rect.width
  resizePoint.y = rect.y + rect.height
  const center = {
    x: rect.x + (rect.width / 2),
    y: rect.y + (rect.height / 2)
  }
  const p = rotate(resizePoint, resizeBox.value.r, center)

  const anotherPoint = calculateOtherEndpoint(center, p)

  ball.value.style.left = anotherPoint.x + 'px'
  ball.value.style.top = anotherPoint.y  + 'px'
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
    const start = screen2svg(startPoint.value.x, startPoint.value.y)
    const end = screen2svg(e.clientX, e.clientY)
    const {x, y, w, h} = generateSize(start, end)
    setNodeSize(tempNode, x, y, w, h)
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
  // resize Node
  else if(isResize.value && resizeDirection) {
    const { rect } = tempNode
    // 鼠标坐标
    const curMouse = screen2svg(e.clientX,e.clientY)

    // 注意：锚点位置确定了，但是鼠标开始的落点不一定是锚点的位置，会有偏差，这里暂时假设就是锚点位置，直接求新中点
    // 鼠标位置 与 对角固定点求 中点
    const newCenter = midpoint(oppositePoint, curMouse)

    // 将鼠标点偏移回正角度
    const originMouse = rotate(curMouse, -resizeBox.value.r, newCenter)
    const oriOppositePoint = rotate(oppositePoint, -resizeBox.value.r, newCenter)

    const { x,y,w,h } = generateSize(oriOppositePoint, originMouse)

    // 操作框只变化旋转中心
    resizeRotate.value = `rotate(${resizeBox.value.r},${newCenter.x},${newCenter.y})`
    resizeBox.value.x = x
    resizeBox.value.y = y
    resizeBox.value.w = w
    resizeBox.value.h = h

    tempNode.rect.x = x
    tempNode.rect.y = y
    tempNode.rect.width = w
    tempNode.rect.height = h
  }
  // 旋转
  else if(isResize.value && isRotate) {
    const { rect } = tempNode
    const center = {
      x: rect.x + (rect.width / 2),
      y: rect.y + (rect.height / 2)
    }
    const cur = screen2svg(e.clientX, e.clientY)
    // const mousePos = mousePointInStage(e)
    // console.log(mousePos,'mousePos')
    // const info = {
    //   width: rect.width,
    //   height: rect.height,
    //   x: rect.x,
    //   y: rect.y,
    // }
    // const center = { x: info.x + info.width / 2, y: info.y + info.height / 2 };

    // let angle = lineAngle(center, mousePos);

    // angle += radianToAngle(Math.atan((info.height + 15) / info.width));
    // angle += angle < 0 ? 360 : 0;
    // // 按下shify以5度为倍数变化旋转角度
    // const adsorbAngles = [0, 90, 180, 270, 360];
    // // 角度吸附处理
    // // adsorbAngles.forEach((degree) => {
    // //   angle = Math.abs(angle - degree) < 1 ? degree : angle;
    // // });
    // angle = angle > 360 ? 360 : angle;//

    // console.log(angle,'angle')
    const angle = calculateRotation(center.x, center.y, cur.x, cur.y, rect.width, rect.height)
    tempNode.rect.rotate = angle
    resizeBox.value.r = angle
    resizeRotate.value = `rotate(${resizeBox.value.r},${resizeBox.value.x + resizeBox.value.w / 2},${resizeBox.value.y + resizeBox.value.h / 2})`

  }
}

// 计算同端点两条线段间的夹角
function calculateAngle(C, A, D) {
    // 向量 CA 和 CD
    const CA = { x: A.x - C.x, y: A.y - C.y };
    const CD = { x: D.x - C.x, y: D.y - C.y };

    // 点积
    const dotProduct = CA.x * CD.x + CA.y * CD.y;

    // 向量模长
    const magnitudeCA = Math.sqrt(CA.x ** 2 + CA.y ** 2);
    const magnitudeCD = Math.sqrt(CD.x ** 2 + CD.y ** 2);

    // 计算 cosθ
    const cosTheta = dotProduct / (magnitudeCA * magnitudeCD);

    // 计算夹角 (弧度转角度)
    const angleInRadians = Math.acos(cosTheta);
    const angleInDegrees = (angleInRadians * 180) / Math.PI;

    return angleInDegrees;
}

function calculateRectDimensions(x1, y1, x2, y2, theta) {
    const rad = (angle) => (Math.PI / 180) * angle; // 转为弧度

    // 对角线长度
    const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // 对角线方向角
    const phi = Math.atan2(y2 - y1, x2 - x1); // 弧度制

    // 宽高的夹角
    const thetaW = phi - rad(theta);

    // 宽和高
    const w = Math.abs(d * Math.cos(thetaW));
    const h = Math.abs(d * Math.sin(thetaW));

    return { w: w, h: h };
}

function calCenter(a,b) {
  const xC = (a.x + b.x) / 2;
  const yC = (a.y + b.y) / 2;
  return { x: xC, y: yC };
}

function  mousePointInStage (e){
    // const { stage, scale = 1 } = this.props;
    const scale = 1
    const { pageX, pageY } = e;
    // const { coordinate: stagePos } = stage.store();
    const stagePos = svgRef.value.getBoundingClientRect()
    const mousePoint = {
      x: pageX - stagePos.x,
      y: pageY - stagePos.y
    };
    mousePoint.x /= scale;
    mousePoint.y /= scale;
    return mousePoint;
  };

function calculateNewCenter(x, y, w, h, angle, deltaW) {
  // 初始中心点
  const cx = x + w / 2;
  const cy = y + h / 2;

  // 转换角度为弧度
  const rad = (angle * Math.PI) / 180;

  // 新的宽高
  const newW = w + deltaW;
  const newH = h + deltaW;

  // 宽高偏移量在旋转前坐标系的值
  const deltaCx = (newW - w) / 2;
  const deltaCy = (newH - h) / 2;

  // 旋转变换到全局坐标系
  const rotatedDeltaCx = deltaCx * Math.cos(rad) - deltaCy * Math.sin(rad);
  const rotatedDeltaCy = deltaCx * Math.sin(rad) + deltaCy * Math.cos(rad);

  // 新的中心点
  const newCx = cx + rotatedDeltaCx;
  const newCy = cy + rotatedDeltaCy;

  return { newCx, newCy };
}

// 测试
const x = 200; // 初始左上角
const y = 200;
const w = 100; // 初始宽高
const h = 100;
const angle = 45; // 旋转角度
const deltaW = 50; // 宽高增加量

const newCenter = calculateNewCenter(x, y, w, h, angle, deltaW);
console.log("变化后的中心点:", newCenter);

// 计算矩形对角线另一端点坐标的函数
function calculateOtherEndpoint(midpoint, pointA) {
    const x2 = 2 * midpoint.x - pointA.x;
    const y2 = 2 * midpoint.y - pointA.y;

    return { x: x2, y: y2 };
}

// 根据旋转后的顶点计算未旋转时的顶点
function calculateOriginalVertices(cx, cy, rotatedVertices, angle) {
  // 转换角度为弧度
  const rad = (angle * Math.PI) / 180;

  // 使用逆旋转矩阵计算未旋转的坐标
  return rotatedVertices.map(({ x: xPrime, y: yPrime }) => {
    const dx = xPrime - cx;
    const dy = yPrime - cy;

    const x = cx + dx * Math.cos(-rad) - dy * Math.sin(-rad);
    const y = cy + dx * Math.sin(-rad) + dy * Math.cos(-rad);

    return { x, y };
  });
}

// 根据旋转角度计算出旋转后的顶点坐标
function calculateRotatedVertices(cx, cy, w, h, angle) {
  // 转换角度为弧度
  const rad = (angle * Math.PI) / 180;

  // 顶点初始坐标相对于中心点的偏移量
  const offsets = [
    [-w / 2, -h / 2], // 左上角
    [w / 2, -h / 2],  // 右上角
    [-w / 2, h / 2],  // 左下角
    [w / 2, h / 2],   // 右下角
  ];

  // 计算旋转后的顶点坐标
  return offsets.map(([dx, dy]) => {
    const x = cx + dx * Math.cos(rad) - dy * Math.sin(rad);
    const y = cy + dx * Math.sin(rad) + dy * Math.cos(rad);
    return { x, y };
  });
}

function calculateRotation(cx, cy, x, y, width, height) {
  // 默认向量（未旋转时左上角相对中心点的向量）
  const defaultAngle = Math.atan2(-height / 2, -width / 2);
  // 当前向量（左上角相对中心点的向量）
  const currentAngle = Math.atan2(y - cy, x - cx);
  // 计算旋转角度
  let angle = (currentAngle - defaultAngle) * 180 / Math.PI;
  // 标准化角度范围到 [0, 360)
  angle = (angle + 360) % 360;
  return angle;
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
    name: '直角矩形',
    type: 3,
    imgUrl: '直角矩形.png', // 
    d: 'M2,2 L30,2 L30,30 L2,30 L2,2'
  },
  {
    name: '圆形',
    type: 2,
    imgUrl: '圆形.png'
  },
  {
    name: '菱形',
    type: 4,
    imgUrl: '菱形框.png'
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

function setNodeSize(node,x,y,w,h) {
  tempNode.rect.width = w
  tempNode.rect.height = h
  switch(node.type) {
    case 1: 
      // 圆角矩形
      tempNode.rect.x = x
      tempNode.rect.y = y
      tempNode.rect.rx = 15
      tempNode.rect.ry = 15
      break
    case 2: 
      // 圆形，设置圆心、半径
      tempNode.rect.x = x
      tempNode.rect.y = y
      tempNode.rect.cx = x + (w/2)
      tempNode.rect.cy = y + (h/2)
      tempNode.rect.rx = w/2
      tempNode.rect.ry = h/2
      break
    case 3: 
      // 直角矩形
      tempNode.rect.x = x
      tempNode.rect.y = y
      break
    case 4:
      // 菱形
      tempNode.rect.x = x
      tempNode.rect.y = y
      tempNode.rect.points = `${x+(w/2)},${y} ${x+w},${y+(h/2)} ${x+(w/2)},${y+h} ${x},${y+(h/2)}`
      break
  }
}

// 生成图形大小及坐标
function generateSize(start,end) {
  let x = Math.min(start.x,end.x) 
  let y = Math.min(start.y,end.y) 
  let w = Math.abs(end.x - start.x)
  let h = Math.abs(end.y - start.y) 
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
      strokeWidth: 3,
      points: '',
      rotate: 0,
      translate: {
        x: 0,
        y: 0
      }
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
        img,svg{
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .resize-box{
    position: fixed;
    width: 200px;
    height: 200px;
    border: 1px solid salmon;
    top: 0;
    .circle{
      position: absolute;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 1px solid rgb(20, 123, 227);
      position: absolute;
      background: #fff;
      z-index: 99;
    }
  }
  .rotate{

  }
}
.top{
  z-index: 999;
}
.left-top{
  cursor: se-resize;
}
.right-top{
  cursor: ne-resize;
}
.left-bottom{
  cursor: ne-resize;
}
.right-bottom{
  cursor: se-resize;
}
.ball{
  position: fixed;
  top: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  transform: translate(-50%,-50%);
  z-index: 9999;
  background-color: transparent;
  border: 1px solid purple;
}
</style>
