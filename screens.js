// Dunlopillo SPA 화면 데이터
// 이미지 경로 설정 (Google Drive 또는 로컬)

// === 이미지 URL 설정 ===
// Google Drive 사용 시: true, 로컬 파일 사용 시: false
const USE_GOOGLE_DRIVE = false; // Google Drive 이미지 사용

/**
 * 🎬 간단한 동영상 설정 (참고 코드 방식)
 */
const VIDEO_SOURCES = [
  "https://res.cloudinary.com/di2pd92t1/video/upload/v1753767432/%E1%84%83%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A9%E1%86%B8_video_01_tt5wqe.mp4",
  "https://res.cloudinary.com/di2pd92t1/video/upload/v1753767434/%E1%84%83%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A9%E1%86%B8_video_02_n8rnf8.mp4", 
  "https://res.cloudinary.com/di2pd92t1/video/upload/v1753767442/%E1%84%83%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A9%E1%86%B8_video_03_x67vjb.mp4"
];

// 동영상 사용 여부
const USE_VIDEO_BACKGROUND = true;

// 전역 변수로 확실히 설정
window.VIDEO_SOURCES = VIDEO_SOURCES;
window.USE_VIDEO_BACKGROUND = USE_VIDEO_BACKGROUND;

console.log('🎬 screens.js에서 동영상 설정 완료:', { VIDEO_SOURCES, USE_VIDEO_BACKGROUND });

// Google Drive 이미지 URL들 - 다단계 최적화 방식
// 1. 썸네일 (즉시 로드) -> 2. 고해상도 (백그라운드 로드) -> 3. 폴백 (로컬)
const GOOGLE_DRIVE_IMAGES = {
  // 빠른 썸네일 버전 (즉시 표시용)
  LOGO: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1g4EoqdHRNNxIzhieRPfK-9rDeaRnZLRe&sz=w400',
    fullsize: 'https://drive.google.com/uc?export=view&id=1g4EoqdHRNNxIzhieRPfK-9rDeaRnZLRe',
    direct: 'https://lh3.googleusercontent.com/d/1g4EoqdHRNNxIzhieRPfK-9rDeaRnZLRe=w400'
  },
  LOGO_WHITE: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1NtvxKourjgLdHZzzKtB7T--U1yCSnPmc&sz=w400',
    fullsize: 'https://drive.google.com/uc?export=view&id=1NtvxKourjgLdHZzzKtB7T--U1yCSnPmc',
    direct: 'https://lh3.googleusercontent.com/d/1NtvxKourjgLdHZzzKtB7T--U1yCSnPmc=w400'
  },
  PAGE2_GROUP: {
    thumbnail: 'https://drive.google.com/thumbnail?id=12PD6K9R2YjSNTdsUXbisyL8KAiEewAxy&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=12PD6K9R2YjSNTdsUXbisyL8KAiEewAxy',
    direct: 'https://lh3.googleusercontent.com/d/12PD6K9R2YjSNTdsUXbisyL8KAiEewAxy=w1200'
  },
  PAGE2_BED: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1FECc1OzpHcOLQJeBHwoFO5ysYhDB8IgI&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1FECc1OzpHcOLQJeBHwoFO5ysYhDB8IgI',
    direct: 'https://lh3.googleusercontent.com/d/1FECc1OzpHcOLQJeBHwoFO5ysYhDB8IgI=w1200'
  },
  P3_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1avMYOWVyOf_3S6g6VTGovifpadddz-M3&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1avMYOWVyOf_3S6g6VTGovifpadddz-M3',
    direct: 'https://lh3.googleusercontent.com/d/1avMYOWVyOf_3S6g6VTGovifpadddz-M3=w1200'
  },
  P4_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1EEBx9lTfrLgNoQD3y04xD5GkSYut3gbQ&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1EEBx9lTfrLgNoQD3y04xD5GkSYut3gbQ',
    direct: 'https://lh3.googleusercontent.com/d/1EEBx9lTfrLgNoQD3y04xD5GkSYut3gbQ=w1200'
  },
  P4_REMOTE1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1UOMhibeK1LHXmL9FmeRmLuzmgRQp2K_n&sz=w600',
    fullsize: 'https://drive.google.com/uc?export=view&id=1UOMhibeK1LHXmL9FmeRmLuzmgRQp2K_n',
    direct: 'https://lh3.googleusercontent.com/d/1UOMhibeK1LHXmL9FmeRmLuzmgRQp2K_n=w800'
  },
  P6_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1qOSuD-mzfM22NfHN3ZGU7_eSemwiKqSQ&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1qOSuD-mzfM22NfHN3ZGU7_eSemwiKqSQ',
    direct: 'https://lh3.googleusercontent.com/d/1qOSuD-mzfM22NfHN3ZGU7_eSemwiKqSQ=w1200'
  },
  P6_REMOTE: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1pzvLZgpECHG4YgBwMZkCkHfiMO5womV3&sz=w600',
    fullsize: 'https://drive.google.com/uc?export=view&id=1pzvLZgpECHG4YgBwMZkCkHfiMO5womV3',
    direct: 'https://lh3.googleusercontent.com/d/1pzvLZgpECHG4YgBwMZkCkHfiMO5womV3=w800'
  },
  P7_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1VckZDeip98WDzxqkqg-jaDsTANWYZb-Q&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1VckZDeip98WDzxqkqg-jaDsTANWYZb-Q',
    direct: 'https://lh3.googleusercontent.com/d/1VckZDeip98WDzxqkqg-jaDsTANWYZb-Q=w1200'
  },
  P7_REMOTE: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1Qeb5PLqN-Pp-3njRso4GaUz1Vb6_oCt_&sz=w600',
    fullsize: 'https://drive.google.com/uc?export=view&id=1Qeb5PLqN-Pp-3njRso4GaUz1Vb6_oCt_',
    direct: 'https://lh3.googleusercontent.com/d/1Qeb5PLqN-Pp-3njRso4GaUz1Vb6_oCt_=w800'
  },
  P9_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1OD-lWC_pmtp6-hOneYS_wgWI4_3InbFS&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1OD-lWC_pmtp6-hOneYS_wgWI4_3InbFS',
    direct: 'https://lh3.googleusercontent.com/d/1OD-lWC_pmtp6-hOneYS_wgWI4_3InbFS=w1200'
  },
  P10_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=18M2iXagHWi3fal8yJY-l_uZfCrTt4xcF&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=18M2iXagHWi3fal8yJY-l_uZfCrTt4xcF',
    direct: 'https://lh3.googleusercontent.com/d/18M2iXagHWi3fal8yJY-l_uZfCrTt4xcF=w1200'
  },
  P11_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1Cq9TmqujjsqGXVShfhRxb9vD3Ig9eOUM&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1Cq9TmqujjsqGXVShfhRxb9vD3Ig9eOUM',
    direct: 'https://lh3.googleusercontent.com/d/1Cq9TmqujjsqGXVShfhRxb9vD3Ig9eOUM=w1200'
  },
  P11_REMOTE: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1qHlOcJrd0uzukrYhqLcM9d5nbZ6n9z-x&sz=w600',
    fullsize: 'https://drive.google.com/uc?export=view&id=1qHlOcJrd0uzukrYhqLcM9d5nbZ6n9z-x',
    direct: 'https://lh3.googleusercontent.com/d/1qHlOcJrd0uzukrYhqLcM9d5nbZ6n9z-x=w800'
  },
  P13_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1ZCslNr--dCQq-SbPz-4qGxTat-ML6CM5&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1ZCslNr--dCQq-SbPz-4qGxTat-ML6CM5',
    direct: 'https://lh3.googleusercontent.com/d/1ZCslNr--dCQq-SbPz-4qGxTat-ML6CM5=w1200'
  },
  P13_REMOTE: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1azrHPEcSYOXsIRds6p61yRJ0OrrHP2Wz&sz=w600',
    fullsize: 'https://drive.google.com/uc?export=view&id=1azrHPEcSYOXsIRds6p61yRJ0OrrHP2Wz',
    direct: 'https://lh3.googleusercontent.com/d/1azrHPEcSYOXsIRds6p61yRJ0OrrHP2Wz=w800'
  },
  P14_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=12PCgon5WamrkQb51AC3dTm7haPQL242Y&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=12PCgon5WamrkQb51AC3dTm7haPQL242Y',
    direct: 'https://lh3.googleusercontent.com/d/12PCgon5WamrkQb51AC3dTm7haPQL242Y=w1200'
  },
  P15_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1iPU7dcKmbRGkQZbrJjGtkv-diQQeL15f&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1iPU7dcKmbRGkQZbrJjGtkv-diQQeL15f',
    direct: 'https://lh3.googleusercontent.com/d/1iPU7dcKmbRGkQZbrJjGtkv-diQQeL15f=w1200'
  },
  P15_REMOTE: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1azxT1ULRJeU-6-HVg76UWOvge46GnRre&sz=w600',
    fullsize: 'https://drive.google.com/uc?export=view&id=1azxT1ULRJeU-6-HVg76UWOvge46GnRre',
    direct: 'https://lh3.googleusercontent.com/d/1azxT1ULRJeU-6-HVg76UWOvge46GnRre=w800'
  },
  P16_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1H1siigzXCv5aBG4RSDKqRJdUPQ0GmR2i&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=1H1siigzXCv5aBG4RSDKqRJdUPQ0GmR2i',
    direct: 'https://lh3.googleusercontent.com/d/1H1siigzXCv5aBG4RSDKqRJdUPQ0GmR2i=w1200'
  },
  P16_HAND1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1xKhWBQjlxzjBui_f4sSCLPYiWATeCz23&sz=w400',
    fullsize: 'https://drive.google.com/uc?export=view&id=1xKhWBQjlxzjBui_f4sSCLPYiWATeCz23',
    direct: 'https://lh3.googleusercontent.com/d/1xKhWBQjlxzjBui_f4sSCLPYiWATeCz23=w600'
  },
  P16_HAND2: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1TKJxBOEL2Uae44pxeVlly-d16oxDEPDp&sz=w400',
    fullsize: 'https://drive.google.com/uc?export=view&id=1TKJxBOEL2Uae44pxeVlly-d16oxDEPDp',
    direct: 'https://lh3.googleusercontent.com/d/1TKJxBOEL2Uae44pxeVlly-d16oxDEPDp=w600'
  },
  P17_REMOTE: {
    thumbnail: 'https://drive.google.com/thumbnail?id=1KGg5ln4hV4Z5tyhNewEYRjXnS_OmvtYW&sz=w600',
    fullsize: 'https://drive.google.com/uc?export=view&id=1KGg5ln4hV4Z5tyhNewEYRjXnS_OmvtYW',
    direct: 'https://lh3.googleusercontent.com/d/1KGg5ln4hV4Z5tyhNewEYRjXnS_OmvtYW=w800'
  },
  P19_PIC1: {
    thumbnail: 'https://drive.google.com/thumbnail?id=19_SMMMczi8brngt34ujxngTVWvtHBttf&sz=w800',
    fullsize: 'https://drive.google.com/uc?export=view&id=19_SMMMczi8brngt34ujxngTVWvtHBttf',
    direct: 'https://lh3.googleusercontent.com/d/19_SMMMczi8brngt34ujxngTVWvtHBttf=w1200'
  }
};

// Google Drive 동영상 URL들 (홈 화면용)
const GOOGLE_DRIVE_VIDEOS = {
  // Google Drive 동영상 직접 스트리밍 URL (여러 방법 시도)
  // 방법 1: googleusercontent.com 직접 접근
  HOME_VIDEO_1: 'https://drive.usercontent.google.com/download?id=177XbPRIkBLIOU27yt5aCcFC0XPHw2w10&export=download&authuser=0', 
  HOME_VIDEO_2: 'https://drive.usercontent.google.com/download?id=18orr8IGlPpZwUgydBQGZELWSPIttpj99&export=download&authuser=0', 
  HOME_VIDEO_3: 'https://drive.usercontent.google.com/download?id=1UNWDZmUrqrR0nnHUJTI7ikNlcbnOD-KT&export=download&authuser=0',
  
  // 백업 방법들
  HOME_VIDEO_1_ALT: 'https://drive.google.com/uc?id=177XbPRIkBLIOU27yt5aCcFC0XPHw2w10&export=download',
  HOME_VIDEO_2_ALT: 'https://drive.google.com/uc?id=18orr8IGlPpZwUgydBQGZELWSPIttpj99&export=download', 
  HOME_VIDEO_3_ALT: 'https://drive.google.com/uc?id=1UNWDZmUrqrR0nnHUJTI7ikNlcbnOD-KT&export=download',
  
  // 백업용 로컬 동영상 경로
  HOME_VIDEO_FALLBACK: 'assets/videos/home-background.mp4'
};

// 로컬 이미지 경로들
const LOCAL_IMAGES = {
  LOGO: 'assets/pics/dunlopillo_logo.png',
  LOGO_WHITE: 'assets/pics/dunlopillo_logo_white.png',
  HOME_ICON: 'assets/pics/home-icon.png',
  PAGE2_GROUP: 'assets/pics/p2_pic1.png',
  PAGE2_BED: 'assets/pics/p2_bed.png',
  P3_PIC1: 'assets/pics/p3_pic1.png',
  P4_PIC1: 'assets/pics/p4_pic1.png',
  P4_REMOTE1: 'assets/pics/p4_remote1.png',
  P6_PIC1: 'assets/pics/p6_pic1.png',
  P6_REMOTE: 'assets/pics/p6_remote.png',
  P7_PIC1: 'assets/pics/p7_pic1.png',
  P7_REMOTE: 'assets/pics/p7_remote.png',
  P9_PIC1: 'assets/pics/p9_pic1.png',
  P10_PIC1: 'assets/pics/p10_pic1.png',
  P11_PIC1: 'assets/pics/p11_pic1.png',
  P11_REMOTE: 'assets/pics/p11_remote.png',
  P13_PIC1: 'assets/pics/p13_pic1.png',
  P13_REMOTE: 'assets/pics/p13_remote.png',
  P14_PIC1: 'assets/pics/p14_pic1.png',
  P15_PIC1: 'assets/pics/p15_pic1.png',
  P15_REMOTE: 'assets/pics/p15_remote.png',
  P16_PIC1: 'assets/pics/p16_pic1.png',
  P16_HAND1: 'assets/pics/p16-hand1.png',
  P16_HAND2: 'assets/pics/p16-hand2.png',
  P17_REMOTE: 'assets/pics/p17_remote.png',
  P19_PIC1: 'assets/pics/p19_pic1.png'
};

// 로컬 동영상 경로들
const LOCAL_VIDEOS = {
  HOME_VIDEO_1: 'assets/videos/home-video-1.mp4',
  HOME_VIDEO_2: 'assets/videos/home-video-2.mp4', 
  HOME_VIDEO_3: 'assets/videos/home-video-3.mp4',
  HOME_VIDEO_FALLBACK: 'assets/videos/home-background.mp4'
};

// 스마트 이미지 소스 선택 (Progressive Loading + 폴백 기능)
function createSmartImageSource(googleDriveUrls, localUrl) {
  const imageSource = {
    // Google Drive URLs (백업용으로 유지)
    thumbnail: googleDriveUrls.thumbnail,
    fullsize: googleDriveUrls.fullsize, 
    direct: googleDriveUrls.direct,
    // 로컬 URL (우선 사용)
    fallback: localUrl,
    
    // Progressive Loading 전략 - 로컬 우선
    toString: function() {
      // 빠른 로딩을 위해 로컬 이미지를 우선 반환
      return this.fallback;
    },
    
    // Google Drive 고화질 이미지 URL 반환 (필요시)
    getFullsize: function() {
      return this.fullsize;
    },
    
    // 직접 접근 URL 반환 (안정성 우선)
    getDirect: function() {
      return this.direct;
    },
    
    // 모든 URL 옵션 반환 (우선순위 순)
    getAllUrls: function() {
      return [this.direct, this.thumbnail, this.fullsize, this.fallback];
    }
  };
  
  return imageSource;
}

// 현재 사용할 이미지 소스 선택 (로컬 우선, 빠른 로딩)
const IMG = {
  // 모든 이미지를 로컬 우선으로 사용 (Netlify CDN 활용)
  LOGO: LOCAL_IMAGES.LOGO,
  LOGO_WHITE: LOCAL_IMAGES.LOGO_WHITE,
  HOME_ICON: LOCAL_IMAGES.HOME_ICON,
  PAGE2_GROUP: LOCAL_IMAGES.PAGE2_GROUP,
  PAGE2_BED: LOCAL_IMAGES.PAGE2_BED,
  P3_PIC1: LOCAL_IMAGES.P3_PIC1,
  P4_PIC1: LOCAL_IMAGES.P4_PIC1,
  P4_REMOTE1: LOCAL_IMAGES.P4_REMOTE1,
  P6_PIC1: LOCAL_IMAGES.P6_PIC1,
  P6_REMOTE: LOCAL_IMAGES.P6_REMOTE,
  P7_PIC1: LOCAL_IMAGES.P7_PIC1,
  P7_REMOTE: LOCAL_IMAGES.P7_REMOTE,
  P9_PIC1: LOCAL_IMAGES.P9_PIC1,
  P10_PIC1: LOCAL_IMAGES.P10_PIC1,
  P11_PIC1: LOCAL_IMAGES.P11_PIC1,
  P11_REMOTE: LOCAL_IMAGES.P11_REMOTE,
  P13_PIC1: LOCAL_IMAGES.P13_PIC1,
  P13_REMOTE: LOCAL_IMAGES.P13_REMOTE,
  P14_PIC1: LOCAL_IMAGES.P14_PIC1,
  P15_PIC1: LOCAL_IMAGES.P15_PIC1,
  P15_REMOTE: LOCAL_IMAGES.P15_REMOTE,
  P16_PIC1: LOCAL_IMAGES.P16_PIC1,
  P16_HAND1: LOCAL_IMAGES.P16_HAND1,
  P16_HAND2: LOCAL_IMAGES.P16_HAND2,
  P17_REMOTE: LOCAL_IMAGES.P17_REMOTE,
  P19_PIC1: LOCAL_IMAGES.P19_PIC1
};

// 현재 사용할 동영상 소스 선택
const VIDEO = USE_GOOGLE_DRIVE ? GOOGLE_DRIVE_VIDEOS : LOCAL_VIDEOS;

// 전역 변수로 노출 (디버깅용)
window.IMG = IMG;
window.VIDEO = VIDEO;
window.USE_GOOGLE_DRIVE = USE_GOOGLE_DRIVE;

// 🚀 Progressive Loading 고속 이미지 최적화 시스템 
class FastImageOptimizer {
  constructor() {
    this.cache = new Map();
    this.failedUrls = new Set();
    this.preloadQueue = new Set();
    this.loadingPromises = new Map();
    this.progressiveUpgrades = new Map(); // 썸네일 -> 고화질 업그레이드 추적
    
    this.init();
  }

  init() {
    // 임시로 프리로딩 비활성화 - 렌더링 속도 테스트
    // this.preloadCriticalThumbnails();
    
    // 백그라운드에서 고화질 이미지 로드 - 비활성화
    // setTimeout(() => this.upgradeToHighQuality(), 2000);
    
    console.log('🚀 Progressive FastImageOptimizer 초기화 완료 (프리로딩 비활성화)');
  }

  // 즉시 로드 - 빠른 썸네일 버전
  preloadCriticalThumbnails() {
    const criticalImages = [
      { name: 'LOGO', source: IMG.LOGO },
      { name: 'PAGE2_GROUP', source: IMG.PAGE2_GROUP },
      { name: 'PAGE2_BED', source: IMG.PAGE2_BED },
      { name: 'P3_PIC1', source: IMG.P3_PIC1 },
      { name: 'P4_PIC1', source: IMG.P4_PIC1 }
    ];

    console.log('🚀 Critical thumbnails preload 시작...');
    
    criticalImages.forEach(item => {
      const thumbnailUrl = item.source.thumbnail || item.source.toString();
      this.preloadSingleUrl(thumbnailUrl, 'critical', item.name);
    });
  }

  // 단일 URL 로드 (개선된 에러 처리)
  async preloadSingleUrl(url, priority = 'normal', imageName = '') {
    if (this.cache.has(url) || this.failedUrls.has(url)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      // 우선순위에 따른 로딩 전략
      if (priority === 'critical') {
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
      }
      
      img.onload = () => {
        this.cache.set(url, img);
        this.preloadQueue.delete(url);
        console.log(`✅ ${imageName} 로드 완료 (${priority}): ${url.includes('thumbnail') ? 'THUMBNAIL' : 'FULLSIZE'}`);
        resolve(img);
      };
      
      img.onerror = () => {
        this.failedUrls.add(url);
        this.preloadQueue.delete(url);
        console.warn(`❌ ${imageName} 로드 실패: ${url.includes('thumbnail') ? 'THUMBNAIL' : 'FULLSIZE'}`);
        reject(new Error(`이미지 로드 실패: ${url}`));
      };
      
      this.preloadQueue.add(url);
      img.src = url;
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  // 백그라운드에서 고화질로 업그레이드
  async upgradeToHighQuality() {
    console.log('🔄 고화질 이미지 업그레이드 시작...');
    
    const upgradeList = [
      { name: 'LOGO', source: IMG.LOGO },
      { name: 'PAGE2_GROUP', source: IMG.PAGE2_GROUP },
      { name: 'PAGE2_BED', source: IMG.PAGE2_BED },
      { name: 'P3_PIC1', source: IMG.P3_PIC1 },
      { name: 'P4_PIC1', source: IMG.P4_PIC1 }
    ];

    for (const item of upgradeList) {
      try {
        // 우선 direct URL 시도 (가장 빠름)
        const directUrl = item.source.direct;
        if (directUrl) {
          await this.preloadSingleUrl(directUrl, 'upgrade', item.name);
          this.progressiveUpgrades.set(item.name, directUrl);
          
          // DOM의 썸네일을 고화질로 교체
          this.upgradeImageInDOM(item.source.thumbnail, directUrl);
        }
      } catch (error) {
        console.warn(`Direct URL 실패, fullsize 시도: ${item.name}`);
        
        try {
          // Direct 실패 시 fullsize 시도
          const fullsizeUrl = item.source.fullsize;
          if (fullsizeUrl) {
            await this.preloadSingleUrl(fullsizeUrl, 'upgrade', item.name);
            this.progressiveUpgrades.set(item.name, fullsizeUrl);
            this.upgradeImageInDOM(item.source.thumbnail, fullsizeUrl);
          }
        } catch (fullsizeError) {
          console.warn(`고화질 업그레이드 완전 실패: ${item.name}`);
        }
      }
    }
  }

  // DOM에서 썸네일을 고화질로 교체
  upgradeImageInDOM(thumbnailUrl, highQualityUrl) {
    // img 태그들 업그레이드
    const images = document.querySelectorAll(`img[src="${thumbnailUrl}"]`);
    images.forEach(img => {
      img.src = highQualityUrl;
    });

    // 배경 이미지들 업그레이드  
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const bgImage = getComputedStyle(element).backgroundImage;
      if (bgImage.includes(thumbnailUrl)) {
        element.style.backgroundImage = bgImage.replace(thumbnailUrl, highQualityUrl);
      }
    });
  }

  // 다중 URL 전략으로 이미지 로드
  async preloadImageWithStrategy(imageSource, priority = 'normal') {
    if (typeof imageSource === 'string') {
      return this.preloadSingleUrl(imageSource, priority);
    }

    // SmartImageSource 객체인 경우 - 우선순위: direct > thumbnail > fullsize > local
    const urls = [
      imageSource.direct,
      imageSource.thumbnail, 
      imageSource.fullsize,
      imageSource.fallback
    ].filter(Boolean);
    
    for (const url of urls) {
      try {
        await this.preloadSingleUrl(url, priority);
        return url; // 첫 번째 성공한 URL 반환
      } catch (error) {
        console.warn(`URL 실패: ${url.substring(0, 30)}..., 다음 URL 시도...`);
        continue;
      }
    }
    
    throw new Error('모든 URL 로드 실패');
  }

  // 다음 페이지 이미지 프리로드 (썸네일 우선)
  preloadNextPageImages(currentPage) {
    const nextPageImages = this.getNextPageImages(currentPage);
    
    nextPageImages.forEach(imageSource => {
      // 썸네일 먼저 로드
      this.preloadImageWithStrategy(imageSource, 'next-page');
    });
  }

  // 페이지별 이미지 목록 반환
  getNextPageImages(currentPage) {
    const pageImages = {
      'home': [IMG.LOGO, IMG.PAGE2_GROUP, IMG.PAGE2_BED],
      'page1': [IMG.P3_PIC1],
      'page2': [IMG.P4_PIC1, IMG.P4_REMOTE1],
      'page3': [IMG.P6_PIC1, IMG.P6_REMOTE],
      'page4': [IMG.P7_PIC1, IMG.P7_REMOTE],
      'page5': [IMG.P9_PIC1],
      'page6': [IMG.P10_PIC1],
      'page7': [IMG.P11_PIC1, IMG.P11_REMOTE],
      'page8': [IMG.P13_PIC1, IMG.P13_REMOTE],
      'page9': [IMG.P14_PIC1],
      'page10': [IMG.P15_PIC1, IMG.P15_REMOTE],
      'page11': [IMG.P16_PIC1],
      'page12': [IMG.P17_REMOTE],
      'page13': [IMG.P19_PIC1]
    };
    
    return pageImages[currentPage] || [];
  }

  // 캐시 상태 확인
  getCacheStats() {
    return {
      cached: this.cache.size,
      failed: this.failedUrls.size,
      loading: this.preloadQueue.size,
      upgraded: this.progressiveUpgrades.size
    };
  }

  // 배경 이미지 폴백 처리 (다중 URL 전략)
  setupBackgroundImageFallback() {
    setTimeout(() => {
      const backgroundElements = document.querySelectorAll('[style*="background-image"]');
      backgroundElements.forEach(element => {
        const style = element.style.backgroundImage;
        if (style && style.includes('url(')) {
          const urlMatch = style.match(/url\(['"]?([^'"()]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            const imageUrl = urlMatch[1];
            this.checkBackgroundImageWithFallback(element, imageUrl);
          }
        }
      });
    }, 100);
  }

  // 배경 이미지 다중 URL 폴백
  async checkBackgroundImageWithFallback(element, primaryUrl) {
    // 이미 로드 성공한 경우 스킵
    if (this.cache.has(primaryUrl)) return;
    
    try {
      await this.preloadSingleUrl(primaryUrl);
    } catch (error) {
      // 1차 실패 - 다른 URL들 시도
      const fallbackUrls = this.getFallbackUrls(primaryUrl);
      
      for (const fallbackUrl of fallbackUrls) {
        try {
          await this.preloadSingleUrl(fallbackUrl);
          element.style.backgroundImage = `url(${fallbackUrl})`;
          console.log(`✅ 배경 이미지 폴백 성공: ${fallbackUrl.substring(0, 30)}...`);
          return;
        } catch (fallbackError) {
          continue;
        }
      }
      
      console.warn(`❌ 모든 배경 이미지 URL 실패: ${primaryUrl.substring(0, 30)}...`);
    }
  }

  // 폴백 URL 매핑 (다중 전략)
  getFallbackUrls(primaryUrl) {
    const fallbackMap = new Map();
    
    // 각 이미지별 폴백 URL들 설정
    Object.entries(GOOGLE_DRIVE_IMAGES).forEach(([key, urls]) => {
      const localKey = LOCAL_IMAGES[key];
      if (localKey) {
        fallbackMap.set(urls.thumbnail, [urls.direct, urls.fullsize, localKey]);
        fallbackMap.set(urls.fullsize, [urls.direct, urls.thumbnail, localKey]);
        fallbackMap.set(urls.direct, [urls.thumbnail, urls.fullsize, localKey]);
      }
    });
    
    return fallbackMap.get(primaryUrl) || [];
  }
}

// 전역 최적화 인스턴스 생성
window.fastImageOptimizer = new FastImageOptimizer();

// 이미지 로딩 테스트 함수 (폴백 기능 포함) - 최적화된 버전
function testImageLoading() {
  const testImages = [
    { name: 'LOGO', url: IMG.LOGO },
    { name: 'PAGE2_GROUP', url: IMG.PAGE2_GROUP },
    { name: 'P3_PIC1', url: IMG.P3_PIC1 },
    { name: 'P4_PIC1', url: IMG.P4_PIC1 }
  ];

  console.log('🔍 이미지 로딩 테스트 시작...');
  
  testImages.forEach(({ name, url }) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ ${name} 로딩 성공:`, url);
    };
    img.onerror = () => {
      console.error(`❌ ${name} 로딩 실패:`, url);
      
      // 🔄 폴백: Google Drive 실패 시 로컬 이미지로 자동 전환
      if (USE_GOOGLE_DRIVE && LOCAL_IMAGES[name]) {
        console.log(`🔄 ${name} 폴백 시도: 로컬 이미지로 전환`);
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          console.log(`✅ ${name} 폴백 성공:`, LOCAL_IMAGES[name]);
          // 실제 이미지 요소들을 찾아서 src를 로컬로 변경
          updateImageSources(name, LOCAL_IMAGES[name]);
        };
        fallbackImg.onerror = () => {
          console.error(`❌ ${name} 폴백도 실패:`, LOCAL_IMAGES[name]);
        };
        fallbackImg.src = LOCAL_IMAGES[name];
      }
    };
    img.src = url;
  });
}

// 이미지 소스 업데이트 함수
function updateImageSources(imageName, newSrc) {
  // 현재 페이지의 모든 이미지 요소 찾기
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // 원본 Google Drive URL이 포함된 이미지를 찾아서 로컬 URL로 교체
    if (img.src.includes('drive.google.com') && 
        (img.classList.contains(`${imageName.toLowerCase()}-img`) ||
         img.src.includes(GOOGLE_DRIVE_IMAGES[imageName]?.split('id=')[1]))) {
      img.src = newSrc;
      console.log(`🔄 ${imageName} 이미지 소스 업데이트됨:`, newSrc);
    }
  });
}

// 전역 함수로 노출
window.testImageLoading = testImageLoading;

// 디버깅 로그
console.log('🖼️ screens.js에서 이미지 설정 완료:', { 
  USE_GOOGLE_DRIVE, 
  IMG_LOGO: IMG.LOGO, 
  IMG_PAGE2_GROUP: IMG.PAGE2_GROUP,
  IMG_P3_PIC1: IMG.P3_PIC1,
  GOOGLE_DRIVE_BASE: 'https://drive.google.com/uc?export=view&id='
});

console.log('🧪 이미지 로딩 테스트 실행 중...');
setTimeout(testImageLoading, 1000);

// 공통 요소 템플릿 (스마트 이미지 폴백 포함)
const COMMON_ELEMENTS = {
  logo: `<img class="dunlopillo-logo" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" style="position: absolute; width: 200px; height: 45px; top: 79px; left: 540px; object-fit: contain; z-index: 10000;" />`,
  
  getButtons: (page) => {
    const isFirstPage = page === 'page1';
    const isLastPage = page === 'page19';  // page19를 마지막 페이지로 설정
    
    return `
      <button class="nav-btn home-btn" onclick="goHome()" style="position: absolute; top: 79px; left: 50px; width: 97px; height: 44px;">홈으로</button>
      ${!isFirstPage ? `<button class="nav-btn prev-btn" onclick="previous()" style="position: absolute; bottom: 50px; left: 50px; width: 97px; height: 44px;">&lt; 이전</button>` : ''}
      <button class="nav-btn next-btn" onclick="${isLastPage ? 'goHome()' : 'next()'}" style="position: absolute; bottom: 50px; right: 50px; width: 97px; height: 44px;">다음&gt;</button>
    `;
  },
  
  getTitle: (titleText) => `<div class="page-title" style="position: absolute; height: 20px; top: 131px; left: 477px; font-family: 'Pretendard-Regular'; font-weight: normal; color: #000000; font-size: 18px; text-align: right; letter-spacing: 0; line-height: normal; white-space: nowrap; z-index: 1000;">${titleText}</div>`,
  
  getContent: (mainContent) => `<div style="position: absolute; top: 200px; left: 50%; transform: translateX(-50%); text-align: center; color: #000000; font-size: 48px; font-family: 'Pretendard-Bold', Helvetica;">${mainContent}</div>`,
  
  getProgressBar: (currentPage) => {
    const pageMap = {
      'page1': 1,
      'page2': 1,
      'page3': 1,
      'page4': 1,
      'page5': 1,
      'page6': 1,
      'page7': 2,
      'page8': 2,
      'page9': 2,
      'page10': 3,
      'page11': 3,
      'page12': 3,
      'page13': 4,
      'page14': 4,
      'page15': 5,
      'page16-1': 5,
      'page16-2': 5,
      'page17': 6,
      'page18': 6
    };
    
    const currentStep = pageMap[currentPage] || 1;
    
    return `
      <div class="progress-bar">
        <div class="progress-wrapper">
          <div class="progress-group">
            <div class="progress-line"></div>
            <div class="progress-ellipse-1 ${currentStep >= 1 ? 'active' : ''}"></div>
            <div class="progress-ellipse-2 ${currentStep >= 2 ? 'active' : ''}"></div>
            <div class="progress-ellipse-3 ${currentStep >= 3 ? 'active' : ''}"></div>
            <div class="progress-ellipse-4 ${currentStep >= 4 ? 'active' : ''}"></div>
            <div class="progress-ellipse-5 ${currentStep >= 5 ? 'active' : ''}"></div>
            <div class="progress-ellipse-6 ${currentStep >= 6 ? 'active' : ''}"></div>
          </div>
        </div>
        <div class="progress-step-1 ${currentStep >= 1 ? 'active' : ''}">01</div>
        <div class="progress-step-2 ${currentStep >= 2 ? 'active' : ''}">02</div>
        <div class="progress-step-3 ${currentStep >= 3 ? 'active' : ''}">03</div>
        <div class="progress-step-4 ${currentStep >= 4 ? 'active' : ''}">04</div>
        <div class="progress-step-5 ${currentStep >= 5 ? 'active' : ''}">05</div>
        <div class="progress-step-6 ${currentStep >= 6 ? 'active' : ''}">06</div>
      </div>
    `;
  }
};

const screens = {
  // 홈 화면
  'home': {
    type: 'main',
    title: '자연에서온 편안함, 던롭필로 침대',
    bg: '',
    button: '화면을 터치하시면 체험이 시작됩니다'
  },
  // page1: 인적사항 입력-1 (성별, 사용경험, 연령대)
  'page1': {
    type: 'survey',
    pageTitle: '던롭필로 라텍스 매트리스 & 모션베드 체험 6단계',
    title: '인적사항 입력',
    subtitle: '던롭필로에 오신걸 환영해요.',
    description: '던롭필로는 모션베드 튜토리얼을 제공하고 경험을 모아 최고의 수면을 제공합니다.',
    content: `
      <button class="nav-btn prev-btn" onclick="goHome()" style="position: absolute; top: 79px; left: 50px; width: 97px; height: 44px;">&lt; 이전</button>
      <button class="nav-btn next-btn" onclick="next()" style="position: absolute; bottom: 50px; right: 50px; width: 97px; height: 44px;">다음&gt;</button>
      ${COMMON_ELEMENTS.logo}
      <div class="page1-title" style="position: absolute; height: 20px; top: 140px; left: 477px; font-family: 'Pretendard-Regular'; font-weight: normal; color: #000000; font-size: 18px; text-align: right; letter-spacing: 0; line-height: normal; white-space: nowrap; z-index: 1000;">던롭필로 라텍스 매트리스 & 모션베드 체험 6단계</div>

      <div class="page1-content" style="z-index: 1;">
        <div class="element">
          <div class="overlap-group">
            <div class="overlap">
              <div class="ROYAL-MOTION">ROYAL<br />MOTION</div>
            </div>
            <div class="text-wrapper-2">던롭필로에<br />오신걸 환영해요.</div>
            <p class="p">던롭필로는 모션베드 튜토리얼을<br /> 제공하고 경험을 모아 최고의<br /> 수면을 제공합니다.</p>
          </div>
          <div class="overlap-2">
            <div class="text-wrapper-3">성별을 선택해주세요.</div>
            <div class="view" onclick="selectSurveyOption('gender', 'male', this)"><div class="label">남성</div></div>
            <div class="label-wrapper" onclick="selectSurveyOption('gender', 'female', this)"><div class="label">여성</div></div>
          </div>
          <div class="overlap-3">
            <div class="text-wrapper-4">던롭필로 사용 경험이 있나요?</div>
            <div class="view" onclick="selectSurveyOption('experience', 'yes', this)"><div class="label">예</div></div>
            <div class="label-wrapper" onclick="selectSurveyOption('experience', 'no', this)"><div class="label" style="white-space: nowrap;">아니요</div></div>
          </div>
          <div class="overlap-4">
            <div class="text-wrapper-5">연령대를 선택해주세요.</div>
            <div class="div-wrapper" onclick="selectSurveyOption('age', 'teen', this)"><div class="label-3">~10대</div></div>
            <div class="view-2" onclick="selectSurveyOption('age', '20s', this)"><div class="label-4">20대</div></div>
            <div class="view-3" onclick="selectSurveyOption('age', '30s', this)"><div class="label-5">30대</div></div>
            <div class="view-4" onclick="selectSurveyOption('age', '40s', this)"><div class="label-5">40대</div></div>
            <div class="view-5" onclick="selectSurveyOption('age', '50s', this)"><div class="label-4">50대</div></div>
            <div class="view-6" onclick="selectSurveyOption('age', '60s', this)"><div class="label-5">60대</div></div>
            <div class="view-7" onclick="selectSurveyOption('age', '70s', this)"><div class="label-6">70대~</div></div>
          </div>
        </div>
      </div>
    `
  },
  // page2: 모션베드 특장점 소개 (Anima 코드 기반)
  'page2': {
    type: 'basic',
    pageTitle: '모션베드 특장점',
    title: '왜 던롭필로 모션베드여야 할까요?',
    subtitle: '왜 던롭필로 모션베드여야 할까요?',
    content: `
      ${COMMON_ELEMENTS.getButtons('page2')}
      
      <div class="page2-element">
        <div class="page2-overlap">
          <div class="page2-overlap-group">
            <div class="page2-overlap-2">
              <div class="page2-ellipse"></div>
              <img class="page2-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
              <p class="page2-intro-text" style="position: absolute !important; top: 394px !important; left: 1080px !important; font-size: 20px !important; text-align: center !important; line-height: 28px !important; color: black !important; height: auto !important;">던롭필로는 모션베드 튜토리얼을 <br />제공하고 경험을 모아 <br />최고의 수면을 제공합니다.</p>
              <div class="page2-rectangle"></div>
              <div class="page2-rectangle-2"></div>
              <p class="page2-okin-text">던롭필로의 모션베드는<br />세계 최대의 모션베드 제조사<br />에르고모션에서 제작됩니다.<br /><br />독일 OKIN사의 전용 모터를<br /> 통해 정전 시에도 안전합니다.</p>
              <img class="page2-group" src="${IMG.PAGE2_GROUP}" onerror="this.src='${LOCAL_IMAGES.PAGE2_GROUP}'" />
            </div>
            <div class="page2-title-main">왜 던롭필로 모션베드여야 할까요?</div>
            <div class="page2-title-sub">모션베드 특장점</div>
          </div>
          <div class="page2-overlap-3">
            <p class="page2-kg-text">튼튼한 스틸 프레임과 친환경<br />프리미엄 유칼립투스 합판으로<br />제작되어 뒤틀림과 변형 걱정이 없고,<br /><br />340kg까지 견딜 수 있는<br />높은 내구성과 안정성을 자랑합니다.</p>
            <img class="page2-bed-img" src="${IMG.PAGE2_BED}" onerror="this.src='${LOCAL_IMAGES.PAGE2_BED}'" style="border-radius: 15px; box-shadow: 2px 3px 6px 2px #00000040;" />
          </div>
        </div>
        <!-- 프로그래스 바 -->
        ${COMMON_ELEMENTS.getProgressBar('page2')}
      </div>
    `
  },

  // page3: 3단계 화면 (Anima 코드 기반)
  'page3': {
    type: 'survey',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '3단계 화면',
    content: `
      ${COMMON_ELEMENTS.getButtons('page3')}
      
      <div class="page3-element">
        <p class="page3-main-text">먼저 다리를 꼬지 않고 천장을 보며<br />정자세로 편하게 누워주세요.</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page3')}
        
        <img class="page3-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <div class="page3-overlap">
          <div class="page3-rectangle"></div>
          <div class="page3-rectangle-2"></div>
          <img class="page3-bed-img" src="${IMG.P3_PIC1}" onerror="this.src='${LOCAL_IMAGES.P3_PIC1}'" />
          <div class="page3-ellipse"></div>
          <div class="page3-royal-motion">ROYAL<br />MOTION</div>
          <p class="page3-intro-text">던롭필로의 라텍스 매트리스와<br />모션베드 체험을 시작하겠습니다.</p>
          <div class="page3-start-text">Start!</div>
        </div>
        
        <p class="page3-title">라텍스 매트리스 &amp; 모션베드 체험</p>
      </div>
    `
  },

  // page4: 4단계 화면 (Anima 코드 기반)
  'page4': {
    type: 'survey',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '4단계 화면',
    content: `
      ${COMMON_ELEMENTS.getButtons('page4')}
      
      <div class="page4-element">
        <p class="page4-main-text">먼저 다리를 올려보겠습니다.<br />리모컨 버튼을 눌러 다리를 5초간 올려주세요.</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page4')}
        
        <img class="page4-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <div class="page4-overlap">
          <div class="page4-rectangle"></div>
          <div class="page4-rectangle-2"></div>
          <img class="page4-remote" src="${IMG.P4_REMOTE1}" onerror="this.src='${LOCAL_IMAGES.P4_REMOTE1}'" />
          <img class="page4-bed-img" src="${IMG.P4_PIC1}" onerror="this.src='${LOCAL_IMAGES.P4_PIC1}'" />
        </div>
        
        <p class="page4-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        <p style="position: absolute; height: 45px; top: 701px; left: 404px; font-family: 'Pretendard-Bold', Helvetica; font-weight: 700; color: #18306c; font-size: 28px; text-align: center; letter-spacing: 0; line-height: 44.8px; white-space: nowrap;">그리고 약 30초간 편하게 사용해주세요.</p>
      </div>
    `
  },

  // page5: 5단계 - 별점 평가 1단계 (Anima 코드 기반)
  'page5': {
    type: 'rating',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '5단계 - 별점 평가',
    content: `
      ${COMMON_ELEMENTS.getButtons('page5')}
      
      <div class="page5-element">
        <div class="page5-main-text">이전 자세와 비교해 어떠신가요?</div>
        
        ${COMMON_ELEMENTS.getProgressBar('page5')}
        
        <img class="page5-version" src="${IMG.LOGO}" />
        
        <p class="page5-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        <div class="page5-rating-labels">
          <div class="page5-label-comfortable">아주 편안함</div>
          <div class="page5-label-unsure">잘 모르겠음</div>
          <div class="page5-score-1">1점</div>
          <div class="page5-score-5">5점</div>
        </div>
        
        <div class="page5-rating-container">
          <div class="page5-star-item" data-rating="1" onclick="selectRating(1)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="2" onclick="selectRating(2)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="3" onclick="selectRating(3)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="4" onclick="selectRating(4)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="5" onclick="selectRating(5)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    `
  },

  // page6: 6단계 - TIP 페이지 (Anima 코드 기반)
  'page6': {
    type: 'tip',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '6단계 - TIP',
    content: `
      ${COMMON_ELEMENTS.getButtons('page6')}
      
      <div class="page6-element">
        <img class="page6-version" src="${IMG.LOGO}" />
        
        <p class="page6-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page6')}
        
        <div class="page6-content-wrapper">
          <div class="page6-content-group">
            <p class="page6-text-1">
              <span style="white-space: nowrap;">연구에 의하면 우리는 평평하게 잘 때 허리와 어깨에 가장 많은 부담이 간다고 합니다.</span><br />
              <span style="white-space: nowrap;">다리를 올림으로서 허리와 어깨에 가해지는 압력이 줄고, 혈액순환도 향상되는데요.</span><br />
              <br /> 이렇게 모션베드를 사용해서 다리를 올리고 휴식을 취하시면 부종이 완화되거나 <br />허리/어깨가 편해지는 것을 느끼실 수 있습니다.<br />
            </p>
          </div>
        </div>
        
        <div class="page6-tip-label">TIP!</div>
      </div>
    `
  },

  // page7: 7단계 - 상체 올리기 체험 (Anima 코드 기반, page4와 동일 구조)
  'page7': {
    type: 'experience',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '7단계 - 상체 올리기 체험',
    content: `
      ${COMMON_ELEMENTS.getButtons('page7')}
      
      <div class="page7-element">
        <p class="page7-main-text">이번에는 상체를 올려보겠습니다.<br />리모컨 버튼을 눌러 상체를 5초간 올려주세요.</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page7')}
        
        <img class="page7-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <div class="page7-overlap">
          <div class="page7-rectangle"></div>
          <div class="page7-rectangle-2"></div>
          <img class="page7-bed-img" src="${IMG.P7_PIC1}" onerror="this.src='${LOCAL_IMAGES.P7_PIC1}'" />
          <img class="page7-remote" src="${IMG.P7_REMOTE}" onerror="this.src='${LOCAL_IMAGES.P7_REMOTE}'" />
        </div>
        
        <p class="page7-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        <p style="position: absolute; height: 45px; top: 701px; left: 404px; font-family: 'Pretendard-Bold', Helvetica; font-weight: 700; color: #18306c; font-size: 28px; text-align: center; letter-spacing: 0; line-height: 44.8px; white-space: nowrap;">그리고 약 30초간 편하게 사용해주세요.</p>
      </div>
    `
  },

  // page8: 2단계 만족도 평가 (별점 평가)
  'page8': {
    type: 'rating',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '8단계 - 별점 평가',
    content: `
      ${COMMON_ELEMENTS.getButtons('page8')}
      
      <div class="page5-element">
        <div class="page5-main-text">이전 자세와 비교해 어떠신가요?</div>
        
        ${COMMON_ELEMENTS.getProgressBar('page8')}
        
        <img class="page5-version" src="${IMG.LOGO}" />
        
        <p class="page5-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        <div class="page5-rating-labels">
          <div class="page5-label-comfortable">아주 편안함</div>
          <div class="page5-label-unsure">잘 모르겠음</div>
          <div class="page5-score-1">1점</div>
          <div class="page5-score-5">5점</div>
        </div>
        
        <div class="page5-rating-container">
          <div class="page5-star-item" data-rating="1" onclick="selectRating(1)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="2" onclick="selectRating(2)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="3" onclick="selectRating(3)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="4" onclick="selectRating(4)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="5" onclick="selectRating(5)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    `
  },

  // page9: 9단계 - TIP 2페이지 (page6과 동일 구조, 배경 이미지와 텍스트만 변경)
  'page9': {
    type: 'tip',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '9단계 - TIP',
    content: `
      ${COMMON_ELEMENTS.getButtons('page9')}
      
      <div class="page6-element page9" style="background-image: url(${IMG.P9_PIC1}); background-size: cover; background-position: 50% 50%;">
        <img class="page6-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <p class="page6-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page9')}
        
        <div class="page6-content-wrapper">
          <div class="page6-content-group">
            <p class="page6-text-1">
              실제로 많은 분들이 코가 막히거나 코골이를 심하게 하시는 경우가 있는데요.<br />
              이 때 모션베드를 머리를 조금 올려 기도를 확보하면 숨쉬기 편해지고<br />
              <br />
              코골이나 무호흡증 또한 완화될 수 있습니다.<br />
              또한 역류성 식도염도 완화되는 효과를 보실 수 있습니다.
            </p>
          </div>
        </div>
        
        <div class="page6-tip-label">TIP!</div>
      </div>
    `
  },

  // page10: 10단계 - 스마트폰 사용 체험 (page7과 동일 구조, 왼쪽 사각형 제거)
  'page10': {
    type: 'experience',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '10단계 - 스마트폰 사용 체험',
    content: `
      ${COMMON_ELEMENTS.getButtons('page10')}
      
      <div class="page7-element">
        <p class="page7-main-text">이번에는 침대에서 스마트폰을<br />사용하는 상황을 가정해 보겠습니다.</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page10')}
        
        <img class="page7-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <div class="page7-overlap">
          <img class="page7-bed-img" src="${IMG.P10_PIC1}" onerror="this.src='${LOCAL_IMAGES.P10_PIC1}'" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);" />
        </div>
        
        <p class="page7-title">라텍스 매트리스 &amp; 모션베드 체험</p>
      </div>
    `
  },

  // page11: 11단계 - 리모컨 조정 체험 (page7과 동일 구조, 텍스트와 이미지만 변경)
  'page11': {
    type: 'experience',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '11단계 - 리모컨 조정 체험',
    content: `
      ${COMMON_ELEMENTS.getButtons('page11')}
      
      <div class="page7-element">
        <p class="page7-main-text">리모컨을 사용해서 다리와 머리부분을 조정하시고<br />
        <span style="white-space: nowrap;">스마트폰을 사용하기 가장 편안한 자세를 만들어 주세요.</span></p>
        
        ${COMMON_ELEMENTS.getProgressBar('page11')}
        
        <img class="page7-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <div class="page7-overlap">
          <div class="page7-rectangle"></div>
          <div class="page7-rectangle-2"></div>
          <img class="page7-bed-img" src="${IMG.P11_PIC1}" onerror="this.src='${LOCAL_IMAGES.P11_PIC1}'" />
          <img class="page7-remote" src="${IMG.P11_REMOTE}" onerror="this.src='${LOCAL_IMAGES.P11_REMOTE}'" />
        </div>
        
        <p class="page7-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        <p style="position: absolute; height: 45px; top: 701px; left: 404px; font-family: 'Pretendard-Bold', Helvetica; font-weight: 700; color: #18306c; font-size: 28px; text-align: center; letter-spacing: 0; line-height: 44.8px; white-space: nowrap;">그리고 약 2분간 편하게 사용해주세요.</p>
      </div>
    `
  },

  // page12: 12단계 - 최종 만족도 평가 (page8과 동일한 별점 평가)
  'page12': {
    type: 'rating',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '12단계 - 별점 평가',
    content: `
      ${COMMON_ELEMENTS.getButtons('page12')}
      
      <div class="page5-element">
        <div class="page5-main-text">스마트폰을 사용하기 편안한 자세를 찾으셨나요?</div>
        
        ${COMMON_ELEMENTS.getProgressBar('page12')}
        
        <img class="page5-version" src="${IMG.LOGO}" />
        
        <p class="page5-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        <div class="page5-rating-labels">
          <div class="page5-label-comfortable">아주 편안함</div>
          <div class="page5-label-unsure">잘 모르겠음</div>
          <div class="page5-score-1">1점</div>
          <div class="page5-score-5">5점</div>
        </div>
        
        <div class="page5-rating-container">
          <div class="page5-star-item" data-rating="1" onclick="selectRating(1)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="2" onclick="selectRating(2)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="3" onclick="selectRating(3)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="4" onclick="selectRating(4)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="5" onclick="selectRating(5)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    `
  },

  // page13: 13단계 - 제로G 모드 체험 (page7과 동일 구조, 텍스트와 이미지만 변경)
  'page13': {
    type: 'experience',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '13단계 - 제로G 모드 체험',
    content: `
      ${COMMON_ELEMENTS.getButtons('page13')}
      
      <div class="page7-element">
        <p class="page7-main-text">이번에는 제로G모드로 바꿔보겠습니다.<br />리모컨에 있는 제로G 버튼을 눌러주세요.</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page13')}
        
        <img class="page7-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <div class="page7-overlap">
          <div class="page7-rectangle"></div>
          <div class="page7-rectangle-2"></div>
          <img class="page7-bed-img" src="${IMG.P13_PIC1}" onerror="this.src='${LOCAL_IMAGES.P13_PIC1}'" />
          <img class="page7-remote" src="${IMG.P13_REMOTE}" onerror="this.src='${LOCAL_IMAGES.P13_REMOTE}'" />
        </div>
        
        <p class="page7-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        <p style="position: absolute; height: 45px; top: 701px; left: 404px; font-family: 'Pretendard-Bold', Helvetica; font-weight: 700; color: #18306c; font-size: 28px; text-align: center; letter-spacing: 0; line-height: 44.8px; white-space: nowrap;">그리고 약 30초간 편하게 사용해주세요.</p>
      </div>
    `
  },

  // page14: 14단계 - Perfect Recovery Posture TIP
  'page14': {
    type: 'tip',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '14단계 - Perfect Recovery Posture TIP',
    content: `
      ${COMMON_ELEMENTS.getButtons('page14')}
      
      <div class="page6-element" style="background-image: url(${IMG.P14_PIC1}); background-size: cover; background-position: 50% 50%;">
        <img class="page6-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <p class="page6-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page14')}
        
        <div class="page6-content-wrapper">
          <div class="page6-content-group">
            <p class="page6-text-1">
              이 자세는 영어로 Perfect Recovery Posture 라고도 하는데요.<br />
              <span style="white-space: nowrap;">'가장 완벽한 회복자세' 라는 뜻입니다. 세계 최대 모션베드 제조사인 에르고모션과</span><br />
              <span style="white-space: nowrap;">던롭필로가 협업하여 수백만건의 데이터를 바탕으로 사람들이 가장 편안하게</span><br />
              <span style="white-space: nowrap;"> 느끼는 자세를 구현했습니다.</span>
            </p>
            <p class="page6-text-2">
      
              완벽한 상하체 각도를 통해 마치 무중력에 있는 듯한 느낌을 받을 수 있으며,<br />
              신체 압력 완화, 혈액순환 향상, 호흡 안정화 등의 효과를 느낄 수 있습니다.
            </p>
          </div>
        </div>
        
        <div class="page6-tip-label">TIP!</div>
      </div>
    `
  },

  // page15: 15단계 - 평평한 상태로 복원 (page7과 동일 구조, 텍스트와 이미지만 변경)
  'page15': {
    type: 'experience',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '15단계 - 평평한 상태로 복원',
    content: `
      ${COMMON_ELEMENTS.getButtons('page15')}
      
      <div class="page7-element">
        <p class="page7-main-text">이제 다시 원래 상태처럼 평평하게 바꿔보겠습니다.<br />리모컨에 있는 플랫 버튼을 눌러주세요.</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page15')}
        
        <img class="page7-version" src="${IMG.LOGO}" />
        
        <div class="page7-overlap">
          <div class="page7-rectangle"></div>
          <div class="page7-rectangle-2"></div>
          <img class="page7-bed-img" src="${IMG.P15_PIC1}" onerror="this.src='${LOCAL_IMAGES.P15_PIC1}'" />
          <img class="page7-remote" src="${IMG.P15_REMOTE}" onerror="this.src='${LOCAL_IMAGES.P15_REMOTE}'" />
        </div>
        
        <p class="page7-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        <p style="position: absolute; height: 45px; top: 701px; left: 404px; font-family: 'Pretendard-Bold', Helvetica; font-weight: 700; color: #18306c; font-size: 28px; text-align: center; letter-spacing: 0; line-height: 44.8px; white-space: nowrap;">그리고 약 30초간 편하게 사용해주세요.</p>
      </div>
    `
  },

  // page16-1: 16-1단계 - 최종 TIP (page14와 동일 구조, 배경 이미지와 텍스트만 변경)
  'page16-1': {
    type: 'tip',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '16-1단계 - 최종 TIP',
    content: `
      ${COMMON_ELEMENTS.getButtons('page16-1')}
      
      <div class="page6-element" style="background-image: url(${IMG.P16_PIC1}); background-size: cover; background-position: 50% 50%;">
        <img class="page6-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <p class="page6-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page16-1')}
        
        <!-- TIP 라벨 - 기존 글로벌 스타일 적용 -->
        <div style="
          position: absolute;
          height: 44px;
          top: 170px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-bold);
          font-weight: 700;
          color: var(--primary-blue);
          font-size: 48px;
          letter-spacing: 0;
          line-height: 44.2px;
          white-space: nowrap;
        ">TIP!</div>
        
        <!-- 손 이미지들 - TIP 라벨 바로 아래에 배치 -->
        <div class="page16-hand-images" style="
          position: absolute;
          top: 230px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 99;
          width: auto;
          height: auto;
        ">
          <img class="page16-hand-img" 
               src="${LOCAL_IMAGES.P16_HAND1}" 
               alt="Hand Image 1" style="
            width: 266px;
            height: 266px;
            border-radius: 12px;
            object-fit: cover;
            display: block;
            position: relative;
          " onload="console.log('✅ P16_HAND1 로컬 로드 성공')" />
          <img class="page16-hand-img" 
               src="${LOCAL_IMAGES.P16_HAND2}" 
               alt="Hand Image 2" style="
            width: 266px;
            height: 266px;
            border-radius: 12px;
            object-fit: cover;
            display: block;
            position: relative;
          " onload="console.log('✅ P16_HAND2 로컬 로드 성공')" />
        </div>

        <!-- Content Wrapper - 기존 글로벌 스타일 적용 -->
        <div style="
          position: absolute;
          width: 703px;
          height: 200px;
          top: 510px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--light-gray);
          border-radius: 15px;
          box-shadow: 2px 3px 6px 2px #00000040;
        ">
          <div style="
            position: relative;
            width: 635px;
            height: 180px;
            top: 20px;
            left: 34px;
            text-align: left;
          ">
            <p style="
              position: absolute;
              height: 85px;
              top: 0;
              left: -12px;
              font-family: 'Pretendard-Medium', Helvetica;
              font-weight: 500;
              color: var(--black);
              font-size: 22px;
              letter-spacing: -2.00px;
              line-height: 30.6px;
              margin: 0;
              padding: 0;
              width: 100%;
              overflow: visible;
              white-space: normal;
              text-align: left !important;
              text-indent: 0 !important;
              direction: ltr;
            ">
              손을 1자로 쭉 펴주세요. 손에 힘을 빼 보세요. 긴장감이 풀리고 편안해 지셨죠?<br /> 
              <span style="white-space: nowrap;">그 힘을 뺀 상태가 방금 경험하신 가장 편안한 제로G 상태와 동일한 자세 입니다.</span>
              
            </p>
            <p style="
              position: absolute;
              height: 85px;
              top: 95px;
              left: -12px;
              font-family: 'Pretendard-Medium', Helvetica;
              font-weight: 500;
              color: var(--black);
              font-size: 22px;
              letter-spacing: -2.00px;
              line-height: 30.6px;
              margin: 0;
              padding: 0;
              width: 100%;
              overflow: visible;
              white-space: normal;
              text-align: left !important;
              text-indent: 0 !important;
              direction: ltr;
            ">
              화학성분으로 만든 타사 폼 매트리스와 달리, 던롭필로 천연 라텍스 매트리스와<br />
              <span style="white-space: nowrap;">모션베드의 완벽한 조합으로 더욱 안정감 있고 편안한 휴식과 숙면을 제공합니다.</span>
            </p>
          </div>
        </div>      </div>
    `
  },

  // page16-2: 16-2단계 - 최종 TIP 2 (page6와 유사한 구조로 변경)
  'page16-2': {
    type: 'tip',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '16-2단계 - 최종 TIP',
    content: `
      ${COMMON_ELEMENTS.getButtons('page16-2')}
      
      <div class="page6-element" style="background-image: url(${IMG.P16_PIC1}); background-size: cover; background-position: 50% 50%;">
        <img class="page6-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <p class="page6-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        ${COMMON_ELEMENTS.getProgressBar('page16-2')}
        
        <!-- TIP 라벨 - 기존 글로벌 스타일 적용 -->
        <div style="
          position: absolute;
          height: 44px;
          top: 170px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-bold);
          font-weight: 700;
          color: var(--primary-blue);
          font-size: 48px;
          letter-spacing: 0;
          line-height: 44.2px;
          white-space: nowrap;
        ">TIP!</div>
        
        <!-- 손 이미지들 - TIP 라벨 바로 아래에 배치 -->
        <div class="page16-hand-images" style="
          position: absolute;
          top: 230px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 99;
          width: auto;
          height: auto;
        ">
          <img class="page16-hand-img" 
               src="${LOCAL_IMAGES.P16_HAND1}" 
               alt="Hand Image 1" style="
            width: 266px;
            height: 266px;
            border-radius: 12px;
            object-fit: cover;
            display: block;
            position: relative;
          " onload="console.log('✅ P16_HAND1 로컬 로드 성공')" />
          <img class="page16-hand-img" 
               src="${LOCAL_IMAGES.P16_HAND2}" 
               alt="Hand Image 2" style="
            width: 266px;
            height: 266px;
            border-radius: 12px;
            object-fit: cover;
            display: block;
            position: relative;
          " onload="console.log('✅ P16_HAND2 로컬 로드 성공')" />
        </div>
        
        <!-- Content Wrapper - page16-2용 텍스트 (손 이미지 위치로 이동) -->
        <div style="
          position: absolute;
          width: 703px;
          height: 200px;
          top: 510px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--light-gray);
          border-radius: 15px;
          box-shadow: 2px 3px 6px 2px #00000040;
        ">
          <div style="
            position: relative;
            width: 635px;
            height: 180px;
            top: 20px;
            left: 34px;
            text-align: left;
          ">
            <p style="
              position: absolute;
              height: 85px;
              top: 30px;
              left: -12px;
              font-family: var(--font-regular);
              font-weight: 500;
              color: var(--black);
              font-size: 22px;
              letter-spacing: -2.00px;
              line-height: 30.6px;
              margin: 0;
              padding: 0;
              width: 100%;
              overflow: visible;
              white-space: normal;
              text-align: left !important;
              text-indent: 0 !important;
              direction: ltr;
            ">
              실제로 8시간 수면중에 보통 60~80번을 뒤척인다고 하는데요.<br />
              <span style="white-space: nowrap;">뒤척임에 즉각적으로 받쳐주는 던롭필로 라텍스 매트리스와 모션베드를 함께</span><br />
              사용하시면, 뒤척임이 줄어들어 더욱 편안한 숙면을 경험하실 수 있습니다.<br />
              
            </p>
          </div>
        </div>      </div>
    `
  },

  // page17: 17단계 - 자유 체험 (리모컨 가운데 정렬, 모든 프로그래스바 활성화)
  'page17': {
    type: 'experience',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '17단계 - 자유 체험',
    content: `
      ${COMMON_ELEMENTS.getButtons('page17')}
      
      <div class="page7-element">
        <p class="page7-main-text">이제 리모컨을 사용하여<br />편안하게 모션베드를 체험해보세요.</p>
        
        <div class="progress-bar">
          <div class="progress-wrapper">
            <div class="progress-group">
              <div class="progress-line"></div>
              <div class="progress-ellipse-1 active"></div>
              <div class="progress-ellipse-2 active"></div>
              <div class="progress-ellipse-3 active"></div>
              <div class="progress-ellipse-4 active"></div>
              <div class="progress-ellipse-5 active"></div>
              <div class="progress-ellipse-6 active"></div>
            </div>
          </div>
          <div class="progress-step-1 active">01</div>
          <div class="progress-step-2 active">02</div>
          <div class="progress-step-3 active">03</div>
          <div class="progress-step-4 active">04</div>
          <div class="progress-step-5 active">05</div>
          <div class="progress-step-6 active">06</div>
        </div>
        
        <img class="page7-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <div class="page17-overlap" style="position: absolute; width: 268px; height: 355px; top: 292px; left: 506px; background-color: #ffffff; border-radius: 15px; box-shadow: 2px 3px 6px 2px #00000040;">
          <img class="page17-remote" src="${IMG.P17_REMOTE}" onerror="this.src='${LOCAL_IMAGES.P17_REMOTE}'" style="position: absolute; width: 191px; height: 320px; top: 18px; left: 38px;" />
        </div>
        
        <p class="page7-title">라텍스 매트리스 &amp; 모션베드 체험</p>
      </div>
    `
  },

  // page18: 18단계 - 최종 만족도 평가 (page5와 동일한 별점 평가, 타이틀만 변경)
  'page18': {
    type: 'rating',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '18단계 - 최종 만족도 평가',
    content: `
      ${COMMON_ELEMENTS.getButtons('page18')}
      
      <div class="page5-element">
        <div class="page5-main-text">체험이 끝나셨다면 마지막으로 던롭필로 모션베드의 만족도를 알려주세요.</div>
        
        <img class="page5-version" src="${IMG.LOGO}" />
        
        <p class="page5-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        <div class="page5-rating-labels">
          <div class="page5-label-comfortable">아주 편안함</div>
          <div class="page5-label-unsure">잘 모르겠음</div>
          <div class="page5-score-1">1점</div>
          <div class="page5-score-5">5점</div>
        </div>
        
        <div class="page5-rating-container">
          <div class="page5-star-item" data-rating="1" onclick="selectRating(1)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="2" onclick="selectRating(2)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="3" onclick="selectRating(3)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="4" onclick="selectRating(4)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="page5-star-item" data-rating="5" onclick="selectRating(5)">
            <svg class="page5-star-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    `
  },

  // page19: 19단계 - 완료 페이지 (page16과 동일한 스타일, 배경 이미지만 변경, 특별한 홈 버튼)
  'page19': {
    type: 'complete',
    pageTitle: '라텍스 매트리스 & 모션베드 체험',
    title: '19단계 - 체험 완료',
    content: `
      <div class="page6-element" style="background-image: url(${IMG.P19_PIC1}); background-size: cover; background-position: 50% 50%;">
        <img class="page6-version" src="${IMG.LOGO}" onerror="this.src='${LOCAL_IMAGES.LOGO}'" />
        
        <p class="page6-title">라텍스 매트리스 &amp; 모션베드 체험</p>
        
        <div class="page19-main-text" style="position: absolute; height: 90px; top: 160px; left: 494px; font-family: 'Pretendard-Bold', Helvetica; font-weight: 700; color: #18306c; font-size: 32px; text-align: center; letter-spacing: 0; line-height: 44.8px;">설문이 완료되었습니다.<br />감사합니다!</div>
        
        <img src="${IMG.HOME_ICON}" onclick="goHome()" style="position: absolute; top: 274px; left: 592px; cursor: pointer; width: 97px; height: 44px;" alt="홈으로" />
      </div>
    `
  },
  
  // 홈 화면 정의
  home: {
    type: 'main',
    title: 'Dunlopillo Motion Bed',
    content: '' // script.js에서 동적으로 생성
  }
};

// 전역 객체로 노출 (script.js에서 접근 가능)
window.screens = screens;
