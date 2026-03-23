# Campground Service

Express와 EJS를 기반으로 만든 학습용 캠핑장 등록 서비스입니다. 사용자는 회원가입과 로그인을 통해 캠핑장을 등록하고, 이미지 업로드, 위치 저장, 리뷰 작성, 수정 및 삭제까지 포함된 전체 CRUD 흐름을 연습할 수 있습니다.

YelpCamp 스타일의 서버 렌더링 프로젝트로, MongoDB, Passport, Cloudinary, Mapbox를 함께 사용합니다.

## 주요 기능

- 회원가입, 로그인, 로그아웃
- 캠핑장 목록 조회
- 캠핑장 상세 조회
- 캠핑장 등록, 수정, 삭제
- Cloudinary 기반 이미지 업로드
- Mapbox 지오코딩을 이용한 위치 좌표 저장
- 캠핑장 상세 페이지 지도 표시
- 리뷰 작성 및 삭제
- 작성자 권한 체크
- Flash 메시지와 세션 기반 인증

## 기술 스택

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- EJS + ejs-mate
- Passport + passport-local
- express-session + connect-mongo
- Joi
- Multer + Cloudinary
- Mapbox SDK
- Helmet

### Frontend

- EJS server-side rendering
- Bootstrap 기반 뷰 템플릿
- Mapbox GL JS
- Vanilla JavaScript

## 프로젝트 구조

```text
Campground-Service/
├── app.js
├── package.json
├── cloudinary/
│   └── index.js
├── controllers/
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── models/
│   ├── campground.js
│   ├── review.js
│   └── user.js
├── public/
│   ├── javascripts/
│   │   ├── clusterMap.js
│   │   ├── showMap.js
│   │   └── validateForms.js
│   └── stylesheets/
│       ├── app.css
│       ├── home.css
│       └── stars.css
├── routes/
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── seeds/
│   ├── cities.js
│   ├── index.js
│   └── seedHelpers.js
├── utils/
│   ├── catchAsync.js
│   └── ExpressError.js
├── views/
│   ├── campgrounds/
│   ├── layouts/
│   ├── partials/
│   ├── users/
│   ├── error.ejs
│   └── home.ejs
├── middleware.js
└── schemas.js
```

## 주요 페이지

- `/`
  - 홈 화면
- `/campgrounds`
  - 캠핑장 목록 페이지
  - 전체 캠핑장 카드와 클러스터 맵 표시
- `/campgrounds/new`
  - 새 캠핑장 등록 폼
  - 로그인 필요
- `/campgrounds/:id`
  - 캠핑장 상세 페이지
  - 이미지, 설명, 위치, 지도, 리뷰 표시
- `/campgrounds/:id/edit`
  - 캠핑장 수정 페이지
  - 작성자만 접근 가능
- `/register`
  - 회원가입 페이지
- `/login`
  - 로그인 페이지

## 라우트 구성

### 캠핑장

- `GET /campgrounds`
- `GET /campgrounds/new`
- `POST /campgrounds`
- `GET /campgrounds/:id`
- `GET /campgrounds/:id/edit`
- `PUT /campgrounds/:id`
- `DELETE /campgrounds/:id`

### 사용자

- `GET /register`
- `POST /register`
- `GET /login`
- `POST /login`
- `GET /logout`

### 리뷰

- `POST /campgrounds/:id/reviews`
- `DELETE /campgrounds/:campgroundId/reviews/:reviewId`

## 실행 방법

### 1. 패키지 설치

```bash
cd /Users/quarterMoon/Desktop/project/Campground-Service
npm install
```

### 2. 환경 변수 설정

루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
DB_URL=mongodb://127.0.0.1:27017/yelp-camp
MAPBOX_TOKEN=your_mapbox_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

현재 코드에서는 세션 secret이 환경 변수로 분리되어 있지 않고 `app.js` 안에 하드코딩되어 있습니다.

### 3. MongoDB 실행

로컬 MongoDB가 실행 중이어야 합니다.

### 4. 서버 실행

현재 `package.json`에 별도 `start` 또는 `dev` 스크립트가 없어서 아래처럼 직접 실행해야 합니다.

```bash
node app.js
```

기본 주소:

- App: `http://localhost:3000`

## 시드 데이터

샘플 캠핑장 데이터를 넣고 싶다면 아래 명령으로 시드 스크립트를 실행하면 됩니다.

```bash
node seeds/index.js
```

## 구현 포인트

- Passport Local 전략으로 회원 인증을 처리합니다.
- `passport-local-mongoose`를 사용해 사용자 인증 로직을 단순화했습니다.
- 캠핑장 생성 시 Mapbox 지오코딩으로 위치 문자열을 좌표로 변환합니다.
- Multer와 Cloudinary Storage를 이용해 이미지를 업로드하고 저장합니다.
- 캠핑장 삭제 시 연결된 리뷰도 함께 제거되도록 Mongoose post 훅이 들어 있습니다.
- `isLoggedIn`, `isAuthor`, `isReviewAuthor` 미들웨어로 접근 권한을 제어합니다.
- Joi 스키마 검증으로 캠핑장과 리뷰 입력값을 검사합니다.
- Helmet과 CSP 설정으로 외부 리소스 허용 범위를 제한합니다.

## 한계 및 참고 사항

- 세션 secret이 환경 변수로 빠져 있지 않고 코드에 하드코딩되어 있습니다.
- `package.json`에 실행 스크립트가 없어 `node app.js`로 직접 실행해야 합니다.
- REST API 기반 SPA가 아니라 EJS 기반 서버 렌더링 애플리케이션입니다.
- 이미지 업로드와 지도 기능은 Cloudinary, Mapbox 키가 없으면 정상 동작하지 않습니다.
- 테스트 코드와 배포 설정은 포함되어 있지 않습니다.

## 학습 포인트

이 프로젝트는 아래 개념을 함께 학습하기 좋은 구조입니다.

- Express 라우팅과 컨트롤러 분리
- MongoDB 모델링과 관계 데이터 처리
- Passport 인증과 세션 관리
- Joi 검증 미들웨어
- 파일 업로드 처리
- 외부 API 연동(Mapbox, Cloudinary)
- EJS 템플릿 기반 서버 렌더링
