<!-- <template>
  <div class="">
    {{ item }}
    <slot></slot>
  </div>
</template> -->

<script>
import { ref,reactive,onMounted,computed,defineProps,inject,defineComponent, h,createVNode  } from "vue"
export default {
  props: {
    item: String,
    model: Object
  },  
  setup(props) {
    const columns = inject('columns')
    const vnode = h('div',{}, 'hello')
    // debugger
    console.log(columns[0],'vnode')
    console.log(columns,'columns')
    return () => h('div',{}, columns[0]({ model: props.model }))
    // return () => h('div',{}, 'test-teim')
  },
  // tip-1: 当使用 setup 函数时，可以直接在setup里面return () => h('div',{}, 'test-teim')
  // 使用render参考test-item.ts
  // render() {
  //   return h('div',{}, 'test-teim')
  // }
}

</script>

<style lang="less" scoped>

</style>
