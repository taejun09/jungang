const CACHE_NAME = 'jungang-v1';  // 캐시의 이름을 설정합니다.
const urlsToCache = [
    '/jungang',  // 홈페이지
    '/index.html',  // 기본 HTML 파일
    '/Jungang-main',  // CSS 파일
    '/app.js',  // JavaScript 파일
];

// 설치 시 캐시 처리
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files...');
                return cache.addAll(urlsToCache);  // 필수 자원들을 캐시합니다.
            })
    );
});

// 활성화 시 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];  // 최신 캐시만 유지
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);  // 오래된 캐시 삭제
                    }
                })
            );
        })
    );
});

// 네트워크 요청을 처리하는 부분
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // 캐시에서 응답을 찾으면 그것을 반환하고, 없으면 네트워크에서 가져옵니다.
                return cachedResponse || fetch(event.request);
            })
    );
});
