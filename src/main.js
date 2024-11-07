import './assets/style.css'
//import './registerServiceWorker';
import './service-worker'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/styles.scss'
import './assets/modal.css'
import i18n from './i18n'

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

// 更新 <title> 的函数
const updateTitle = () => {
  document.title = i18n.global.t('title') // 设置标题
}

// 设置初始语言
const savedLanguage = localStorage.getItem('language') || 'ja'
i18n.global.locale = savedLanguage
updateTitle() // 初始化时更新标题

// 监听语言变化
app.config.globalProperties.$changeLanguage = lang => {
  i18n.global.locale = lang
  localStorage.setItem('language', lang)
  updateTitle() // 切换语言时更新标题
}

//注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error)
      })
  })
}

app.mount('#app')
