/**
 * ========================================
 * 설문조사 데이터 관리 시스템
 * ========================================
 * 
 * Google Sheets와 연동하여 실시간으로 설문조사 및 별점 데이터를 수집
 * 
 * @version 1.0.0
 * @since 2025-01-24
 */

'use strict';

/**
 * 데이터 수집 관리 클래스
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
    // API 엔드포인트 설정
        this._apiEndpoint = 'https://script.google.com/macros/s/AKfycbyC025uuAdcxa8QnIxloCANUm1QMm4dC6sgMXSuK7jH2asoyCYQEoTHdAxmUacT2wjE8Q/exec';
    
    /** @private @type {string} */
    this._tabletId = this._generateTabletId();
    
    /** @private @type {string} */
    this._userId = this._generateUserId();
    
    /** @private @type {Date} */
    this._sessionStart = new Date();
    
    /** @private @type {Object} */
    this._surveyData = {
      gender: null,
      experience: null,
      age: null
    };
    
    /** @private @type {Object} */
    this._ratingsData = {
      page5: null,   // 체험 만족도
      page8: null,   // 제품 만족도  
      page12: null,  // 구매 의향
      page18: null   // 추천 의향
    };
    
    /** @private @type {boolean} */
    this._isDataSent = false;
    
    /** @private @type {Array<Function>} */
    this._pendingRequests = [];

    this._initializeSystem();
  }

  /**
   * 시스템 초기화
   * @private
   */
  _initializeSystem() {
    console.log('📊 [SurveyDataManager] 시스템 초기화');
    console.log(`🏷️ 테블릿 ID: ${this._tabletId}`);
    console.log(`👤 사용자 ID: ${this._userId}`);
    console.log(`⏰ 세션 시작: ${this._sessionStart.toISOString()}`);
    
    // 페이지 언로드 시 데이터 전송
    window.addEventListener('beforeunload', () => {
      this._sendFinalData();
    });
    
    // 주기적으로 데이터 백업 (5분마다)
    setInterval(() => {
      this._backupData();
    }, 5 * 60 * 1000);
  }

  /**
   * 테블릿 ID 생성
   * @private
   * @returns {string}
   */
  _generateTabletId() {
    // URL 파라미터에서 테블릿 ID 확인
    const urlParams = new URLSearchParams(window.location.search);
    const tabletId = urlParams.get('tablet') || urlParams.get('t');
    
    if (tabletId) {
      return `TABLET_${tabletId.toUpperCase()}`;
    }
    
    // IP 주소 기반 ID 생성
    const ip = this._getLocalIP();
    const hash = this._generateHash(ip + navigator.userAgent);
    return `TABLET_${hash.substring(0, 8).toUpperCase()}`;
  }

  /**
   * 사용자 ID 생성
   * @private
   * @returns {string}
   */
  _generateUserId() {
    // 세션 스토리지에서 기존 ID 확인
    let userId = sessionStorage.getItem('dunlopillo_user_id');
    
    if (!userId) {
      // 새 사용자 ID 생성
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      userId = `USER_${timestamp}_${random.toUpperCase()}`;
      sessionStorage.setItem('dunlopillo_user_id', userId);
    }
    
    return userId;
  }

  /**
   * 로컬 IP 주소 추정
   * @private
   * @returns {string}
   */
  _getLocalIP() {
    // 현재 접속 중인 IP 추정 (Live Server 기준)
    const host = window.location.hostname;
    if (host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
      return host;
    }
    return 'localhost';
  }

  /**
   * 간단한 해시 생성
   * @private
   * @param {string} str
   * @returns {string}
   */
  _generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32비트 정수로 변환
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * 설문조사 응답 저장
   * @public
   * @param {string} category - 설문 카테고리 (gender, experience, age)
   * @param {string} value - 선택된 값
   */
  saveSurveyResponse(category, value) {
    if (!this._surveyData.hasOwnProperty(category)) {
      console.warn(`❌ [SurveyDataManager] 알 수 없는 설문 카테고리: ${category}`);
      return;
    }
    
    this._surveyData[category] = value;
    console.log(`📝 [SurveyDataManager] 설문 응답 저장: ${category} = ${value}`);
    
    // 로컬 스토리지에 백업
    localStorage.setItem('dunlopillo_survey_data', JSON.stringify(this._surveyData));
    
    // 설문이 완료되면 중간 저장
    if (this._isSurveyComplete()) {
      console.log('✅ [SurveyDataManager] 설문조사 완료');
      this._sendIntermediateData();
    }
  }

  /**
   * 별점 평가 저장
   * @public
   * @param {string} page - 페이지명 (page5, page8, page12, page18)
   * @param {number} rating - 별점 (1-5)
   */
  saveRating(page, rating) {
    if (!this._ratingsData.hasOwnProperty(page)) {
      console.warn(`❌ [SurveyDataManager] 알 수 없는 별점 페이지: ${page}`);
      return;
    }
    
    if (rating < 1 || rating > 5) {
      console.warn(`❌ [SurveyDataManager] 잘못된 별점 값: ${rating}`);
      return;
    }
    
    this._ratingsData[page] = rating;
    console.log(`⭐ [SurveyDataManager] 별점 저장: ${page} = ${rating}점`);
    
    // 로컬 스토리지에 백업
    localStorage.setItem('dunlopillo_ratings_data', JSON.stringify(this._ratingsData));
    
    // 실시간으로 데이터 전송
    this._sendIntermediateData();
  }

  /**
   * 설문조사 완료 여부 확인
   * @private
   * @returns {boolean}
   */
  _isSurveyComplete() {
    return Object.values(this._surveyData).every(value => value !== null);
  }

  /**
   * 중간 데이터 전송 (실시간)
   * @private
   */
  async _sendIntermediateData() {
    if (this._isDataSent) return; // 중복 전송 방지
    
    try {
      const data = this._buildDataPayload(false);
      await this._sendToGoogleSheets(data);
      console.log('📤 [SurveyDataManager] 중간 데이터 전송 완료');
    } catch (error) {
      console.warn('⚠️ [SurveyDataManager] 중간 데이터 전송 실패 (Google Sheets 미설정):', error.message);
      // 로컬에는 정상적으로 저장되므로 계속 진행
    }
  }

  /**
   * 최종 데이터 전송
   * @private
   */
  async _sendFinalData() {
    if (this._isDataSent) return;
    
    try {
      const data = this._buildDataPayload(true);
      await this._sendToGoogleSheets(data);
      this._isDataSent = true;
      console.log('🎯 [SurveyDataManager] 최종 데이터 전송 완료');
    } catch (error) {
      console.warn('⚠️ [SurveyDataManager] 최종 데이터 전송 실패 (Google Sheets 미설정):', error.message);
      // 로컬 데이터는 유지됨
    }
  }

  /**
   * 데이터 페이로드 구성
   * @private
   * @param {boolean} isFinal - 최종 전송 여부
   * @returns {Object}
   */
  _buildDataPayload(isFinal) {
    const sessionEnd = isFinal ? new Date() : null;
    
    return {
      tabletId: this._tabletId,
      userId: this._userId,
      survey: { ...this._surveyData },
      ratings: { ...this._ratingsData },
      sessionStart: this._sessionStart.toISOString(),
      sessionEnd: sessionEnd ? sessionEnd.toISOString() : null,
      ipAddress: this._getLocalIP(),
      browserInfo: this._getBrowserInfo(),
      isFinal: isFinal,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 브라우저 정보 수집
   * @private
   * @returns {string}
   */
  _getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      browser = 'Chrome';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'Safari';
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
    }
    
    // 버전 추출
    const version = ua.match(new RegExp(browser + '/([0-9.]+)'));
    return version ? `${browser}/${version[1]}` : browser;
  }

  /**
   * Google Sheets로 데이터 전송
   * @private
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async _sendToGoogleSheets(data) {
    console.log('📤 [SurveyDataManager] Google Sheets 전송 시도:', this._apiEndpoint);
    console.log('📤 [SurveyDataManager] 전송 데이터:', data);
    
    try {
      const response = await fetch(this._apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
      });
      
      console.log('📤 [SurveyDataManager] 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📤 [SurveyDataManager] 응답 결과:', result);
      
      if (!result.success) {
        throw new Error(result.error || '알 수 없는 오류가 발생했습니다');
      }
      
      return result;
    } catch (error) {
      console.error('📤 [SurveyDataManager] 전송 실패 상세:', {
        error: error.message,
        endpoint: this._apiEndpoint,
        data: data
      });
      throw error;
    }
  }

  /**
   * 로컬 데이터 백업
   * @private
   */
  _backupData() {
    const backupData = {
      tabletId: this._tabletId,
      userId: this._userId,
      sessionStart: this._sessionStart.toISOString(),
      survey: this._surveyData,
      ratings: this._ratingsData,
      lastBackup: new Date().toISOString()
    };
    
    localStorage.setItem('dunlopillo_backup_data', JSON.stringify(backupData));
    console.log('💾 [SurveyDataManager] 데이터 백업 완료');
  }

  /**
   * 백업 데이터 복원
   * @public
   * @returns {boolean} 복원 성공 여부
   */
  restoreBackupData() {
    try {
      const backupJson = localStorage.getItem('dunlopillo_backup_data');
      if (!backupJson) return false;
      
      const backup = JSON.parse(backupJson);
      
      // 데이터 복원
      this._surveyData = backup.survey || {};
      this._ratingsData = backup.ratings || {};
      
      console.log('🔄 [SurveyDataManager] 백업 데이터 복원 완료');
      return true;
    } catch (error) {
      console.error('❌ [SurveyDataManager] 백업 데이터 복원 실패:', error);
      return false;
    }
  }

  /**
   * API 엔드포인트 설정
   * @public
   * @param {string} endpoint - Google Apps Script 웹 앱 URL
   */
  setApiEndpoint(endpoint) {
    this._apiEndpoint = endpoint;
    console.log(`🔗 [SurveyDataManager] API 엔드포인트 설정: ${endpoint}`);
  }

  /**
   * 현재 수집된 데이터 조회
   * @public
   * @returns {Object}
   */
  getCurrentData() {
    return {
      tabletId: this._tabletId,
      userId: this._userId,
      sessionStart: this._sessionStart.toISOString(),
      survey: { ...this._surveyData },
      ratings: { ...this._ratingsData },
      isComplete: this._isSurveyComplete(),
      isDataSent: this._isDataSent
    };
  }

  /**
   * 데이터 초기화
   * @public
   */
  resetData() {
    this._surveyData = { gender: null, experience: null, age: null };
    this._ratingsData = { page5: null, page8: null, page12: null, page18: null };
    this._isDataSent = false;
    this._sessionStart = new Date();
    
    // 로컬 스토리지 정리
    localStorage.removeItem('dunlopillo_survey_data');
    localStorage.removeItem('dunlopillo_ratings_data');
    localStorage.removeItem('dunlopillo_backup_data');
    
    console.log('🗑️ [SurveyDataManager] 데이터 초기화 완료');
  }

  /**
   * 시스템 상태 조회
   * @public
   * @returns {Object}
   */
  getSystemStatus() {
    return {
      tabletId: this._tabletId,
      userId: this._userId,
      sessionDuration: Date.now() - this._sessionStart.getTime(),
      surveyComplete: this._isSurveyComplete(),
      ratingsCount: Object.values(this._ratingsData).filter(r => r !== null).length,
      dataTransmitted: this._isDataSent,
      apiEndpoint: this._apiEndpoint
    };
  }
}

// 즉시 실행 함수로 초기화 (클래스 정의 후에 실행)
(function() {
  console.log('📊 [SurveyDataManager] 초기화 시작...');
  
  try {
    // SurveyDataManager 클래스가 정의되었는지 확인
    if (typeof SurveyDataManager === 'undefined') {
      throw new Error('SurveyDataManager 클래스가 정의되지 않았습니다');
    }
    console.log('✅ [SurveyDataManager] 클래스 정의 확인됨');
    
    // 전역 인스턴스 생성 및 노출
    window.SurveyDataManager = SurveyDataManager; // 클래스도 전역으로 노출
    window.surveyDataManager = SurveyDataManager.getInstance();
    console.log('✅ [SurveyDataManager] 인스턴스 생성 완료');
    
    // 인스턴스 유효성 검사
    if (!window.surveyDataManager) {
      throw new Error('surveyDataManager 인스턴스 생성 실패');
    }
    
    // 메서드들이 제대로 있는지 확인
    const requiredMethods = ['saveSurveyResponse', 'saveRating', 'getSystemStatus', 'getCurrentData'];
    requiredMethods.forEach(method => {
      if (typeof window.surveyDataManager[method] !== 'function') {
        throw new Error(`필수 메서드 ${method}가 없습니다`);
      }
    });
    console.log('✅ [SurveyDataManager] 메서드 검증 완료');
    
    // 레거시 호환성을 위한 전역 함수들
    window.saveSurveyResponse = (category, value) => {
      console.log('📝 [Legacy] saveSurveyResponse 호출:', category, value);
      window.surveyDataManager.saveSurveyResponse(category, value);
    };

    window.saveRating = (page, rating) => {
      console.log('⭐ [Legacy] saveRating 호출:', page, rating);
      window.surveyDataManager.saveRating(page, rating);
    };
    
    console.log('✅ [SurveyDataManager] 전역 함수 등록 완료');
    
    // 백업 데이터 복원 시도 (즉시 실행)
    window.surveyDataManager.restoreBackupData();
    
    // 시스템 상태 로그
    console.log('📊 [SurveyDataManager] 시스템 상태:');
    console.table(window.surveyDataManager.getSystemStatus());
    
    console.log('🚀 [SurveyDataManager] 시스템 로드 완료');
    
  } catch (error) {
    console.error('❌ [SurveyDataManager] 초기화 실패:', error);
    console.error('스택 트레이스:', error.stack);
    
    // 전역 디버깅 정보에 오류 추가
    if (window.debugInfo) {
      window.debugInfo.errors.push({
        message: `SurveyDataManager 초기화 실패: ${error.message}`,
        stack: error.stack,
        source: 'survey-data-manager.js'
      });
    }
  }
})();

/**
 * DOM 로드 완료 시 추가 초기화
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 [SurveyDataManager] DOM 로드 완료');
  });
} else {
  console.log('📄 [SurveyDataManager] DOM 이미 로드됨');
}
