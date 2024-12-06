<!-- <template>
  <div class="form-item">
    <div class="label">{{ props.label }}</div>
    <slot></slot>
  </div>
</template> -->

<script setup lang="ts">
import { h,ref,reactive,onMounted,onBeforeMount,computed, defineProps, getCurrentInstance, defineComponent, inject } from "vue"
interface IProps {
  label: string,
}



const props = defineProps<IProps>()

const _this = getCurrentInstance()

console.log(_this,'_this')
// render不生效，查看test-item.vue tip-1
// defineComponent({
//   render() {
//     return h('div', '123')
//   }
// })

const columns = inject('columns')

onBeforeMount(() => {
  columns.push(_this.slots.default)
  console.log(columns,'col')
})



</script>

<style lang="less" scoped>
.form-item{
  display: flex;
}
</style>
