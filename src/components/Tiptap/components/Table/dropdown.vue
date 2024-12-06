<!-- TableCellComponent.vue -->
<template>
  <node-view-wrapper  class="DevPropTest">
    <button @click="getAll">收集全部数据</button>
    <div class="content">
      <!-- <el-input></el-input> -->
      <el-select v-model="select">
        <el-option label="1" value="222"></el-option>
      </el-select>
      <div class="list">
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="Headers">
          <BaseForm
            :list="cloneList.reqH"
            @update="handleUpdateReqHeaderData"
          />
        </el-tab-pane>
        <el-tab-pane label="Body">
          <BaseForm
            :list="cloneList.reqB"
            @update="handleUpdateReqBodyData"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </node-view-wrapper>
</template>

<script>

import { ref, defineProps } from 'vue';
import BaseForm from './baseform.vue'
import { NodeViewWrapper,NodeViewContent,nodeViewProps } from '@tiptap/vue-3';
/**
  vue3需要使用defineComponent
  export default defineComponent({
    props: nodeViewProps,
  })
 */
export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
    BaseForm
  },
  // 使用封装的API接收
  // props: nodeViewProps,
  // 显式声明接收
  props: {
    node: {
      type: Object,
      required: true,
    },
    updateAttributes: {
      type: Function,
      required: true,
    },
  },
  data(){
    return {
      select: '',
      arry: [12,2,3,5],
      cloneList: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.node.attrs.list,'nextTick')
      this.cloneList = this.node.attrs.list
    })
    
  },
  methods: {
    getAll() {
      this.updateAttributes({
        list: this.cloneList,
      })
    },
    increase() {
      console.log(this,'this0--')
      this.updateAttributes({
        count: this.node.attrs.count + 1,
      })
    },
    handleUpdateReqHeaderData(data) {
      console.log(data,'hhhh')

    },
    handleUpdateReqBodyData(data) {
      console.log(data,'ddd')
    },
  },
};
</script>

<style lang="less">
.bg{
  width: 100px;
  height: 50px;
  border: 1px solid salmon;
  .content {
    margin: 2.5rem 1rem 1rem;
    padding: 0.5rem;
    border: 2px dashed #0D0D0D20;
    border-radius: 0.5rem;
  }
}
.DevPropTest{
  display: flex;
  padding: 0.5rem;
  margin: 0.5rem 10px;
  border-radius: 0.5rem;
  background: white;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1),
  ;
  .content{
    flex: 1;
    .list{
      .item{
        height: 20px;
      }
    }
  }
}
</style>