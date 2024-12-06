import {
  callOrReturn, getExtensionField, mergeAttributes, Node, ParentConfig,
} from '@tiptap/core'
import { DOMOutputSpec } from '@tiptap/pm/model'


export interface InputOptions {
  HTMLAttributes: Record<string, any>
}
export const Input = Node.create<InputOptions>({
  name: 'CustomInput',
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: false,
    }
  },
  content: 'inline*',
  isolating: true,
  group: 'block',
  parseHTML() {
    return [{ tag: 'input' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    return[
      'div',
      ['input',mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),0],
      
    ]

  },

  addCommands() {
    return {
      setInput: () => ({ commands }) => {
        return commands.setNode(this.name)
      },
    }
  },
})