/*
## https://v3-migration.vuejs.org/zh/breaking-changes/custom-directives
vue3自定义指令钩子

  created：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加在普通的 v-on 事件监听器调用前的事件监听器中时，这很有用。

  beforeMount：当指令第一次绑定到元素并且在挂载父组件之前调用。

  mounted：在绑定元素的父组件被挂载后调用，大部分自定义指令都写在这里。

  beforeUpdate：在更新包含组件的 VNode 之前调用。

  updated：在包含组件的 VNode 及其子组件的 VNode 更新后调用。

  beforeUnmount：在卸载绑定元素的父组件之前调用

  unmounted：当指令与元素解除绑定且父组件已卸载时，只调用一次。

*/