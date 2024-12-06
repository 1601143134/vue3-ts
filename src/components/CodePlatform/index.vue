<template>
  <div class="cd-wrapper">
    <!-- 侧边目录 -->
    <div class="cd-sidebar"></div>
    <!-- 内容区 -->
    <div class="cd-body">
      <!-- 头部 -->
      <div class="cd-header">

      </div>

      <!-- 展示、编辑区域 -->
      <div class="cd-content">
        <div class="cd-edit">
          <div class="cd-toolbar"></div>
          <!-- <div class="cd-editbar"></div> -->
          <div class="cd-edit-body">
            <!-- 左边选择区 -->
            <left></left>
            <!-- 中间放置区 -->
            <middle></middle>
            <!-- 右边属性区域 -->
            <div class="cd-right-attr"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import left from './components/left/index.vue'
import middle from './components/middle/index.vue'
import { ref,reactive,onMounted,computed } from "vue"





</script>

<style lang="less" scoped>
*{
  box-sizing: border-box;
}
@primary-line-color: #cccccc;
@primary-bgd-color: #f2f3f5;
@white-color: #fff;
.cd-wrapper{
  background-color: @primary-bgd-color;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .cd-sidebar{
    width: 56px;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    border: 1px solid @primary-line-color;
  }
  .cd-body{
    // width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 56px;
    .cd-header{
      height: 60px;
      display: flex;
      justify-content: space-between;
      background-color: @white-color;
      border-top: 1px solid @primary-line-color;
    }
    .cd-content{
      height: 100%;
      flex: 1;
      .cd-edit{
        height: 100%;
        .cd-toolbar{
          width: 100%;
          height: 40px;
          // border-bottom: 1px solid @primary-line-color;
          border-top: 1px solid @primary-line-color;
          background-color: @white-color;
        }
        .cd-editbar{
          height: 30px;
          background-color: @white-color;
        }
        .cd-edit-body{
          height: calc(100% - 50px);
          display: flex;
          justify-content: space-between;
          
          .cd-right-attr{
            background-color: @white-color;
            width: 300px;
            min-width: 300px;
            height: 100%;
            border-top: 1px solid @primary-line-color;
          }
        }
      }
    }
  }
}
</style>
