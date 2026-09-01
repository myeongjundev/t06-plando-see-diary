# T06 · 플랜두씨 다이어리 1

상태: **기능 구현·공개 배포 완료 · 최종 제출 검증 진행 중**

학원 PC에서 이어가기: [인수인계와 실행 방법](docs/ACADEMY-HANDOFF.md).
공개 앱: https://t06-plando-see-diary.onrender.com

계획(Plan) → 실제로 한 일(Do) → 돌아보기(See)를 하나의 흐름으로 연결하는
공개 다이어리입니다. React 화면, Flask API, PostgreSQL 서버 데이터베이스로
구성하며 T06에서는 인증을 구현하지 않습니다.

## 확정 기능

- 기간·우선순위·성공 기준·예상 시간이 있는 계획과 수정 이력
- 계획에 연결된 할 일 CRUD·완료·되돌리기·검색·필터·고정 정렬
- 시작·종료·실제 시간·막힌 이유를 담는 실행 기록
- 중복 완료 요청을 데이터베이스 제약으로 한 번만 반영
- 계획·완료·지연·막힘·예상·실제·차이 집계와 근거 기록 이동
- 돌아보기의 개선점 한 줄을 다음 계획으로 전달
- 서버 DB 영구 저장과 전체 JSON 내보내기
- 공개 안내, XSS 방어, 비밀값 비노출

## 기술 구성

- Frontend: React + Vite + TypeScript
- Backend: Flask + SQLAlchemy + Alembic
- Database: PostgreSQL
- Test: Pytest, frontend build, browser acceptance checks
- Timezone: UTC 저장, `Asia/Seoul` 표시·날짜 판정
- Duration unit: minutes

## 기준 문서

- `docs/source/T06-OFFICIAL-ASSIGNMENT.md` — 공식 과제 원문
- `docs/REQUIREMENTS.md` — 확정 요구사항
- `docs/T06-ACCEPTANCE-MATRIX.md` — 고정 검사 44개
- `docs/FLASK-ARCHITECTURE.md` — 구현 구조
- `contracts/pds-schema-v2.json` — 데이터 계약
- `docs/STATUS.md` — 현재 상태와 다음 행동
- `docs/DEVELOPMENT.md` — 로컬 실행과 검사 명령
- `docs/HANDOFF.md` — Claude·Codex 인수인계 상태

## 공개 데이터 주의

T06에는 로그인이 없습니다. 배포 화면에는 남이 봐도 괜찮은 실제 작업 기록만
입력하고, 저장소·테스트·제출 증거에는 합성 자료만 사용합니다. 인증은 T07에서
추가합니다.
