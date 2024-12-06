<template>
  <div class="tiptap">
    <button @click="insertTable">input</button>
    <button @click="insertInput">insertInput</button>
    <button @click="setContent">content</button>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { NodeType, Schema } from '@tiptap/pm/model'
import { ref,reactive,onMounted,computed } from "vue"
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Input } from './components/ElInput/ElInput'
import { myTableNode, myTableRowNode, myTableCellNode, test } from './components/Table/table'
// import { TableNode } from './components/Table/table'
// import { NodeView } from '@tiptap/pm/view'

const editor = useEditor({
  content: ``,
  extensions: [
    StarterKit,
    Table,
    TableRow,
    TableCell,
    TableHeader,

    // Input,
    // TableNode
    // myTableNode,
    // myTableRowNode,
    // myTableCellNode,
    test
  ],
  onUpdate: () => {
        // HTML | JSON
        // this.$emit('input', this.editor.getJSON())
        // this.$emit('input', this.editor.getHTML())
        // if(!this.json) this.json = this.editor.getJSON()
        console.log(editor.value.getJSON(),'json---')
        json.value = editor.value.getJSON()
      },
})
const json = ref({
    "type": "doc",
    "content": [
        {
            "type": "TableCellComponent",
            "attrs": {
                "count": 0,
                "list": {
                    "reqH": [
                        {
                            "id": 1716983320727,
                            "name": "1",
                            "reqType": "string",
                            "require": true,
                            "default": "",
                            "textarea": "",
                            "length": ""
                        }
                    ],
                    "reqB": [
                        {
                            "id": 1716983318549,
                            "require": false,
                            "length": "1",
                            "default": "1223",
                            "reqType": "",
                            "name": "1",
                            "textarea": ""
                        }
                    ]
                }
            }
        },
        {
            "type": "paragraph"
        }
    ]
})
const insertInput = () => {
  // 方式1
  editor.value.commands.insetTest()
  // 方式2：通过insertContent方法插入
  // editor.value.commands.insertContent({
  //   type: 'TableCellComponent',
  //   attrs: {
  //     class: 'my-class',
  //     style: 'color: red; font-size: 16px;'
  //   }
  // })
  // insertTable
}

const setContent = () => {
  editor.value.commands.setContent(json.value)
}
const insertTable = () => {
  editor.value.chain().focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  // editor.value.chain().focus().insertContent(`<TableCellComponent count="0"></TableCellComponent><p></p>`).run();
  // editor.value.chain().focus().insertContent({
  //   type: 'table',
  //   content: [
  //     {
  //       type: 'tableRow',
  //       content: [
  //         { type: 'tableCell', content: [] },
  //         { type: 'tableCell', content: [] },
  //       ],
  //     },
  //     {
  //       type: 'tableRow',
  //       content: [
  //         { type: 'tableCell', content: [] },
  //         { type: 'tableCell', content: [] },
  //       ],
  //     },
  //   ],
  // }).run();
};

onMounted(() => {
  console.log(editor,'editor')
})
</script>

<style lang="less" scoped>
.tiptap{
  width: 70%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid saddlebrown;
  :deep .ProseMirror:focus{
    outline: none;
  }
  button{
    margin-right: 10px;
  }
}
</style>
