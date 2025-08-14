# 디바이스 ID 설정 가이드

## 🔍 디바이스 ID란?

디바이스 ID는 각 테블릿 기기를 구분하기 위한 고유 식별자입니다. 이 ID는 데이터 수집 및 분석 시 중요하게 사용됩니다.

## 🚀 새로운 URL 경로 기반 설정 방법 (권장)

이제 URL 경로를 사용하여 매우 간단하게 디바이스 ID를 설정할 수 있습니다.

### 방법 1: URL 경로로 직접 접속

```
https://dunlopillo-spa-v2.netlify.app/TABLET_01
```

위와 같이 URL 끝에 원하는 디바이스 ID를 추가하면 됩니다.

- 예시:
  - `https://dunlopillo-spa-v2.netlify.app/TABLET_01`
  - `https://dunlopillo-spa-v2.netlify.app/TABLET_GANGNAM_01` 
  - `https://dunlopillo-spa-v2.netlify.app/TABLET_JAMSIL_02`

### 특징:
- **브라우저 호환성**: 모든 브라우저에서 동작 (Fully Kiosk 브라우저 포함)
- **설정 편의성**: 별도의 설정 페이지 필요 없음
- **고정 URL**: Fully Kiosk 브라우저에서 홈 URL로 설정 가능
- **자동 저장**: 디바이스 ID가 자동으로 localStorage에 저장됨

## 🔗 URL 파라미터 방식 (기존 방법)

기존 방식인 URL 파라미터를 사용한 설정도 계속 지원합니다.

### 방법 2: URL 파라미터로 설정

```
https://dunlopillo-spa-v2.netlify.app/device-id-setter.html?presetId=TABLET_01
```

- 지원하는 파라미터:
  - `presetId=TABLET_01` (권장)
  - `tablet=TABLET_01` 
  - `t=TABLET_01`

## 📋 설정 확인하기

설정한 디바이스 ID가 제대로 적용되었는지 확인하는 방법:

1. 브라우저 콘솔을 열고 (F12 또는 개발자 도구) 다음 명령어를 실행:
   ```javascript
   console.log(localStorage.getItem('dunlopillo_device_id'));
   ```

2. 또는 앱 초기화 시 콘솔에 출력되는 로그를 확인:
   ```
   🏷️ 테블릿 ID: TABLET_01
   ```

## ⚠️ 주의사항

- 디바이스 ID는 영문자, 숫자, 언더스코어(_)만 사용하는 것을 권장합니다.
- 디바이스 ID는 대소문자를 구분하지 않으며, 내부적으로 대문자로 변환됩니다.
- 매장별로 고유한 ID 체계를 사용하는 것을 권장합니다 (예: TABLET_STORE_001).
