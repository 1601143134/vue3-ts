import { createApp } from 'vue'
import MessageVue from './index.vue'

let id = 1
let zIndex = 1000
let msgInsArr = []
const Message = (options: Object | String) => {
  // 转化为对象
  if(typeof options === 'string') {
    options = {
      message: options,
      id: id++
    }
  }
  let mesId = id
  options.onClose = function() {
    Message.close(mesId)
  }

  const msgIns = createApp(MessageVue, {
    ...options
  })
  msgIns.mesId = mesId
  // 创建容器
  const div = document.createElement('div')
  div.setAttribute('class', 'message-container')
  msgIns.mount(div)

  // 设置容器top
  let top = 20
  msgInsArr.forEach(vnode => {
    top += vnode._instance.vnode.el.offsetHeight + 20
  })
  div.style.top = top + 'px'
  document.body.appendChild(div)
  msgInsArr.push(msgIns)
}

Message.close = (id) => {
  let len = msgInsArr.length
  let removeHeight 
  let startIndex = -1
  for(let i=0;i<msgInsArr.length;i++) {
    if(msgInsArr[i].mesId === id) {
      removeHeight = msgInsArr[i]._instance.vnode.el.offsetHeight
      startIndex = i
      msgInsArr.splice(i,1)
      break
    }
  }

  // 调整所有实例的top值
  if(len < 1 || startIndex === -1 || startIndex > msgInsArr.length - 1) return
  for(let i = startIndex;i<len - 1;i++){
    let dom = msgInsArr[i]._instance.vnode.el.parentNode;
    dom.style['top'] =
      parseInt(dom.style['top'], 10) - removeHeight - 20 + 'px';
  }
}

export default Message