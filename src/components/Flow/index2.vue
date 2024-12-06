<template>
  <div 
    class="wrapper"
    @mousemove="lineMove"
    @mouseleave="onMouseleave"
    @mouseup="onMouseup" 
    @mousedown="onMousedown"
  >
    <button @click="addBlock" class="btn">添加div</button>
    <!-- 节点 -->
    <div class="flow-draw">
      <!-- 多选操作框 -->
      <div 
        v-if="showOperate"
        draggable="true"
        @dblclick="cancelOperate"
        @mousedown.stop="onOperationDown"
        :style="{ 
          width: operate.w + 'px', 
          height: operate.h + 'px',
          transform: `translate3d(${operate.x}px,${operate.y}px,0) scale(${1})`
        }" 
        class="operation">
        <!-- <div class="circle left"></div>
        <div class="circle right"></div>
        <div class="circle left-bottom"></div>
        <div class="circle right-bottom"></div> -->
      </div>
      <node
        v-for="(item) in blockArry" :key="item.id"
        :node="item"
        :wrapper="wrapper"
        :flowDraw="linesArea"
        :nodeArray="blockArry"
        :isCtrl="isCtrl"
        :activityNodeIds="activityNodeIds"
        @lineStart="onLineStart"
        @activityNode="onActivityNode"
        @getNodeDom="onGetNodeDom"
        @cancelMove="onCancelMove"
        @nodeResize="onNodeResize"
      />
    </div>
    <!-- 连接线 -->
    <div class="lines-area" :class="[ toolFlag !== 0 ? 'cross' : '' ]" >
      <svg style="width: 100%;height: 100%">
        <defs>
          <marker v-for="line in linesArry" :key="line.id" :id="line.id" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="rgb(20, 123, 227)" />
          </marker>
        </defs>
        <g v-for="line in linesArry" @mousedown.stop="onPathSelected($event,line)" :key="line.id" :style="{zIndex: line.zIndex}">
          <path class="line" :d="line.d" fill="none" :marker-end="`url(#${line.id})`"></path>
          <path class="hover-line" :d="line.d" fill="none"></path>
        </g>
      </svg>
    </div>
    <!-- 辅助线 -->
    <div :style="{ top: (X_POINT[0] ?? 0 )+ 'px' }" :class="{ hidden: !X_POINT[0] }" class="assit-line x-line"></div>  
    <div :style="{ top: (X_POINT[1] ?? 0) + 'px' }" :class="{ hidden: !X_POINT[1] }" class="assit-line x-line"></div>  
    <div :style="{ top: (X_POINT[2] ?? 0) + 'px' }" :class="{ hidden: !X_POINT[2] }" class="assit-line x-line"></div>  
    <div :style="{ left: (Y_POINT[0] ?? 0) + 'px' }" :class="{ hidden: !Y_POINT[0] }" class="assit-line y-line"></div>  
    <div :style="{ left: (Y_POINT[1] ?? 0) + 'px' }" :class="{ hidden: !Y_POINT[1] }" class="assit-line y-line"></div>  
    <div :style="{ left: (Y_POINT[2] ?? 0) + 'px' }" :class="{ hidden: !Y_POINT[2] }" class="assit-line y-line"></div>  
    <!-- 线条操作点 -->
    <div 
      @mousedown.stop="onLineDown($event,'1')" 
      :style="{ top: lineHead.y + 'px', left: lineHead.x + 'px' }" 
      class="circle line-head"
      :class="{ hidden: !activityLine }"
    ></div>
    <div 
      @mousedown.stop="onLineDown($event,'2')" 
      :style="{ top: lineWail.y + 'px', left: lineWail.x + 'px' }" 
      class="circle line-wail"
      :class="{ hidden: !activityLine }"
    ></div>
    <!-- 添加栏 -->
    <!-- <div class="left-bar">
      <div class="node-type-container">
        <div draggable="true" class="node-type">
          <svg>
            <rect x="4" y="4" width="55" height="55" rx="10" ry="10" fill="none" stroke="black" stroke-width="2px" />
            <text x="32" y="33" font-family="Arial" font-size="18" fill="black" text-anchor="middle" alignment-baseline="middle">
              审核
            </text>
          </svg>
        </div>
        <div draggable="true" class="node-type">
          <svg>
            <rect x="4" y="4" width="55" height="55" rx="10" ry="10" fill="none" stroke="black" stroke-width="2px" />
            <text x="32" y="33" font-family="Arial" font-size="18" fill="black" text-anchor="middle" alignment-baseline="middle">
              审批
            </text>
          </svg>
        </div>
        <div draggable="true" class="node-type">
          <svg>
            <polygon points="31,4 59,31 31,59 4,31" fill="none" stroke="black" stroke-width="2"/>
            <text x="30" y="33" font-family="Arial" font-size="18" fill="black" text-anchor="middle" alignment-baseline="middle">
              条件
            </text>
          </svg>
        </div>
      </div>
    </div> -->

    <!-- 工具栏 -->
    <div class="tool-bar" :style="{ left:'150px',top:'50px' }">
      <div class="block">
        <div class="handle">
        </div>
      </div>
      <div @mousedown.stop="onToolBar(1)" class="block" :class="[ toolFlag == 1 ? 'active' : '']">
        <div class="add-block juxing"></div>
      </div>
      <div @mousedown.stop="onToolBar(2)" class="block" :class="[ toolFlag == 2 ? 'active' : '']">
        <div class="add-block lingxing"></div>
      </div>
    </div>

    <!--   v-if="toolFlag"  虚拟画框 -->
    <div 
   
      :style="{ 
        width: virtualRect.w + 'px',
        height: virtualRect.h + 'px',
        left: 0 + 'px',
        top: 0 + 'px',
        transform: `translate3d(${virtualRect.x}px,${virtualRect.y}px,0) scale(${1})`

      }" 
      
      class="virtual-box">678</div>
  </div>
</template>

<script setup>
import { ref,reactive,onMounted,computed,defineEmits,nextTick,watch } from "vue"
import { nodes as nodeInfo, lines as lineInfo } from './utils/data'
import drawLine from './utils/common'
// import { se_resizeLine } from './utils/common'
import node from './components/node.vue'
import line from './components/line.vue'
const regex = /translate3d\((\d+)\s*px,\s*(\d+)\s*px,/;
const threshold = 4; //

let toolBar = ref([
  { isActive: false, type: 'rect',id: '1' },
  { isActive: false, type: 'ling',id: '2' },
])

let blockArry = reactive([])
let linesArry = reactive([])
let zIndex = 10
let wrapper, flowDraw, linesArea
let lineDown = ref(false)
let tempLine = reactive({})
let nodeDown = false
let allPoints = []
let offset = { x: 0, y: 0 }
let nodesInView = []
let activityNode = []
let activityNodeIds = ref([])
let oneQuadrant = [], twoQuadrant = [], threeQuadrant = [], fourQuadrant = []
const conor = ['左上角','右上角','左下角','右下角','中心点',]

let X_POINT = ref([])
let Y_POINT = ref([])
let isCtrl = ref(false)

let activityLine = null
let lineHead = ref({x:0,y:0})
let lineWail = ref({x:0,y:0})
let lineTarget = null

let operate = ref({ w: 0, h: 0, x: 0, y: 0 })
let resizeNode = null
// 1'左上角',2'右上角',3'左下角',4'右下角'
let resizeInfo = null 

const MAX_W = 300
const MIN_W = 100
const MAX_H = 300
const MIN_H = 100

let showOperate = ref(false)
let toolFlag = ref(0)
let virtualRect = ref({ w: 0, h: 0, x: 0, y: 0  })

// 选择工具回调
const onToolBar = (v) => {
  if(toolFlag.value !== v) {
    toolFlag.value = v
  }else if(toolFlag.value == v) {
    toolFlag.value = 0
  }
}
let toolStart = ref(false)
let toolStartPoint = { x:0,y:0 }

// wrapper 点击空白区域 mouseDown
const onMousedown = (e) => {
  console.log('空白区域')
  nodeDown = false
  activityNode = []
  lineDown.value = false
  resizeNode = null
  lineResize = 0
  activityNodeIds.value = []
  if(toolFlag) {
    toolStartPoint.x = e.clientX 
    toolStartPoint.y = e.clientY
    toolStart.value = true
  }
}

const cancelOperate = () => {
  nodeDown = true
  activityNode = []
  activityNodeIds.value = []
  showOperate.value = false
}

const onOperationDown = (e) => {
  e.preventDefault()
  showOperate.value = true
  nodeDown = true
  offset.x = e.clientX - (operate.value.x - wrapper.scrollLeft)
  offset.y = e.clientY - (operate.value.y - wrapper.scrollTop)
 
}

const onLinehover = () => {
  console.log(2222)
}

// 初始化流程信息
const initFlow = () => {
  // blockArry = nodeInfo
  nodeInfo.forEach(n => {
    blockArry.push(n)
  })
  lineInfo.forEach(n => {
    linesArry.push(n)
  })
  lineInfo.forEach(line => {
    blockArry.forEach(node => {
      if(line.beginNode == node.id) {
        node.outterLines.push(line)
      }
      if(line.targetNode == node.id) {
        node.innerLines.push(line)
      }
    })
  })
}

// 过滤在可视区域内的所有node
const filterNodeInView = (arry,node) => {
  const nodes = arry.filter(node => !activityNodeIds.value.includes(node.id) && isInterect(node))
  return nodes.map(node => getPoints(node))
}

const setOperationWH = (nodes) => {
  let minw = nodes[0].x, maxw = nodes[0].x + nodes[0].width, 
      minh = nodes[0].y, maxh = nodes[0].y + nodes[0].height
  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    if(node.x < minw) minw = node.x
    if(node.x + node.width > maxw) maxw = node.x + node.width
    if(node.y < minh) minh = node.y
    if(node.y + node.height > maxh) maxh = node.y + node.height
  }
  operate.value.w = maxw - minw
  operate.value.h = maxh - minh
  operate.value.x = minw
  operate.value.y = minh
}

let testNodeResizePoint = { x:0,y:0 }
const onNodeResize = (params) => {
  console.log(params,'onNodeResize')
  resizeNode = blockArry.find(node => node.id === params.nodeId)
  resizeInfo = params
  // console.log(resizeNode,resizeInfo,'resize')
  console.log(blockArry,'bbb')
  testNodeResizePoint.x = params.x
  testNodeResizePoint.y = params.y
}

// 按下node 活动的node重新设置zindex，防止拖动到高zindex的node上面时没有触发move
const onActivityNode = (params) => {
  const { nodes, offsetXY, nodeId } = params
  console.log(nodes,'按下node')
  if(activityNode.length > 1 && !isCtrl.value) {
    activityNode = []
    activityNodeIds.value = []
    showOperate.value = false
  }
  if(isCtrl.value) {
    if(!activityNode.find(n => n.id == nodeId)) {
      activityNode.push(nodes)
      activityNodeIds.value.push(nodeId)
      if(!showOperate.value && activityNodeIds.value.length > 1) showOperate.value = true
    }
  }else if(!isCtrl.value){
    activityNode.splice(0,1,nodes)
    activityNodeIds.value.splice(0,1,nodeId)
  }
  // 设置多选操作框大小
  if(activityNode.length > 1) setOperationWH(activityNode)

  // 获取可视区域内的所有div的点位用于辅助线对齐
  allPoints = filterNodeInView(blockArry)
  offset = offsetXY

  if(activityNode.length) {
    if(nodeDown == false) nodeDown = true
    activityNode.forEach(node => {
      for (let i = 0; i < blockArry.length; i++) {
        const element = blockArry[i];
        if(node.id == element.id) {
          element.zIndex = ++zIndex
          break
        }
      }
    })
  }

  console.log(activityNode,'activityNode')
}



const onMouseleave = () => {
  lineDown.value = false
  nodeDown = false
  lineResize = 0
}

let lineResize = 0
// 按下线条操作点
const onLineDown = (e,type) => {
  console.log(tempLine,'按下线条操作点')
  let originId
  if(type == '1') {
    // 线头
    originId = tempLine.beginNode
    lineResize = 1
    lineStartPoint = tempLine.position.end

  }else{
    // 线尾（箭头）
    originId = tempLine.targetNode
    lineResize = 2
    lineStartPoint = { x: tempLine.x, y: tempLine.y }

  }
  blockArry.forEach(node => {
    if(isInterect(node)) nodesInView.push(node)
  })

  // 将node分象限
  getNodeInArea(nodesInView)
  

  e.preventDefault()

}


// 选择线条
const onPathSelected = (e,line) => {
  console.log(line,'选择的线条-----------------')
  activityLine = line
  tempLine = line
  lineHead.value = line.position.begin
  lineWail.value = line.position.end
  // getNodeInArea()
  e.preventDefault()
}



// 页面可视区域的node按象限进行区分，用于线条连接
const getNodeInArea = (nodeArry) => {
  // 计算原点
  const originX = (window.innerWidth / 2) + wrapper.scrollLeft;
  const originY = (window.innerHeight / 2)  + wrapper.scrollTop;

  // 将页面可视区域的node按象限进行区分，以起始点为原点
  for (let i = 0; i < nodeArry.length; i++) {
    const node = nodeArry[i];
    const points = getPointsOfCornor(node)
    // 1象限
    if(points.x1.x >= originX && points.x1.y < originY) {
      oneQuadrant.push(node)
      // 是否跨4象限
      if(points.x4.y > originY) {
        fourQuadrant.push(node)
      }
    }
    // 2象限
    if(points.x1.x < originX && points.x1.y < originY) {
      twoQuadrant.push(node)
      // 跨4象限
      if(points.x4.x > originX && points.x4.y > originY) {
        oneQuadrant.push(node)
        threeQuadrant.push(node)
        fourQuadrant.push(node)
      }else
      // 跨1象限
      if(points.x4.x > originX && points.x4.y <= originY) {
        oneQuadrant.push(node)
      }else
      // 跨3象限
      if(points.x4.x <= originX && points.x4.y > originY) {
        threeQuadrant.push(node)
      }
    }
    // 3象限
    if(points.x1.x < originX && points.x1.y >= originY) {
      threeQuadrant.push(node)
      // 跨4象限
      if(points.x4.x > originX) {
        fourQuadrant.push(node)
      }
    }
    // 4象限
    if(points.x1.x >= originX && points.x1.y >= originY) {
      fourQuadrant.push(node)
    }
  }
}
let mulDiff = { x:0,y:0 }
let lineStartNode = null
let lineStartPoint = { x:0,y:0 }
// 按下线条
const onLineStart = (line, originNode) => {
  if(activityNode.length) activityNode = []
  // 添加线条出来的node
  activityNode.push(originNode)
  console.log(line,'onLineStart')
  blockArry.forEach(node => {
    if(node.id !== originNode.id){
      if(isInterect(node)) nodesInView.push(node)
    }
    else{
      node.outterLines.push(line)
    }
  })
  lineStartNode = originNode
  getNodeInArea(nodesInView)
  linesArry.push(line)
  line.zIndex = ++zIndex
  tempLine = linesArry[linesArry.length - 1]
  if(tempLine.startDir == 'right') {
    lineStartPoint.x = originNode.x + originNode.width
    lineStartPoint.y = tempLine.y
  }else if(tempLine.startDir == 'left') {
    lineStartPoint.x = originNode.x
    lineStartPoint.y = tempLine.y
  }else if(tempLine.startDir == 'top') {
    lineStartPoint.x = tempLine.x
    lineStartPoint.y = originNode.y 
  }else {
    lineStartPoint.x = tempLine.x
    lineStartPoint.y = originNode.y  + originNode.height 
  }

  tempLine.x = lineStartPoint.x
  tempLine.y = lineStartPoint.y
  lineDown.value = true
}
let endDirection = null
let targetNode = null
// 移动 node || 线条
const move = (e) => {
  // console.log('移动')
  e.preventDefault();

  // 移动线头位置需要更改linestart，线尾位置正常更新
  
  if(lineDown.value) {
    endDirection = null
    // 屏幕中点 + 滚动条
    const originX = (window.innerWidth / 2) + wrapper.scrollLeft; // 屏幕中点是不变的，需要加上滚动条
    const originY = (window.innerHeight / 2)  + wrapper.scrollTop;
    // 鼠标位置
    let x = e.clientX + wrapper.scrollLeft - wrapper.getBoundingClientRect().left
    let y = e.clientY + wrapper.scrollTop - wrapper.getBoundingClientRect().top
    // console.log(lineStartPoint,x,y,'00000')
    // 跟象限区域内的node进行比较，根据x,y判断在哪个象限内，return 象限数组
    const arry = judgeQuadrant({x,y},{x:originX,y:originY})
    const areaThreshold = 10
    // 遍历区域内的node，判断距离在阈值范围内的
    for (let i = 0; i < arry.length; i++) {
      const node = arry[i];
      const t = node.y
      const b = node.y + node.height
      const l = node.x
      const r = node.x + node.width
      // 左边
      if(Math.abs(x - node.x) <= areaThreshold && y <= b && y >= t) {
        x = node.x  
        targetNode = node
        endDirection = 'left'
        break
      }
      // 右边
      if(Math.abs(x - (node.x + node.width)) <= areaThreshold && y <= b && y >= t) {
        x = node.x + node.width
        targetNode = node
        endDirection = 'right'
        break
      }
      // 上边
      if(Math.abs(y - (node.y)) <= areaThreshold && x <= r && x >= l) {
        y = node.y  //
        // y = node.y - 8 // 有8的偏移 lines-area 的上padding影响
        endDirection = 'top'
        targetNode = node
        break
      }
      // 下边
      if(Math.abs(y - (node.y + node.height)) <= areaThreshold && x <= r && x >= l) {
        y = node.y + node.height  // 取消panding需要加上 5
        endDirection = 'bottom'
        targetNode = node
        break
      }
    }
    if(!endDirection) targetNode = null
    // 从node出来的点lineStartPoint是固定的
    // 这里lineStartPoint使用同一个引用类型变量，导致所有的线起始点都是相同的 - -
    let position = drawLine(JSON.parse(JSON.stringify(lineStartPoint)), {x,y}, tempLine.startDir, endDirection)
    tempLine.d = position.d
    tempLine.position = position

  }
  else if(nodeDown) {
    // 修改node位置
    let last = false
    activityNode.forEach((node, index) => {
      if(index == activityNode.length - 1) last = true
      hanldeNodePosition(e, node, last)
    })
  }else if(resizeNode) {
    let test = {
      x:  e.clientX - testNodeResizePoint.x,
      y:  e.clientY - testNodeResizePoint.y,
    }
    console.log(test,'tetttt')
    testNodeResizePoint.x = e.clientX
    testNodeResizePoint.y = e.clientY
    const position = {
      x: resizeNode.x + resizeNode.width,
      y: resizeNode.y + resizeNode.height,
    }
    // 鼠标与右下角的差值
    let diff = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    let W = resizeNode.width + diff.x
    let H = resizeNode.height + diff.y
    let old = {
      w: resizeNode.width,
      h: resizeNode.height,
      x: resizeNode.x,
      y: resizeNode.y
    }
    
    switch (resizeInfo.type) {
      case '1':
        break;
      case '2':
        break;
      case '3':
        break;
      case '4':
        // 右下角
        // console.log(resizeNode.width,'old--------------')
       
        if(W < MIN_W) {
          diff.x = MIN_W - resizeNode.width 
          resizeNode.width = MIN_W
        }else if(W > MAX_W){
          diff.x = MAX_W - resizeNode.width 
          resizeNode.width = MAX_W
        }else{
          resizeNode.width = W
        }

        if(H < MIN_H) {
          diff.y = MIN_H - resizeNode.height
          resizeNode.height = MIN_H
        }else if(H > MAX_H){
          diff.y = MAX_H - resizeNode.height
          resizeNode.height = MAX_H
        }else{
          resizeNode.height = H
        }
        let _new = {
          w: resizeNode.width,
          h: resizeNode.height,
          x: resizeNode.x,
          y: resizeNode.y
        }
        console.log(diff,'diff--')
        // console.log(resizeNode,'resizenode')
        // debugger
        // 高度变化需要根据比例计算线条起点y的位置
        se_resizeLine(resizeNode.outterLines,diff,old,_new,'out')
        se_resizeLine(resizeNode.innerLines,diff,old,_new,'in')
        break;
    }
  }else if(lineResize) {
    // 操作点 移动线条
    
    let direction = null
    lineTarget = null
    // 屏幕中点 + 滚动条
    const originX = (window.innerWidth / 2) + wrapper.scrollLeft; // 屏幕中点是不变的，需要加上滚动条
    const originY = (window.innerHeight / 2)  + wrapper.scrollTop;
    // 鼠标位置
    let x = e.clientX + wrapper.scrollLeft - wrapper.getBoundingClientRect().left
    let y = e.clientY + wrapper.scrollTop - wrapper.getBoundingClientRect().top
    // console.log(lineStartPoint,x,y,'00000')
    // 跟象限区域内的node进行比较，根据x,y判断在哪个象限内，return 象限数组
    const arry = judgeQuadrant({x,y},{x:originX,y:originY})
    const areaThreshold = 10
    // 遍历区域内的node，判断距离在阈值范围内的
    for (let i = 0; i < arry.length; i++) {
      const node = arry[i];
      const t = node.y
      const b = node.y + node.height
      const l = node.x
      const r = node.x + node.width
      // 左边
      if(Math.abs(x - node.x) <= areaThreshold && y <= b && y >= t) {
        x = node.x  
        lineTarget = node
        direction = 'left'
        break
      }
      // 右边
      if(Math.abs(x - (node.x + node.width)) <= areaThreshold && y <= b && y >= t) {
        x = node.x + node.width
        lineTarget = node
        direction = 'right'
        break
      }
      // 上边
      if(Math.abs(y - (node.y)) <= areaThreshold && x <= r && x >= l) {
        y = node.y  //
        // y = node.y - 8 // 有8的偏移 lines-area 的上padding影响
        direction = 'top'
        lineTarget = node
        break
      }
      // 下边
      if(Math.abs(y - (node.y + node.height)) <= areaThreshold && x <= r && x >= l) {
        y = node.y + node.height  // 取消panding需要加上 5
        direction = 'bottom'
        lineTarget = node
        break
      }
    }

    
    if(lineResize == 1) {
      // 线头 更新 line.x line.y startDir
      if(!direction) {
        if(tempLine.targetDir == 'left' || tempLine.targetDir == 'right') {
          if(tempLine.position.end.x < tempLine.x) {
            tempLine.startDir = 'left'
          }else{
            tempLine.startDir = 'right'
          }
        }else{
          if(tempLine.y < tempLine.position.end.y) {
            tempLine.startDir = 'bottom'
          }else{
            tempLine.startDir = 'top'
          }
        }
      }else{
        tempLine.startDir = direction
      }

      let position = drawLine({x,y},JSON.parse(JSON.stringify(lineStartPoint)), tempLine.startDir, tempLine.targetDir)
      tempLine.x = x
      tempLine.y = y
      tempLine.d = position.d
      tempLine.position = position
      lineHead.value.x = x
      lineHead.value.y = y
    }else {
      // 线尾 更新 position.d / begin / end  targetDir
      if(!direction) {
        if(tempLine.startDir == 'bottom' || tempLine.startDir == 'top') {
          if(tempLine.y < tempLine.position.end.y) {
            tempLine.targetDir = 'top'
          }else{
            tempLine.targetDir = 'bottom'
          }
          
        }else{
          if(tempLine.position.end.x < tempLine.x) {
            tempLine.targetDir = 'right'
          }else{
            tempLine.targetDir = 'left'
          }
        }
      }else{
        tempLine.targetDir = direction
      }
      let position = drawLine(JSON.parse(JSON.stringify(lineStartPoint)),{x,y}, tempLine.startDir, tempLine.targetDir)
      tempLine.d = position.d
      tempLine.position = position
      lineWail.value.x = position.end.x
      lineWail.value.y = position.end.y
    }


  }else if(toolStart.value && toolFlag.value) {
    // 画图
    let curPos = {};
    curPos.x = e.clientX;
    curPos.y = e.clientY;
    //div 的left和top：如果鼠标当前位置>鼠标起始位置，则为鼠标起始位置（鼠标往右拉）；如果鼠标当前位置<鼠标起始位置，则为鼠标当前位置(鼠标往左拉)
    virtualRect.value.x = Math.min(toolStartPoint.x,curPos.x) 
    virtualRect.value.y = Math.min(toolStartPoint.y,curPos.y) 

    //通过当前坐标x/y-鼠标起始坐标x/y得到要生成的div的宽度 ，如果往左拉，鼠标当前坐标-起始坐标可能为负数，所以，需要使用绝对值函数Math.abs()
    virtualRect.value.w = Math.abs(curPos.x - toolStartPoint.x)
    virtualRect.value.h = Math.abs(curPos.y - toolStartPoint.y) 
  }
}

const se_resizeLine = (lines,posDiff,old,newx,type) => {
  // 分进入线 和 出去线，
  // console.log(old,newx);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let start, end, diffval, dir = type == 'out' ? 'startDir' : 'targetDir'
    let began = line.position.begin, lineEnd = line.position.end
    let position
    switch (line[dir]) {
      case 'right': 
        if(type == 'out') {
          // x变，y比例变
          diffval = (((began.y - old.y) / old.h) * newx.h) + old.y
          start = {x: posDiff.x + line.x, y: diffval}
          end = lineEnd
        }else {
          diffval = (((lineEnd.y - old.y) / old.h) * newx.h) + old.y
          start = began
          end = {x: posDiff.x + lineEnd.x, y: diffval}
        }
        position = drawLine(start,end,line.startDir,line.targetDir,true)
        if(type == 'out') {
          line.x = posDiff.x + line.x
          line.y = diffval
        }
        break;
      case 'left': 
      case 'top': 
      case 'bottom': 
        // 比例x，y变
        // debugger
        if(type == 'out') {
          diffval = (((began.x - old.x) / old.w) * newx.w) + old.x
          start = {x: diffval, y: posDiff.y + line.y}
          end = lineEnd
        }else {
          diffval = (((lineEnd.x - old.x) / old.w) * newx.w) + old.x
          start = (began)
          end = {x: diffval, y: posDiff.y + lineEnd.y}
        }

        position = drawLine(start,end,line.startDir,line.targetDir,true)
        if(type == 'out') {
          line.x = diffval
          line.y = posDiff.y + line.y
        }
        
        break;
    }
    line.d = position.d
    line.position = position
  }
  
 
}


// 处理node移动逻辑
const hanldeNodePosition = async (e,node,last) => {
  let _h, _w

  // 加上滚动条滚动距离
  let _left = e.clientX + wrapper.scrollLeft - offset.x
  let _top = e.clientY + wrapper.scrollTop - offset.y

  // 如果是多选，边界需要设置为大div的边界
  if(activityNodeIds.value.length > 1) {
    const operate = document.querySelector('.operation').getBoundingClientRect()
    _h = linesArea.offsetHeight - operate.height 
    _w = linesArea.offsetWidth - operate.width 
  }else{
    _h = linesArea.offsetHeight - node.height 
    _w = linesArea.offsetWidth - node.width 
  }

  _left = Math.min(Math.max(0,_left),_w) // 左右边界
  _top = Math.min(Math.max(0,_top),_h)   // 上下边界

  // 多选的时候_left是大div的left,operate.x是大div的left，所以第二次的时候muldiff.x = 0
  
  mulDiff.x = _left - operate.value.x
  mulDiff.y = _top - operate.value.y

  if(_left == _w) {
    const rect = linesArea.getBoundingClientRect()
    linesArea.style.width = Math.floor(rect.width) + 10 + 'px'
    nextTick(() => {
      wrapper.scrollLeft = wrapper.scrollLeft + 10
    })
    return
  }

  // 算出五个点位
  const rect = {
    x: _left,
    y: _top,
    width: node.width,
    height: node.height
  }
  const currentPoints= getPoints(rect)
  X_POINT.value = []
  Y_POINT.value = []

  if(activityNode.length == 1) {
    for (let i = 0; i < allPoints.length; i++) {
      const alignment = checkAlignment(currentPoints, allPoints[i], 1);
      if (alignment.length) {
        let xarry = [], yarry = []
        for (let i = 0; i < alignment.length; i++) {
          if(alignment[i].alignedX) {
            xarry.push(alignment[i])
          }
          if(alignment[i].alignedY) {
            yarry.push(alignment[i])
          }
        }

        if(xarry.length) {
          const point =  xarry[1] ? xarry[1] : xarry[0]
          // 进入数组的点是在阈值范围内的点 -3 <= x <= 3，只需要加上差值就能得出正确的吸附坐标
          _left += (point.otherPoints.x - point.currentPoints.x)
          const points = [...new Set(xarry.map(i => i.otherPoints.x))]
          xarry = [...new Set(xarry)]
          Y_POINT.value = points
        }

        if(yarry.length) {
          const point =  yarry[1] ? yarry[1] : yarry[0]
          _top += (point.otherPoints.y - point.currentPoints.y)
          const points = [...new Set(yarry.map(i => i.otherPoints.y))]
          yarry = [...new Set(yarry)]
          X_POINT.value = points

        }
        
        console.log('对齐:', alignment);
      }
    }

    const diff = { x: (_left - node.x), y: (_top - node.y)}

    node.x = _left
    node.y = _top
    node.left = _left
    node.top = _top
    node.right = _left + node.width
    node.bottom = _top + node.height
    syncPositionOfLine(node.outterLines, diff, 1)
    syncPositionOfLine(node.innerLines, diff, 2)
  }else{    

    node.x = node.x + mulDiff.x
    node.y = node.y + mulDiff.y
    node.left = node.x + mulDiff.x
    node.top = node.y + mulDiff.y
    node.right = node.x + mulDiff.x + node.width
    node.bottom = node.y + mulDiff.y + node.height
    syncPositionOfLine(node.outterLines, mulDiff, 1)
    syncPositionOfLine(node.innerLines, mulDiff, 2)
    if(last) {
      operate.value.x = _left
      operate.value.y = _top
    }
  }
  
  
}

const onCancelMove = () => {}

const lineMove = throttle(move, 10)
// 松开
const onMouseup = (e) => {
  console.log(linesArry,'松开-------------------------')
  Y_POINT.value = []
  X_POINT.value = []
  nodesInView = []
  oneQuadrant = []
  twoQuadrant = []
  threeQuadrant = []
  fourQuadrant = []
  nodeDown = false

  if(lineDown.value) {

    if(!targetNode) {
      for (let i = 0; i < lineStartNode.outterLines.length; i++) {
        const line = lineStartNode.outterLines[i]
        if(line.id == tempLine.id) {
          lineStartNode.outterLines.splice(i,1)
          deleteLine(tempLine.id)
          break
        }
      }
    }

    // debugger
    console.log(activityNode,'activityNode')

    // 清除秒点线
    if(tempLine.d && !tempLine.d.includes('L')) {
      console.log('即点即松开')
      for (let i = 0; i < linesArry.length; i++) {
        const line = linesArry[i];
        if(line.id == tempLine.id) {
          linesArry.splice(i,1)
          break
        }
      }

      activityNode.forEach(n => {
        n.outterLines.forEach((line,i) => {
          if(line.id == tempLine.id) {
            n.outterLines.splice(i,1)
          }
        })
      })
      return
    }
    // 连接到node
    if(targetNode) {
      tempLine.targetNode = targetNode.id
      tempLine.targetDir = endDirection

      // 给节点添加innerLine
      for (let i = 0; i < blockArry.length; i++) {
        const node = blockArry[i];
        if(targetNode && node.id == targetNode.id) {
          const hadPush = node.innerLines.find(line => line.id == tempLine.id)
          if(!hadPush) node.innerLines.push(tempLine)
          break
        }
      }
    }

    endDirection = null
    targetNode = null
    // activityNode = []
    // activityNodeIds.value = []
    tempLine = {}
    lineDown.value = false
  }

  if(resizeNode) {
    resizeNode = null
    resizeInfo = null
  }

  if(lineResize) {
    console.log(lineResize,lineTarget,'lineResize')
    // 
    if(lineTarget) {
      if(lineResize == 1) {
        // 修改 beginNode，旧的beginNode的outterline要去除
        const node = findNode(tempLine.beginNode)
        if(node) {
          const index = node.outterLines.findIndex(line => line.id == tempLine.id)
          if(index !== -1) node.outterLines.splice(index,1)
        }
        tempLine.beginNode = lineTarget.id
        lineTarget.outterLines.push(tempLine)
      }else{
        // 修改 targetNode，旧的targetNode的innerline要去除
        const node = findNode(tempLine.targetNode)
        if(node) {
          const index = node.innerLines.findIndex(line => line.id == tempLine.id)
          if(index !== -1) node.innerLines.splice(index,1)
        }
        tempLine.targetNode = lineTarget.id
        lineTarget.innerLines.push(tempLine)
      }
    }else{
      deleteLine(tempLine.id)
    }

    lineTarget = null
    lineResize = 0
    lineHead.value = {x:0,y:0}
    lineWail.value = {x:0,y:0}
    activityLine = null

  }

  if(toolStart.value) {
    toolFlag.value = 0
    toolStart.value = false
  }
  
}

const findNode = (id) => {
  return blockArry.find(node => node.id == id)
}

const deleteLine = (id) => {
  for(let i = 0; i < linesArry.length; i++) {
    const line = linesArry[i];
    if(line.id == id) {
      linesArry.splice(i,1)
      break
    }
  }
}

const getPointsOfCornor = (node) => {
  return {
    x1: { x: node.x, y: node.y },
    x2: { x: node.x + node.width, y: node.y },
    x3: { x: node.x, y: node.y + node.height },
    x4: { x: node.x + node.width, y: node.y + node.height }
  }
}

// 是否在目标线附近
const isNearPoints = (x1,x2,threshold) => Math.abs(x1 - x2) <= threshold


// 判断点位于哪个象限
const judgeQuadrant = (point, origin) => {
  if(point.x >= origin.x && point.y < origin.y){
    return oneQuadrant
  }else if(point.x < origin.x && point.y < origin.y) {
    return twoQuadrant
  }else if(point.x < origin.x && point.y >= origin.y) {
    return threeQuadrant
  }else {
    return fourQuadrant
  }
}

// 移动node同步线条位置 type: 1--起点  2--终点
const syncPositionOfLine = (lines, diff, type) => {
  if(lines.length) {
    return new Promise((resolve, reject) => {
      lines.forEach(line => {
        let start, end
        if(type == 1) {
          start = {x: diff.x + line.x,y:diff.y +line.y}
          end = {x: line.position.end.x,y: line.position.end.y}
        }else{
          start = {x:line.x,y:line.y}
          end = {x:diff.x + line.position.end.x,y:diff.y + line.position.end.y}
        }
        const position = drawLine(start,end,line.startDir,line.targetDir,true)
        if(type == 1) {
          line.x = diff.x + line.x
          line.y = diff.y + line.y
        }
        line.d = position.d
        line.position = position
      })
      resolve()
    })
    
  }
  
}

// 添加node
function addBlock() {
  const x = getRandomInRange(130, 500)
  const y = getRandomInRange(50, 150)
  const width = getRandomInRange(100, 158)
  const height = getRandomInRange(100, 120) 
  blockArry.push({
    id: 'node'+(+new Date()),
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    width,
    height,
    zIndex: ++zIndex,
    x,
    y,
    dom: null,
    outterLines: [],
    innerLines: [],
    name: zIndex
  })
}

const keydown = () => {
  // 用户按下ctrl后变量isCtrl为true
  document.onkeydown = e => {
    let el = e || window.event || arguments.callee.caller.arguments[0]
    if (el.keyCode === 17) {
      isCtrl.value = true
      console.log(isCtrl.value)
    }
  };
  // 用户松开ctrl后变量isCtrl为false
  document.onkeyup = e => {
      let el = e || window.event || arguments.callee.caller.arguments[0]
      if (el.keyCode === 17) {
        isCtrl.value = false
      }
    }
}

function isAligned(point1, point2, threshold) {
  // 判断是否水平或垂直对齐
  const alignedX = Math.abs(point1.x - point2.x) <= threshold;
  const alignedY = Math.abs(point1.y - point2.y) <= threshold;
  return { alignedX, alignedY };
}

function checkAlignment(currentPoints, otherPoints, threshold) {
  let arry = []
  for (let i = 0; i < currentPoints.length; i++) {
    for (let j = 0; j < otherPoints.length; j++) {
      const { alignedX, alignedY } = isAligned(currentPoints[i], otherPoints[j], threshold);
      if (alignedX || alignedY) {    
        arry.push({ alignedX, alignedY, 
          currentPoints: currentPoints[i], otherPoints: otherPoints[j], 
          currentCornor: conor[i],
          otherCornor: conor[j],
        })
      }
    }
  }
  return arry;
}

// 点击
function divClick(e) {  
  e.target.style.zIndex = ++zIndex
}

const onGetNodeDom = (id) => {
  blockArry.forEach(node => {
    if(node.id == id) node.dom = document.querySelector(`#${id}`)
  })
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

function getPoints(rect) {
  return [
    { x: rect.x, y: rect.y }, // 左上角
    { x: rect.x + rect.width, y: rect.y },          // 右上角
    { x: rect.x, y: rect.y + rect.height },         // 左下角
    { x: rect.x + rect.width, y: rect.y + rect.height }, // 右下角
    { x: rect.x + (rect.width / 2), y: rect.y + (rect.height / 2) }, // 中心点
  ];
}


function isInterect(node) {  
  return node.right > wrapper.scrollLeft && node.right < wrapper.scrollLeft + wrapper.offsetWidth
  && node.bottom > wrapper.scrollTop && node.top < wrapper.scrollTop + wrapper.offsetHeight
  // return (node.left <= window.innerWidth + wrapper.scrollLeft) && (node.top <= window.innerHeight + wrapper.scrollTop)
}
// 求区间内的随机数
function getRandomInRange(min, max) {
  return Math.floor(Math.floor(Math.random() * (max - min + 1)) + min);
}


onMounted(() => {
  wrapper = document.querySelector('.wrapper')
  flowDraw = document.querySelector('.flow-draw')
  linesArea = document.querySelector('.lines-area')
  // initFlow()
  console.log(blockArry,'mmm--')
  keydown()
})
</script>

<style lang="less" scoped>
*,body,div{
  margin: 0;
  box-sizing: border-box;
}
.wrapper{
  // transform: scale(1.3);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  background-color: rgb(250,250,250);
  // background:
  //     -webkit-linear-gradient(top, transparent 99px, #ccc 99px),
  //     -webkit-linear-gradient(left, transparent 99px, #ccc 99px);
  // background-size: 100px 100px;
  background: radial-gradient(circle at 1px 1px,rgb(201, 201, 202) 2px,rgb(243,243,245) 0); 
  background-size: 49.5px 49.5px; //圆点间隔（自定义值） 第一值是左右间隔  第二个值是上下间隔
}

.line-head,.line-wail{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgb(20, 123, 227);
  position: absolute;
  background: #fff;
  transform: translate(-50%, -50%);
  z-index: 999;
  cursor: pointer;
}

.flow-draw{
  width: 100%;
  position: relative;
  .operation{
    position: absolute;
    border: 2px solid rgb(20, 123, 227);
    background-color: transparent;
    z-index: 999999;
    left: 0px;
    top: 0px;
    cursor: move;
    .circle {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid rgb(20, 123, 227);
      position: absolute;
      background: #fff;
    }
    
    .left{
      top: 0;
      left: 0;
      transform: translate(-50%,-50%);
      cursor: se-resize;
    }
    .right{
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
}

.virtual-box{
  position: fixed;
  border: 1px solid rgb(63, 154, 218);
  user-select: none;
  overflow: hidden;

}

.hidden{
  display: none;
}

.lines-area{
  height: 1200px;
  // width: 2400px;
  background-color: transparent;
  &.cross{
    cursor: crosshair;
  }
  .line {
    stroke: rgb(20, 123, 227);
    fill: none;
    stroke-width: 2px;
    &:hover{
      // stroke: rgb(26, 226, 160);
      cursor: pointer;
    }
  }
  .hover-line{
    stroke: transparent;
    fill: none;
    stroke-width: 8px;
    z-index: 9;
    &:hover{
      // stroke: rgb(26, 226, 160);
      cursor: pointer;
    }
  }
}
.btn{
  position: fixed;
  width: 100px;
  height: 50px;
  left: 100px;
  top: 100px;
}

.assit-line{
  position: absolute;
  z-index: 9999;
}
.y-line{
  height: 100%;
  top: 0;
  border-left: 1px dashed rgb(114, 200, 250);
}
.x-line{
  width: 100%;
  left: 0;
  border-top: 1px dashed rgb(114, 200, 250);
}
.left-bar{
  position: fixed;
  background-color: #fff;
  border-radius: 8px;
  width: 70px;
  height: 500px;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  box-shadow: 0px 6px 20px rgba(25,25,26,.06), 0px 2px 12px rgba(25,25,26,.04);
  padding: 18px 0;
  .node-type-container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .node-type{
      width: 62px;
      height: 62px;
      // background-color: aqua;
      cursor: pointer;
      margin-bottom: 8px;
      background-color: transparent;
      svg{
        width: 100%;
        height: 100%;
        background-color: transparent;
        .line{
          stroke: #000;
          fill: none;
          stroke-width: 2px;
        }
      }
    }
  }
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
      &.juxing{
        background: url('./img/juxing.png') no-repeat;
        background-size: contain;
      }
      &.lingxing{
        background: url('./img/菱形.png') no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>
