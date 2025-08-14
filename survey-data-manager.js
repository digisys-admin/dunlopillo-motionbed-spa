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
        this._apiEndpoint = 'https://script.google.com/macros/s/AKfycbwP5rQmthmDRxOlQC6x7hZNlqSeO8ZjCPgtt8EyM3Suhx9f33EvY_WQiD_RMrgSxxqWSA/exec';
    
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
    
    /** @private @type {boolean} */
    this._allowAutoTransmission = false; // 자동 전송 완전 차단
    
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
    
    // 페이지 언로드 시 데이터 전송 제거 (수동 전송만 허용)
    // window.addEventListener('beforeunload', () => {
    //   this._sendFinalData();
    // });
    
    // 주기적으로 데이터 백업 (5분마다)
    setInterval(() => {
      this._backupData();
    }, 5 * 60 * 1000);
  }

  /**
   * 디바이스 타입 감지
   * @private
   * @returns {string}
   */
  _detectDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    // 1. 터치 지원 여부 확인
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 2. 화면 크기 확인
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const maxDimension = Math.max(screenWidth, screenHeight);
    const minDimension = Math.min(screenWidth, screenHeight);
    
    // 3. User Agent 기반 디바이스 판별
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(ua) || 
                    (hasTouch && minDimension >= 768 && maxDimension >= 1024);
    const isIOS = /ipad|iphone|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    
    // 4. 화면 비율 및 크기 기반 판별
    const aspectRatio = maxDimension / minDimension;
    const isLargeScreen = minDimension >= 1200; // 데스크톱/노트북
    const isMediumScreen = minDimension >= 768 && minDimension < 1200; // 태블릿
    const isSmallScreen = minDimension < 768; // 모바일
    
    // 5. 포인터 정밀도 확인 (CSS Media Query 지원 시)
    let hasFinePrinter = false;
    try {
      hasFinePrinter = window.matchMedia('(pointer: fine)').matches;
    } catch (e) {
      // 지원하지 않는 브라우저는 User Agent로 판단
      hasFinePrinter = !hasTouch;
    }
    
    // 6. 디바이스 타입 결정 로직
    let deviceType = 'UNKNOWN';
    let confidence = 'LOW';
    
    // iPad 또는 Android 태블릿 명시적 감지
    if (isIOS && ua.includes('ipad')) {
      deviceType = 'TABLET';
      confidence = 'HIGH';
    }
    // Android 태블릿 (mobile이 없고 tablet이 있거나 화면이 큰 경우)
    else if (isAndroid && !ua.includes('mobile') && (ua.includes('tablet') || isMediumScreen)) {
      deviceType = 'TABLET';
      confidence = 'HIGH';
    }
    // 스마트폰 감지
    else if (isMobile && isSmallScreen) {
      deviceType = 'MOBILE';
      confidence = 'HIGH';
    }
    // 대형 화면 + 마우스/트랙패드 = 데스크톱/노트북
    else if (isLargeScreen && hasFinePrinter && !hasTouch) {
      deviceType = 'LAPTOP';
      confidence = 'HIGH';
    }
    // 중간 화면 + 터치 = 태블릿 가능성
    else if (isMediumScreen && hasTouch) {
      deviceType = 'TABLET';
      confidence = 'MEDIUM';
    }
    // 중간 화면 + 마우스 = 노트북 가능성
    else if (isMediumScreen && hasFinePrinter) {
      deviceType = 'LAPTOP';
      confidence = 'MEDIUM';
    }
    // 큰 화면 + 터치 = 터치 노트북 또는 대형 태블릿
    else if (isLargeScreen && hasTouch) {
      // Surface Pro 같은 경우 - 화면 비율로 추가 판별
      if (aspectRatio > 1.5) {
        deviceType = 'LAPTOP'; // 16:9, 16:10 비율은 노트북
      } else {
        deviceType = 'TABLET'; // 4:3, 3:2 비율은 태블릿
      }
      confidence = 'MEDIUM';
    }
    // Windows/macOS/Linux + 큰 화면 = 데스크톱/노트북
    else if ((platform.includes('win') || platform.includes('mac') || platform.includes('linux')) && isLargeScreen) {
      deviceType = 'LAPTOP';
      confidence = 'MEDIUM';
    }
    // 기본값: 화면 크기 기반
    else {
      if (isSmallScreen) {
        deviceType = 'MOBILE';
      } else if (isMediumScreen) {
        deviceType = 'TABLET';
      } else {
        deviceType = 'LAPTOP';
      }
      confidence = 'LOW';
    }
    
    // 디버깅 정보 출력
    console.log(`📱 [DeviceDetection] 감지 결과:`, {
      deviceType,
      confidence,
      details: {
        userAgent: ua.substring(0, 100) + '...',
        platform,
        screenSize: `${screenWidth}x${screenHeight}`,
        hasTouch,
        hasFinePrinter,
        aspectRatio: aspectRatio.toFixed(2),
        classifications: {
          isMobile,
          isTablet,
          isIOS,
          isAndroid,
          isLargeScreen,
          isMediumScreen,
          isSmallScreen
        }
      }
    });
    
    return `${deviceType}-${confidence}`;
  }

  /**
   * 디바이스 타입 감지 (신뢰도 포함)
   * @private
   * @returns {string} - "TABLET-HIGH", "LAPTOP-MEDIUM" 등
   */
  _detectDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    // 터치 지원 확인
    const hasTouch = ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0) || 
                     (navigator.msMaxTouchPoints > 0);
    
    // 화면 크기 확인
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const screenSize = Math.max(screenWidth, screenHeight);
    const screenRatio = Math.max(screenWidth, screenHeight) / Math.min(screenWidth, screenHeight);
    
    console.log(`🔍 [DeviceDetection] UA: ${ua.substring(0, 50)}...`);
    console.log(`🔍 [DeviceDetection] Platform: ${platform}`);
    console.log(`🔍 [DeviceDetection] Touch: ${hasTouch}, Screen: ${screenWidth}x${screenHeight}`);
    
    // 1. 명확한 모바일 기기 (스마트폰)
    if (/android.*mobile|iphone|ipod|blackberry|windows phone|webos/i.test(ua)) {
      return 'MOBILE-HIGH';
    }
    
    // 2. 명확한 태블릿
    if (/ipad|kindle|silk|playbook/i.test(ua)) {
      return 'TABLET-HIGH';
    }
    
    // 3. Android 태블릿 (mobile이 없는 Android)
    if (/android/i.test(ua) && !/mobile/i.test(ua)) {
      return 'TABLET-HIGH';
    }
    
    // 4. 화면 크기와 터치 기반 추론
    if (hasTouch) {
      if (screenSize <= 768) {
        return 'MOBILE-MEDIUM'; // 작은 터치 화면
      } else if (screenSize <= 1024) {
        return 'TABLET-MEDIUM'; // 중간 터치 화면
      } else if (screenSize <= 1366) {
        return 'TABLET-LOW'; // 큰 태블릿 또는 터치 노트북
      } else {
        return 'LAPTOP-MEDIUM'; // 터치 노트북/올인원
      }
    }
    
    // 5. 터치 없는 기기 (데스크탑/노트북)
    if (screenSize <= 1366) {
      return 'LAPTOP-HIGH'; // 노트북 해상도
    } else if (screenSize <= 1920) {
      return 'LAPTOP-MEDIUM'; // 큰 노트북 또는 작은 데스크탑
    } else {
      return 'DESKTOP-HIGH'; // 데스크탑
    }
  }

  /**
   * 테블릿 ID 생성 (디바이스 고유 식별)
   * @private
   * @returns {string}
   */
  _generateTabletId() {
    console.log('🔍 [Device] 디바이스 ID 생성 시작');
    
    // URL 경로 기반으로 설정된 디바이스 ID가 있는지 확인 (최우선)
    const idLocked = localStorage.getItem('dunlopillo_device_id_locked') === 'true';
    const idSource = localStorage.getItem('dunlopillo_id_source');
    
    // 경로로 설정된 ID가 있으면 자동감지 건너뛰기
    if (idLocked && (idSource === 'url_path' || idSource === 'url_path_inline')) {
      const lockedId = localStorage.getItem('dunlopillo_device_id');
      if (lockedId) {
        console.log(`🔒 [Device] URL 경로로 설정된 디바이스 ID 발견 (잠금): ${lockedId}`);
        return lockedId;
      }
    }
    
    // 페이지 로드 시 자동 실행된 인라인 스크립트에서 설정한 값이 있는지 확인
    if (window.deviceIdFromPath) {
      console.log(`🔒 [Device] 인라인 스크립트에서 설정된 디바이스 ID 발견: ${window.deviceIdFromPath}`);
      
      // 이미 설정되어 있지만 확실하게 localStorage에도 저장
      localStorage.setItem('dunlopillo_device_id', window.deviceIdFromPath);
      localStorage.setItem('dunlopillo_auto_device_id', window.deviceIdFromPath);
      localStorage.setItem('dunlopillo_device_id_locked', 'true');
      localStorage.setItem('dunlopillo_id_source', 'url_path_inline');
      
      return window.deviceIdFromPath;
    }
    
    // 0. localStorage에 저장된 디바이스 ID가 있으면 먼저 확인
    // (URL 경로로 설정한 경우도 이 방식으로 이미 저장되어 있음)
    const storedDeviceId = localStorage.getItem('dunlopillo_device_id');
    const autoDeviceId = localStorage.getItem('dunlopillo_auto_device_id');
    
    // 자동 ID가 설정되어 있으면 그것을 우선 사용 (URL 경로나 파라미터로 설정된 경우)
    if (autoDeviceId && (autoDeviceId.startsWith('TABLET_') || 
                        autoDeviceId.startsWith('LAPTOP_') || 
                        autoDeviceId.startsWith('MOBILE_') || 
                        autoDeviceId.startsWith('DESKTOP_'))) {
      console.log(`🔍 [Device] localStorage에서 자동 설정된 디바이스 ID 불러옴: ${autoDeviceId}`);
      return autoDeviceId;
    }
    
    // 기본 저장된 ID 확인
    if (storedDeviceId && (storedDeviceId.startsWith('TABLET_') || 
                          storedDeviceId.startsWith('LAPTOP_') || 
                          storedDeviceId.startsWith('MOBILE_') || 
                          storedDeviceId.startsWith('DESKTOP_'))) {
      console.log(`🔍 [Device] localStorage에서 디바이스 ID 불러옴: ${storedDeviceId}`);
      return storedDeviceId;
    }
    
    // 1. URL 파라미터에서 테블릿 ID 확인 (?tablet=KIOSK1, ?t=A, ?presetId=TABLET_01)
    const urlParams = new URLSearchParams(window.location.search);
    const tabletId = urlParams.get('presetId') || urlParams.get('tablet') || urlParams.get('t');
    
    if (tabletId) {
      // URL 파라미터로 명시적 지정 시에도 디바이스 타입 추가
      // 단, 이미 TABLET_, LAPTOP_ 등의 접두사가 있으면 그대로 사용
      let deviceId;
      if (tabletId.match(/^(TABLET_|LAPTOP_|MOBILE_|DESKTOP_)/i)) {
        deviceId = tabletId.toUpperCase();
      } else {
        const deviceType = this._detectDeviceType().split('-')[0]; // HIGH/MEDIUM/LOW 제거
        deviceId = `${deviceType}_${tabletId.toUpperCase()}`;
      }
      
      // 자동 감지 우회를 위해 두 키 모두 저장
      localStorage.setItem('dunlopillo_device_id', deviceId);
      localStorage.setItem('dunlopillo_auto_device_id', deviceId);
      console.log(`🔍 [Device] URL 파라미터에서 디바이스 ID 설정: ${deviceId}`);
      return deviceId;
    }
    
    // 3. 디바이스 타입 감지
    const deviceTypeWithConfidence = this._detectDeviceType();
    const deviceType = deviceTypeWithConfidence.split('-')[0]; // TABLET, LAPTOP, MOBILE, DESKTOP
    
    // 4. 디바이스 지문(fingerprint) 생성 - 브라우저/기기별 고유값
    const deviceFingerprint = this._generateDeviceFingerprint();
    const hash = this._generateHash(deviceFingerprint);
    const newDeviceId = `${deviceType}_${hash.substring(0, 8).toUpperCase()}`;
    
    // 5. 생성된 ID를 localStorage에 영구 저장
    localStorage.setItem('dunlopillo_device_id', newDeviceId);
    console.log(`🆔 [Device] 새 디바이스 ID 생성: ${newDeviceId}`);
    console.log(`📱 [Device] 디바이스 타입: ${deviceType} (${deviceTypeWithConfidence})`);
    console.log(`🔍 [Device] 디바이스 지문: ${deviceFingerprint.substring(0, 50)}...`);
    
    return newDeviceId;
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
   * 디바이스 타입 감지
   * @private
   * @returns {string}
   */
  _detectDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    
    // 1. 모바일 디바이스 감지 (우선순위)
    if (/iphone|ipod|android.*mobile|windows phone|blackberry|mobile/i.test(ua)) {
      return 'Mobile';
    }
    
    // 2. 태블릿 감지
    if (/ipad|android(?!.*mobile)|tablet|kindle|silk|playbook/i.test(ua)) {
      return 'Tablet';
    }
    
    // 3. 터치 지원 여부와 화면 크기로 태블릿 추가 감지
    if (maxTouchPoints > 0) {
      // 터치 지원 + 중간 화면 크기 = 태블릿 가능성
      if (screenWidth >= 768 && screenWidth <= 1366) {
        return 'Tablet';
      }
      // 터치 지원 + 작은 화면 = 모바일
      if (screenWidth < 768) {
        return 'Mobile';
      }
    }
    
    // 4. 노트북/데스크톱 구분
    // 일반적으로 노트북은 1920px 이하, 데스크톱은 그 이상
    if (screenWidth <= 1920 && screenHeight <= 1200) {
      return 'Laptop';
    }
    
    // 5. 기본값: Desktop
    return 'Desktop';
  }

  /**
   * 디바이스 지문 생성 (브라우저/기기별 고유 식별)
   * @private
   * @returns {string}
   */
  _generateDeviceFingerprint() {
    const components = [];
    
    // 1. 화면 해상도 및 색상 깊이
    components.push(`screen:${screen.width}x${screen.height}x${screen.colorDepth}`);
    
    // 2. 시간대
    components.push(`timezone:${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    
    // 3. 언어 설정
    components.push(`lang:${navigator.language}`);
    
    // 4. 플랫폼 정보
    components.push(`platform:${navigator.platform}`);
    
    // 5. User Agent (축약)
    const ua = navigator.userAgent;
    const uaHash = this._generateHash(ua).substring(0, 8);
    components.push(`ua:${uaHash}`);
    
    // 6. 현재 호스트/포트
    components.push(`host:${window.location.host}`);
    
    // 7. 하드웨어 동시성 (CPU 코어 수)
    if (navigator.hardwareConcurrency) {
      components.push(`hw:${navigator.hardwareConcurrency}`);
    }
    
    // 8. 메모리 정보 (Chrome만 지원)
    if (navigator.deviceMemory) {
      components.push(`mem:${navigator.deviceMemory}`);
    }
    
    // 9. 로컬 IP (개선된 감지)
    // 이전에 WebRTC로 감지된 IP가 있으면 사용
    const detectedIP = localStorage.getItem('dunlopillo_detected_ip');
    const currentIP = detectedIP || this._getLocalIP();
    components.push(`ip:${currentIP}`);
    
    // 10. Canvas Fingerprinting (간단한 버전)
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Dunlopillo Device ID', 2, 2);
      const canvasData = canvas.toDataURL();
      const canvasHash = this._generateHash(canvasData).substring(0, 8);
      components.push(`canvas:${canvasHash}`);
    } catch (e) {
      components.push('canvas:unsupported');
    }
    
    const fingerprint = components.join('|');
    console.log(`🔍 [DeviceFingerprint] 생성된 지문: ${fingerprint}`);
    
    // 지문을 localStorage에도 저장 (IP 업데이트 시 참조용)
    localStorage.setItem('dunlopillo_device_fingerprint', fingerprint);
    
    return fingerprint;
  }

  /**
   * 로컬 IP 주소 추정 (개선된 버전)
   * @private
   * @returns {string}
   */
  _getLocalIP() {
    // 1. 현재 접속 중인 호스트 확인
    const host = window.location.hostname;
    
    // 2. 이미 로컬 네트워크 IP로 접속 중이면 사용
    if (host.startsWith('192.168.') || host.startsWith('10.') || 
        host.startsWith('172.16.') || host.startsWith('172.17.') || 
        host.startsWith('172.18.') || host.startsWith('172.19.') ||
        host.startsWith('172.2') || host.startsWith('172.3')) {
      return host;
    }
    
    // 3. localhost/127.0.0.1인 경우 실제 IP 추정 시도
    if (host === 'localhost' || host === '127.0.0.1' || host === '') {
      // WebRTC를 이용한 로컬 IP 감지 시도 (비동기이므로 즉시 반환은 불가)
      this._detectLocalIPAsync();
      
      // 일반적인 개발 환경 IP 추정
      const now = new Date();
      const timeHash = now.getHours() + now.getMinutes();
      
      // 시간 기반으로 일반적인 로컬 IP 대역 중 하나 선택
      const commonIPs = ['192.168.1.', '192.168.0.', '10.0.0.', '172.16.0.'];
      const selectedPrefix = commonIPs[timeHash % commonIPs.length];
      
      // 100-200 사이의 숫자로 IP 완성 (중복 가능성 낮춤)
      const lastOctet = 100 + (timeHash % 100);
      return `${selectedPrefix}${lastOctet}`;
    }
    
    // 4. 기타 경우 호스트명 그대로 반환
    return host;
  }

  /**
   * WebRTC를 이용한 실제 로컬 IP 감지 (비동기)
   * @private
   */
  _detectLocalIPAsync() {
    // URL 경로에서 설정된 디바이스 ID가 있으면 IP 감지 비활성화
    const idLocked = localStorage.getItem('dunlopillo_device_id_locked') === 'true';
    const idSource = localStorage.getItem('dunlopillo_id_source');
    
    if (idLocked && idSource === 'url_path') {
      console.log('🔒 [IP감지] URL 경로로 설정된 디바이스 ID 있음 - WebRTC IP 감지 비활성화');
      return;
    }
    
    try {
      // WebRTC RTCPeerConnection을 이용한 로컬 IP 감지 - 비활성화
      console.log('ℹ️ [IP감지] WebRTC IP 감지 기능 비활성화됨 (URL 경로 방식 활성화)');
      
      // 코드 비활성화
      /*
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      pc.createDataChannel('');
      
      pc.onicecandidate = (event) => {
        if (event && event.candidate && event.candidate.candidate) {
          const candidate = event.candidate.candidate;
          const match = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          
          if (match && match[1]) {
            const detectedIP = match[1];
            // 로컬 네트워크 IP인지 확인
            if (detectedIP.startsWith('192.168.') || 
                detectedIP.startsWith('10.') || 
                detectedIP.startsWith('172.')) {
              
              console.log(`🌐 [IP감지] WebRTC로 감지된 로컬 IP: ${detectedIP}`);
              
              // 감지된 IP를 localStorage에 저장 (다음번 사용)
              localStorage.setItem('dunlopillo_detected_ip', detectedIP);
              
              // 디바이스 ID 재생성 (더 정확한 IP 반영)
              this._updateDeviceIdWithIP(detectedIP);
            }
          }
        }
      };
      
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(err => console.log('🌐 [IP감지] WebRTC 실패:', err));
      */
    } catch (error) {
      console.log('🌐 [IP감지] WebRTC 지원하지 않음:', error.message);
    }
  }

  /**
   * 감지된 IP로 디바이스 ID 업데이트
   * @private
   * @param {string} detectedIP 
   */
  _updateDeviceIdWithIP(detectedIP) {
    try {
      // URL 경로로 설정된 경우 자동감지 중단
      const idLocked = localStorage.getItem('dunlopillo_device_id_locked') === 'true';
      const idSource = localStorage.getItem('dunlopillo_id_source');
      if (idLocked && idSource === 'url_path') {
        console.log('🔒 [Device] URL 경로로 설정된 디바이스 ID가 있음 - 자동 업데이트 건너뛰기');
        return;
      }
      
      // 기존 저장된 디바이스 ID가 있고, URL 파라미터로 지정되지 않은 경우만 업데이트
      const urlParams = new URLSearchParams(window.location.search);
      const hasTabletParam = urlParams.get('tablet') || urlParams.get('t');
      
      if (!hasTabletParam) {
        const currentDeviceId = localStorage.getItem('dunlopillo_device_id');
        let deviceType = 'TABLET'; // 기본값
        
        // 기존 디바이스 ID에서 타입 추출
        if (currentDeviceId) {
          if (currentDeviceId.startsWith('TABLET_')) {
            deviceType = 'TABLET';
          } else if (currentDeviceId.startsWith('LAPTOP_')) {
            deviceType = 'LAPTOP';
          } else if (currentDeviceId.startsWith('MOBILE_')) {
            deviceType = 'MOBILE';
          } else {
            // 새로운 감지 실행
            deviceType = this._detectDeviceType().split('-')[0];
          }
        } else {
          // 새로운 감지 실행
          deviceType = this._detectDeviceType().split('-')[0];
        }
        
        // 새로운 디바이스 지문 생성 (감지된 IP 포함)
        const oldFingerprint = localStorage.getItem('dunlopillo_device_fingerprint');
        const newComponents = [];
        
        // 기존 구성요소들 유지하되 IP만 업데이트
        if (oldFingerprint) {
          const parts = oldFingerprint.split('|');
          parts.forEach(part => {
            if (part.startsWith('ip:')) {
              newComponents.push(`ip:${detectedIP}`);
            } else {
              newComponents.push(part);
            }
          });
        } else {
          // 새로 생성
          const deviceFingerprint = this._generateDeviceFingerprint();
          newComponents.push(deviceFingerprint.replace(/ip:[^|]+/, `ip:${detectedIP}`));
        }
        
        const updatedFingerprint = newComponents.join('|');
        const hash = this._generateHash(updatedFingerprint);
        const newDeviceId = `${deviceType}_${hash.substring(0, 8).toUpperCase()}`;
        
        // 업데이트된 정보 저장
        localStorage.setItem('dunlopillo_device_id', newDeviceId);
        localStorage.setItem('dunlopillo_device_fingerprint', updatedFingerprint);
        
        console.log(`🆔 [IP업데이트] 디바이스 ID 갱신: ${newDeviceId} (타입: ${deviceType}, IP: ${detectedIP})`);
        
        // 현재 인스턴스의 태블릿 ID도 업데이트
        this._tabletId = newDeviceId;
      }
    } catch (error) {
      console.error('❌ [IP업데이트] 디바이스 ID 업데이트 실패:', error);
    }
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
    
    // 설문은 저장만 하고 전송하지 않음 (중복 전송 방지)
    console.log('📝 [SurveyDataManager] 설문 응답 저장됨 (전송 대기 중)');
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
    
    // 로컬 스토리지에 저장
    localStorage.setItem('dunlopillo_ratings_data', JSON.stringify(this._ratingsData));
    
    // 별점 저장 시에는 중간 전송하지 않음 (최종 완료 시에만 전송)
    console.log('⭐ [SurveyDataManager] 별점 저장됨 (전송 대기 중)');
  }

  /**
   * 설문조사 완료 여부 확인
   * @private
   * @returns {boolean}
   */
  _isSurveyComplete() {
    const result = Object.values(this._surveyData).every(value => value !== null && value !== undefined && value !== '');
    
    console.log('🔍 [DEBUG] 설문 체크 결과:', {
      surveyData: this._surveyData,
      result
    });
    
    return result;
  }

  /**
   * 모든 별점이 입력되었는지 확인
   * @private
   * @returns {boolean}
   */
  _hasAllRatings() {
    const requiredPages = ['page5', 'page8', 'page12', 'page18'];
    const result = requiredPages.every(page => {
      const rating = this._ratingsData[page];
      return rating !== null && rating !== undefined && rating >= 1 && rating <= 5;
    });
    
    console.log('🔍 [DEBUG] 별점 체크 결과:', {
      requiredPages,
      currentRatings: this._ratingsData,
      result
    });
    
    return result;
  }

  /**
   * 설문조사 완료 시 수동으로 최종 데이터 전송
   * @public
   */
  async completeSurvey() {
    console.log('🎯 [SurveyDataManager] 설문조사 완료 트리거');
    
    // 이미 전송된 경우 중복 방지
    if (this._isDataSent) {
      console.log('⚠️ [SurveyDataManager] 데이터 이미 전송됨. 중복 전송 차단.');
      return;
    }
    
    // 수동 호출 플래그 설정
    this._isManualCall = true;
    
    await this._sendFinalData();
  }

  /**
   * 세션 시작 시점 업데이트 (홈 화면 터치 시)
   * @public
   */
  startSession() {
    this._sessionStart = new Date();
    console.log(`⏰ [SurveyDataManager] 세션 시작: ${this._sessionStart.toISOString()}`);
  }

  /**
   * 새 세션 준비 (데이터 초기화)
   * @private
   */
  _prepareNewSession() {
    // 데이터 전송 상태 초기화
    this._isDataSent = false;
    
    // 잠시 후 새로운 세션을 위해 데이터 초기화
    setTimeout(() => {
      // 🔄 사용자 ID 강제 재생성 (sessionStorage 초기화)
      sessionStorage.removeItem('dunlopillo_user_id');
      this._userId = this._generateUserId();
      
      this._sessionStart = new Date();
      this._surveyData = { gender: null, experience: null, age: null };
      this._ratingsData = { page5: null, page8: null, page12: null, page18: null };
      
      // 로컬 스토리지 임시 데이터도 정리
      localStorage.removeItem('dunlopillo_survey_data');
      localStorage.removeItem('dunlopillo_ratings_data');
      
      console.log('🔄 [SurveyDataManager] 새 세션 준비 완료');
      console.log(`🆔 [NewSession] 새 사용자 ID: ${this._userId}`);
    }, 3000); // 3초 후 초기화
  }

  /**
   * 최종 데이터 전송 (설문조사 완료 시에만)
   * @private
   */
  async _sendFinalData() {
    // 이미 전송했으면 중복 전송 방지
    if (this._isDataSent) {
      console.log('📤 [SurveyDataManager] 데이터 이미 전송됨. 중복 전송 방지.');
      return;
    }
    
    // 자동 전송이 허용되지 않고, 수동 호출이 아닌 경우 차단
    if (!this._allowAutoTransmission && !this._isManualCall) {
      console.log('🚫 [SurveyDataManager] 자동 전송 차단됨. 수동 호출만 허용.');
      return;
    }
    
    // 디버깅: 현재 데이터 상태 출력
    console.log('🔍 [DEBUG] 설문 데이터:', this._surveyData);
    console.log('🔍 [DEBUG] 별점 데이터:', this._ratingsData);
    console.log('🔍 [DEBUG] 설문 완료 여부:', this._isSurveyComplete());
    console.log('🔍 [DEBUG] 별점 완료 여부:', this._hasAllRatings());
    
    // 현재 세션의 완성도 체크 (모든 필수 데이터가 있는지 확인)
    if (!this._isSurveyComplete() || !this._hasAllRatings()) {
      console.log('📤 [SurveyDataManager] 설문조사가 완료되지 않았습니다. 전송 생략.');
      return;
    }
    
    try {
      const data = this._buildDataPayload(true);
      console.log('🔍 [DEBUG] 전송할 데이터:', data);
      await this._sendToGoogleSheets(data);
      this._isDataSent = true;
      console.log('📤 [SurveyDataManager] 최종 데이터 전송 완료');
      
      // 전송 후 새 세션 준비
      this._prepareNewSession();
    } catch (error) {
      console.warn('⚠️ [SurveyDataManager] 최종 데이터 전송 실패 (Google Sheets 미설정):', error.message);
      // 로컬에는 정상적으로 저장되므로 계속 진행
    } finally {
      this._isManualCall = false; // 플래그 초기화
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
      sessionId: `${this._userId}_${this._sessionStart.getTime()}`, // 🔄 고유 세션 식별자 추가
      survey: { ...this._surveyData },
      ratings: { ...this._ratingsData },
      sessionStart: this._sessionStart.toISOString(),
      sessionEnd: sessionEnd ? sessionEnd.toISOString() : null,
      ipAddress: this._getLocalIP(),
      browserInfo: this._getBrowserInfo(),
      deviceType: this._detectDeviceType(), // 🔄 디바이스 타입 추가
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
   * Google Sheets로 데이터 전송 (Form Submit 방식 - CORS 우회)
   * @private
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async _sendToGoogleSheets(data) {
    console.log('📤 [SurveyDataManager] Google Sheets 전송 시도:', this._apiEndpoint);
    console.log('📤 [SurveyDataManager] 전송 데이터:', data);
    
    // 🌐 온라인 상태 확인
    if (!navigator.onLine) {
      console.log('📡 [SurveyDataManager] 오프라인 상태 - 로컬 저장');
      await this._saveOfflineData(data);
      return { success: true, offline: true, message: '오프라인 상태 - 데이터 로컬 저장됨' };
    }
    
    return new Promise((resolve, reject) => {
      try {
        // 임시 iframe 생성 (새 창 대신 숨겨진 iframe 사용)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'hidden_form_target';
        document.body.appendChild(iframe);
        
        // 임시 form 엘리먼트 생성
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this._apiEndpoint;
        form.target = 'hidden_form_target'; // iframe으로 전송
        form.style.display = 'none';
        
        // 데이터를 JSON 문자열로 변환해서 hidden input에 넣기
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(data);
        
        form.appendChild(input);
        document.body.appendChild(form);
        
        // form submit
        form.submit();
        
        // form과 iframe 정리
        setTimeout(() => {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
        }, 1000);
        
        console.log('📤 [SurveyDataManager] Form 전송 완료 (백그라운드)');
        
        // form submit은 응답을 직접 받을 수 없으므로 성공으로 가정
        resolve({
          success: true,
          message: 'Form 전송 완료 (백그라운드)',
          method: 'form-submit-hidden'
        });
        
      } catch (error) {
        console.error('📤 [SurveyDataManager] 전송 실패 상세:', {
          error: error.message,
          endpoint: this._apiEndpoint,
          data: data
        });
        reject(error);
      }
    });
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
   * 오프라인 데이터 저장 (Service Worker에게 전달)
   * @private
   * @param {Object} data - 저장할 데이터
   * @returns {Promise<void>}
   */
  async _saveOfflineData(data) {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Service Worker에게 데이터 저장 요청
        navigator.serviceWorker.controller.postMessage({
          type: 'SAVE_OFFLINE_DATA',
          payload: {
            apiUrl: this._apiEndpoint,
            payload: data,
            timestamp: Date.now(),
            source: 'survey-data-manager'
          }
        });
        
        console.log('💾 [SurveyDataManager] 오프라인 데이터 저장 요청 전송');
        
        // 사용자에게 알림
        this._showOfflineNotification();
      } else {
        // Service Worker가 없으면 localStorage에 임시 저장
        console.warn('⚠️ [SurveyDataManager] Service Worker 없음 - localStorage 사용');
        this._saveToLocalStorage(data);
      }
    } catch (error) {
      console.error('❌ [SurveyDataManager] 오프라인 데이터 저장 실패:', error);
      // 대안: localStorage 저장
      this._saveToLocalStorage(data);
    }
  }

  /**
   * localStorage에 임시 저장 (Service Worker 대안)
   * @private
   * @param {Object} data
   */
  _saveToLocalStorage(data) {
    try {
      const offlineData = JSON.parse(localStorage.getItem('dunlopillo_offline_data') || '[]');
      
      // 🔄 동일 세션 데이터 중복 체크
      const sessionId = data.sessionId || `${data.userId}_${data.timestamp}`;
      const existingIndex = offlineData.findIndex(item => item.sessionId === sessionId);
      
      const newDataItem = {
        ...data,
        sessionId: sessionId,
        timestamp: Date.now(),
        synced: false
      };
      
      if (existingIndex >= 0) {
        // 🔄 기존 세션 데이터 업데이트 (덮어쓰기)
        console.log(`🔄 [OfflineStorage] 기존 세션 데이터 업데이트: ${sessionId}`);
        offlineData[existingIndex] = newDataItem;
      } else {
        // 🆕 새 세션 데이터 추가
        console.log(`🆕 [OfflineStorage] 새 세션 데이터 추가: ${sessionId}`);
        offlineData.push(newDataItem);
      }
      
      // 최대 100개까지만 저장 (메모리 관리)
      if (offlineData.length > 100) {
        offlineData.splice(0, offlineData.length - 100);
      }
      
      localStorage.setItem('dunlopillo_offline_data', JSON.stringify(offlineData));
      console.log('💾 [SurveyDataManager] localStorage 저장 완료');
      console.log(`📊 [OfflineStorage] 총 ${offlineData.length}개 세션 저장됨`);
      
      this._showOfflineNotification();
    } catch (error) {
      console.error('❌ [SurveyDataManager] localStorage 저장 실패:', error);
    }
  }

  /**
   * 오프라인 상태 알림 표시
   * @private
   */
  _showOfflineNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FF9800;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
      ">
        📡 오프라인 상태<br>
        <small>WiFi 연결 시 자동 전송됩니다</small>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // 3초 후 제거
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * 온라인 상태에서 미동기화 데이터 확인 및 전송
   * @public
   */
  async syncPendingData() {
    if (!navigator.onLine) {
      console.log('📡 [SurveyDataManager] 여전히 오프라인 상태');
      return;
    }
    
    try {
      // localStorage에서 미동기화 데이터 확인
      const offlineData = JSON.parse(localStorage.getItem('dunlopillo_offline_data') || '[]');
      const pendingData = offlineData.filter(item => !item.synced);
      
      if (pendingData.length === 0) {
        console.log('✅ [SurveyDataManager] 동기화할 데이터 없음');
        return;
      }
      
      console.log(`📤 [SurveyDataManager] ${pendingData.length}개 데이터 동기화 시작`);
      
      for (let i = 0; i < pendingData.length; i++) {
        const data = pendingData[i];
        try {
          // 실제 전송 시도
          await this._sendToGoogleSheets(data);
          
          // 성공 시 동기화 완료 표시
          data.synced = true;
          data.syncedAt = Date.now();
          
          console.log(`✅ [SurveyDataManager] 데이터 ${i + 1}/${pendingData.length} 동기화 완료`);
        } catch (error) {
          console.error(`❌ [SurveyDataManager] 데이터 ${i + 1} 동기화 실패:`, error);
        }
      }
      
      // localStorage 업데이트
      localStorage.setItem('dunlopillo_offline_data', JSON.stringify(offlineData));
      
      // 성공 알림
      this._showSyncSuccessNotification(pendingData.filter(d => d.synced).length);
      
    } catch (error) {
      console.error('❌ [SurveyDataManager] 데이터 동기화 실패:', error);
    }
  }

  /**
   * 동기화 성공 알림
   * @private
   * @param {number} count
   */
  _showSyncSuccessNotification(count) {
    if (count === 0) return;
    
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
      ">
        ✅ 데이터 동기화 완료<br>
        <small>${count}개 데이터 전송됨</small>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
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
   * 테스트용 데이터 강제 설정
   * @public
   */
  setTestData() {
    this._surveyData = {
      gender: 'male',
      experience: 'yes', 
      age: '50s'
    };
    this._ratingsData = {
      page5: 5,
      page8: 4,
      page12: 3,
      page18: 5
    };
    this._isDataSent = false;
    
    console.log('🧪 [SurveyDataManager] 테스트 데이터 설정 완료');
    console.log('📊 설문 데이터:', this._surveyData);
    console.log('⭐ 별점 데이터:', this._ratingsData);
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

    window.completeSurvey = () => {
      console.log('🎯 [Legacy] completeSurvey 호출');
      window.surveyDataManager.completeSurvey();
    };

    window.startSession = () => {
      console.log('⏰ [Legacy] startSession 호출');
      window.surveyDataManager.startSession();
    };

    window.setTestData = () => {
      console.log('🧪 [Legacy] setTestData 호출');
      window.surveyDataManager.setTestData();
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
    setupOfflineHandlers();
  });
} else {
  console.log('📄 [SurveyDataManager] DOM 이미 로드됨');
  setupOfflineHandlers();
}

/**
 * 오프라인 상태 처리 설정
 */
function setupOfflineHandlers() {
  // 온라인 상태가 되면 자동 동기화 시도
  window.addEventListener('online', () => {
    console.log('🌐 [SurveyDataManager] 온라인 상태 복구 - 자동 동기화 시작');
    
    // 잠시 대기 후 동기화 (네트워크 안정성 확보)
    setTimeout(() => {
      if (window.surveyDataManager && typeof window.surveyDataManager.syncPendingData === 'function') {
        window.surveyDataManager.syncPendingData();
      }
    }, 2000);
  });

  window.addEventListener('offline', () => {
    console.log('📡 [SurveyDataManager] 오프라인 상태 - 로컬 저장 모드');
  });

  // 페이지 로드 시 온라인 상태면 기존 데이터 동기화 확인
  if (navigator.onLine) {
    setTimeout(() => {
      if (window.surveyDataManager && typeof window.surveyDataManager.syncPendingData === 'function') {
        window.surveyDataManager.syncPendingData();
      }
    }, 5000); // 앱 초기화 완료 후 실행
  }
  
  console.log('✅ [SurveyDataManager] 오프라인 핸들러 설정 완료');
}
