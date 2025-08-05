# Dunlopillo MotionBed SPA

> 던롭필로 모션베드 및 라텍스 매트리스 체험을 위한 인터랙티브 19페이지 SPA 애플리케이션

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://placeholder.netlify.app)

## 🎯 프로젝트 개요

**목적**: 모션베드와 라텍스 매트리스의 기능을 체험할## 📊 파일 크기 정보

```bash
# 전체 프로젝트 크기
du -sh .                    # 약 25MB (미디어 포함)

# 코드만 (미디어 제외)
du -sh --exclude=assets .   # 약 2MB

# 미디어 파일들
du -sh assets/voices/       # 약 2.7MB (11개 MP3)
du -sh assets/pics/         # 약 20MB (PNG 이미지들)
```

## 🔄 버전 관리 전략

### Git 설정
- **미디어 파일 제외**: `.gitignore`로 용량 최적화
- **코드만 추적**: HTML, CSS, JS 파일만 버전 관리
- **CDN 활용**: 대용량 파일은 Cloudinary 호스팅

### 백업 및 복원
```bash
# 코드 백업
git add . && git commit -m "백업: $(date)"
git push origin main

# 미디어 파일 별도 백업 (권장)
tar -czf assets_backup_$(date +%Y%m%d).tar.gz assets/

# 복원
tar -xzf assets_backup_20250723.tar.gz
```

## 🔒 보안 및 운영

### 환경 변수 (필요시)
```bash
# .env 파일 (Git 제외됨)
CLOUDINARY_CLOUD_NAME=di2pd92t1
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

### 운영 체크리스트
- [ ] 모든 페이지 정상 동작 확인
- [ ] 음성 파일 재생 테스트
- [ ] 자동 진행 기능 확인
- [ ] 다양한 브라우저에서 테스트
- [ ] 모바일 터치 이벤트 확인
- [ ] 키오스크 해상도(1280x800) 최적화

## 📞 지원 및 문의

### 개발 관련
- **GitHub Issues**: 버그 리포트 및 기능 요청
- **개발자**: DigiSys Admin
- **이메일**: sh_sohn@digisys.co.kr

### 배포 관련
- **Netlify 대시보드**: 배포 상태 모니터링
- **Cloudinary 콘솔**: 미디어 파일 관리
- **GitHub Actions**: CI/CD 파이프라인 (필요시)

## 🚀 다음 단계

### 개선 계획
- [ ] PWA 지원 (오프라인 사용)
- [ ] 다국어 지원 (영어, 중국어)
- [ ] 사용자 분석 도구 연동
- [ ] 더 많은 음성 가이드 추가
- [ ] 키오스크 모드 최적화

### 기술 부채
- [ ] TypeScript 마이그레이션
- [ ] 모듈화 개선
- [ ] 테스트 코드 작성
- [ ] 성능 모니터링 도구 추가

---

**📅 마지막 업데이트**: 2025년 7월 23일  
**🏷️ 현재 버전**: v1.0.0  
**👨‍💻 개발자**: DigiSys Admin  
**🌐 라이브 데모**: [Netlify에서 확인](https://placeholder.netlify.app)

---

### ⭐ 프로젝트가 도움이 되셨다면 GitHub에서 Star를 눌러주세요!플리케이션  
**페이지 수**: 19개 페이지 (홈 + 설문 + 체험)  
**타겟 해상도**: 1280x800 (키오스크 최적화)

## 🚀 주요 기능

### 🎵 오디오 시스템
- **배경 음악**: Cloudinary CDN 동영상에서 오디오 추출, 자동 순환 재생
- **AI 음성 가이드**: 페이지별 MP3 음성 안내 (11개 페이지 지원)
- **스마트 볼륨 제어**: 음성 재생 시 배경음 자동 감소

### ⏰ 자동 진행 시스템
- **음성 안내 페이지**: 음성 종료 + 5초 후 자동 전환
- **일반 페이지**: 7초 후 자동 전환
- **시각적 피드백**: 다음 버튼에 실시간 프로그레스바

### 📱 인터랙션
- **터치/클릭 지원**: 모바일 및 데스크톱 호환
- **사용자 상호작용 감지**: 브라우저 정책 준수
- **반응형 디자인**: 다양한 화면 크기 지원

## �️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **오디오/비디오**: Cloudinary CDN
- **폰트**: Pretendard (한글 최적화)
- **개발 도구**: VS Code Live Server
- **배포**: Netlify

## �📁 프로젝트 구조

```
dunlopillo-motionbed-spa/
├── index.html              # 메인 HTML 파일 + 오디오 시스템
├── styles.css              # 전체 스타일시트
├── script.js               # 메인 애플리케이션 로직
├── screens.js              # 페이지 정의 및 렌더링
├── survey-data.js          # 설문 데이터 및 로직
├── assets/                 # 미디어 파일들 (로컬 개발용)
│   ├── voices/             # 음성 가이드 MP3 파일들
│   └── pics/               # 이미지 파일들 (PNG)
├── .gitignore              # Git 제외 파일 설정
├── netlify.toml            # Netlify 배포 설정
├── package.json            # 프로젝트 메타데이터
└── README.md               # 이 파일
```

## � 빠른 시작

### 1. 로컬 개발 환경

```bash
# 저장소 클론
git clone https://github.com/digisys-admin/dunlopillo-motionbed-spa.git
cd dunlopillo-motionbed-spa

# VS Code로 열기
code .

# Live Server 실행
# index.html 우클릭 → "Open with Live Server"
```

### 2. 미디어 파일 복원 (선택사항)

```bash
# 음성 파일들 (Git에서 제외됨)
mkdir -p assets/voices
# MP3 파일들을 assets/voices/에 복사

# 이미지 파일들 (Git에서 제외됨)  
mkdir -p assets/pics
# PNG 파일들을 assets/pics/에 복사
```

### 3. 브라우저에서 확인

- **로컬**: `http://localhost:5500`
- **키오스크 해상도**: 1280x800 권장
## 🌐 배포 및 호스팅

### Netlify 배포 (추천)
```bash
# netlify.toml 설정 완료
# GitHub 연동 시 자동 배포
```

### 기타 정적 호스팅
- **Vercel**: Zero-config 배포
- **GitHub Pages**: 공개 저장소 무료
- **AWS S3**: 커스텀 도메인 지원

## 🔧 핵심 설정 파일들

### 🎙️ 음성 가이드 매핑 (index.html)
```javascript
const VOICE_SCRIPTS = {
  'page3': 'assets/voices/voice_page3.mp3',   // 모션베드 소개
  'page4': 'assets/voices/voice_page4.mp3',   // 기능 설명
  'page5': 'assets/voices/voice_page5.mp3',   // 체험 방법
  'page7': 'assets/voices/voice_page7.mp3',   // 라텍스 매트리스
  'page8': 'assets/voices/voice_page8.mp3',   // 알레르기 방지
  'page10': 'assets/voices/voice_page10.mp3', // 온도 조절
  'page11': 'assets/voices/voice_page11.mp3', // 자세 조절
  'page12': 'assets/voices/voice_page12.mp3', // 마사지 기능
  'page13': 'assets/voices/voice_page13.mp3', // 수면 개선
  'page15': 'assets/voices/voice_page15.mp3', // 건강 효과
  'page17': 'assets/voices/voice_page17.mp3'  // 완료 메시지
};
```

### � 배경 음악 소스 (index.html)
```javascript
const BACKGROUND_AUDIO_SOURCES = [
  'https://res.cloudinary.com/di2pd92t1/video/upload/v1748237173/Dunlopillo-Crash-Test-Flexibilitet-web_n045ph.mp4',
  'https://res.cloudinary.com/di2pd92t1/video/upload/v1748237657/Dunlopillo-Crash-Test-Stabilitet-web_mvxr27.mp4',
  'https://res.cloudinary.com/di2pd92t1/video/upload/v1748241410/Dunlopillo-Crash-Test-Allergivenlig-A%CC%8Andba%CC%8Ar-web_wxolsb.mp4'
];
```

### ⏰ 자동 진행 설정 (index.html)
```javascript
const AUTO_PROGRESS_CONFIG = {
  // 음성 안내 있는 페이지들 (음성 종료 후 5초)
  'page3': { hasVoice: true, delay: 5 },
  'page4': { hasVoice: true, delay: 5 },
  // ... 더 많은 설정
  
  // 음성 안내 없는 페이지들 (7초 후 자동 진행)
  'page6': { hasVoice: false, delay: 7 },
  'page9': { hasVoice: false, delay: 7 },
  // ... 더 많은 설정
};
```

## �️ 개발 가이드

### 새 페이지 추가하기

1. **screens.js에 페이지 정의**
   ```javascript
   const screens = {
     // ... 기존 페이지들
     'page21': {
       title: '새 페이지',
       content: `<div class="new-page">...</div>`
     }
   };
   ```

2. **자동 진행 설정**
   ```javascript
   // index.html의 AUTO_PROGRESS_CONFIG에 추가
   'page21': { hasVoice: false, delay: 7 }
   ```

3. **음성 가이드 추가 (선택사항)**
   ```javascript
   // VOICE_SCRIPTS에 추가
   'page21': 'assets/voices/voice_page21.mp3'
   ```

### 음성 파일 추가하기

1. **MP3 파일 준비**
   - 고품질 MP3 (128kbps 이상)
   - 명확한 한국어 발음
   - 10-30초 권장 길이

2. **파일 배치**
   ```bash
   # 로컬 개발
   cp new_voice.mp3 assets/voices/voice_page21.mp3
   
   # 또는 Cloudinary 업로드 후 URL 사용
   ```

3. **코드 업데이트**
   ```javascript
   // VOICE_SCRIPTS 객체에 추가
   'page21': 'assets/voices/voice_page21.mp3'
   ```

## 🔍 디버깅 및 테스트

### 콘솔 명령어

```javascript
// 현재 시스템 상태 확인
console.log('🎵 배경음악:', window.backgroundMusicSystem);
console.log('🎙️ 음성가이드:', window.voiceGuideSystem);
console.log('⏰ 자동진행:', window.AUTO_PROGRESS_CONFIG);

// 음성 테스트
window.testPage3Voice();

// 배경음악 토글
window.backgroundMusicSystem.toggle();

// 자동 진행 시작/정지
window.startAutoProgress('page3');
window.clearAutoProgress();
```

### 문제 해결

**음성이 재생되지 않을 때:**
- 브라우저 자동재생 정책 확인
- 사용자 상호작용 후 재생 시도
- 파일 경로 및 형식 확인

**자동 진행이 작동하지 않을 때:**
- AUTO_PROGRESS_CONFIG 설정 확인
- 다음 버튼 셀렉터 확인
- 콘솔 오류 메시지 확인

## 📱 브라우저 호환성

| 브라우저 | 버전 | 지원 상태 | 특이사항 |
|---------|------|----------|----------|
| Chrome | 90+ | ✅ 완전 지원 | 권장 브라우저 |
| Firefox | 88+ | ✅ 완전 지원 | 안정적 동작 |
| Safari | 14+ | ⚠️ 제한적 | 자동재생 제한 |
| Edge | 90+ | ✅ 완전 지원 | Chrome과 동일 |
| Mobile Safari | iOS 14+ | ⚠️ 제한적 | 터치 후 재생 |
| Chrome Mobile | Android 90+ | ✅ 완전 지원 | 터치 지원 |

## ⚡ 성능 최적화

### 로딩 속도
- **폰트 프리로드**: Pretendard CDN 최적화
- **이미지 압축**: PNG → WebP 전환 권장
- **오디오 프리로드**: 중요 파일만 선택적 로딩

### 메모리 관리
- **오디오 객체 재사용**: 메모리 누수 방지
- **타이머 정리**: 페이지 전환 시 자동 해제
- **이벤트 리스너 관리**: 중복 등록 방지

## � 파일 크기 정보

```bash
# 전체 프로젝트 크기
du -sh .                    # 약 25MB (미디어 포함)

# 코드만 (미디어 제외)
du -sh --exclude=assets .   # 약 2MB

# 미디어 파일들
du -sh assets/voices/       # 약 2.7MB (11개 MP3)
du -sh assets/pics/         # 약 20MB (PNG 이미지들)
```

## 🆘 문제 해결

### 음성이 재생되지 않을 때
1. 브라우저 자동재생 정책 확인
2. HTTPS 환경에서 테스트
3. 사용자 상호작용 후 재생 시도

### 배경 음악이 재생되지 않을 때
1. Cloudinary URL 접근 확인
2. 네트워크 연결 상태 확인
3. 브라우저 콘솔 오류 메시지 확인

## 📞 지원

문제가 발생하면 GitHub Issues에 등록해주세요.
# Trigger new Netlify build #오후
