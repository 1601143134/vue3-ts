<template>
  <div class="tr"  :class="{ 'childTr': childFlag }">
    <div 
      v-for="(item, index) in list"
      :key="item.id" 
      :class="{ 
        'childTd': childFlag, 
        'active': item.id == keyId,
        'downActive': downArry?.includes(item.id) }"
      @mouseenter="enter($event,item)"
      @mouseleave="leave($event,item)"
      @mousedown="down($event,item)"
      class="td">
      <div class="name">{{ item.name }}</div>
      <template v-if="item.child && item.child.length">
        <Item 
          :list="item.child" 
          :key-id="keyId" 
          :childFlag="true" 
          :down-arry="downArry"
          @node-hover="handleHover"
          @node-down="handleDown" 
         
          ></Item>
        <!-- @node-hover="handleHover" 绑定递归组件身上，因为组件里面又有mousenter事件，进入触发handleHover，handleHover又往上触发到父亲的handleHover -->
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive,onMounted,defineOptions,defineProps,defineEmits } from "vue"
defineOptions({
  name: 'Item'
})
const emit = defineEmits(['node-hover','node-down','node-up'])
// item对象接口
interface Iitem {
  id: string,
  name: string,
  child?: IChildItem[]
}
// 子数组接口
interface IChildItem {
  id: string,
  name: string,
}
const props = defineProps<{
  list: Iitem[],
  childFlag?: boolean,
  keyId?: string,
  downArry?: string[]
}>()
const down = (evt: MouseEvent, data: Iitem) => {
  if(!data.child || !data.child.length) {
    // 记录按下第一个的id
    emit('node-down', data)
  }
}

const up = (evt: MouseEvent, data: Iitem) => {
  emit('node-up')
}
const enter = (evt: MouseEvent, data: Iitem) => {
  // 叶子td
  if(!data.child || !data.child.length) {
    emit('node-hover', data)
    // 进入时判断是否按下，是添加id
    if(props.downArry.length){
      emit('node-down', data)
    }
  }
}
const leave = (evt: MouseEvent, data: Iitem) => {
  if(!data.child || !data.child.length) {
    emit('node-hover', {
      ...data,
      id: '',
    })
  }
}
const handleHover = (data) => {
  emit('node-hover', data)
}
const handleDown = (data) => {
  emit('node-down', data)
}

const handleUp = () => {
  emit('node-up')
}
</script>

<style lang="less" scoped>
/*
  第一层td 设置右、下边框
  子层tr设置最后一个td右边框none
  子层td设置上边框，取消下边框
*/
.tr{
  display: flex;
  width: 100%;
  .td{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    // align-items: center;
    user-select: none;
    border-right: 1px solid gray;
    border-bottom: 1px solid gray;
    // &.childTr 不能写在这里，嵌套失效，暂时没找到原因
    &.childTd{
      border-bottom: none;
      border-top: 1px solid gray;
    }
    .name{
      // width: 100%;
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.childTr{
  &>:last-child{
    border-right: none;
  }
}
.active{
  background-color: rgb(202, 246, 246);
}
.downActive{
  background-color: aqua;
}
</style>
