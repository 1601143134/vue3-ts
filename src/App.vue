<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import RequestAnimate from './components/RequestAnimate/index.vue'
// import ScaleImg from './components/ScalePicture/index.vue'
import CodePlatfrom from './components/CodePlatform/index.vue'
// import Tiptap from './components/Tiptap/index.vue'
// import MergeHeader from './components/MergeHeader/index.vue'
// import Slot from './components/Slot/index.vue'
import Dropdown from './components/DropDown/index.vue'
import { onMounted, ref } from 'vue';
import Message from './components/Message/index.ts';
import Form from './components/Form/index.vue'
import formItem from './components/Form/components/form-item.vue';
import Image from './components/Image/index.vue'
import MobileImage from './components/ImgageViewer/mobile.vue'
import Flow from './components/Flow/index.vue'
onMounted(() => {
  // Message('测试')
})
let index = 0
const addMessage = () => { Message('测试' + (index++)) }

let form = ref({
  name: '哈哈'
})

const check = () => {
  console.log(form.value,'form')
}
</script>

<template>

  <!-- <MobileImage></MobileImage> -->
  <!-- <div> -->
    <!-- <button @click="addMessage">添加</button> -->
    <!-- <RequestAnimate></RequestAnimate> -->
    <!-- <ScaleImg></ScaleImg> -->
    
  <!-- </div> -->
  <!-- <CodePlatfrom></CodePlatfrom> -->
   <!-- <div class="flow-module">
    <div class="flow-designer">
      <Flow></Flow>
    </div>
   </div> -->
   <!-- <div class="container">
    <Flow></Flow>
   </div> -->
  
  <!-- <Tiptap></Tiptap> -->
  <!-- <MergeHeader></MergeHeader> -->
  <!-- <Dropdown></Dropdown> -->

  <!-- <div>

    <button @click="check">查看</button>
    <Form :model="form">
      <form-item label="名字">
        <el-input v-model="form.name"></el-input>
      </form-item>
    </Form>
    
  </div> -->

  <!-- <Image></Image> -->

  <router-view></router-view>
</template>

<style lang="less" scoped>
.flow-module{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flow-designer{
  width: 80%;
  height: 500px;
}
.container{
  width: 100%;
  height: 100%;
}
</style>
