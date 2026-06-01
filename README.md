# Commerce Web

**Spring Boot 백엔드 기반 온라인 패션 커머스 프론트엔드**

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

---

## Architecture

**Clean Architecture** 4개 레이어로 구성됩니다.

```
src/
├── domain/             # 비즈니스 규칙 (엔티티, 레포지토리 인터페이스)
│   ├── entities/
│   └── repositories/
│
├── application/        # Use Cases (기능 단위 비즈니스 로직)
│   └── use-cases/
│       ├── auth/
│       ├── product/
│       ├── cart/
│       └── order/
│
├── infrastructure/     # 외부 의존성 구현체 (API 클라이언트, 레포지토리)
│   ├── api/
│   └── repositories/
│
├── presentation/       # UI 레이어 (컴포넌트, 훅, 스토어)
│   ├── components/
│   │   ├── layout/     # Header, Footer, CartDrawer
│   │   ├── features/   # 도메인별 컴포넌트
│   │   └── ui/         # 공통 UI 컴포넌트
│   ├── hooks/
│   └── store/
│
├── app/                # Next.js App Router 페이지
└── shared/             # 공통 타입, 유틸, 상수
```

---

## Pages

| 경로 | 설명 |
|---|---|
| `/` | 홈 — 히어로 배너, 카테고리 그리드, 브랜드 섹션 |
| `/products` | 상품 목록 — 카테고리 필터, 검색, 페이지네이션 |
| `/products/[id]` | 상품 상세 — 이미지, 설명, 재고, 장바구니 담기 |
| `/login` | 로그인 |
| `/signup` | 회원가입 |
| `/orders` | 주문 목록 (로그인 필요) |
| `/orders/[id]` | 주문 상세 — 결제, 취소 |

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

백엔드의 모든 엔드포인트와 연동됩니다.

| 기능 | 엔드포인트 |
|---|---|
| 회원가입 | `POST /api/auth/signup` |
| 로그인 | `POST /api/auth/login` |
| 내 정보 | `GET /api/members/me` |
| 상품 목록 | `GET /api/products` |
| 상품 상세 | `GET /api/products/{id}` |
| 카테고리 | `GET /api/categories` |
| 장바구니 조회 | `GET /api/cart` |
| 장바구니 추가 | `POST /api/cart/items` |
| 장바구니 삭제 | `DELETE /api/cart/items/{id}` |
| 주문 생성 | `POST /api/orders` |
| 주문 목록 | `GET /api/orders` |
| 주문 상세 | `GET /api/orders/{id}` |
| 결제 | `POST /api/orders/{id}/pay` |
| 주문 취소 | `POST /api/orders/{id}/cancel` |

### 인증

로그인 성공 시 JWT Access Token을 쿠키에 저장하고, Axios 인터셉터가 모든 요청 헤더에 자동으로 첨부합니다. 401 응답 시 자동으로 로그인 페이지로 리다이렉트됩니다.

---

## Scripts

```bash
npm run dev        # 개발 서버 (Turbopack)
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버
npm run type-check # TypeScript 타입 검사
npm run lint       # ESLint 검사
```
