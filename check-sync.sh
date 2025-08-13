#!/bin/bash
# iCloud 동기화 상태 확인

echo "🔍 iCloud 동기화 상태 확인..."

# 동기화되지 않은 파일 찾기
find . -name "*.icloud" -type f 2>/dev/null | head -5

# Git 상태 확인
echo "📁 Git 상태:"
git status --porcelain

echo "✅ 확인 완료!"
