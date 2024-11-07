self.addEventListener('install', () => {
  console.log('Service Worker installed')
})

self.addEventListener('activate', () => {
  console.log('Service Worker activated')
})

self.addEventListener('fetch', () => {
  // 这里可以处理网络请求
})
