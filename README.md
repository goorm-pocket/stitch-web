# Stitch FE

주머니 속 일상의 조각을 기록하고, 친구들과 공유하는 `Stitch`의 프론트엔드 프로젝트입니다.  
카카오 로그인 이후 포스트를 작성하고, 포켓 보드에서 기록을 시각적으로 탐색하며, 친구/알림/회고 기능까지 하나의 흐름으로 사용할 수 있도록 구성되어 있습니다.

## 프로젝트 개요

`Stitch FE`는 `React`, `TypeScript`, `Vite` 기반의 웹 애플리케이션입니다.  
단순 피드형 UI보다, 포스트를 "주머니 속 조각"처럼 다루는 인터랙션과 보드형 시각화에 초점을 둔 서비스입니다.

주요 사용자 흐름은 다음과 같습니다.

- 카카오 OAuth 로그인
- 포스트 작성 및 수정
- 포켓 보드에서 게시물 탐색
- 친구 검색 및 친구 요청 관리
- 실시간 알림 확인
- 주간 회고(Recap) 확인
- 프로필 및 공개 범위 설정

## 주요 기능

### 1. 인증
- 카카오 OAuth 로그인 지원
- 인증이 필요한 페이지는 `ProtectedRouter`로 보호
- API `401` 응답 시 홈으로 리다이렉트

### 2. 포스트 작성 및 수정
- 텍스트와 이미지 기반 포스트 작성
- 이모지 또는 이미지 마커 선택 가능
- 이미지 크롭 지원
- `HEIC/HEIF` 이미지 업로드 및 변환 지원
- 최대 10장 이미지 업로드 가능
- 작성 후 일정 시간이 지난 포스트는 공개 범위만 수정 가능

### 3. 포켓 보드
- 사용자의 포스트를 보드 형태로 시각화
- 새 포스트 작성 화면으로 빠르게 이동 가능
- `matter-js` 기반 인터랙션을 사용하는 포켓 UI 구성

### 4. 친구 기능
- 사용자 이름 검색
- 친구 요청 전송
- 친구 목록, 보낸 요청, 받은 요청 분리 조회
- 다른 사용자 프로필 페이지 이동 지원

### 5. 알림
- SSE(Server-Sent Events) 기반 실시간 알림 수신
- 읽지 않은 알림 수 갱신
- 알림 유형별 이동 처리 로직 포함

### 6. 리캡(Recap)
- 특정 기간의 기록을 주간 단위로 요약
- 보드 데이터와 함께 회고 텍스트 제공
- 요약문 펼치기/접기 UI 지원

### 7. 설정 및 프로필
- 프로필 설정 페이지 제공
- 알림/개인정보 관련 설정 섹션 구성
- 마이페이지 및 사용자 프로필 페이지 제공

## 기술 스택

### Core
- `React 19`
- `TypeScript`
- `Vite`

### State / Data Fetching
- `@tanstack/react-query`
- `zustand`
- `axios`

### Routing / UI
- `react-router-dom`
- `styled-components`
- `vite-plugin-svgr`

### Media / Interaction
- `react-easy-crop`
- `emoji-picker-react`
- `browser-image-compression`
- `heic2any`
- `matter-js`
- `dayjs`

## 프로젝트 구조

```text
src
|-- app
|   |-- layout
|   |-- router
|   `-- styles
|-- assets
|-- features
|   |-- Archive
|   |-- Notification
|   |-- Pocket
|   |-- PostForm
|   `-- ProfileModal
|-- pages
|   |-- HomePage
|   |-- PocketPage
|   |-- CreatePostPage
|   |-- PostDetailPage
|   |-- FriendPage
|   |-- MyPage
|   |-- SettingPage
|   |-- ProfileSettingPage
|   |-- UserProfilePage
|   |-- RecapPage
|   `-- CallbackPage
`-- shared
    |-- api
    |-- components
    |-- hooks
    |-- hoc
    |-- types
    |-- ui
    |-- utils
    `-- webview
```

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정
루트 디렉터리에 `.env.development` 또는 `.env` 파일을 준비합니다.

```env
VITE_API_BASE_URL=
VITE_REDIRECTION_URL=
VITE_KAKAO_OAUTH_KEY=
```

설명:

- `VITE_API_BASE_URL`: 백엔드 API 주소
- `VITE_REDIRECTION_URL`: 카카오 OAuth 콜백 URL
- `VITE_KAKAO_OAUTH_KEY`: 카카오 REST API 키

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 빌드 결과 미리보기

```bash
npm run preview
```

## 사용 가능한 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 타입 체크 후 프로덕션 빌드 생성
- `npm run lint`: ESLint 실행
- `npm run preview`: 빌드 결과 로컬 미리보기
- `npm run format`: Prettier 포맷 적용

## Docker

Docker 관련 파일이 포함되어 있어 컨테이너 기반 실행 구성이 가능합니다.

- `Dockerfile`
- `docker-compose.yml`

프로젝트 환경에 맞는 API 주소와 환경 변수를 별도로 주입해 사용하면 됩니다.

## 라우트 개요

- `/`: 랜딩 페이지 및 카카오 로그인
- `/callback`: OAuth 콜백 처리
- `/pocket`: 포켓 보드
- `/createpost`: 포스트 작성
- `/mypage`: 마이페이지
- `/friend`: 친구 관리
- `/setting`: 설정
- `/posts/:id`: 포스트 상세
- `/profile/:id`: 사용자 프로필
- `/recap`: 주간 회고
- `/profilesetting`: 프로필 설정

## 문서 작성 기준

이 README는 현재 저장소의 실제 코드 구조와 페이지/기능 기준으로 작성했습니다.  
추가로 팀 소개, 배포 주소, 스크린샷, 백엔드 저장소 링크가 있다면 문서 완성도를 더 높일 수 있습니다.
