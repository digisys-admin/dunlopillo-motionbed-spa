/**
 * 🚀 던롭필로 SPA Service Worker
 * 오프라인 기능 및 캐싱 관리
 */

const CACHE_NAME = 'dunlopillo-spa-v1.0.0';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/screens.js',
  '/survey-data-manager.js',
  '/survey-data.js',
  '/manifest.json',
  
  // 홈 화면 동영상들 (Cloudinary)
  'https://res.cloudinary.com/di2pd92t1/video/upload/v1753767432/%E1%84%83%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A9%E1%86%B8_video_01_tt5wqe.mp4',
  'https://res.cloudinary.com/di2pd92t1/video/upload/v1753767434/%E1%84%83%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A9%E1%86%B8_video_02_n8rnf8.mp4',
  'https://res.cloudinary.com/di2pd92t1/video/upload/v1753767442/%E1%84%83%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A9%E1%86%B8_video_03_x67vjb.mp4',
  
  // 이미지 파일들
  '/assets/pics/dunlopillo_logo.png',
  '/assets/pics/dunlopillo_logo_white.png',
  '/assets/pics/home-icon.png',
  '/assets/pics/p2_pic1.png',
  '/assets/pics/p2_bed.png',
  '/assets/pics/p3_pic1.png',
  '/assets/pics/p4_pic1.png',
  '/assets/pics/p4_remote1.png',
  '/assets/pics/p6_pic1.png',
  '/assets/pics/p6_remote.png',
  '/assets/pics/p7_pic1.png',
  '/assets/pics/p7_remote.png',
  '/assets/pics/p9_pic1.png',
  '/assets/pics/p10_pic1.png',
  '/assets/pics/p11_pic1.png',
  '/assets/pics/p11_remote.png',
  '/assets/pics/p13_pic1.png',
  '/assets/pics/p13_remote.png',
  '/assets/pics/p14_pic1.png',
  '/assets/pics/p15_pic1.png',
  '/assets/pics/p15_remote.png',
  '/assets/pics/p16_pic1.png',
  '/assets/pics/p16-hand1.png',
  '/assets/pics/p16-hand2.png',
  '/assets/pics/p17_remote.png',
  '/assets/pics/p19_pic1.png',
  
  // 음성 파일들 (중요한 것들만)
  '/assets/voices/voice_page3.mp3',
  '/assets/voices/voice_page4.mp3',
  '/assets/voices/voice_page5.mp3',
  '/assets/voices/voice_page7.mp3',
  '/assets/voices/voice_page8.mp3',
  '/assets/voices/voice_page10.mp3',
  '/assets/voices/voice_page11.mp3',
  '/assets/voices/voice_page12.mp3',
  '/assets/voices/voice_page13.mp3',
  '/assets/voices/voice_page15.mp3',
  '/assets/voices/voice_page17.mp3',
  '/assets/voices/voice_tip1.mp3',
  '/assets/voices/voice_tip2.mp3',
  '/assets/voices/voice_tip3.mp3',
  '/assets/voices/voice_tip4.mp3',
  '/assets/voices/voice_tip5.mp3'
];

// 📦 Service Worker 설치
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker 설치 중...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 캐시 오픈 성공:', CACHE_NAME);
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('✅ 모든 리소스 캐시 완료');
        self.skipWaiting(); // 즉시 활성화
      })
      .catch((error) => {
        console.error('❌ 캐시 실패:', error);
      })
  );
});

// 🔄 Service Worker 활성화
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker 활성화 중...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 이전 버전 캐시 삭제
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ 이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker 활성화 완료');
      self.clients.claim(); // 즉시 제어권 획득
    })
  );
});

// 🌐 네트워크 요청 가로채기 (Cache First 전략)
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Google Drive 동영상은 캐시, Google Sheets API는 네트워크 우선
  if (event.request.url.includes('script.google.com')) {
    // Google Sheets API만 네트워크 우선 (설문 데이터 전송용)
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('📡 Google Sheets API 오프라인 - 기본 응답 제공');
          return new Response('{"offline": true}', {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시에서 제공
        if (response) {
          console.log('📦 캐시에서 제공:', event.request.url);
          return response;
        }
        
        // 캐시에 없으면 네트워크에서 가져오기
        console.log('🌐 네트워크에서 가져오기:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // 정상 응답이면 캐시에 저장
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            console.log('❌ 네트워크 실패 - 오프라인 페이지 제공');
            
            // HTML 요청인 경우 메인 페이지 제공
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // 이미지 요청인 경우 로고 제공
            if (event.request.headers.get('accept').includes('image')) {
              return caches.match('/assets/pics/dunlopillo_logo.png');
            }
            
            // 기타 요청은 네트워크 오류 반환
            return new Response('오프라인 상태입니다', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// 📱 PWA 설치 가능 알림
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // 오프라인 데이터 저장 요청
  if (event.data && event.data.type === 'SAVE_OFFLINE_DATA') {
    saveOfflineData(event.data.payload);
  }
});

// 🔄 Background Sync - 온라인 상태가 되면 자동 동기화
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync 이벤트:', event.tag);
  
  if (event.tag === 'survey-data-sync') {
    event.waitUntil(syncSurveyData());
  }
});

// 📊 오프라인 데이터 저장 (IndexedDB 사용)
async function saveOfflineData(data) {
  try {
    const db = await openDB();
    const transaction = db.transaction(['offline_data'], 'readwrite');
    const store = transaction.objectStore('offline_data');
    
    const dataWithTimestamp = {
      ...data,
      timestamp: Date.now(),
      synced: false
    };
    
    await store.add(dataWithTimestamp);
    console.log('💾 오프라인 데이터 저장:', dataWithTimestamp);
    
    // Background Sync 등록
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('survey-data-sync');
      console.log('🔄 Background Sync 등록 완료');
    }
  } catch (error) {
    console.error('❌ 오프라인 데이터 저장 실패:', error);
  }
}

// 🌐 온라인 상태에서 데이터 동기화
async function syncSurveyData() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['offline_data'], 'readwrite');
    const store = transaction.objectStore('offline_data');
    
    // 동기화되지 않은 데이터 조회
    const unsyncedData = await store.getAll();
    const pendingData = unsyncedData.filter(item => !item.synced);
    
    console.log(`📤 동기화할 데이터 ${pendingData.length}개 발견`);
    
    for (const data of pendingData) {
      try {
        // Google Sheets API로 데이터 전송
        const response = await fetch(data.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data.payload)
        });
        
        if (response.ok) {
          // 성공 시 동기화 완료 표시
          data.synced = true;
          data.syncedAt = Date.now();
          await store.put(data);
          console.log('✅ 데이터 동기화 성공:', data.timestamp);
        } else {
          console.warn('⚠️ 데이터 동기화 실패:', response.status);
        }
      } catch (error) {
        console.error('❌ 개별 데이터 동기화 실패:', error);
      }
    }
    
    // 성공적으로 동기화된 데이터 정리 (7일 후)
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const oldSyncedData = unsyncedData.filter(item => 
      item.synced && item.syncedAt < weekAgo
    );
    
    for (const oldData of oldSyncedData) {
      await store.delete(oldData.id);
    }
    
    if (oldSyncedData.length > 0) {
      console.log(`🗑️ 오래된 동기화 데이터 ${oldSyncedData.length}개 정리`);
    }
    
  } catch (error) {
    console.error('❌ 데이터 동기화 실패:', error);
  }
}

// 📁 IndexedDB 연결
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DunlopilloDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('offline_data')) {
        const store = db.createObjectStore('offline_data', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
}

console.log('✅ Service Worker 로드 완료 (Background Sync 포함)');
