/**
 * ========================================
 * GOOGLE APPS SCRIPT - 설문조사 데이터 수집 API
 * ========================================
 * 
 * 사용법:
 * 1. Google Apps Script에서 새 프로젝트 생성
 * 2. 이 코드를 붙여넣기
 * 3. doPost 함수를 웹 앱으로 배포
 * 4. 배포 URL을 JavaScript에서 사용
 */

// Google Sheets 설정
const SPREADSHEET_ID = '1RTjrn7N-q0-uAm2mHn2CMwaU-HobX8FRqvVa37vlpOg'; // 개인 계정의 새 스프레드시트 ID로 변경
const SHEET_NAME = '설문결과';

/**
 * GET 요청 처리 함수 (브라우저에서 직접 접근할 때)
 * @param {Object} e - 요청 이벤트 객체
 * @returns {Object} HTML 또는 JSON 응답
 */
function doGet(e) {
  try {
    console.log('GET 요청 수신:', e ? e.parameter : 'direct execution');
    
    // 브라우저에서 직접 접근한 경우 상태 정보 반환
    const response = {
      status: 'online',
      service: '던롭필로 설문조사 API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        POST: '/exec (데이터 저장)',
        GET: '/exec (상태 확인)'
      },
      message: 'API가 정상적으로 작동 중입니다'
    };
    
    return createJsonResponse(response);
    
  } catch (error) {
    console.error('GET 요청 처리 중 오류:', error);
    return createJsonResponse({
      success: false,
      error: 'GET 요청 처리 실패',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * POST 요청 처리 함수
 * @param {Object} e - 요청 이벤트 객체
 * @returns {Object} JSON 응답
 */
function doPost(e) {
  try {
    console.log('POST 요청 수신:', e.postData.contents);
    
    // JSON 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    console.log('파싱된 데이터:', data);
    
    // 테스트 데이터 확인
    if (data.isTest) {
      console.log('테스트 데이터 수신됨');
      return createJsonResponse({
        success: true,
        message: '테스트 연결 성공! API가 정상적으로 작동합니다.',
        testData: data,
        timestamp: new Date().toISOString()
      });
    }
    
    // 데이터 검증
    if (!data.userId || !data.tabletId) {
      throw new Error('필수 데이터가 누락되었습니다');
    }
    
    // Google Sheets에 데이터 저장
    const result = saveToSheet(data);
    
    return createJsonResponse({
      success: true,
      message: '데이터가 성공적으로 저장되었습니다',
      rowIndex: result.rowIndex,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('오류 발생:', error.toString());
    
    return createJsonResponse({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * OPTIONS 요청 처리 (CORS Preflight)
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * JSON 응답 생성 (CORS 헤더 포함)
 * @param {Object} data - 응답 데이터
 * @returns {Object} ContentService 응답
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Google Sheets에 데이터 저장
 * @param {Object} data - 저장할 데이터
 * @returns {Object} 저장 결과
 */
function saveToSheet(data) {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    }
    
    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }
    
    // 데이터 행 생성
    const row = createDataRow(data);
    
    // 데이터 추가
    const rowIndex = sheet.getLastRow() + 1;
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    
    console.log(`데이터 저장 완료: 행 ${rowIndex}`);
    
    return {
      success: true,
      rowIndex: rowIndex,
      data: row
    };
    
  } catch (error) {
    console.error('시트 저장 에러:', error);
    throw new Error(`시트 저장 실패: ${error.toString()}`);
  }
}

/**
 * 시트 헤더 설정
 * @param {Sheet} sheet - Google Sheets 객체
 */
function setupHeaders(sheet) {
  const headers = [
    '날짜',
    '시간',
    '테블릿ID',
    '사용자ID',
    '성별',
    '모션베드경험',
    '연령대',
    '별점_체험만족도',
    '별점_제품만족도', 
    '별점_구매의향',
    '별점_추천의향',
    '세션시작시간',
    '세션종료시간',
    '체험시간(분)',
    'IP주소',
    '브라우저정보'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // 열 너비 자동 조정
  sheet.autoResizeColumns(1, headers.length);
  
  console.log('헤더 설정 완료');
}

/**
 * 데이터 행 생성
 * @param {Object} data - 원본 데이터
 * @returns {Array} 시트 행 데이터
 */
function createDataRow(data) {
  const now = new Date();
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // KST 변환
  
  // 체험 시간 계산 (분 단위)
  const experienceTime = data.sessionEnd && data.sessionStart ? 
    Math.round((new Date(data.sessionEnd) - new Date(data.sessionStart)) / 60000) : 0;
  
  return [
    kstTime.toISOString().split('T')[0], // 날짜 (YYYY-MM-DD)
    kstTime.toLocaleTimeString('ko-KR'), // 시간 (HH:MM:SS)
    data.tabletId || '',                 // 테블릿 ID
    data.userId || '',                   // 사용자 ID
    data.survey?.gender || '',           // 성별
    data.survey?.experience || '',       // 모션베드 경험
    data.survey?.age || '',              // 연령대
    data.ratings?.page5 || '',           // 별점1: 체험 만족도
    data.ratings?.page8 || '',           // 별점2: 제품 만족도
    data.ratings?.page12 || '',          // 별점3: 구매 의향
    data.ratings?.page18 || '',          // 별점4: 추천 의향
    data.sessionStart || '',             // 세션 시작 시간
    data.sessionEnd || kstTime.toISOString(), // 세션 종료 시간
    experienceTime,                      // 체험 시간 (분)
    data.ipAddress || '',                // IP 주소
    data.browserInfo || ''               // 브라우저 정보
  ];
}

/**
 * 테스트 함수 - 수동 실행용
 */
function testDataSave() {
  const testData = {
    tabletId: 'TABLET_001',
    userId: 'USER_12345',
    survey: {
      gender: '남성',
      experience: '있음',
      age: '30-39세'
    },
    ratings: {
      page5: 5,
      page8: 4,
      page12: 3,
      page18: 5
    },
    sessionStart: '2025-01-24T10:00:00.000Z',
    sessionEnd: '2025-01-24T10:15:00.000Z',
    ipAddress: '192.168.0.110',
    browserInfo: 'Chrome/131.0.0.0'
  };
  
  try {
    const result = saveToSheet(testData);
    console.log('테스트 성공:', result);
    return result;
  } catch (error) {
    console.error('테스트 실패:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * 시트 초기화 함수 - 수동 실행용
 */
function initializeSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (sheet) {
      spreadsheet.deleteSheet(sheet);
    }
    
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    setupHeaders(sheet);
    
    console.log('시트 초기화 완료');
    return { success: true, message: '시트가 초기화되었습니다' };
    
  } catch (error) {
    console.error('시트 초기화 실패:', error);
    return { success: false, error: error.toString() };
  }
}
