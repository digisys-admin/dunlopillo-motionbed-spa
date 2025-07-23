# 🎬 홈 화면 동영상 설정 가이드

## 📋 개요
홈 화면에 동영상 배경을 설정하여 더 매력적인 대기 화면을 구현합니다.

## 🔧 설정 방법

### 1. Google Drive 동영상 설정 (추천)

#### A. 동영상 업로드
1. Google Drive에 3개 이상의 동영상 파일 업로드
2. 파일명 예시: `home-video-1.mp4`, `home-video-2.mp4`, `home-video-3.mp4`

#### B. 공유 설정
1. 각 동영상 파일 우클릭 → "공유"
2. "링크가 있는 모든 사용자" 권한 설정
3. 공유 링크 복사

#### C. 파일 ID 추출
공유 링크 형식: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- FILE_ID 부분만 복사

#### D. screens.js 파일 수정
```javascript
const GOOGLE_DRIVE_VIDEOS = {
  HOME_VIDEO_1: 'https://drive.google.com/file/d/실제동영상ID1/preview',
  HOME_VIDEO_2: 'https://drive.google.com/file/d/실제동영상ID2/preview',
  HOME_VIDEO_3: 'https://drive.google.com/file/d/실제동영상ID3/preview',
  HOME_VIDEO_FALLBACK: 'assets/videos/home-background.mp4'
};
```

### 2. 로컬 동영상 설정 (백업용)

#### A. 동영상 파일 저장
```
assets/videos/
├── home-video-1.mp4
├── home-video-2.mp4
├── home-video-3.mp4
└── home-background.mp4 (폴백용)
```

#### B. screens.js에서 Google Drive 비활성화
```javascript
const USE_GOOGLE_DRIVE = false; // Google Drive 비활성화
```

## 🎯 동영상 최적화 권장사항

### 파일 크기 & 품질
- **해상도**: 1920x1080 (Full HD) 권장
- **프레임레이트**: 30fps
- **비트레이트**: 2-5 Mbps
- **포맷**: MP4 (H.264 코덱)
- **파일 크기**: 10MB 이하 권장

### 최적화 도구
```bash
# FFmpeg를 사용한 최적화 예시
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vb 3000k -ab 128k -s 1920x1080 -r 30 output.mp4
```

## 🔄 동영상 순환 재생 로직

### 자동 순환
1. 첫 번째 동영상 재생
2. 종료 시 자동으로 다음 동영상 전환
3. 마지막 동영상 후 첫 번째로 돌아가서 무한 반복

### 에러 처리
- 동영상 로드 실패 시 자동으로 배경 이미지로 폴백
- 네트워크 오류 시 로컬 동영상으로 전환
- 브라우저 호환성 문제 시 정적 이미지 표시

## 🎮 사용자 상호작용

### 자동 재생 정책
- **음소거 상태로 자동 재생** (브라우저 정책 준수)
- 사용자 클릭 시 음성 활성화 가능
- 모바일에서 데이터 절약을 위한 최적화

### 터치 인터랙션
- 화면 터치 시 체험 시작
- 동영상은 백그라운드에서 계속 재생
- 부드러운 전환 효과

## 🔧 커스터마이징

### 동영상 개수 변경
```javascript
// 2개 동영상만 사용하는 경우
const videoSources = [
  window.VIDEO.HOME_VIDEO_1,
  window.VIDEO.HOME_VIDEO_2
].filter(url => url && !url.includes('xxxxxxxxxxxxxxxxxxxxxxxxxxx'));
```

### 전환 효과 변경
```css
.home-background-video.transitioning {
  opacity: 0;
  transition: opacity 0.5s ease-in-out; /* 전환 시간 조정 */
}
```

### 오버레이 효과 조정
```css
.video-overlay {
  background: rgba(0, 0, 0, 0.2); /* 어둡게 하려면 값 증가 */
}
```

## 📱 모바일 최적화

### 성능 고려사항
- 모바일에서는 해상도 자동 조정
- 데이터 사용량 최적화
- 배터리 소모 최소화

### 반응형 설정
```css
@media (max-width: 768px) {
  .home-background-video {
    max-width: 100vw;
    max-height: 100vh;
  }
}
```

## 🚨 문제 해결

### 동영상이 재생되지 않는 경우
1. Google Drive 공유 권한 확인
2. 파일 ID 정확성 검증
3. 브라우저 콘솔에서 에러 메시지 확인
4. 네트워크 연결 상태 점검

### 성능 이슈
1. 동영상 파일 크기 최적화
2. 프리로딩 비활성화
3. 저사양 디바이스 감지 후 폴백

### 브라우저 호환성
- Chrome, Safari, Firefox, Edge 지원
- iOS Safari 자동재생 제한 대응
- 구형 브라우저 폴백 처리

## 📊 성능 모니터링

### 로드 시간 체크
```javascript
// 콘솔에서 동영상 상태 확인
app.getImageOptimizationStats()
```

### 메모리 사용량
- 동영상 캐시 관리
- 메모리 누수 방지
- 백그라운드 정리

## 🎉 완료 후 확인사항

✅ 홈 화면에서 동영상 자동 재생  
✅ 여러 동영상 순환 재생  
✅ 터치 시 정상적으로 다음 페이지 이동  
✅ 모바일/데스크톱 양쪽에서 정상 작동  
✅ 네트워크 오류 시 폴백 이미지 표시  

---

## 📞 지원

문제가 발생하거나 추가 최적화가 필요한 경우, 콘솔 로그를 확인하거나 브라우저 개발자 도구를 통해 디버깅하세요.
