# 🚀 던롭필로 SPA - Google Sheets 데이터 수집 설정 가이드

## 📊 개요

던롭필로 모션베드 SPA는 실시간으로 설문조사 및 별점 데이터를 Google Sheets에 저장하는 시스템을 제공합니다.

## 🔧 단계별 설정 가이드

### 1단계: Google Sheets 생성

1. **Google Sheets 접속**
   - https://sheets.google.com 에 접속
   - 새 스프레드시트 생성

2. **시트 이름 설정**
   ```
   시트명: Dunlopillo_Survey_Data
   ```

3. **헤더 설정** (첫 번째 행에 다음 컬럼들 입력)
   ```
   A1: 날짜
   B1: 테블릿ID  
   C1: 사용자ID
   D1: 성별
   E1: 매트리스_경험
   F1: 연령대
   G1: 체험만족도_Page5
   H1: 제품만족도_Page8
   I1: 구매의향_Page12
   J1: 추천의향_Page18
   K1: 세션시작시간
   L1: 세션종료시간
   M1: IP주소
   N1: 브라우저정보
   O1: 타임스탬프
   ```

### 2단계: Google Apps Script 설정

1. **Apps Script 열기**
   - Google Sheets에서 `확장 프로그램` > `Apps Script` 클릭

2. **코드 교체**
   - 기본 `Code.gs` 파일의 내용을 모두 삭제
   - `google-apps-script.js` 파일의 내용을 복사하여 붙여넣기

3. **스크립트 저장**
   - `Ctrl+S` (또는 `Cmd+S`)로 저장
   - 프로젝트 이름: `Dunlopillo_Survey_Collector`

### 3단계: 웹 앱 배포

1. **배포 시작**
   - Apps Script에서 `배포` > `새 배포` 클릭

2. **배포 설정**
   ```
   유형: 웹 앱
   설명: Dunlopillo Survey Data Collector v1.0
   실행 계정: 나
   액세스 권한: 모든 사용자
   ```

3. **권한 승인**
   - `배포` 버튼 클릭
   - Google 계정 로그인 및 권한 승인

4. **웹 앱 URL 복사**
   ```
   예시: https://script.google.com/macros/s/AKfycbx.../exec
   ```

### 4단계: 프론트엔드 연동

1. **API 엔드포인트 설정**
   ```javascript
   // survey-data-manager.js에서 수정
   this._apiEndpoint = 'YOUR_WEB_APP_URL_HERE';
   ```

2. **또는 런타임에 설정**
   ```javascript
   // 브라우저 콘솔에서 실행
   window.surveyDataManager.setApiEndpoint('YOUR_WEB_APP_URL_HERE');
   ```

## 🧪 테스트 방법

### 1. 시스템 상태 확인
```javascript
// 브라우저 콘솔에서 실행
console.table(window.surveyDataManager.getSystemStatus());
```

### 2. 설문 응답 테스트
```javascript
// 성별 설정
window.surveyDataManager.saveSurveyResponse('gender', '남성');

// 경험 설정  
window.surveyDataManager.saveSurveyResponse('experience', '처음');

// 연령대 설정
window.surveyDataManager.saveSurveyResponse('age', '30대');
```

### 3. 별점 테스트
```javascript
// Page5 체험 만족도
window.surveyDataManager.saveRating('page5', 5);

// Page8 제품 만족도
window.surveyDataManager.saveRating('page8', 4);

// Page12 구매 의향
window.surveyDataManager.saveRating('page12', 3);

// Page18 추천 의향
window.surveyDataManager.saveRating('page18', 5);
```

### 4. 수집된 데이터 확인
```javascript
// 현재 데이터 조회
console.log(window.surveyDataManager.getCurrentData());

// 레거시 호환성 테스트
console.log(window.surveyData.responses);
```

## 📋 데이터 수집 항목

### 설문조사 데이터
- **성별**: 남성, 여성
- **매트리스 경험**: 처음, 경험있음
- **연령대**: 20대, 30대, 40대, 50대, 60대 이상

### 별점 평가 (1-5점)
- **Page5**: 체험 만족도
- **Page8**: 제품 만족도  
- **Page12**: 구매 의향
- **Page18**: 추천 의향

### 시스템 정보
- **테블릿ID**: 자동 생성
- **사용자ID**: 세션별 고유 ID
- **IP주소**: 네트워크 정보
- **브라우저**: 사용자 환경
- **세션 시간**: 시작/종료 시간

## 🔒 보안 및 개인정보

### 데이터 보호
- 개인 식별 정보 수집 안 함
- 익명화된 사용자 ID 사용
- 세션 기반 임시 데이터

### 권한 관리
- Google Apps Script 웹 앱 권한 최소화
- CORS 정책 적용
- 데이터 검증 및 필터링

## 🛠️ 문제 해결

### 일반적인 오류

1. **403 권한 오류**
   ```
   해결: Apps Script 배포 시 "모든 사용자" 권한 설정 확인
   ```

2. **CORS 오류**
   ```
   해결: google-apps-script.js의 CORS 헤더 설정 확인
   ```

3. **데이터 저장 안됨**
   ```
   해결: Google Sheets 헤더 컬럼명 정확성 확인
   ```

### 디버깅 방법

1. **Apps Script 로그 확인**
   - Apps Script > `실행` > `실행 기록` 확인

2. **브라우저 콘솔 확인**
   ```javascript
   // 시스템 상태 확인
   window.surveyDataManager.getSystemStatus();
   ```

3. **네트워크 탭 확인**
   - 브라우저 개발자 도구 > Network 탭에서 POST 요청 확인

## 📞 지원

문제가 발생하면 다음 정보와 함께 문의해주세요:

1. 오류 메시지
2. 브라우저 콘솔 로그
3. 사용 중인 브라우저 및 버전
4. Apps Script 실행 기록

---

*던롭필로 모션베드 SPA v3.0.0 - Google Sheets Integration*
