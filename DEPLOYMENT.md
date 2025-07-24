# Dunlopillo SPA 배포 가이드

## CDN 리소스 관리

### 1. Cloudinary 음성 파일 업로드
```bash
# Cloudinary CLI 설치
npm install -g cloudinary-cli

# 음성 파일들 일괄 업로드
cloudinary upload_dir assets/voices/ \
  --resource_type video \
  --folder "dunlopillo-spa/voices"
```

### 2. 이미지 파일 최적화 및 업로드
```bash
# 이미지 최적화
for file in assets/pics/*.png; do
  npx imagemin "$file" --out-dir=assets/pics/optimized/ --plugin=pngquant
done

# Cloudinary 업로드
cloudinary upload_dir assets/pics/ \
  --resource_type image \
  --folder "dunlopillo-spa/images"
```

### 3. 환경별 설정

#### 개발 환경 (로컬)
- 미디어 파일: 로컬 assets 폴더 사용
- 서버: Live Server 또는 로컬 개발 서버

#### 스테이징 환경
- 미디어 파일: Cloudinary CDN
- 서버: Netlify 또는 Vercel

#### 프로덕션 환경
- 미디어 파일: Cloudinary CDN (최적화됨)
- 서버: Netlify 또는 Vercel
- 도메인: 커스텀 도메인 연결

## 배포 스크립트

### Netlify 자동 배포
```toml
# netlify.toml
[build]
  command = "echo 'No build required'"
  publish = "."

[context.production.environment]
  CDN_BASE_URL = "https://res.cloudinary.com/your-cloud-name"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self' 'unsafe-inline' https://res.cloudinary.com"
```

### GitHub Actions 워크플로우
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: '.'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 백업 전략

### 1. 코드 백업 (GitHub)
- 주요 코드: Git 저장소
- 설정 파일: 환경별 분리

### 2. 미디어 백업 (Cloudinary)
- 원본 파일: Cloudinary 저장소
- 로컬 백업: assets 폴더 (개발용)

### 3. 자동 백업 스크립트
```bash
#!/bin/bash
# backup.sh

# 1. 코드 백업
git add .
git commit -m "Auto backup: $(date)"
git push origin main

# 2. 미디어 파일 백업 (선택적)
# rsync -av assets/ ~/backups/dunlopillo-spa-assets/

echo "백업 완료: $(date)"
```
