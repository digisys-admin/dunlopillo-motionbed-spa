/**
 * ========================================
 * DUNLOPILLO MOTIONBED SPA - PROFESSIONAL JAVASCRIPT
 * ========================================
 * 
 * Google Frontend Engineer Level Architecture
 * 
 * 구조:
 * ✅ ES6+ Class-based Architecture
 * ✅ Event-Driven State Management  
 * ✅ Modular Component System
 * ✅ Performance Optimized DOM Operations
 * ✅ Comprehensive Error Handling
 * ✅ Memory Leak Prevention
 * ✅ Type Safety with JSDoc
 * ✅ Single Responsibility Principle
 * 
 * @author Professional Development Team
 * @version 2.0.0 - Optimized Architecture
 * @since 2025-07-21
 */

'use strict';

/**
 * 애플리케이션 상수 정의
 * @readonly
 * @enum {string}
 */
const APP_CONSTANTS = Object.freeze({
  PAGE_ORDER: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 
               'page8', 'page9', 'page10', 'page11', 'page12', 'page13', 'page14', 
               'page15', 'page16', 'page17', 'page18', 'page19'],
  INITIAL_SCREEN: 'home',
  APP_CONTAINER_ID: 'app',
  TRANSITION_DURATION: 300,
  DEBOUNCE_DELAY: 150,
  MAX_RETRIES: 3
});

/**
 * 애플리케이션 이벤트 타입
 * @readonly
 * @enum {string}
 */
const APP_EVENTS = Object.freeze({
  PAGE_CHANGE: 'pageChange',
  SURVEY_UPDATE: 'surveyUpdate', 
  RATING_UPDATE: 'ratingUpdate',
  ERROR_OCCURRED: 'errorOccurred',
  STATE_CHANGED: 'stateChanged',
  IMAGE_LOADED: 'imageLoaded',
  IMAGE_ERROR: 'imageError'
});

/**
 * 이미지 최적화 관리 클래스
 * @class ImageOptimizer
 */
class ImageOptimizer {
  /**
   * @private
   * @static
   * @type {ImageOptimizer|null}
   */
  static _instance = null;

  /**
   * 싱글톤 인스턴스 반환
   * @returns {ImageOptimizer}
   */
  static getInstance() {
    if (!ImageOptimizer._instance) {
      ImageOptimizer._instance = new ImageOptimizer();
    }
    return ImageOptimizer._instance;
  }

  /**
   * @private
   * @constructor
   */
  constructor() {
    if (ImageOptimizer._instance) {
      throw new Error('ImageOptimizer는 싱글톤입니다. getInstance()를 사용하세요.');
    }

    /** @private @type {Map<string, HTMLImageElement>} */
    this._imageCache = new Map();
    
    /** @private @type {Set<string>} */
    this._loadingImages = new Set();
    
    /** @private @type {IntersectionObserver|null} */
    this._lazyLoadObserver = null;
    
    /** @private @type {Map<string, string>} */
    this._preloadQueue = new Map();

    this._initializeLazyLoading();
  }

  /**
   * Lazy Loading 초기화
   * @private
   */
  _initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
      this._lazyLoadObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this._loadImage(entry.target);
              this._lazyLoadObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );
    }
  }

  /**
   * 이미지 지연 로딩 등록
   * @public
   * @param {HTMLImageElement} img 
   */
  observeImage(img) {
    if (this._lazyLoadObserver && img.dataset.src) {
      this._lazyLoadObserver.observe(img);
    } else {
      // IntersectionObserver 미지원 시 즉시 로드
      this._loadImage(img);
    }
  }

  /**
   * 이미지 로딩
   * @private
   * @param {HTMLImageElement} img 
   */
  async _loadImage(img) {
    const src = img.dataset.src;
    if (!src || this._loadingImages.has(src)) return;

    this._loadingImages.add(src);
    
    try {
      // 캐시에서 확인
      if (this._imageCache.has(src)) {
        img.src = src;
        img.classList.add('loaded');
        this._loadingImages.delete(src);
        return;
      }

      // 로딩 시작
      img.classList.add('loading');
      
      // 새 이미지 로드
      const newImg = new Image();
      newImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        newImg.onload = () => {
          this._imageCache.set(src, newImg);
          img.src = src;
          img.classList.remove('loading');
          img.classList.add('loaded');
          
          // 이벤트 발송
          img.dispatchEvent(new CustomEvent('imageOptimized', { 
            detail: { src, cached: false }
          }));
          
          resolve();
        };
        
        newImg.onerror = () => {
          img.classList.remove('loading');
          img.classList.add('error');
          reject(new Error(`이미지 로드 실패: ${src}`));
        };
        
        newImg.src = src;
      });

    } catch (error) {
      console.warn('🖼️ [ImageOptimizer] 이미지 로드 실패:', src, error);
      
      // Fallback 이미지 설정
      if (img.dataset.fallback) {
        img.src = img.dataset.fallback;
      }
    } finally {
      this._loadingImages.delete(src);
    }
  }

  /**
   * 이미지 프리로딩
   * @public
   * @param {string[]} imageUrls 
   */
  async preloadImages(imageUrls) {
    const loadPromises = imageUrls.map(async (url) => {
      if (this._imageCache.has(url)) return;

      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            this._imageCache.set(url, img);
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
        
        console.log('🚀 [ImageOptimizer] 프리로드 완료:', url);
      } catch (error) {
        console.warn('⚠️ [ImageOptimizer] 프리로드 실패:', url);
      }
    });

    await Promise.allSettled(loadPromises);
  }

  /**
   * 다음 페이지 이미지 프리로딩
   * @public
   * @param {string} nextPageKey 
   */
  preloadNextPageImages(nextPageKey) {
    if (!window.screens?.[nextPageKey]) return;

    const screenContent = window.screens[nextPageKey].content || '';
    const imageUrls = this._extractImageUrls(screenContent);
    
    if (imageUrls.length > 0) {
      // 비동기적으로 프리로드 (UX 방해하지 않음)
      setTimeout(() => {
        this.preloadImages(imageUrls);
      }, 500);
    }
  }

  /**
   * HTML 콘텐츠에서 이미지 URL 추출
   * @private
   * @param {string} htmlContent 
   * @returns {string[]}
   */
  _extractImageUrls(htmlContent) {
    const imgRegex = /src\s*=\s*["']([^"']+)["']/gi;
    const urls = [];
    let match;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const url = match[1];
      if (url.includes('drive.google.com') || url.includes('assets/')) {
        urls.push(url);
      }
    }
    
    return [...new Set(urls)]; // 중복 제거
  }

  /**
   * 캐시 상태 조회
   * @public
   * @returns {Object}
   */
  getCacheStats() {
    return {
      cachedImages: this._imageCache.size,
      loadingImages: this._loadingImages.size,
      memoryUsage: this._estimateMemoryUsage()
    };
  }

  /**
   * 메모리 사용량 추정
   * @private
   * @returns {string}
   */
  _estimateMemoryUsage() {
    const avgImageSize = 100; // KB 추정
    const totalKB = this._imageCache.size * avgImageSize;
    
    if (totalKB > 1024) {
      return `${(totalKB / 1024).toFixed(1)}MB`;
    }
    return `${totalKB}KB`;
  }

  /**
   * 캐시 정리
   * @public
   */
  clearCache() {
    this._imageCache.clear();
    this._loadingImages.clear();
    console.log('🧹 [ImageOptimizer] 이미지 캐시 정리 완료');
  }

  /**
   * 정리 작업
   * @public
   */
  cleanup() {
    if (this._lazyLoadObserver) {
      this._lazyLoadObserver.disconnect();
    }
    this.clearCache();
  }
}

/**
 * 메인 애플리케이션 클래스 - 싱글톤 패턴
 * @class MotionBedApp
 */
class MotionBedApp {
  /**
   * @private
   * @static
   * @type {MotionBedApp|null}
   */
  static _instance = null;

  /**
   * 싱글톤 인스턴스 반환
   * @returns {MotionBedApp}
   */
  static getInstance() {
    if (!MotionBedApp._instance) {
      MotionBedApp._instance = new MotionBedApp();
    }
    return MotionBedApp._instance;
  }

  /**
   * @private
   * @constructor
   */
  constructor() {
    if (MotionBedApp._instance) {
      throw new Error('MotionBedApp는 싱글톤입니다. getInstance()를 사용하세요.');
    }

    /** @private @type {string} */
    this._currentScreen = APP_CONSTANTS.INITIAL_SCREEN;
    
    /** @private @type {HTMLElement|null} */
    this._appContainer = null;
    
    /** @private @type {EventTarget} */
    this._eventBus = new EventTarget();
    
    /** @private @type {Map<string, Function>} */
    this._eventListeners = new Map();
    
    /** @private @type {Map<string, HTMLElement>} */
    this._domCache = new Map();
    
    /** @private @type {boolean} */
    this._isTransitioning = false;
    
    /** @private @type {AbortController} */
    this._abortController = new AbortController();

    /** @private @type {ImageOptimizer} */
    this._imageOptimizer = ImageOptimizer.getInstance();

    this._initialize();
  }

  /**
   * 애플리케이션 초기화
   * @private
   * @returns {Promise<void>}
   */
  async _initialize() {
    try {
      console.log('🚀 MotionBedApp 초기화 시작...');
      
      await this._setupDOM();
      this._setupEventListeners();
      this._exposeGlobalAPI();
      
      // screens 객체 확인
      if (!window.screens) {
        console.error('❌ screens 객체를 찾을 수 없습니다');
        return;
      }
      
      console.log('✅ screens 객체 발견:', Object.keys(window.screens));
      
      this._render();
      
      this._logInfo('MotionBedApp 초기화 완료', {
        currentScreen: this._currentScreen,
        totalPages: APP_CONSTANTS.PAGE_ORDER.length,
        availableScreens: Object.keys(window.screens || {})
      });
    } catch (error) {
      this._handleError('초기화 실패', error);
    }
  }

  /**
   * DOM 설정
   * @private
   * @returns {Promise<void>}
   */
  async _setupDOM() {
    this._appContainer = document.getElementById(APP_CONSTANTS.APP_CONTAINER_ID);
    
    if (!this._appContainer) {
      throw new Error(`앱 컨테이너를 찾을 수 없습니다: #${APP_CONSTANTS.APP_CONTAINER_ID}`);
    }

    // DOM 캐시 초기화
    this._domCache.set('app', this._appContainer);
  }

  /**
   * 이벤트 리스너 설정
   * @private
   */
  _setupEventListeners() {
    // 글로벌 이벤트 리스너
    const globalListeners = [
      ['beforeunload', this._cleanup.bind(this)],
      ['unload', this._cleanup.bind(this)],
      ['error', this._handleGlobalError.bind(this)],
      ['unhandledrejection', this._handleUnhandledRejection.bind(this)]
    ];

    globalListeners.forEach(([event, handler]) => {
      window.addEventListener(event, handler, {
        signal: this._abortController.signal,
        passive: true
      });
      this._eventListeners.set(event, handler);
    });
  }

  /**
   * 전역 API 노출 (레거시 호환성)
   * @private
   */
  _exposeGlobalAPI() {
    const api = {
      goHome: this.goHome.bind(this),
      next: this.next.bind(this),
      previous: this.previous.bind(this),
      selectSurveyOption: this.selectSurveyOption.bind(this),
      selectRating: this.selectRating.bind(this)
    };

    Object.assign(window, api);
    
    // 앱 인스턴스도 전역에 노출 (배경 음악 시스템에서 접근 가능)
    window.app = this;
  }

  /**
   * 홈 화면으로 이동
   * @public
   */
  goHome() {
    // ⏰ 홈 버튼 클릭 시 자동 진행 취소
    if (window.clearAutoProgress && typeof window.clearAutoProgress === 'function') {
      window.clearAutoProgress();
      console.log('⏰ [USER] 홈 버튼 클릭으로 자동 진행 취소');
    }

    // 🎙️ 현재 재생 중인 음성 가이드 중단
    if (window.voiceGuideSystem?.stopVoice) {
      window.voiceGuideSystem.stopVoice();
      console.log('🎙️ [USER] 홈 버튼 클릭으로 음성 가이드 중단');
    }

    this._navigateToScreen(APP_CONSTANTS.INITIAL_SCREEN);
  }

  /**
   * 다음 페이지로 이동
   * @public
   */
  next() {
    if (this._isTransitioning) return;

    // ⏰ 사용자가 직접 클릭 시 자동 진행 취소
    if (window.clearAutoProgress && typeof window.clearAutoProgress === 'function') {
      window.clearAutoProgress();
      console.log('⏰ [USER] 사용자 클릭으로 자동 진행 취소');
    }

    // 🎙️ 현재 재생 중인 음성 가이드 중단
    if (window.voiceGuideSystem?.stopVoice) {
      window.voiceGuideSystem.stopVoice();
      console.log('🎙️ [USER] 다음 버튼 클릭으로 음성 가이드 중단');
    }

    let nextScreen;

    if (this._currentScreen === 'home') {
      nextScreen = APP_CONSTANTS.PAGE_ORDER[0]; // home에서 다음 누르면 page1으로
    } else {
      const currentIndex = APP_CONSTANTS.PAGE_ORDER.indexOf(this._currentScreen);
      if (currentIndex >= 0 && currentIndex < APP_CONSTANTS.PAGE_ORDER.length - 1) {
        nextScreen = APP_CONSTANTS.PAGE_ORDER[currentIndex + 1];
      } else {
        this._logWarn('마지막 페이지입니다', { currentScreen: this._currentScreen });
        return;
      }
    }

    this._navigateToScreen(nextScreen);
  }

  /**
   * 이전 페이지로 이동
   * @public
   */
  previous() {
    if (this._isTransitioning) return;

    // ⏰ 사용자가 직접 클릭 시 자동 진행 취소
    if (window.clearAutoProgress && typeof window.clearAutoProgress === 'function') {
      window.clearAutoProgress();
      console.log('⏰ [USER] 사용자 클릭으로 자동 진행 취소');
    }

    // 🎙️ 현재 재생 중인 음성 가이드 중단
    if (window.voiceGuideSystem?.stopVoice) {
      window.voiceGuideSystem.stopVoice();
      console.log('🎙️ [USER] 이전 버튼 클릭으로 음성 가이드 중단');
    }

    let prevScreen;

    if (this._currentScreen === 'home') {
      this._logWarn('홈 화면에서는 이전 페이지가 없습니다');
      return;
    }

    const currentIndex = APP_CONSTANTS.PAGE_ORDER.indexOf(this._currentScreen);
    if (currentIndex > 0) {
      prevScreen = APP_CONSTANTS.PAGE_ORDER[currentIndex - 1];
    } else if (currentIndex === 0) {
      prevScreen = 'home'; // page1에서 이전 누르면 홈으로
    } else {
      this._logWarn('이전 페이지를 찾을 수 없습니다', { currentScreen: this._currentScreen });
      return;
    }

    this._navigateToScreen(prevScreen);
  }

  /**
   * 설문 옵션 선택 처리
   * @public
   * @param {string} category - 설문 카테고리
   * @param {string} value - 선택된 값
   * @param {HTMLElement} element - 클릭된 요소
   */
  selectSurveyOption(category, value, element) {
    try {
      this._validateSurveyInput(category, value, element);
      
      if (this._currentScreen === 'page1') {
        this._handlePage1Survey(category, element);
      }

      // 데이터 저장
      this._saveSurveyData(category, value);
      
      this._logInfo('설문 응답 저장됨', { category, value, screen: this._currentScreen });
    } catch (error) {
      this._handleError('설문 선택 처리 실패', error, { category, value });
    }
  }

  /**
   * 별점 평가 선택 처리
   * @public
   * @param {number} rating - 선택된 별점 (1-5)
   */
  selectRating(rating) {
    try {
      this._validateRating(rating);
      
      // 별점 UI 업데이트
      this._updateRatingDisplay(rating);
      
      // 데이터 저장
      this._saveRatingData(rating);
      
      this._logInfo('별점 평가 저장됨', { rating, screen: this._currentScreen });
    } catch (error) {
      this._handleError('별점 선택 처리 실패', error, { rating });
    }
  }

  /**
   * 페이지 네비게이션 처리
   * @private
   * @param {string} screenName - 이동할 화면명
   */
  async _navigateToScreen(screenName) {
    if (this._isTransitioning) return;
    
    try {
      this._isTransitioning = true;
      
      // ⏰ 페이지 이동 시 이전 페이지의 자동 진행 정리
      if (window.clearAutoProgress && typeof window.clearAutoProgress === 'function') {
        window.clearAutoProgress();
      }
      
      const previousScreen = this._currentScreen;
      this._currentScreen = screenName;
      
      // 이벤트 발송
      this._dispatchEvent(APP_EVENTS.PAGE_CHANGE, {
        from: previousScreen,
        to: screenName,
        timestamp: Date.now()
      });

      await this._render();
      
      // 홈 화면일 때 동영상 음소거 (배경 음악과 충돌 방지)
      if (screenName === 'home') {
        setTimeout(() => {
          const homeVideo = document.getElementById('homeBackgroundVideo');
          if (homeVideo) {
            homeVideo.muted = true;
            homeVideo.volume = 0;
            console.log('🔇 홈 화면 동영상 음소거 (페이지 전환)');
            
            // 배경 음악도 함께 동기화
            if (window.backgroundMusicSystem?.syncWithHomeVideo) {
              window.backgroundMusicSystem.syncWithHomeVideo();
            }
          }
        }, 500);
      } else {
        // 홈이 아닌 페이지로 이동할 때 홈 동영상 상태에 따라 배경 음악 결정
        setTimeout(() => {
          if (window.backgroundMusicSystem?.syncWithHomeVideo) {
            window.backgroundMusicSystem.syncWithHomeVideo();
          }
        }, 100);
      }

      // 🎙️ 페이지별 음성 가이드 자동 재생 (음성 파일이 있는 페이지만)
      setTimeout(() => {
        console.log(`🔄 [DEBUG] 페이지 전환 완료: ${screenName} - 음성 가이드 확인`);
        
        // 음성 파일이 있는 페이지인지 먼저 확인
        const hasVoiceFile = window.VOICE_SCRIPTS && window.VOICE_SCRIPTS[screenName];
        
        if (hasVoiceFile) {
          console.log(`🔄 [DEBUG] 음성 파일 존재: ${screenName} - 음성 가이드 시작`);
          if (window.voiceGuideSystem?.playVoiceForPage) {
            window.voiceGuideSystem.playVoiceForPage(screenName);
          } else {
            console.log(`🔄 [ERROR] 음성 가이드 시스템을 찾을 수 없음`);
          }
        } else {
          console.log(`🔄 [INFO] 음성 파일 없음: ${screenName} - 음성 가이드 건너뛰기`);
        }
      }, 1000); // 페이지 로딩 후 1초 뒤 음성 시작

      // ⏰ 자동 진행 시스템 시작
      setTimeout(() => {
        if (window.startAutoProgress && typeof window.startAutoProgress === 'function') {
          window.startAutoProgress(screenName);
          console.log(`⏰ [DEBUG] 자동 진행 시스템 시작: ${screenName}`);
        }
      }, 1500); // 페이지 로딩 후 1.5초 뒤 자동 진행 시작
      
      // FastImageOptimizer로 다음 페이지 이미지 프리로드
      if (window.fastImageOptimizer && typeof window.fastImageOptimizer.preloadNextPageImages === 'function') {
        window.fastImageOptimizer.preloadNextPageImages(screenName);
      }
      
      // 배경 이미지 폴백 처리
      if (window.fastImageOptimizer && typeof window.fastImageOptimizer.setupBackgroundImageFallback === 'function') {
        window.fastImageOptimizer.setupBackgroundImageFallback();
      }
      
      this._logInfo('페이지 네비게이션 완료', {
        from: previousScreen,
        to: screenName
      });
    } catch (error) {
      this._handleError('페이지 네비게이션 실패', error);
    } finally {
      setTimeout(() => {
        this._isTransitioning = false;
      }, APP_CONSTANTS.TRANSITION_DURATION);
    }
  }

  /**
   * 화면 렌더링
   * @private
   * @returns {Promise<void>}
   */
  async _render() {
    try {
      const screenData = this._getScreenData();
      
      if (!screenData) {
        throw new Error(`화면 데이터를 찾을 수 없습니다: ${this._currentScreen}`);
      }

      // DOM 업데이트
      await this._updateDOM(screenData);
      
      // 후처리
      this._setupScreenEventListeners();
      
    } catch (error) {
      this._handleError('화면 렌더링 실패', error);
    }
  }

  /**
   * 화면 데이터 조회
   * @private
   * @returns {Object|null}
   */
  _getScreenData() {
    const screenData = window.screens?.[this._currentScreen] || null;
    
    if (!screenData) {
      this._logWarn(`화면 데이터를 찾을 수 없습니다: ${this._currentScreen}`, {
        availableScreens: Object.keys(window.screens || {})
      });
    }
    
    return screenData;
  }

  /**
   * DOM 업데이트 처리
   * @private
   * @param {Object} screenData - 화면 데이터
   * @returns {Promise<void>}
   */
  async _updateDOM(screenData) {
    if (!this._appContainer) return;

    // 홈 화면 특별 처리
    if (screenData.type === 'main') {
      this._appContainer.className = 'screen-container home-screen';
      this._appContainer.innerHTML = this._generateHomeContent();
    } else {
      this._appContainer.className = 'screen-container';
      this._appContainer.innerHTML = screenData.content;
    }

    // 이미지 기본 속성만 설정 (최적화 일시 비활성화)
    this._setupBasicImageAttributes();
    
    // 다음 페이지 이미지 프리로딩
    this._preloadNextPageImages();
  }

  /**
   * 기본 이미지 속성 설정
   * @private
   */
  _setupBasicImageAttributes() {
    const images = this._appContainer?.querySelectorAll('img');
    if (!images?.length) return;

    images.forEach(img => {
      // 접근성 향상
      if (!img.alt) {
        img.alt = 'Dunlopillo Motion Bed Image';
      }
      
      // 로딩 에러 처리
      if (!img.onerror) {
        img.onerror = () => {
          console.warn('🖼️ 이미지 로드 실패:', img.src);
          img.style.display = 'none'; // 깨진 이미지 숨김
        };
      }
    });
  }

  /**
   * 현재 페이지 이미지 최적화
   * @private
   */
  async _optimizeImages() {
    const images = this._appContainer?.querySelectorAll('img');
    if (!images?.length) return;

    images.forEach(img => {
      // 기본 최적화만 적용 (지연 로딩 없음)
      if (!img.dataset.optimized) {
        // 모든 이미지를 즉시 로드
        img.classList.add('optimized-image');
        
        // 접근성 향상
        if (!img.alt) {
          img.alt = 'Dunlopillo Motion Bed Image';
        }
        
        // 로딩 에러 처리만 추가
        img.onerror = () => {
          console.warn('🖼️ 이미지 로드 실패:', img.src);
          img.classList.add('error');
        };
        
        img.onload = () => {
          img.classList.add('loaded');
        };
        
        // 최적화 완료 표시
        img.dataset.optimized = 'true';
      }
    });
  }

  /**
   * 다음 페이지 이미지 프리로딩
   * @private
   */
  _preloadNextPageImages() {
    const currentIndex = APP_CONSTANTS.PAGE_ORDER.indexOf(this._currentScreen);
    let nextPageKey = null;

    if (this._currentScreen === APP_CONSTANTS.INITIAL_SCREEN) {
      nextPageKey = APP_CONSTANTS.PAGE_ORDER[0];
    } else if (currentIndex >= 0 && currentIndex < APP_CONSTANTS.PAGE_ORDER.length - 1) {
      nextPageKey = APP_CONSTANTS.PAGE_ORDER[currentIndex + 1];
    }

    if (nextPageKey) {
      this._imageOptimizer.preloadNextPageImages(nextPageKey);
    }
  }

  /**
   * 홈 화면 콘텐츠 생성
   * @private
   * @returns {string}
   */
  _generateHomeContent() {
    // 동영상 URL 배열 생성 (실제 Google Drive ID가 있는 동영상만 포함)
    const videoSources = window.VIDEO ? [
      window.VIDEO.HOME_VIDEO_1,
      window.VIDEO.HOME_VIDEO_2, 
      window.VIDEO.HOME_VIDEO_3
    ].filter(url => url && url.includes('drive.google.com') && !url.includes('xxxxxxxxxxxxxxxxxxxxxxxxxxx')) : [];

    // 폴백 동영상 또는 이미지
    const fallbackSrc = window.VIDEO?.HOME_VIDEO_FALLBACK || 'assets/pics/dunlopillo_logo_white.png';
    
    return `
      <div class="home-content" style="position: relative; width: 100%; height: 100%; overflow: hidden;">
        ${this._generateVideoBackground(videoSources, fallbackSrc)}
        <div class="home-overlay" style="position: relative; z-index: 5;">
          <img
            class="home-logo"
            src="assets/pics/dunlopillo_logo_white.png"
            style="position: absolute; width: 707px; height: 157px; top: 289px; left: 287px; object-fit: cover; z-index: 6;"
            alt="Dunlopillo Logo"
            loading="lazy"
          />
          <div class="motion-bed" style="z-index: 6;">MOTION BED</div>
          <div class="buttons" onclick="next();" style="z-index: 6;">
            <div class="label">화면을 터치하시면 체험이 시작됩니다</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 동영상 배경 생성
   * @private
   * @param {string[]} videoSources - 동영상 URL 배열
   * @param {string} fallbackSrc - 폴백 소스
   * @returns {string}
   */
  /**
   * 간단한 동영상 배경 생성 (참고 코드 방식)
   */
  _generateVideoBackground(videoSources, fallbackSrc) {
    console.log('[DEBUG] 간단한 동영상 배경 생성');
    
    // 새로운 VIDEO_SOURCES 사용
    const sources = window.VIDEO_SOURCES || [];
    
    if (sources.length === 0) {
      console.log('[INFO] 동영상 소스 없음, 기본 배경 사용');
      return `
        <div class="home-background" style="
          background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
        "></div>
      `;
    }

    // 랜덤 동영상 선택
    const randomIndex = Math.floor(Math.random() * sources.length);
    const startVideo = sources[randomIndex];
    
    console.log('[INFO] 선택된 동영상:', { index: randomIndex, url: startVideo });

    return `
      <div class="home-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;">
        <video 
          id="homeBackgroundVideo" 
          src="${startVideo}"
          autoplay 
          muted 
          playsinline 
          style="width: 100%; height: 100%; object-fit: cover;">
        </video>
      </div>
      
      <!-- 소리 토글 버튼 - 오른쪽 상단 (전체화면 버튼과 구별) -->
      <div id="soundToggle" onclick="toggleVideoSound(event)"
           style="position: absolute; top: 20px; right: 20px; z-index: 10000; 
                  background: rgba(34, 197, 94, 0.7); padding: 8px 12px; border-radius: 8px; 
                  font-size: 1.8rem; color: white; cursor: pointer; line-height: 1; 
                  width: 50px; height: 50px; text-align: center; display: flex; 
                  align-items: center; justify-content: center; backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px); transition: all 0.2s ease;
                  border: 2px solid rgba(255, 255, 255, 0.2);"
           onmouseover="this.style.background='rgba(34, 197, 94, 0.9)'; this.style.transform='scale(1.1)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'"
           onmouseout="this.style.background='rgba(34, 197, 94, 0.7)'; this.style.transform='scale(1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'">
        🔇
      </div>
      
      <!-- 전체화면 토글 버튼 - 왼쪽 상단 (fullscreen-test.html 방식) -->
      <div id="fullscreenToggle" onclick="toggleFullscreen()"
           style="position: absolute; top: 20px; left: 20px; z-index: 10000; 
                  background: rgba(0, 0, 0, 0.7); padding: 8px 12px; border-radius: 8px; 
                  color: white; cursor: pointer; line-height: 1; 
                  width: 50px; height: 50px; text-align: center; display: flex; 
                  align-items: center; justify-content: center; backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px); transition: all 0.2s ease;
                  border: 2px solid rgba(255, 255, 255, 0.2);" title="전체화면 모드"
           onmouseover="this.style.background='rgba(30, 64, 175, 0.8)'; this.style.transform='scale(1.1)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'"
           onmouseout="this.style.background='rgba(0, 0, 0, 0.7)'; this.style.transform='scale(1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14H5V19H10V17H7V14Z" fill="currentColor"/>
          <path d="M5 10H7V7H10V5H5V10Z" fill="currentColor"/>
          <path d="M17 14H19V19H14V17H17V14Z" fill="currentColor"/>
          <path d="M14 5V7H17V10H19V5H14Z" fill="currentColor"/>
        </svg>
      </div>
    `;
  }

  /**
   * 화면별 이벤트 리스너 설정
   * @private
   */
  _setupScreenEventListeners() {
    // 페이지별 특화 이벤트 리스너 설정
    const eventSetups = {
      'home': this._setupHomeEvents.bind(this),
      'page1': this._setupPage1Events.bind(this),
      'page5': this._setupRatingEvents.bind(this),
      'page8': this._setupRatingEvents.bind(this),
      'page12': this._setupRatingEvents.bind(this),
      'page18': this._setupRatingEvents.bind(this)
    };

    const setupFn = eventSetups[this._currentScreen];
    if (setupFn) {
      setupFn();
    }
  }

  /**
   * 홈 화면 이벤트 설정
   * @private
   */
  _setupHomeEvents() {
    // 간단한 동영상 설정
    this._setupSimpleHomeVideo();
  }

  /**
   * 간단한 홈 동영상 설정 (참고 코드 방식)
   */
  _setupSimpleHomeVideo() {
    console.log('[DEBUG] 간단한 홈 동영상 설정 시작');
    
    const video = document.getElementById('homeBackgroundVideo');
    if (!video) {
      console.log('[WARN] 동영상 요소를 찾을 수 없음');
      return;
    }

    const sources = window.VIDEO_SOURCES || [];
    if (sources.length === 0) {
      console.log('[WARN] 동영상 소스가 없음');
      return;
    }

    let currentVideoIndex = 0;
    video.src = sources[currentVideoIndex];
    video.play(); // ✅ 참고 코드와 동일하게 즉시 재생

    // 동영상 종료 시 다음 동영상 재생 (참고 코드 방식)
    video.addEventListener('ended', () => {
      currentVideoIndex = (currentVideoIndex + 1) % sources.length;
      video.src = sources[currentVideoIndex];
      video.play();
      console.log('[INFO] 다음 동영상으로 전환:', { index: currentVideoIndex, src: sources[currentVideoIndex] });
    });

    // 로드 이벤트
    video.addEventListener('loadeddata', () => {
      console.log('[INFO] 동영상 로드 완료');
    });

    video.addEventListener('error', (e) => {
      console.error('[ERROR] 동영상 에러:', e);
    });
  }

  /**
   * Page1 이벤트 설정
   * @private
   */
  _setupPage1Events() {
    // 설문 옵션 버튼들에 이벤트 리스너 추가 (이미 HTML에 onclick이 있으므로 생략)
  }

  /**
   * 별점 페이지 이벤트 설정
   * @private
   */
  _setupRatingEvents() {
    const starItems = this._appContainer?.querySelectorAll('.page5-star-item, .rating-star');
    if (!starItems?.length) return;

    starItems.forEach((item, index) => {
      const rating = index + 1;
      item.addEventListener('click', () => this.selectRating(rating), {
        signal: this._abortController.signal
      });
    });
  }

  /**
   * 설문 입력 검증
   * @private
   * @param {string} category 
   * @param {string} value 
   * @param {HTMLElement} element 
   */
  _validateSurveyInput(category, value, element) {
    if (!category || typeof category !== 'string') {
      throw new Error('유효하지 않은 카테고리입니다');
    }
    if (!value || typeof value !== 'string') {
      throw new Error('유효하지 않은 값입니다');
    }
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error('유효하지 않은 DOM 요소입니다');
    }
  }

  /**
   * 별점 입력 검증
   * @private
   * @param {number} rating 
   */
  _validateRating(rating) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('별점은 1-5 사이의 정수여야 합니다');
    }
  }

  /**
   * Page1 설문 처리
   * @private
   * @param {string} category 
   * @param {HTMLElement} element 
   */
  _handlePage1Survey(category, element) {
    const selectors = {
      gender: '.page1-content .element .overlap-2 .view, .page1-content .element .overlap-2 .label-wrapper',
      experience: '.page1-content .element .overlap-3 .view, .page1-content .element .overlap-3 .label-wrapper',
      age: '.page1-content .element .overlap-4 .div-wrapper, .page1-content .element .overlap-4 .view-2, .page1-content .element .overlap-4 .view-3, .page1-content .element .overlap-4 .view-4, .page1-content .element .overlap-4 .view-5, .page1-content .element .overlap-4 .view-6, .page1-content .element .overlap-4 .view-7'
    };
    
    const selector = selectors[category];
    if (selector) {
      const categoryElements = document.querySelectorAll(selector);
      categoryElements.forEach(el => el.classList.remove('selected'));
      element.classList.add('selected');
    }
  }

  /**
   * 별점 표시 업데이트
   * @private
   * @param {number} rating 
   */
  _updateRatingDisplay(rating) {
    const starItems = document.querySelectorAll('.page5-star-item');
    starItems.forEach((item, index) => {
      item.classList.remove('selected', 'feedback');
      
      if (index < rating) {
        item.classList.add('selected');
      }
    });
    
    // 클릭된 별점에 피드백 효과
    const selectedItem = document.querySelector(`[data-rating="${rating}"]`);
    if (selectedItem) {
      selectedItem.classList.add('feedback');
      setTimeout(() => selectedItem.classList.remove('feedback'), 300);
    }
  }

  /**
   * 설문 데이터 저장
   * @private
   * @param {string} category 
   * @param {string} value 
   */
  _saveSurveyData(category, value) {
    // 레거시 지원
    if (window.surveyData) {
      window.surveyData[category] = value;
    }
    
    // 새로운 시스템 지원
    if (window.surveyData?.saveSurveyResponse) {
      window.surveyData.saveSurveyResponse(category, value);
    }

    this._dispatchEvent(APP_EVENTS.SURVEY_UPDATE, { category, value });
  }

  /**
   * 별점 데이터 저장
   * @private
   * @param {number} rating 
   */
  _saveRatingData(rating) {
    // 레거시 지원
    if (window.surveyData) {
      window.surveyData.rating = rating;
    }
    
    // 새로운 시스템 지원
    if (window.surveyData?.saveRating) {
      window.surveyData.saveRating(this._currentScreen, rating);
    }

    this._dispatchEvent(APP_EVENTS.RATING_UPDATE, { rating, screen: this._currentScreen });
  }

  /**
   * 이벤트 발송
   * @private
   * @param {string} eventType 
   * @param {any} detail 
   */
  _dispatchEvent(eventType, detail) {
    const customEvent = new CustomEvent(eventType, { detail });
    this._eventBus.dispatchEvent(customEvent);
  }

  /**
   * 글로벌 에러 핸들러
   * @private
   * @param {ErrorEvent} event 
   */
  _handleGlobalError(event) {
    this._handleError('글로벌 에러 발생', event.error);
  }

  /**
   * Unhandled Promise Rejection 핸들러
   * @private
   * @param {PromiseRejectionEvent} event 
   */
  _handleUnhandledRejection(event) {
    this._handleError('처리되지 않은 Promise 에러', event.reason);
  }

  /**
   * 에러 처리
   * @private
   * @param {string} message 
   * @param {Error} error 
   * @param {Object} context 
   */
  _handleError(message, error, context = {}) {
    const errorInfo = {
      message,
      error: error?.message || error,
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
      screen: this._currentScreen
    };

    console.error(`🚨 [MotionBedApp Error] ${message}`, errorInfo);
    
    this._dispatchEvent(APP_EVENTS.ERROR_OCCURRED, errorInfo);
  }

  /**
   * 로깅 - 정보
   * @private
   * @param {string} message 
   * @param {Object} data 
   */
  _logInfo(message, data = {}) {
    console.log(`ℹ️ [MotionBedApp] ${message}`, data);
  }

  /**
   * 로깅 - 경고
   * @private
   * @param {string} message 
   * @param {Object} data 
   */
  _logWarn(message, data = {}) {
    console.warn(`⚠️ [MotionBedApp] ${message}`, data);
  }

  /**
   * 정리 작업
   * @private
   */
  _cleanup() {
    try {
      // 이벤트 리스너 정리
      this._abortController.abort();
      
      // 캐시 정리
      this._domCache.clear();
      
      // 이미지 최적화 정리
      this._imageOptimizer.cleanup();
      
      this._logInfo('앱 정리 완료');
    } catch (error) {
      console.error('정리 중 오류 발생:', error);
    }
  }

  /**
   * 현재 화면 조회
   * @public
   * @returns {string}
   */
  getCurrentScreen() {
    return this._currentScreen;
  }

  /**
   * 이미지 최적화 상태 조회
   * @public
   * @returns {Object}
   */
  getImageOptimizationStats() {
    return this._imageOptimizer.getCacheStats();
  }

  /**
   * 이벤트 리스너 등록
   * @public
   * @param {string} eventType 
   * @param {Function} handler 
   */
  addEventListener(eventType, handler) {
    this._eventBus.addEventListener(eventType, handler);
  }

  /**
   * 이벤트 리스너 제거
   * @public
   * @param {string} eventType 
   * @param {Function} handler 
   */
  removeEventListener(eventType, handler) {
    this._eventBus.removeEventListener(eventType, handler);
  }
}

/**
 * 전역 소리 토글 함수 (참고 코드와 동일)
 */
function toggleVideoSound(event) {
  event.stopPropagation(); // ❗ 부모로 이벤트 전파 방지

  const video = document.getElementById("homeBackgroundVideo");
  const icon = document.getElementById("soundToggle");

  if (video.muted) {
    video.muted = false;
    video.play(); // ✅ 참고 코드에 있는 중요한 부분
    icon.textContent = "🔊";
    
    // 배경 음악도 함께 활성화
    if (window.backgroundMusicSystem?.syncWithHomeVideo) {
      window.backgroundMusicSystem.syncWithHomeVideo();
    }
  } else {
    video.muted = true;
    icon.textContent = "🔇";
    
    // 배경 음악도 함께 비활성화
    if (window.backgroundMusicSystem?.syncWithHomeVideo) {
      window.backgroundMusicSystem.syncWithHomeVideo();
    }
  }
}

/**
 * 앱 초기화 및 시작
 */
function initializeApp() {
  // DOM이 준비되면 앱 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // FastImageOptimizer 초기화
      if (typeof FastImageOptimizer !== 'undefined') {
        window.fastImageOptimizer = new FastImageOptimizer();
        console.log('FastImageOptimizer 초기화 완료');
      }
      
      MotionBedApp.getInstance();
    });
  } else {
    // FastImageOptimizer 초기화
    if (typeof FastImageOptimizer !== 'undefined') {
      window.fastImageOptimizer = new FastImageOptimizer();
      console.log('FastImageOptimizer 초기화 완료');
    }
    
    MotionBedApp.getInstance();
  }
}

// 앱 초기화 실행
initializeApp();
