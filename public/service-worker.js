//public/service-worker.js
self.addEventListener('install', () => {
    console.log('Service Worker installing...');
});

self.addEventListener('activate', () => {
    console.log('Service Worker activating...');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((response) => {
                // 只缓存状态码为 200 的完整响应
                if (response.status === 200) {
                    return caches.open('audio-cache').then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                }
                return response; // 如果不是 200 状态，直接返回响应
            });
        })
    );
});
