import { createApp, h, ref } from 'vue';
import ElementPlus, { ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';

import {  Node, NodeView } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { TextSelection } from '@tiptap/pm/state'
import TableCellComponent from './dropdown.vue'

export const myTableNode = Node.create({
  name: 'table',
  group: 'block',
  content: 'tableRow+',
  tableRole: 'table',
  isolating: true,
  parseHTML() {
    return [{ tag: 'table' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['table', HTMLAttributes, 0];
  },
});

export const myTableRowNode = Node.create({
  name: 'tableRow',
  group: 'tableRow',
  content: 'tableCell+',
  tableRole: 'row',
  parseHTML() {
    return [{ tag: 'tr' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['tr', HTMLAttributes, 0];
  },
});

export const myTableCellNode = Node.create({
  name: 'tableCell',
  group: 'tableCell',
  content: 'block+',
  tableRole: 'cell',
  isolating: true,
  parseHTML() {
    return [{ tag: 'td' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['td', HTMLAttributes, 0];
  },
  addNodeView() {
    return VueNodeViewRenderer(TableCellComponent);
  },
});

export const test = Node.create({
  name: 'TableCellComponent',
  group: 'block',
  parseHTML() {
    return [{ tag: 'TableCellComponent' }];
  },
  renderHTML({ HTMLAttributes }) {
    // 标签
    return ['TableCellComponent', HTMLAttributes,0];
  },
  // 定义属性
  addAttributes() {
    return {
      // 传入的props
      count: {
        default: 0,
        // 定义如何从 HTML 解析出节点。这里指定了 HTML 标签 <custom-node>。
        parseHTML: element => parseInt(element.getAttribute('data-count'), 10),
        // 定义如何将节点渲染为 HTML。这里返回 <custom-node> 标签和 HTMLAttributes。
        renderHTML: attributes => {
          return {
            // 属性会被挂载到标签上
            'data-count': JSON.stringify(attributes.count),
          };
        },
      },
      list: {
        // default: [1,2,3]
        default: {
          reqH: [
            {
              id: +new Date(),
              require: false,
              length: '1',
              default: '1223',
              reqType: '',
              name: '1',
              textarea: ''
            }
          ],
          reqB: [
            {
              id: +new Date(),
              require: false,
              length: '1',
              default: '1223',
              reqType: '',
              name: '1',
              textarea: ''
            }
          ]
        }
      },
      // 添加类名--不能跟addNodeView同时使用，不然会被覆盖渲染
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          return {
            class: attributes.class,
          };
        },
      },
      // 添加内联样式--不能跟addNodeView同时使用，不然会被覆盖渲染
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          return {
            style: attributes.style,
          };
        },
      }
    }
  },
  // 渲染指定组件
  addNodeView() {
    // debugger
    return VueNodeViewRenderer(TableCellComponent);
  },
  addCommands() {
    return {
      insetTest:
      () => ({ tr, dispatch, editor, commands }) => {
        const roles: { [key: string]: NodeType } =  editor.schema.cached.TableCellComponent || {}
        
        if(!roles.TableCellComponent){
          // 找到schema中对应的规则
          Object.keys(editor.schema.nodes).forEach(type => {
            const nodeType = editor.schema.nodes[type]

            if (nodeType.name == 'TableCellComponent') {
              roles[nodeType.name] = nodeType
            }
          })

          // 放到cache里面:提高查找效率、避免重复代码：
          editor.schema.cached.TableCellComponent = roles
        }
        
        const rows: ProsemirrorNode[] = []
        const node = roles.TableCellComponent.createChecked(null, rows)
        if (dispatch) {
          const offset = tr.selection.anchor
          // 用自定义节点替换当前选区，并设置光标位置
          // tr.doc.resolve(offset) 方法解析光标位置
          // tr.doc.resolve(offset) 用于将光标位置解析为一个 ResolvedPos 对象
          // TextSelection.near 方法设置新的光标位置
          tr.replaceSelectionWith(node)  
            .scrollIntoView()
            .setSelection(TextSelection.near(tr.doc.resolve(offset)))
        }

        return true
        // setNode 只支持文本块节点
        // return commands.setNode(this.name)
      }
    }
  }
});


