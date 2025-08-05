// 🗄️ 고급 캐시 관리 시스템
class AdvancedCacheManager {
  constructor() {
    this.CACHE_NAME = 'dunlopillo-images-v1';
    this.CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7일
    this.localStorageKey = 'dunlopillo-cache-info';
    this.sessionStorageKey = 'dunlopillo-session-cache';
    
    this.init();
  }

  async init() {
    // Service Worker 지원 확인
    this.supportsServiceWorker = 'serviceWorker' in navigator;
    this.supportsCacheAPI = 'caches' in window;
    
    console.log('🗄️ 캐시 관리자 초기화:', {
      serviceWorker: this.supportsServiceWorker,
      cacheAPI: this.supportsCacheAPI
    });
  }

  // 1. Session Storage로 세션 내 캐시 유지
  saveToSessionCache(imageMap) {
    try {
      const cacheData = {
        timestamp: Date.now(),
        images: {},
        totalSize: 0
      };

      imageMap.forEach((blob, url) => {
        // 작은 이미지만 Session Storage에 저장 (5MB 제한)
        if (blob.size < 100 * 1024) { // 100KB 미만
          const reader = new FileReader();
          reader.onload = () => {
            cacheData.images[url] = {
              dataUrl: reader.result,
              size: blob.size,
              timestamp: Date.now()
            };
            cacheData.totalSize += blob.size;
          };
          reader.readAsDataURL(blob);
        }
      });

      sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(cacheData));
      console.log('💾 세션 캐시 저장 완료:', cacheData.totalSize, 'bytes');
    } catch (error) {
      console.warn('⚠️ 세션 캐시 저장 실패:', error);
    }
  }

  getFromSessionCache(url) {
    try {
      const cacheData = JSON.parse(sessionStorage.getItem(this.sessionStorageKey));
      if (cacheData && cacheData.images[url]) {
        const imageData = cacheData.images[url];
        
        // 1시간 이내 캐시만 사용
        if (Date.now() - imageData.timestamp < 60 * 60 * 1000) {
          return imageData.dataUrl;
        }
      }
    } catch (error) {
      console.warn('⚠️ 세션 캐시 읽기 실패:', error);
    }
    return null;
  }

  // 2. Local Storage로 방문 기록 관리
  saveVisitInfo(loadedImages) {
    try {
      const visitInfo = {
        timestamp: Date.now(),
        imageUrls: Array.from(loadedImages),
        version: '1.0'
      };
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(visitInfo));
      console.log('📝 방문 정보 저장:', visitInfo.imageUrls.length, '개 이미지');
    } catch (error) {
      console.warn('⚠️ 방문 정보 저장 실패:', error);
    }
  }

  getVisitInfo() {
    try {
      const visitInfo = JSON.parse(localStorage.getItem(this.localStorageKey));
      
      // 7일 이내 방문 기록만 유효
      if (visitInfo && Date.now() - visitInfo.timestamp < this.CACHE_DURATION) {
        return visitInfo;
      }
    } catch (error) {
      console.warn('⚠️ 방문 정보 읽기 실패:', error);
    }
    return null;
  }

  isReturnVisitor() {
    const visitInfo = this.getVisitInfo();
    return !!visitInfo;
  }

  // 3. Cache API 활용 (Service Worker 없이도 가능)
  async cacheImages(imageUrls) {
    if (!this.supportsCacheAPI) return false;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      
      const cachePromises = imageUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response.clone());
            return { url, status: 'cached' };
          }
        } catch (error) {
          return { url, status: 'failed', error: error.message };
        }
      });

      const results = await Promise.all(cachePromises);
      console.log('🗄️ Cache API 저장 결과:', results);
      
      return true;
    } catch (error) {
      console.warn('⚠️ Cache API 저장 실패:', error);
      return false;
    }
  }

  async getFromCache(url) {
    if (!this.supportsCacheAPI) return null;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(url);
      
      if (response) {
        console.log('✅ 캐시에서 이미지 로드:', url);
        return response;
      }
    } catch (error) {
      console.warn('⚠️ 캐시 읽기 실패:', error);
    }
    return null;
  }

  // 4. 스마트 프리로딩 전략
  async smartPreload(imageUrls, onProgress) {
    const visitInfo = this.getVisitInfo();
    const isReturnVisitor = !!visitInfo;
    
    console.log('🧠 스마트 프리로딩:', isReturnVisitor ? '재방문자' : '신규 방문자');

    if (isReturnVisitor) {
      // 재방문자: 캐시된 이미지 우선 확인
      const cachedUrls = [];
      const uncachedUrls = [];

      for (const url of imageUrls) {
        const cached = await this.getFromCache(url) || this.getFromSessionCache(url);
        if (cached) {
          cachedUrls.push(url);
        } else {
          uncachedUrls.push(url);
        }
      }

      console.log('📊 캐시 분석:', {
        cached: cachedUrls.length,
        uncached: uncachedUrls.length
      });

      // 캐시되지 않은 이미지만 새로 로드
      if (uncachedUrls.length > 0) {
        return this.loadNewImages(uncachedUrls, onProgress);
      } else {
        // 모든 이미지가 캐시됨
        onProgress && onProgress(imageUrls.length, imageUrls.length, '모든 이미지 캐시됨');
        return { loaded: imageUrls.length, failed: 0 };
      }
    } else {
      // 신규 방문자: 전체 로딩
      return this.loadNewImages(imageUrls, onProgress);
    }
  }

  async loadNewImages(imageUrls, onProgress) {
    const loadedImages = new Set();
    const failedImages = new Set();
    
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      
      try {
        const response = await fetch(url);
        if (response.ok) {
          // 즉시 Cache API에 저장
          if (this.supportsCacheAPI) {
            const cache = await caches.open(this.CACHE_NAME);
            await cache.put(url, response.clone());
          }
          
          loadedImages.add(url);
        } else {
          failedImages.add(url);
        }
      } catch (error) {
        failedImages.add(url);
      }
      
      onProgress && onProgress(loadedImages.size, imageUrls.length, url);
    }

    // 방문 정보 저장
    this.saveVisitInfo(loadedImages);
    
    return {
      loaded: loadedImages.size,
      failed: failedImages.size
    };
  }

  // 5. 캐시 정리
  async clearOldCache() {
    try {
      // Cache API 정리
      if (this.supportsCacheAPI) {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name.startsWith('dunlopillo-images-') && name !== this.CACHE_NAME
        );
        
        await Promise.all(oldCaches.map(name => caches.delete(name)));
        console.log('🧹 오래된 캐시 정리:', oldCaches.length, '개');
      }

      // Local Storage 정리
      const visitInfo = this.getVisitInfo();
      if (!visitInfo) {
        localStorage.removeItem(this.localStorageKey);
      }

    } catch (error) {
      console.warn('⚠️ 캐시 정리 실패:', error);
    }
  }

  // 6. 캐시 상태 정보
  async getCacheStatus() {
    const status = {
      isReturnVisitor: this.isReturnVisitor(),
      sessionCacheSize: 0,
      cacheApiSupported: this.supportsCacheAPI,
      serviceWorkerSupported: this.supportsServiceWorker
    };

    try {
      const sessionCache = sessionStorage.getItem(this.sessionStorageKey);
      if (sessionCache) {
        status.sessionCacheSize = JSON.parse(sessionCache).totalSize || 0;
      }
    } catch (error) {
      // 무시
    }

    if (this.supportsCacheAPI) {
      try {
        const cache = await caches.open(this.CACHE_NAME);
        const keys = await cache.keys();
        status.cacheApiEntries = keys.length;
      } catch (error) {
        status.cacheApiEntries = 0;
      }
    }

    return status;
  }
}

// 전역 인스턴스 생성
window.cacheManager = new AdvancedCacheManager();

console.log('🗄️ 고급 캐시 관리자 로드 완료');
