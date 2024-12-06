<template>
  <div class="wrapper">
    <div 
      @mouseup="handleUp"
      @mousemove.prevent="handleMove" 
      ref="headerWrapper" 
      class="header-warpper">
      <Item 
        :list="test" 
        :key-id="keyId"
        :downArry="downSelectArry"
        @node-down="handleDown" 
        @node-hover="handleHover"
       
      />
      <!--  @node-up="handleUp" -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import Item from './components/item.vue'
import { v4 as uuidv4 } from 'uuid';
import { ref,reactive,onMounted,computed,defineProps } from "vue"
// 使用函数类型来定义
const randomId: () => number = () => {
  let random = parseInt(Math.random() * 10) == 0 ? 1 : parseInt(Math.random() * 10)
  // return random * (+new Date())
  return random * Date.now()
}
interface IlistItem {
  id?: number,
  name?: string
}
const keyId = ref<string>('')
const headerWrapper = ref<HTMLElement>()
let rect = null
let timer = null
let scrollTimer = null
let max = 0
const isOut = ref<boolean>(false)
// 滚动条自动滚动逻辑
const handleMove = (evt: MouseEvent) => {
  if(scrollTimer) return
  if(
    isDown.value 
    && rect
    && isOut
    && (evt.currentTarget.clientWidth - (evt.pageX - rect.left)) < 100
  ){
    scrollTimer = setInterval(() => {
      headerWrapper.value.scrollLeft += 3
    },20)
  }
}
// 手指放开逻辑
const handleUp = () => {
  isDown.value = false
  clearTimeout(timer)
  clearInterval(scrollTimer)
  scrollTimer = null
  console.log(scrollTimer,'放开')

  timer = setTimeout(() => {
    // 
    if(downSelectArry.value.length <= 1){
      return downSelectArry.value = []
    }
    // 设置多级表头
    // 边界：第一层级没有父，其余的要在父底下新加一个item
    const parent = getfindParentByChildId(test.value,downSelectArry.value[0])
    let newItem = {
      name: 'newname',
      id: uuidv4(),
      child:[]
    }
    let index = -1
    if(parent){
      const sons = parent.child.filter((item) => downSelectArry.value.includes(item.id))
      for(let i=parent.child.length - 1;i>=0;i--){
        if(downSelectArry.value.includes(parent.child[i].id)){
          index = i
          parent.child.splice(i,1)
        }
      }
      newItem.child = sons
      parent.child.splice(index,0,newItem)
    }else{
      const sons = test.value.filter((item) => downSelectArry.value.includes(item.id))
      newItem.child = sons
      for(let i=test.value.length - 1;i>=0;i--){
        if(downSelectArry.value.includes(test.value[i].id)){
          index = i
          test.value.splice(i,1)
        }
      }
      test.value.splice(index,0,newItem)
    }
    downSelectArry.value = []
  },200)
}

const handleHover = (data) => {
  keyId.value = data.id || ''
} 
const handleDown = (data) => {
  rect = headerWrapper.value.getBoundingClientRect()
  max = headerWrapper.value.scrollWidth - headerWrapper.value.clientWidth
  if(headerWrapper.value.scrollWidth > headerWrapper.value.clientWidth) isOut.value = true
  if(data) {
    isDown.value = true
    // 判断是否是同一层级的
    if(downSelectArry.value.length){
      const result = deepSearch(test.value, data.id)
      if(!result.includes(downSelectArry.value[0])){
        downSelectArry.value = []
      }else{
        downSelectArry.value.push(data.id)
      }
    }else{
      downSelectArry.value.push(data.id)
    }    
  }else{
    isDown.value = false
    downSelectArry.value = []
  }
}
// 查找同层级的兄弟节点
const deepSearch = (list,key) => {
  let result = []
  function deep(nodes) {
    for(let node of nodes){
      if(node.id == key) {
        result = nodes
      }else{
        if(node.child && node.child.length){
          deep(node.child)
        }
      }
    }
  }
  deep(list)
  return result.map(item => item.id)
}
// 查找父级节点
const getfindParentByChildId = (tree, nodeId) => {
  let parentOfFirstChild = null;
  const dfs = (node, parent) => {
    if (parentOfFirstChild !== null) {
      return;
    }
    if (node.child && node.child.length > 0) {
      // eslint-disable-next-line
      for (const child of node.child) {
        dfs(child, node);
      }
    } else {
      // 找到对应节点后，返回其父节点
      if (node.id === nodeId) {
        parentOfFirstChild = parent;
      }
    }
  }
  for (const node of tree) {
    dfs(node, null);
  }
  return parentOfFirstChild
}
const isDown = ref<boolean>(false)
const downSelectArry = ref<string[]>([])
const list = ref<IlistItem[]>([])
const test = ref([])

onMounted(() => {
  test.value = new Array(50).fill('').map((item,index) => {
    return {
      id: uuidv4(),
      name: 'name' + (++index)
    }
  })
})
</script>

<style lang="less" scoped>
.wrapper{
  width: 100%;
  height: 100vh;
  border: 1px solid salmon;
  padding: 30px 30px;
  .header-warpper{
    width: 100%;
    display: flex;
    border-left: 1px solid gray;
    border-top: 1px solid gray;
    overflow: auto;
    // transition: all .1s ease;
  }
}
</style>
