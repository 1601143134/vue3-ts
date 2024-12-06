import { defineComponent, h, inject } from 'vue';

// 定义一个普通组件
export default defineComponent({
  name: 'MyComponent',
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
  render() {
    console.log(this,'this')
    // 使用 `h` 函数创建虚拟 DOM 节点
    return h('li',{}, this.columns[0]({ model: this.props.model }))
    // return (
    //   <li>
    //   </li>
    // )
  }
});