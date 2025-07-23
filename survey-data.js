/**
 * ========================================
 * DUNLOPILLO MOTIONBED SPA - SURVEY DATA MANAGER
 * ========================================
 * 
 * Professional Data Management System
 * 
 * 특징:
 * ✅ Robust Error Handling & Retry Logic
 * ✅ Multiple Transport Methods (Fetch, JSONP, Form)
 * ✅ Automatic Local Storage Backup
 * ✅ Session Management & Tracking
 * ✅ Comprehensive Logging System
 * ✅ Type Safety with JSDoc
 * ✅ Performance Monitoring
 * ✅ Memory Leak Prevention
 * 
 * @author Professional Development Team
 * @version 2.0.0 - Enterprise Grade
 * @since 2025-07-21
 */

'use strict';

/**
 * 설문 데이터 관리자 - 싱글톤 패턴
 * @class SurveyDataManager
 */
class SurveyDataManager {
  /**
   * @private
   * @static
   * @type {SurveyDataManager|null}
   */
  static _instance = null;

  /**
   * 싱글톤 인스턴스 반환
   * @returns {SurveyDataManager}
   */
  static getInstance() {
    if (!SurveyDataManager._instance) {
      SurveyDataManager._instance = new SurveyDataManager();
    }
    return SurveyDataManager._instance;
  }

  /**
   * @private
   * @constructor
   */
  constructor() {
    if (SurveyDataManager._instance) {
      throw new Error('SurveyDataManager는 싱글톤입니다. getInstance()를 사용하세요.');
    }

    /** @private @type {string} */
    this._sessionId = this._generateSessionId();
    
    /** @private @type {string} */
    this._dealerName = '기본대리점';
    
    /** @private @type {Object} */
    this._responses = this._initializeResponses();
    
    /** @private @type {string} */
    this._webAppUrl = 'https://script.google.com/macros/s/AKfycbx4xVGs57g45p3o_GhHojxG96UBFWFI37QZmsfM5VPqFw6LDeRcIWYGH-GX0fcgjSG1QQ/exec';
    
    /** @private @type {EventTarget} */
    this._eventBus = new EventTarget();
    
    /** @private @type {Map<string, any>} */
    this._cache = new Map();
    
    /** @private @type {number} */
    this._retryCount = 0;
    
    /** @private @type {number} */
    this._maxRetries = 3;
    
    /** @private @type {AbortController} */
    this._abortController = new AbortController();

    this._initialize();
  }

  /**
   * 초기화
   * @private
   */
  _initialize() {
    try {
      this._loadFromStorage();
      this._setupEventListeners();
      this._logInfo('SurveyDataManager 초기화 완료', {
        sessionId: this._sessionId,
        dealerName: this._dealerName
      });
    } catch (error) {
      this._handleError('초기화 실패', error);
    }
  }

  /**
   * 응답 데이터 초기화
   * @private
   * @returns {Object}
   */
  _initializeResponses() {
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      timestamp: now.toISOString(),
      dealerName: this._dealerName,
      sessionId: this._sessionId,
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio || 1
      },
      survey: {
        gender: '',
        experience: '',
        age: ''
      },
      ratings: {
        rating1: 0,  // page5 - 첫 번째 체험 평가
        rating2: 0,  // page8 - 두 번째 체험 평가  
        rating3: 0   // page12/page18 - 최종 평가
      },
      metadata: {
        startTime: now.toISOString(),
        endTime: null,
        duration: 0,
        pageVisits: [],
        interactions: []
      }
    };
  }

  /**
   * 세션 ID 생성
   * @private
   * @returns {string}
   */
  _generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const browser = this._getBrowserInfo();
    return `session_${timestamp}_${random}_${browser}`;
  }

  /**
   * 브라우저 정보 조회
   * @private
   * @returns {string}
   */
  _getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'chrome';
    if (ua.includes('Safari')) return 'safari';
    if (ua.includes('Firefox')) return 'firefox';
    if (ua.includes('Edge')) return 'edge';
    return 'unknown';
  }

  /**
   * 이벤트 리스너 설정
   * @private
   */
  _setupEventListeners() {
    // 페이지 unload 시 최종 데이터 저장
    window.addEventListener('beforeunload', () => {
      this._finalizeSession();
    }, { signal: this._abortController.signal });

    // 가시성 변경 추적
    document.addEventListener('visibilitychange', () => {
      this._trackVisibilityChange();
    }, { signal: this._abortController.signal });
  }

  /**
   * 설문 응답 저장
   * @public
   * @param {string} question - 질문 유형
   * @param {string} answer - 응답 값
   * @returns {Promise<boolean>}
   */
  async saveSurveyResponse(question, answer) {
    try {
      this._validateSurveyInput(question, answer);
      
      // 응답 저장
      this._responses.survey[question] = answer;
      
      // 상호작용 기록
      this._trackInteraction('survey', { question, answer });
      
      this._logInfo('설문 응답 저장됨', { question, answer });
      
      // 백그라운드에서 전송 시도
      this._sendToRemoteAsync();
      
      return true;
    } catch (error) {
      this._handleError('설문 응답 저장 실패', error, { question, answer });
      return false;
    }
  }

  /**
   * 별점 저장
   * @public
   * @param {string} pageType - 페이지 유형
   * @param {number} rating - 별점 (1-5)
   * @returns {Promise<boolean>}
   */
  async saveRating(pageType, rating) {
    try {
      this._validateRatingInput(pageType, rating);
      
      // 별점 저장
      const ratingKey = this._mapPageToRating(pageType);
      this._responses.ratings[ratingKey] = rating;
      
      // 상호작용 기록
      this._trackInteraction('rating', { pageType, rating });
      
      this._logInfo('별점 저장됨', { pageType, rating, ratingKey });
      
      // 백그라운드에서 전송 시도
      this._sendToRemoteAsync();
      
      return true;
    } catch (error) {
      this._handleError('별점 저장 실패', error, { pageType, rating });
      return false;
    }
  }

  /**
   * 페이지를 별점 키로 매핑
   * @private
   * @param {string} pageType 
   * @returns {string}
   */
  _mapPageToRating(pageType) {
    const mappings = {
      'page5': 'rating1',
      'rating1': 'rating1',
      'page8': 'rating2', 
      'rating2': 'rating2',
      'page12': 'rating3',
      'page18': 'rating3',
      'rating3': 'rating3'
    };
    
    return mappings[pageType] || 'rating1';
  }

  /**
   * 상호작용 추적
   * @private
   * @param {string} type 
   * @param {Object} data 
   */
  _trackInteraction(type, data) {
    this._responses.metadata.interactions.push({
      type,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  }

  /**
   * 가시성 변경 추적
   * @private
   */
  _trackVisibilityChange() {
    const isVisible = !document.hidden;
    this._trackInteraction('visibility', { 
      visible: isVisible,
      visibilityState: document.visibilityState 
    });
  }

  /**
   * 세션 종료 처리
   * @private
   */
  _finalizeSession() {
    this._responses.metadata.endTime = new Date().toISOString();
    this._responses.metadata.duration = Date.now() - new Date(this._responses.timestamp).getTime();
    
    // 최종 저장 시도
    this._saveToLocalStorage();
    
    this._logInfo('세션 종료', {
      duration: this._responses.metadata.duration,
      interactions: this._responses.metadata.interactions.length
    });
  }

  /**
   * 원격 서버로 비동기 전송
   * @private
   */
  async _sendToRemoteAsync() {
    try {
      // 디바운스 처리 - 연속 호출 방지
      if (this._sendTimeout) {
        clearTimeout(this._sendTimeout);
      }
      
      this._sendTimeout = setTimeout(async () => {
        await this._sendToGoogleSheets();
      }, 1000); // 1초 디바운스
      
    } catch (error) {
      this._logWarn('비동기 전송 스케줄링 실패', error);
    }
  }

  /**
   * Google Sheets로 데이터 전송 (개선된 버전)
   * @public
   * @returns {Promise<boolean>}
   */
  async sendToGoogleSheets() {
    return this._sendToGoogleSheets();
  }

  /**
   * Google Sheets로 데이터 전송 내부 구현
   * @private
   * @returns {Promise<boolean>}
   */
  async _sendToGoogleSheets() {
    if (!this._webAppUrl || this._webAppUrl.includes('YOUR_GOOGLE')) {
      this._saveToLocalStorage();
      this._logWarn('웹앱 URL이 설정되지 않음');
      return false;
    }

    const methods = [
      () => this._sendWithFetch(),
      () => this._sendWithJsonp(),
      () => this._sendWithForm()
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        await methods[i]();
        this._logTransmission('success', `방법 ${i + 1} 성공`);
        this._saveToLocalStorage();
        this._retryCount = 0;
        return true;
      } catch (error) {
        this._logWarn(`전송 방법 ${i + 1} 실패`, error.message);
        
        if (i === methods.length - 1) {
          // 모든 방법 실패 시
          this._retryCount++;
          if (this._retryCount < this._maxRetries) {
            this._logInfo(`재시도 ${this._retryCount}/${this._maxRetries} 예약`);
            setTimeout(() => this._sendToGoogleSheets(), 5000 * this._retryCount);
          } else {
            this._logTransmission('failed', `모든 방법 실패 (${this._retryCount}회 시도)`);
            this._retryCount = 0;
          }
          this._saveToLocalStorage();
          return false;
        }
      }
    }
    
    return false;
  }

  /**
   * Fetch API를 사용한 전송
   * @private
   * @returns {Promise<boolean>}
   */
  async _sendWithFetch() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(this._webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(this._responses),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      throw new Error(`Fetch 실패: ${error.message}`);
    }
  }

  /**
   * JSONP를 사용한 전송 
   * @private
   * @returns {Promise<boolean>}
   */
  async _sendWithJsonp() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const callbackName = `callback_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const params = new URLSearchParams(this._flattenObject(this._responses)).toString();
      
      // 글로벌 콜백 등록
      window[callbackName] = (response) => {
        this._cleanup(script, callbackName);
        resolve(true);
      };
      
      // 에러 핸들링
      script.onerror = () => {
        this._cleanup(script, callbackName);
        reject(new Error('JSONP 스크립트 로딩 실패'));
      };
      
      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        this._cleanup(script, callbackName);
        reject(new Error('JSONP 타임아웃'));
      }, 10000);
      
      script.src = `${this._webAppUrl}?callback=${callbackName}&${params}`;
      document.head.appendChild(script);
      
      // 정리 함수
      const cleanup = () => clearTimeout(timeoutId);
      script.onload = cleanup;
      script.onerror = cleanup;
    });
  }

  /**
   * Form을 사용한 전송
   * @private  
   * @returns {Promise<boolean>}
   */
  async _sendWithForm() {
    return new Promise((resolve, reject) => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = this._webAppUrl;
      form.target = '_blank';
      form.style.display = 'none';
      
      // 평면화된 데이터를 폼 필드로 변환
      const flatData = this._flattenObject(this._responses);
      Object.entries(flatData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      
      // 폼 정리 및 완료 처리
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        resolve(true);
      }, 1000);
    });
  }

  /**
   * 객체 평면화 (중첩 객체를 평면 구조로 변환)
   * @private
   * @param {Object} obj 
   * @param {string} prefix 
   * @returns {Object}
   */
  _flattenObject(obj, prefix = '') {
    const flattened = {};
    
    Object.keys(obj).forEach(key => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, this._flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        flattened[newKey] = JSON.stringify(value);
      } else {
        flattened[newKey] = value;
      }
    });
    
    return flattened;
  }

  /**
   * JSONP 정리 함수
   * @private
   * @param {HTMLElement} script 
   * @param {string} callbackName 
   */
  _cleanup(script, callbackName) {
    if (document.head.contains(script)) {
      document.head.removeChild(script);
    }
    if (window[callbackName]) {
      delete window[callbackName];
    }
  }

  /**
   * 로컬 스토리지 백업
   * @private
   * @returns {boolean}
   */
  _saveToLocalStorage() {
    try {
      const timestamp = new Date().toISOString();
      const dataWithTimestamp = {
        ...this._responses,
        backupTime: timestamp,
        version: '2.0.0'
      };
      
      // 기존 백업 데이터 조회
      const existingData = JSON.parse(localStorage.getItem('surveyBackup') || '[]');
      existingData.push(dataWithTimestamp);
      
      // 최대 50개 백업만 유지 (메모리 관리)
      if (existingData.length > 50) {
        existingData.splice(0, existingData.length - 50);
      }
      
      localStorage.setItem('surveyBackup', JSON.stringify(existingData));
      
      this._logInfo('로컬 스토리지 백업 완료', { 
        backupCount: existingData.length,
        dataSize: JSON.stringify(dataWithTimestamp).length 
      });
      
      return true;
    } catch (error) {
      this._handleError('로컬 스토리지 저장 실패', error);
      return false;
    }
  }

  /**
   * 로컬 스토리지에서 데이터 로드
   * @private
   */
  _loadFromStorage() {
    try {
      const backup = localStorage.getItem('surveyBackup');
      if (backup) {
        const backupData = JSON.parse(backup);
        if (backupData.length > 0) {
          const latest = backupData[backupData.length - 1];
          this._logInfo('이전 세션 데이터 발견', { 
            sessionId: latest.sessionId,
            backupTime: latest.backupTime 
          });
        }
      }
    } catch (error) {
      this._logWarn('백업 데이터 로드 실패', error);
    }
  }

  /**
   * 전송 로그 기록
   * @private
   * @param {string} status 
   * @param {string} message 
   */
  _logTransmission(status, message = '') {
    try {
      const log = {
        timestamp: new Date().toISOString(),
        sessionId: this._sessionId,
        status,
        message,
        data: this._responses,
        retryCount: this._retryCount,
        userAgent: navigator.userAgent
      };
      
      // 전송 로그 저장
      const logs = JSON.parse(localStorage.getItem('transmissionLogs') || '[]');
      logs.push(log);
      
      // 최대 100개 로그만 유지
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('transmissionLogs', JSON.stringify(logs));
      
      this._logInfo(`전송 로그 기록: ${status}`, { message, retryCount: this._retryCount });
    } catch (error) {
      this._logWarn('전송 로그 기록 실패', error);
    }
  }

  /**
   * 입력 검증 - 설문
   * @private
   * @param {string} question 
   * @param {string} answer 
   */
  _validateSurveyInput(question, answer) {
    if (!question || typeof question !== 'string') {
      throw new Error('유효하지 않은 질문 유형입니다');
    }
    
    if (!answer || typeof answer !== 'string') {
      throw new Error('유효하지 않은 응답 값입니다');
    }
    
    const validQuestions = ['gender', 'experience', 'age'];
    if (!validQuestions.includes(question)) {
      throw new Error(`지원하지 않는 질문 유형입니다: ${question}`);
    }
  }

  /**
   * 입력 검증 - 별점
   * @private
   * @param {string} pageType 
   * @param {number} rating 
   */
  _validateRatingInput(pageType, rating) {
    if (!pageType || typeof pageType !== 'string') {
      throw new Error('유효하지 않은 페이지 유형입니다');
    }
    
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('별점은 1-5 사이의 정수여야 합니다');
    }
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
      sessionId: this._sessionId
    };

    console.error(`🚨 [SurveyDataManager Error] ${message}`, errorInfo);
    
    // 에러 이벤트 발송
    const customEvent = new CustomEvent('surveyError', { detail: errorInfo });
    this._eventBus.dispatchEvent(customEvent);
  }

  /**
   * 로깅 - 정보
   * @private
   * @param {string} message 
   * @param {Object} data 
   */
  _logInfo(message, data = {}) {
    console.log(`ℹ️ [SurveyDataManager] ${message}`, data);
  }

  /**
   * 로깅 - 경고
   * @private
   * @param {string} message 
   * @param {Object} data 
   */
  _logWarn(message, data = {}) {
    console.warn(`⚠️ [SurveyDataManager] ${message}`, data);
  }

  /**
   * 데이터 내보내기 (디버깅용)
   * @public
   * @returns {Object}
   */
  exportData() {
    return {
      responses: { ...this._responses },
      sessionInfo: {
        sessionId: this._sessionId,
        dealerName: this._dealerName,
        retryCount: this._retryCount
      },
      backupData: JSON.parse(localStorage.getItem('surveyBackup') || '[]'),
      transmissionLogs: JSON.parse(localStorage.getItem('transmissionLogs') || '[]')
    };
  }

  /**
   * 통계 조회
   * @public
   * @returns {Object}
   */
  getStatistics() {
    const backups = JSON.parse(localStorage.getItem('surveyBackup') || '[]');
    const logs = JSON.parse(localStorage.getItem('transmissionLogs') || '[]');
    
    return {
      totalSessions: backups.length,
      successfulTransmissions: logs.filter(log => log.status === 'success').length,
      failedTransmissions: logs.filter(log => log.status === 'failed').length,
      currentSessionInteractions: this._responses.metadata.interactions.length,
      averageSessionDuration: this._calculateAverageSessionDuration(backups),
      lastBackupTime: backups.length > 0 ? backups[backups.length - 1].backupTime : null
    };
  }

  /**
   * 평균 세션 시간 계산
   * @private
   * @param {Array} backups 
   * @returns {number}
   */
  _calculateAverageSessionDuration(backups) {
    const durations = backups
      .filter(backup => backup.metadata?.duration)
      .map(backup => backup.metadata.duration);
    
    return durations.length > 0 
      ? Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length)
      : 0;
  }

  /**
   * 정리 작업
   * @public
   */
  cleanup() {
    try {
      this._finalizeSession();
      this._abortController.abort();
      
      if (this._sendTimeout) {
        clearTimeout(this._sendTimeout);
      }
      
      this._logInfo('SurveyDataManager 정리 완료');
    } catch (error) {
      console.error('정리 중 오류 발생:', error);
    }
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

  // ==== 레거시 호환성 메서드들 ====
  
  /**
   * @deprecated 레거시 호환성을 위해 유지
   */
  get sessionId() { return this._sessionId; }
  get dealerName() { return this._dealerName; }
  get responses() { return this._responses; }
  get webAppUrl() { return this._webAppUrl; }
  
  set dealerName(name) { 
    this._dealerName = name;
    this._responses.dealerName = name;
  }

  /**
   * @deprecated 레거시 호환성을 위해 유지
   */
  generateSessionId() { return this._generateSessionId(); }
  saveToLocalStorage() { return this._saveToLocalStorage(); }
  logTransmission(status, message) { return this._logTransmission(status, message); }
}

/**
 * 전역 인스턴스 생성 및 레거시 호환성 지원
 */
function createSurveyDataInstance() {
  const manager = SurveyDataManager.getInstance();
  
  // 레거시 호환성을 위한 전역 객체 생성
  const legacyInstance = {
    // 레거시 프로퍼티들
    sessionId: manager.sessionId,
    dealerName: manager.dealerName,
    responses: manager.responses,
    webAppUrl: manager.webAppUrl,
    
    // 레거시 메서드들 - 새로운 메서드로 위임
    saveSurveyResponse: manager.saveSurveyResponse.bind(manager),
    saveRating: manager.saveRating.bind(manager),
    sendToGoogleSheets: manager.sendToGoogleSheets.bind(manager),
    generateSessionId: manager.generateSessionId.bind(manager),
    saveToLocalStorage: manager.saveToLocalStorage.bind(manager),
    logTransmission: manager.logTransmission.bind(manager),
    
    // 새로운 메서드들도 노출
    exportData: manager.exportData.bind(manager),
    getStatistics: manager.getStatistics.bind(manager),
    cleanup: manager.cleanup.bind(manager),
    addEventListener: manager.addEventListener.bind(manager),
    removeEventListener: manager.removeEventListener.bind(manager)
  };
  
  return legacyInstance;
}

// 전역 변수로 설정 (레거시 호환성)
if (typeof window !== 'undefined') {
  window.surveyData = createSurveyDataInstance();
  window.SurveyDataManager = SurveyDataManager;
}
    const results = [];
    
    console.log(`🔄 ${backups.length}개의 백업 데이터 재전송 시도...`);
    
    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i];
      
      // 임시로 응답 데이터 교체
      const originalResponses = { ...this.responses };
      this.responses = { ...backup };
      
      const success = await this.sendToGoogleSheets();
      results.push({ index: i, success, data: backup });
      
      // 원래 데이터 복원
      this.responses = originalResponses;
      