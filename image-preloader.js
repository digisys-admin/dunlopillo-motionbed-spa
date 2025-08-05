/**
 * 🚀 Dunlopillo SPA 이미지 프리로더 시스템
 * 
 * 기능:
 * - 사용자가 페이지를 보기 전에 미리 모든 이미지를 로드
 * - Progressive Loading: 중요한 이미지부터 우선 로드
 * - 스마트 캐싱: 브라우저 캐시 최적화
 * - 로딩 진행상황 표시
 * - 오류 복구 시스템
 */

class ImagePreloader {
  constructor() {
    this.loadedImages = new Map();
    this.failedImages = new Set();
    this.loadingPromises = new Map();
    this.totalImages = 0;
    this.loadedCount = 0;
    this.onProgress = null;
    this.onComplete = null;
    
    // 우선순위별 이미지 분류
    this.criticalImages = []; // 홈화면, 첫 페이지
    this.importantImages = []; // 2-5페이지
    this.normalImages = []; // 나머지 페이지
    
    this.init();
  }

  init() {
    this.categorizeImages();
    console.log('🚀 이미지 프리로더 초기화 완료');
    console.log(`📊 총 이미지: ${this.totalImages}개 (중요: ${this.criticalImages.length}, 일반: ${this.importantImages.length + this.normalImages.length})`);
  }

  // 이미지를 중요도별로 분류
  categorizeImages() {
    if (!window.IMG) {
      console.warn('⚠️ IMG 객체를 찾을 수 없습니다');
      return;
    }

    // 중요 이미지 (즉시 로드)
    this.criticalImages = [
      { key: 'LOGO', url: window.IMG.LOGO, alt: '던롭필로 로고' },
      { key: 'PAGE2_GROUP', url: window.IMG.PAGE2_GROUP, alt: '페이지2 그룹' },
      { key: 'PAGE2_BED', url: window.IMG.PAGE2_BED, alt: '페이지2 베드' },
      { key: 'P3_PIC1', url: window.IMG.P3_PIC1, alt: '페이지3 이미지' },
      { key: 'P4_PIC1', url: window.IMG.P4_PIC1, alt: '페이지4 이미지' }
    ];

    // 일반 중요 이미지 (백그라운드 로드)
    this.importantImages = [
      { key: 'P4_REMOTE1', url: window.IMG.P4_REMOTE1, alt: '페이지4 리모컨' },
      { key: 'P6_PIC1', url: window.IMG.P6_PIC1, alt: '페이지6 이미지' },
      { key: 'P7_PIC1', url: window.IMG.P7_PIC1, alt: '페이지7 이미지' },
      { key: 'P9_PIC1', url: window.IMG.P9_PIC1, alt: '페이지9 이미지' },
      { key: 'P10_PIC1', url: window.IMG.P10_PIC1, alt: '페이지10 이미지' }
    ];

    // 나머지 이미지 (지연 로드)
    this.normalImages = [
      { key: 'P11_PIC1', url: window.IMG.P11_PIC1, alt: '페이지11 이미지' },
      { key: 'P13_PIC1', url: window.IMG.P13_PIC1, alt: '페이지13 이미지' },
      { key: 'P14_PIC1', url: window.IMG.P14_PIC1, alt: '페이지14 이미지' },
      { key: 'P15_PIC1', url: window.IMG.P15_PIC1, alt: '페이지15 이미지' },
      { key: 'P16_PIC1', url: window.IMG.P16_PIC1, alt: '페이지16 이미지' },
      { key: 'P17_REMOTE', url: window.IMG.P17_REMOTE, alt: '페이지17 리모컨' },
      { key: 'P19_PIC1', url: window.IMG.P19_PIC1, alt: '페이지19 이미지' },
      // 리모컨 이미지들
      { key: 'P6_REMOTE', url: window.IMG.P6_REMOTE, alt: '페이지6 리모컨' },
      { key: 'P7_REMOTE', url: window.IMG.P7_REMOTE, alt: '페이지7 리모컨' },
      { key: 'P11_REMOTE', url: window.IMG.P11_REMOTE, alt: '페이지11 리모컨' },
      { key: 'P13_REMOTE', url: window.IMG.P13_REMOTE, alt: '페이지13 리모컨' },
      { key: 'P15_REMOTE', url: window.IMG.P15_REMOTE, alt: '페이지15 리모컨' },
      // 손 이미지들
      { key: 'P16_HAND1', url: window.IMG.P16_HAND1, alt: '페이지16 손1' },
      { key: 'P16_HAND2', url: window.IMG.P16_HAND2, alt: '페이지16 손2' },
      // 홈 아이콘
      { key: 'HOME_ICON', url: window.IMG.HOME_ICON, alt: '홈 아이콘' }
    ];

    this.totalImages = this.criticalImages.length + this.importantImages.length + this.normalImages.length;
  }

  // 단일 이미지 로드
  async loadSingleImage(imageInfo, priority = 'normal') {
    const { key, url, alt } = imageInfo;
    
    // 상대 경로 문제 해결: assets/로 시작하는 경우 절대 경로로 변환
    let actualUrl = url;
    if (url.startsWith('assets/')) {
      // 현재 페이지 위치에 따라 경로 조정
      if (window.location.pathname.includes('test-preloader.html')) {
        actualUrl = './' + url; // 테스트 페이지에서는 현재 디렉토리 기준
      } else {
        actualUrl = url; // 메인 페이지에서는 그대로 사용
      }
    }
    
    if (this.loadedImages.has(actualUrl) || this.failedImages.has(actualUrl)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(actualUrl)) {
      return this.loadingPromises.get(actualUrl);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      // 우선순위에 따른 로딩 전략
      if (priority === 'critical') {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      } else {
        img.loading = 'lazy';
        img.fetchPriority = 'auto';
      }

      const timeout = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        this.failedImages.add(actualUrl);
        console.warn(`⏰ ${key} 로딩 타임아웃 (30초): ${actualUrl.substring(0, 50)}...`);
        reject(new Error(`타임아웃: ${key}`));
      }, 30000); // 30초 타임아웃으로 증가

      img.onload = () => {
        clearTimeout(timeout);
        this.loadedImages.set(actualUrl, img);
        this.loadedCount++;
        
        console.log(`✅ [${priority.toUpperCase()}] ${key} 로드 완료 (${this.loadedCount}/${this.totalImages})`);
        
        if (this.onProgress) {
          this.onProgress(this.loadedCount, this.totalImages, key);
        }
        
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        this.failedImages.add(actualUrl);
        console.error(`❌ ${key} 로드 실패: ${actualUrl.substring(0, 50)}...`);
        reject(new Error(`로드 실패: ${key}`));
      };

      img.src = actualUrl;
      img.alt = alt;
    });

    this.loadingPromises.set(actualUrl, promise);
    return promise;
  }

  // 중요 이미지 즉시 로드
  async preloadCriticalImages() {
    console.log('🔥 중요 이미지 즉시 로드 시작...');
    
    const promises = this.criticalImages.map(imageInfo => 
      this.loadSingleImage(imageInfo, 'critical').catch(error => {
        console.warn(`중요 이미지 로드 실패: ${imageInfo.key}`, error);
      })
    );

    await Promise.allSettled(promises);
    console.log('🔥 중요 이미지 로드 완료');
  }

  // 일반 이미지 백그라운드 로드 (배치 방식)
  async preloadImportantImages() {
    console.log('⚡ 일반 중요 이미지 백그라운드 로드 시작...');
    
    // 5개씩 배치로 로드
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < this.importantImages.length; i += batchSize) {
      batches.push(this.importantImages.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const promises = batch.map(imageInfo => 
        this.loadSingleImage(imageInfo, 'important').catch(error => {
          console.warn(`일반 이미지 로드 실패: ${imageInfo.key}`, error);
        })
      );
      
      await Promise.allSettled(promises);
      // 배치 간 100ms 지연
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('⚡ 일반 중요 이미지 로드 완료');
  }

  // 나머지 이미지 지연 로드 (배치 방식)
  async preloadNormalImages() {
    console.log('📦 나머지 이미지 지연 로드 시작...');
    
    // 3개씩 배치로 로드 (더 느리게)
    const batchSize = 3;
    const batches = [];
    
    for (let i = 0; i < this.normalImages.length; i += batchSize) {
      batches.push(this.normalImages.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const promises = batch.map(imageInfo => 
        this.loadSingleImage(imageInfo, 'normal').catch(error => {
          console.warn(`나머지 이미지 로드 실패: ${imageInfo.key}`, error);
        })
      );
      
      await Promise.allSettled(promises);
      // 배치 간 200ms 지연
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('📦 나머지 이미지 로드 완료');
  }

  // 전체 프리로딩 시작
  async startPreloading() {
    console.log('🚀 이미지 프리로딩 시작!');
    const startTime = Date.now();

    try {
      // 테스트 페이지인지 확인
      const isTestPage = window.location.pathname.includes('test-preloader.html');
      
      if (isTestPage) {
        // 테스트 페이지: 모든 이미지 동시 로딩
        console.log('🧪 테스트 모드: 모든 이미지 동시 로딩');
        await Promise.all([
          this.preloadCriticalImages(),
          this.preloadImportantImages(), 
          this.preloadNormalImages()
        ]);
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        console.log(`🎉 테스트 모드 프리로딩 완료! (${duration.toFixed(2)}초)`);
        console.log(`📊 통계: 성공 ${this.loadedImages.size}개, 실패 ${this.failedImages.size}개`);
        
        if (this.onComplete) {
          this.onComplete(this.loadedImages.size, this.failedImages.size);
        }
      } else {
        // 일반 페이지: 단계별 로딩 (기존 방식)
        console.log('🚀 일반 모드: 단계별 로딩');
        // 1단계: 중요 이미지 즉시 로드
        await this.preloadCriticalImages();
        
        // 즉시 완료 콜백 호출 (중요 이미지만 완료)
        if (this.onComplete) {
          this.onComplete(this.loadedImages.size, this.failedImages.size);
        }
        
        // 2단계: 일반 이미지 백그라운드 로드 (논블로킹)
        setTimeout(() => this.preloadImportantImages(), 500);
        
        // 3단계: 나머지 이미지 지연 로드 (논블로킹)
        setTimeout(() => this.preloadNormalImages(), 2000);
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        console.log(`🎉 일반 모드 중요 이미지 완료! (${duration.toFixed(2)}초, 백그라운드 로딩 계속...)`);
      }
      
    } catch (error) {
      console.error('❌ 프리로딩 중 오류:', error);
    }
  }

  // 로딩 진행 콜백 설정
  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  // 완료 콜백 설정
  setCompleteCallback(callback) {
    this.onComplete = callback;
  }

  // 로딩 상태 확인
  getLoadingStatus() {
    return {
      total: this.totalImages,
      loaded: this.loadedCount,
      failed: this.failedImages.size,
      progress: Math.round((this.loadedCount / this.totalImages) * 100),
      critical: this.criticalImages.length,
      important: this.importantImages.length,
      normal: this.normalImages.length
    };
  }

  // 특정 이미지가 로드되었는지 확인
  isImageLoaded(imageKey) {
    const imageInfo = [...this.criticalImages, ...this.importantImages, ...this.normalImages]
      .find(img => img.key === imageKey);
    
    if (!imageInfo) return false;
    return this.loadedImages.has(imageInfo.url);
  }

  // 실패한 이미지 재시도
  async retryFailedImages() {
    if (this.failedImages.size === 0) {
      console.log('✅ 재시도할 실패 이미지가 없습니다');
      return;
    }

    console.log(`🔄 실패한 이미지 ${this.failedImages.size}개 재시도 중...`);
    
    const failedUrls = Array.from(this.failedImages);
    this.failedImages.clear();
    
    const allImages = [...this.criticalImages, ...this.importantImages, ...this.normalImages];
    
    for (const url of failedUrls) {
      const imageInfo = allImages.find(img => img.url === url);
      if (imageInfo) {
        try {
          await this.loadSingleImage(imageInfo, 'retry');
          console.log(`✅ 재시도 성공: ${imageInfo.key}`);
        } catch (error) {
          console.warn(`❌ 재시도 실패: ${imageInfo.key}`, error);
        }
      }
    }
  }

  // 캐시된 이미지 정리
  clearCache() {
    this.loadedImages.clear();
    this.failedImages.clear();
    this.loadingPromises.clear();
    this.loadedCount = 0;
    console.log('🧹 이미지 캐시 정리 완료');
  }
}

// 전역 인스턴스 생성
window.imagePreloader = new ImagePreloader();

// 사용 예시 및 자동 시작
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM 로드 완료 - 이미지 프리로딩 시작');
  
  // 테스트 페이지가 아닌 경우에만 자동 프리로딩 시작
  const isTestPage = window.location.pathname.includes('test-preloader.html');
  
  if (!isTestPage) {
    // 로딩 진행 콜백 설정
    window.imagePreloader.setProgressCallback((loaded, total, currentImage) => {
      const progress = Math.round((loaded / total) * 100);
      console.log(`📊 로딩 진행: ${progress}% (${loaded}/${total}) - ${currentImage}`);
      
      // 로딩 UI 업데이트 (필요시)
      const loadingElement = document.getElementById('loading-progress');
      if (loadingElement) {
        loadingElement.textContent = `이미지 로딩 중... ${progress}%`;
      }
    });
    
    // 완료 콜백 설정
    window.imagePreloader.setCompleteCallback((loaded, failed) => {
      console.log(`🎉 프리로딩 완료: 성공 ${loaded}개, 실패 ${failed}개`);
      
      // 로딩 UI 숨기기 (필요시)
      const loadingElement = document.getElementById('loading-progress');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
    });
    
    // 프리로딩 시작 (페이지 로드 후 100ms 지연)
    setTimeout(() => {
      window.imagePreloader.startPreloading();
    }, 100);
  } else {
    console.log('🧪 테스트 페이지 모드 - 수동 프리로딩 대기 중');
  }
});

// 디버깅용 함수들
window.debugImagePreloader = {
  status: () => window.imagePreloader.getLoadingStatus(),
  retry: () => window.imagePreloader.retryFailedImages(),
  clear: () => window.imagePreloader.clearCache(),
  restart: () => {
    window.imagePreloader.clearCache();
    window.imagePreloader.startPreloading();
  }
};

console.log('🚀 이미지 프리로더 모듈 로드 완료');
