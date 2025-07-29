// 테스트용 간단한 SurveyDataManager
console.log('📊 간단한 SurveyDataManager 로드 시작');

class SurveyDataManager {
  static _instance = null;

  static getInstance() {
    if (!SurveyDataManager._instance) {
      SurveyDataManager._instance = new SurveyDataManager();
    }
    return SurveyDataManager._instance;
  }

  constructor() {
    console.log('📊 SurveyDataManager 생성자 호출');
    this._tabletId = 'TEST-' + Math.random().toString(36).substr(2, 9);
    this._userId = 'USER-' + Math.random().toString(36).substr(2, 9);
    this._sessionStart = new Date();
  }

  getSystemStatus() {
    console.log('📊 getSystemStatus 호출됨');
    return {
      tabletId: this._tabletId,
      userId: this._userId,
      sessionDuration: Date.now() - this._sessionStart.getTime(),
      surveyComplete: false,
      ratingsCount: 0,
      dataTransmitted: false,
      apiEndpoint: 'test-endpoint'
    };
  }

  saveSurveyResponse(category, value) {
    console.log('📝 saveSurveyResponse:', category, value);
  }

  saveRating(page, rating) {
    console.log('⭐ saveRating:', page, rating);
  }

  getCurrentData() {
    console.log('📊 getCurrentData 호출됨');
    return { test: 'data' };
  }

  restoreBackupData() {
    console.log('🔄 restoreBackupData 호출됨');
  }
}

// 즉시 초기화
try {
  console.log('📊 [SurveyDataManager] 초기화 시작...');
  
  // 전역으로 노출
  window.SurveyDataManager = SurveyDataManager;
  window.surveyDataManager = SurveyDataManager.getInstance();
  
  console.log('✅ [SurveyDataManager] 초기화 완료');
  console.log('✅ window.SurveyDataManager:', typeof window.SurveyDataManager);
  console.log('✅ window.surveyDataManager:', typeof window.surveyDataManager);
  
} catch (error) {
  console.error('❌ [SurveyDataManager] 초기화 실패:', error);
}

console.log('📊 간단한 SurveyDataManager 로드 완료');
