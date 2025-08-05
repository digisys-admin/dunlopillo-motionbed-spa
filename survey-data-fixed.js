/**
 * 설문조사 응답 저장 함수 (레거시 지원)
 * @param {string} category - 설문 카테고리 
 * @param {string} value - 선택된 값
 */
function saveSurveyResponse(category, value) {
  console.log('📝 [LegacySurveyData] 설문 응답 저장:', category, value);
  
  // 새로운 매니저가 있으면 그것을 사용
  if (window.surveyDataManager) {
    window.surveyDataManager.saveSurveyResponse(category, value);
    return;
  }
  
  console.warn('⚠️ [LegacySurveyData] 매니저가 아직 초기화되지 않았습니다');
}

/**
 * 별점 저장
 * @param {string|number} pageType - 페이지 유형 (5, 8, 12, 18) 또는 페이지명 (page5, page8, page12, page18)
 * @param {number} rating - 별점 (1-5)
 * @returns {Promise<boolean>}
 */
async function saveRating(pageType, rating) {
  try {
    if (!window.surveyDataManager) {
      console.warn('⚠️ [LegacySurveyData] 매니저가 아직 초기화되지 않았습니다');
      return false;
    }

    // 페이지 타입을 새로운 형식으로 변환 (이미 page가 붙어있으면 그대로 사용)
    const page = pageType.toString().startsWith('page') ? pageType : `page${pageType}`;
    window.surveyDataManager.saveRating(page, rating);
    console.log(`⭐ [LegacySurveyData] 별점 저장: ${page} = ${rating}점`);
    return true;
  } catch (error) {
    console.error('❌ [LegacySurveyData] 별점 저장 실패:', error);
    return false;
  }
}

console.log('✅ [LegacySurveyData] 레거시 함수들 로드 완료');
