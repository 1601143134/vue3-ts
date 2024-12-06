<template>
  <transition 
    name="show"
    @after-leave="handleLeave"
  >
    <div 
      v-show="visible"
      class="message-box">
      <div>{{ message }}</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, ComponentInternalInstance } from "vue"
interface Props {
  message: string,
  onClose?: Function,
  duration: number
}
const props = withDefaults(defineProps<Props>(), {
  message: '你好',
  duration: 3000
})

// 没有显式声明接口interface，上面为显式声明接口方式，然后加上默认值
// const props = defineProps<{
//   message: string
// }>()
const instance: ComponentInternalInstance = getCurrentInstance();
const handleLeave = () => {
  const parent: HTMLElement = instance.vnode.el.parentNode
  parent?.remove()
}
const visible = ref(false)

onMounted(() => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
    props.onClose()
  }, props.duration)
})

</script>

<style lang="less" scoped>
.message-box{
  background-color: rgb(26, 227, 167);
}
.show-enter-from, 
.show-leave-to{
  opacity: 0;
  transform: translate(0, -100%);
}
.show-enter-active{
  transition: transform .3s, opacity .5s ease;
}
.show-leave-active{
  transition: transform .5s, opacity .3s ease-out;
}
</style>
