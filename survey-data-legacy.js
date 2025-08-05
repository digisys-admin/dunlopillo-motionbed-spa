/**
 * ========================================
 * DUNLOPILLO MOTIONBED SPA - SURVEY DATA MANAGER (통합 버전)
 * ========================================
 * 
 * Google Sheets 연동 설문조사 데이터 수집 시스템
 * 
 * @author Development Team
 * @version 3.0.0 - Google Sheets Integration
 * @since 2025-01-24
 */

'use strict';

/**
 * 레거시 호환성을 위한 설문 데이터 관리자
 * 새로운 SurveyDataManager와 연동하여 작동
 * @class LegacySurveyData
 */
class LegacySurveyData {
  constructor() {
    // 새로운 데이터 매니저 인스턴스 참조
    this._manager = null;
    
    /** @type {string} */
    this.sessionId = '';
    
    /** @type {string} */
    this._dealerName = '기본대리점';
    
    /** @type {string} */
    this._webAppUrl = 'https://script.google.com/macros/s/AKfycbwP5rQmthmDRxOlQC6x7hZNlqSeO8ZjCPgtt8EyM3Suhx9f33EvY_WQiD_RMrgSxxqWSA/exec';
    
    this._initializeManager();
  }

  /**
   * 매니저 초기화
   * @private
   */
  _initializeManager() {
    if (window.surveyDataManager) {
      this._manager = window.surveyDataManager;
      this.sessionId = this._manager._userId;
      console.log('🔗 [LegacySurveyData] 레거시 호환성 모드 활성화');
    } else {
      // 매니저가 아직 로드되지 않은 경우 대기
      setTimeout(() => this._initializeManager(), 100);
    }
  }

  /**
   * 응답 데이터 조회 (동적)
   * @returns {Object}
   */
  get responses() {
    if (!this._manager) {
      return this._getEmptyResponses();
    }

    const currentData = this._manager.getCurrentData();
    
    return {
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      dealerName: this._dealerName,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio || 1
      },
      survey: {
        gender: currentData.survey.gender || '',
        experience: currentData.survey.experience || '',
        age: currentData.survey.age || ''
      },
      ratings: {
        rating1: currentData.ratings.page5 || 0,   // page5 - 첫 번째 체험 평가
        rating2: currentData.ratings.page8 || 0,   // page8 - 두 번째 체험 평가  
        rating3: currentData.ratings.page12 || currentData.ratings.page18 || 0  // page12/page18 - 최종 평가
      },
      metadata: {
        startTime: currentData.sessionStart,
        endTime: null,
        duration: Date.now() - new Date(currentData.sessionStart).getTime(),
        pageVisits: [],
        interactions: []
      }
    };
  }

  /**
   * 빈 응답 데이터 반환
   * @private
   * @returns {Object}
   */
  _getEmptyResponses() {
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      timestamp: now.toISOString(),
      dealerName: this._dealerName,
      sessionId: this.sessionId,
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
        rating1: 0,
        rating2: 0,
        rating3: 0
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
   * 설문 응답 저장
   * @param {string} question - 질문 유형 (gender, experience, age)
   * @param {string} answer - 응답 값
   * @returns {Promise<boolean>}
   */
  async saveSurveyResponse(question, answer) {
    try {
      if (!this._manager) {
        console.warn('⚠️ [LegacySurveyData] 매니저가 아직 초기화되지 않았습니다');
        return false;
      }

      this._manager.saveSurveyResponse(question, answer);
      console.log(`📝 [LegacySurveyData] 설문 응답 저장: ${question} = ${answer}`);
      return true;
    } catch (error) {
      console.error('❌ [LegacySurveyData] 설문 응답 저장 실패:', error);
      return false;
    }
  }

  /**
   * 별점 저장
   * @param {string} pageType - 페이지 유형 (5, 8, 12, 18)
   * @param {number} rating - 별점 (1-5)
   * @returns {Promise<boolean>}
   */
  async saveRating(pageType, rating) {
    try {
      if (!this._manager) {
        console.warn('⚠️ [LegacySurveyData] 매니저가 아직 초기화되지 않았습니다');
        return false;
      }

      // 페이지 타입을 새로운 형식으로 변환
      const page = `page${pageType}`;
      this._manager.saveRating(page, rating);
      console.log(`⭐ [LegacySurveyData] 별점 저장: ${page} = ${rating}점`);
      return true;
    } catch (error) {
      console.error('❌ [LegacySurveyData] 별점 저장 실패:', error);
      return false;
    }
  }

  /**
   * Google Sheets로 데이터 전송
   * @returns {Promise<boolean>}
   */
  async sendToGoogleSheets() {
    try {
      console.log('📤 [LegacySurveyData] Google Sheets 전송 요청');
      console.log('📊 현재 수집된 데이터:', this.responses);
      
      // 새로운 매니저를 통해 데이터 전송
      // 실제 전송은 새로운 시스템에서 자동으로 처리됨
      return true;
    } catch (error) {
      console.error('❌ [LegacySurveyData] 데이터 전송 실패:', error);
      return false;
    }
  }

  /**
   * 로컬 스토리지 저장
   * @returns {boolean}
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem('dunlopillo_legacy_data', JSON.stringify(this.responses));
      console.log('💾 [LegacySurveyData] 로컬 저장 완료');
      return true;
    } catch (error) {
      console.error('❌ [LegacySurveyData] 로컬 저장 실패:', error);
      return false;
    }
  }

  /**
   * 세션 ID 생성 (레거시 호환)
   * @returns {string}
   */
  generateSessionId() {
    return this.sessionId;
  }

  /**
   * 전송 로그 (레거시 호환)
   * @param {string} status
   * @param {string} message
   */
  logTransmission(status, message) {
    console.log(`📋 [LegacySurveyData] ${status}: ${message}`);
  }

  /**
   * 데이터 내보내기
   * @returns {Object}
   */
  exportData() {
    return this._manager ? this._manager.getCurrentData() : this._getEmptyResponses();
  }

  /**
   * 통계 정보 조회
   * @returns {Object}
   */
  getStatistics() {
    return this._manager ? this._manager.getSystemStatus() : {};
  }

  /**
   * 정리 작업
   */
  cleanup() {
    console.log('🧹 [LegacySurveyData] 정리 작업 완료');
  }

  /**
   * 딜러명 설정
   * @param {string} name
   */
  set dealerName(name) {
    this._dealerName = name;
    console.log(`🏪 [LegacySurveyData] 딜러명 설정: ${name}`);
  }

  get dealerName() {
    return this._dealerName;
  }

  /**
   * API 엔드포인트 설정
   * @param {string} url
   */
  set webAppUrl(url) {
    this._webAppUrl = url;
    if (this._manager) {
      this._manager.setApiEndpoint(url);
    }
    console.log(`🔗 [LegacySurveyData] API 엔드포인트 설정: ${url}`);
  }

  get webAppUrl() {
    return this._webAppUrl;
  }
}

/**
 * 전역 변수 설정 및 레거시 호환성 지원
 */
function initializeLegacySupport() {
  // 레거시 인스턴스 생성
  const legacyInstance = new LegacySurveyData();

  // 전역 변수로 설정
  window.surveyData = legacyInstance;
  
  // 전역 함수들도 설정 (기존 코드 호환성)
  window.saveSurveyResponse = legacyInstance.saveSurveyResponse.bind(legacyInstance);
  window.saveRating = legacyInstance.saveRating.bind(legacyInstance);
  
  console.log('✅ [LegacySurveyData] 레거시 호환성 시스템 초기화 완료');
  console.log('📋 사용 가능한 전역 객체: window.surveyData');
  console.log('📋 사용 가능한 전역 함수: saveSurveyResponse(), saveRating()');
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLegacySupport);
} else {
  initializeLegacySupport();
}

console.log('📦 [LegacySurveyData] 레거시 호환성 모듈 로드 완료');
