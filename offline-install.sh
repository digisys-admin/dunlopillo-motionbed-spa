#!/bin/bash

# 던롭필로 SPA 오프라인 설치 스크립트
# 사용법: 이 파일을 태블릿에 복사 후 실행

echo "🚀 던롭필로 SPA 오프라인 설치 시작..."

# 1. 프로젝트 다운로드
if [ ! -d "dunlopillo-motionbed-spa" ]; then
    echo "📥 GitHub에서 프로젝트 다운로드 중..."
    git clone https://github.com/digisys-admin/dunlopillo-motionbed-spa.git
    cd dunlopillo-motionbed-spa
else
    echo "📁 기존 프로젝트 폴더 발견 - 업데이트 중..."
    cd dunlopillo-motionbed-spa
    git pull origin main
fi

# 2. Python 서버 시작
echo "🌐 로컬 서버 시작 중..."
echo "📍 접속 주소: http://localhost:8080"
echo "⏹️  종료하려면 Ctrl+C 를 누르세요"

# 파이썬이 설치되어 있는지 확인
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    python -m http.server 8080
else
    echo "❌ 파이썬이 설치되어 있지 않습니다"
    echo "💡 PWA 앱 설치를 권장합니다"
fi
