<template>
  <!-- 左边选择区 -->
  <div class="cd-left-drag">
    <div class="tabs"></div>
    <ul>
      <draggable
        v-model="leftArry" 
        :group="{ name:'people',pull: 'clone', put: false }" 
        @start="drag=true" 
        @end="drag=false" 
        item-key="name"
        class="list"
        :sort="false"
        @clone="handleClone"
      >
        <template #item="{ element }">
          <div class="item">
            <span>{{ element.name }}</span>
          </div>
        </template>
      </draggable>
    </ul>
    
    <span class="line"></span>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted,computed } from "vue"
import draggable from "vuedraggable";
interface leftItem {
  name: String,
  type: String
}
const leftDrag = ref<boolean>(false)
const leftArry = ref<leftItem[]>([
  {
    name: '容器',
    type: 'container',
    colwidth: 'empty'
  },
  {
    name: '文本',
    type: 'text'
  },
  {
    name: '数值',
    type: 'number'
  },
])

const handleClone = (cloneItem:any) => {

      console.log(cloneItem,'clonedItem')
      cloneItem.isCloned = true
      return cloneItem;
}
</script>

<style lang="less" scoped>
*{
  box-sizing: border-box;
}
@primary-line-color: #cccccc;
@primary-bgd-color: #f2f3f5;
@white-color: #fff;
.cd-left-drag{
  width: 255px;
  min-width: 255px;
  height: 100%;
  border-top: 1px solid @primary-line-color;
  border-bottom: 1px solid @primary-line-color;
  position: relative;
  background-color: @white-color;
  .tabs{
    height: 46px;
    border-bottom: 1px solid @primary-line-color;
  }
  ul{
    list-style: none;
    .ghost{
      background-color: red;
    }
  }
  .list{
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 46px);
    overflow: auto;
    padding: 10px 0 10px 20px;
    .drag{
      background-color: red;
    }
    .item{
      width: 100px;
      margin: 0px 12px 10px 0px;
      height: 35px;
      border: 1px solid @primary-line-color;
    }
  }
  .line{
    width: 3px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background-color: transparent;
    cursor: e-resize;
    &:hover{
      // display: block;
      background-color: aqua;

    }
  }
}
</style>
