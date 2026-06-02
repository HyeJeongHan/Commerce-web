# Commerce Web

**Spring Boot 백엔드 기반 온라인 커머스 프론트엔드**

Adidas, JCLE 스타일의 미니멀 블랙&화이트 디자인으로 제작된 풀스택 커머스 애플리케이션입니다.

백엔드 레포지토리: [HyeJeongHan/Commerce](https://github.com/HyeJeongHan/Commerce)

---

## Tech Stack

| 구분 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Form | React Hook Form + Zod |
| HTTP | Axios |
| UI Icons | Lucide React |
| Animation | Framer Motion |

---

## Architecture

**Clean Architecture** 4개 레이어로 구성됩니다.

```
src/
├── domain/                 # 비즈니스 규칙 (엔티티, 레포지토리 인터페이스)
│   ├── entities/
│   └── repositories/
│
├── application/            # Use Cases (기능 단위 비즈니스 로직)
│   └── use-cases/
│       ├── auth/
│       ├── product/
│       ├── cart/
│       └── order/
│
├── infrastructure/         # 외부 의존성 구현체
│   ├── api/                # Axios 클라이언트, 토큰 관리
│   └── repositories/       # 레포지토리 구현체
│
├── presentation/           # UI 레이어
│   ├── components/
│   │   ├── layout/         # Header, Footer, CartDrawer
│   │   ├── features/       # 도메인별 컴포넌트
│   │   └── ui/             # 공통 컴포넌트 (Spinner, Pagination 등)
│   ├── hooks/              # 커스텀 훅
│   └── store/              # Zustand 스토어
│
├── app/                    # Next.js App Router 페이지 & Route Handlers
│   ├── api/auth/           # 로그인·로그아웃·토큰 갱신 Route Handler
│   └── ...
│
└── shared/                 # 공통 타입, 유틸, 상수
```

---

## Pages

| 경로 | 설명 |
|---|---|
| `/` | 홈 — 히어로 배너, 상품 수 기준 TOP 3 카테고리, 브랜드 섹션 |
| `/products` | 상품 목록 — 카테고리 필터, 키워드 검색, 가격 범위 필터, 정렬, Infinite Scroll |
| `/products/[id]` | 상품 상세 — 이미지, 설명, 재고, 장바구니 담기, 위시리스트 |
| `/wishlist` | 위시리스트 — 찜한 상품 목록 |
| `/orders` | 주문 목록 (로그인 필요) |
| `/orders/[id]` | 주문 상세 — 결제, 취소 / 어드민: 주문 상태 변경 |
| `/account` | 내 계정 — 프로필 확인, 비밀번호 변경 |
| `/login` | 로그인 |
| `/signup` | 회원가입 |

---

## Features

### 상품
- 카테고리 필터, 키워드 검색, 가격 범위 필터, 정렬 (가격·이름순)
- Infinite Scroll (IntersectionObserver 기반)
- 카테고리별 자동 이미지 매핑 (백엔드 imageUrl 없을 때 폴백)
- 홈 화면 Explore 섹션: 실시간 상품 수 기준 TOP 3 카테고리 동적 표시

### 장바구니
- 상품 추가 / 수량 +- 조절 (PATCH 연동, 100ms 디바운스로 연타 방지) / 삭제
- 슬라이드인 CartDrawer (우측)
- 장바구니에서 바로 주문 생성

### 주문
- 주문 생성 · 결제 · 취소
- 주문 상태 뱃지 (결제 대기 / 결제 완료 / 배송 중 / 배송 완료 / 취소)
- 어드민 계정: 주문 상세에서 상태 직접 변경

### 위시리스트 / 최근 본 상품
- localStorage 기반, 로그인 불필요
- 상품 카드 하트 버튼 (호버 시 표시)
- 상품 상세 하단 최근 본 상품 섹션 (최대 8개)

### 계정
- 회원가입 / 로그인
- 비밀번호 변경 (`/account`)

---

## 인증 아키텍처

```
브라우저 (JS)
  │  /api/auth/login (POST)
  ▼
Next.js Route Handler          ← 서버에서 토큰 수신
  │  Set-Cookie: access_token (httpOnly, 30분)
  │  Set-Cookie: refresh_token (httpOnly, 7일)
  │  Set-Cookie: has_session   (JS readable, 30분) ← 클라이언트 로그인 상태 확인용
  ▼
브라우저 쿠키 저장

이후 API 요청:
브라우저  →  Next.js Middleware  →  Spring Boot 백엔드
               (httpOnly 쿠키 읽어 Authorization 헤더 자동 주입)
```

**토큰 자동 갱신**: Access Token 만료(401) 시 Axios 인터셉터가 자동으로 `POST /api/auth/refresh`를 호출하고 원래 요청을 재시도합니다. 동시 여러 요청 만료 시 큐잉 처리됩니다.

---

## Getting Started

### 사전 요구사항

- Node.js 20+
- [Commerce 백엔드](https://github.com/HyeJeongHan/Commerce) 실행 중 (기본 포트 8080)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **CORS 처리**: `next.config.ts`의 rewrites 설정으로 `/api/*` 요청을 백엔드로 프록시합니다. 별도의 CORS 설정 없이 동작합니다.

---

## API 연동

| 기능 | 메서드 | 엔드포인트 |
|---|---|---|
| 회원가입 | POST | `/api/auth/signup` |
| 로그인 | POST | `/api/auth/login` |
| 토큰 갱신 | POST | `/api/auth/refresh` |
| 내 정보 | GET | `/api/members/me` |
| 비밀번호 변경 | PUT | `/api/members/password` |
| 상품 목록 | GET | `/api/products?keyword=&categoryId=&minPrice=&maxPrice=` |
| 상품 상세 | GET | `/api/products/{id}` |
| 카테고리 | GET | `/api/categories` |
| 장바구니 조회 | GET | `/api/cart` |
| 장바구니 추가 | POST | `/api/cart/items` |
| 장바구니 수량 수정 | PATCH | `/api/cart/items/{id}` |
| 장바구니 삭제 | DELETE | `/api/cart/items/{id}` |
| 주문 생성 | POST | `/api/orders` |
| 주문 목록 | GET | `/api/orders` |
| 주문 상세 | GET | `/api/orders/{id}` |
| 결제 | POST | `/api/orders/{id}/pay` |
| 주문 취소 | POST | `/api/orders/{id}/cancel` |
| 주문 상태 변경 (어드민) | PATCH | `/api/orders/{id}/status` |

---

## Scripts

```bash
npm run dev        # 개발 서버 (Turbopack)
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버
npm run type-check # TypeScript 타입 검사
npm run lint       # ESLint 검사
```
