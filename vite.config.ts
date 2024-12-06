import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";

// 使用到了上面下载的@types/node
import path from 'path'  
// 以下三项引入是为配置Element-plus自动按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// require('events').EventEmitter.defaultMaxListeners = 0;


export default defineConfig({
  plugins: [
    vue(),
    // vueJsx()
    // 以下两项是为配置Element-plus自动按需导入
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // })
  ],
  // server:{     // 手机端调试打开 host：电脑本地ip，端口自定义，手机直接访问，访问不了需要关闭下电脑防火墙
  //   host:'172.172.88.106',
  //   port:3344
  // },
  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    }
  }
})

