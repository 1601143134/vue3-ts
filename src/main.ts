import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VConsole from 'vconsole';

import router from './router'

// const vConsole = new VConsole();
const app = createApp(App)

app.use(ElementPlus)
app.use(router)

app.mount('#app')
