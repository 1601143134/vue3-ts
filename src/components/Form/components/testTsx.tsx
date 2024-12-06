import { defineComponent,ref,inject } from 'vue'
export default defineComponent({
  name: 'MyTsxTest',
  props: {
    item: String,
    model: Object
  },
  setup(props) {
    const columns = inject('columns')
    console.log(props,'propswww')
    return {
      columns,
      props
    }
  },
  // render可以直接返回jsx-虚拟dom
  render(){
    // 内部使用this获取data
    return <>
      <li>
        { this.columns[0]({ model: this.props.model }) }
      </li>
    </>
  }
})