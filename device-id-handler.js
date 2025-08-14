// URL 경로에서 디바이스 ID 추출 기능 강화 (Fully Kiosk 호환성)
// 즉시 실행되는 함수로 가장 먼저 처리 (페이지 로드 전)
(function() {
  try {
    console.log('🔍 초기 URL 경로 확인 시작 (페이지 로드 전)');
    
    // 기존에 자동 감지로 생성된 ID 기록 완전히 삭제 (초기화)
    // 이렇게 하면 URL 경로 기반 ID가 확실하게 우선 적용됨
    localStorage.removeItem('dunlopillo_device_id');
    localStorage.removeItem('dunlopillo_auto_device_id');
    localStorage.removeItem('dunlopillo_device_id_locked');
    localStorage.removeItem('dunlopillo_id_source');
    localStorage.removeItem('dunlopillo_device_fingerprint');
    localStorage.removeItem('dunlopillo_detected_ip');
    console.log('🧹 자동 감지 ID 관련 데이터 초기화 완료');
    
    // URL 경로에서 디바이스 ID 추출
    const path = window.location.pathname;
    console.log('🔍 현재 URL 경로:', path);
    
    // 경로가 단순 슬래시나 index.html이 아닌 경우
    if (path !== '/' && path !== '/index.html') {
      // 경로에서 슬래시 제거하고 ID 추출
      let deviceId = path.replace(/^\//, '').replace(/\/index\.html$/, '');
      
      if (deviceId) {
        // 대문자 변환 및 접두사 확인
        deviceId = deviceId.toUpperCase();
        if (!deviceId.startsWith('TABLET_') && !deviceId.startsWith('LAPTOP_') && 
            !deviceId.startsWith('MOBILE_') && !deviceId.startsWith('DESKTOP_')) {
          deviceId = 'TABLET_' + deviceId;
        }
        
        console.log('🔍 URL 경로에서 디바이스 ID 즉시 추출됨:', deviceId);
        
        try {
          // localStorage에 ID 저장 (양쪽 키에 모두 저장)
          localStorage.setItem('dunlopillo_device_id', deviceId);
          localStorage.setItem('dunlopillo_auto_device_id', deviceId);
          
          // 자동 감지 차단을 위한 특수 플래그
          localStorage.setItem('dunlopillo_device_id_locked', 'true');
          localStorage.setItem('dunlopillo_id_source', 'url_path');
          
          console.log('🔍 디바이스 ID 즉시 저장됨:', deviceId);
          
          // 페이지 로드 시 재확인을 위한 플래그 설정
          window.deviceIdFromPath = deviceId;
          
          // 디버그 정보 표시
          console.log('=== 디바이스 ID 디버깅 정보 ===');
          console.log('📍 현재 URL:', window.location.href);
          console.log('📍 URL 경로:', window.location.pathname);
          console.log('📍 추출된 ID:', deviceId);
          console.log('📍 localStorage 상태:', 
            localStorage.getItem('dunlopillo_device_id'),
            localStorage.getItem('dunlopillo_auto_device_id')
          );
          console.log('📍 브라우저:', navigator.userAgent);
        } catch (storageError) {
          console.error('❌ localStorage 저장 실패 (즉시 실행):', storageError);
          // localStorage 실패 시 window 객체에 임시 저장
          window.tempDeviceId = deviceId;
        }
      }
    } else {
      console.log('🔍 기본 경로 - 디바이스 ID 추출 건너뛰기 (즉시 실행)');
    }
  } catch (error) {
    console.error('❌ URL 경로 처리 중 오류 발생 (즉시 실행):', error);
  }
})();

// URL 경로에서 디바이스 ID 추출 (일반 함수 - 백업용)
function getDeviceIdFromUrl() {
  try {
    console.log('🔍 URL 경로에서 디바이스 ID 추출 시도 (DOM 로드 후)');
    const path = window.location.pathname;
    console.log('🔍 현재 URL 경로:', path);
    
    // 경로 검증
    if (!path || path === '/' || path === '/index.html') {
      console.log('🔍 기본 경로 - 디바이스 ID 추출 건너뛰기');
      return null;
    }
    
    // 경로에서 슬래시 제거하고 ID 추출
    const deviceId = path.replace(/^\//, '').replace(/\/index\.html$/, '');
    
    if (deviceId) {
      console.log('🔍 URL에서 디바이스 ID 추출됨:', deviceId);
      
      try {
        // localStorage에 ID 저장
        localStorage.setItem('dunlopillo_device_id', deviceId);
        localStorage.setItem('dunlopillo_auto_device_id', deviceId);
        console.log('🔍 디바이스 ID 저장됨:', deviceId);
      } catch (storageError) {
        console.error('❌ localStorage 저장 실패:', storageError);
        // localStorage 차단 시에도 메모리에 임시 저장
        window.tempDeviceId = deviceId;
      }
      
      return deviceId;
    }
    
    return null;
  } catch (error) {
    console.error('❌ URL 경로 처리 중 오류 발생:', error);
    return null;
  }
}

// 페이지 로드 시 자동 실행 (이미 초기화되었더라도 한 번 더 확인)
window.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 DOMContentLoaded - 디바이스 ID 재확인');
  getDeviceIdFromUrl();
});

// 완전한 페이지 로드 후에도 한 번 더 확인 (Fully Kiosk 호환성)
window.addEventListener('load', () => {
  console.log('🔍 Window load - 디바이스 ID 최종 확인');
  
  // 현재 localStorage 상태 확인
  const currentId = localStorage.getItem('dunlopillo_device_id');
  const autoId = localStorage.getItem('dunlopillo_auto_device_id');
  
  console.log('🔍 현재 ID 상태:', { currentId, autoId });
  
  // 기존에 설정된 값이 없으면 다시 한 번 시도
  if (!currentId) {
    console.log('🔍 ID가 없음 - 다시 시도');
    getDeviceIdFromUrl();
  }
  
  // 임시 저장된 ID가 있으면 적용 (localStorage 실패 백업)
  if (window.tempDeviceId && !currentId) {
    try {
      localStorage.setItem('dunlopillo_device_id', window.tempDeviceId);
      localStorage.setItem('dunlopillo_auto_device_id', window.tempDeviceId);
      console.log('🔍 임시 저장 ID를 localStorage에 저장:', window.tempDeviceId);
    } catch (e) {
      console.error('❌ 임시 ID localStorage 저장 실패:', e);
    }
  }
});

// 5초 후 최종 확인 (Fully Kiosk 브라우저 호환성)
setTimeout(() => {
  console.log('🔍 5초 후 디바이스 ID 최종 확인');
  const currentId = localStorage.getItem('dunlopillo_device_id');
  console.log('🔍 최종 디바이스 ID:', currentId);
}, 5000);
