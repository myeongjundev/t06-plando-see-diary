# Flask 구조 초안

상태: **선택 후보 / 공식 과제 공개 전 구현 금지**

## 권장 구성

공식 과제에서 서버 DB가 유지되면 다음 구성을 사용한다.

- Frontend: React + Vite
- API: Flask
- ORM: SQLAlchemy
- Production DB: PostgreSQL
- Validation: 명시적 요청·파일 스키마 검사
- Timezone: `Asia/Seoul`
- Export format: JSON

서버 DB가 필수가 아니고 실제 기록을 반드시 PC에만 두라고 확정되면 두 가지 모드로
분리한다.

- 공개 배포: 합성 데이터 전용 Flask 데모 저장소
- 개인 사용: 로컬 Flask + 로컬 DB

로그인 없는 공개 서버에는 실제 개인 기록을 저장하지 않는다.

## 데이터 구조 후보

### v1

| 필드 | 타입 | 규칙 |
|---|---|---|
| schemaVersion | integer | `1` |
| id | UUID string | 고유·불변 |
| occurredAt | ISO 8601 string | 시간대 포함 |
| timezone | string | `Asia/Seoul` |
| item | string | 공백 제외 1자 이상 |
| value | number | 유한한 0 이상 값 |
| unit | string | 항목별 고정 단위 |
| memo | string | 선택, 공개 자료에는 합성 문구 |

### v2 후보

v1 필드를 모두 유지하고 다음 하나를 추가한다.

| 필드 | 타입 | 기본값 | 용도 |
|---|---|---|---|
| tag | string | `general` | 기록 분류와 마이그레이션 증명 |

## API 후보

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/records` | 목록 조회 |
| POST | `/api/records` | 한 건 생성 |
| PATCH | `/api/records/:id` | 정확한 ID 한 건 수정 |
| DELETE | `/api/records/:id` | 정확한 ID 한 건 삭제 |
| GET | `/api/summary/weekly` | KST 주간 요약 |
| GET | `/api/export` | 검증 가능한 JSON 내보내기 |
| POST | `/api/import/validate` | 반영 전 전체 파일 검사 |
| POST | `/api/import/apply` | 검증된 파일 원자적 반영 |
| DELETE | `/api/records` | 명시적 확인 뒤 전체 삭제 |
| GET | `/api/schema` | 현재 schemaVersion·변환 상태 |

## 안전한 가져오기 흐름

1. 파일 크기와 JSON 문법 검사
2. schemaVersion 판정
3. 모든 행의 필수 필드·타입·날짜·UUID 검사
4. v1이면 메모리에서 v2로 변환
5. 중복 ID 처리 규칙 적용
6. 전체 검사가 통과한 경우에만 트랜잭션 반영
7. 실패하면 기존 DB를 전혀 바꾸지 않고 행 번호와 이유 반환

## 집계 규칙 초안

- 기준 시간대: `Asia/Seoul`
- 주 시작: 월요일 00:00:00
- 주 종료: 다음 월요일 00:00:00 미만
- 잘못된 날짜·NaN·Infinity·숫자 문자열은 집계 전에 제외
- 단위가 다른 기록은 같은 합계에 섞지 않음
- 중복 UUID는 저장 단계에서 차단

## T07 확장 대비

T06에서 인증을 구현하지 않는다. 다만 공식 요구가 허용하면 내부 테이블에 추후
`owner_id`를 추가할 수 있도록 저장소 계층을 분리한다. 공개 API에 가짜 사용자 ID를
노출하거나 인증된 것처럼 표현하지 않는다.

## 공식 공개 뒤 결정할 것

- PostgreSQL 사용 여부
- React 분리형 또는 Flask Jinja 단일 앱
- 공개 데모의 데이터 초기화 정책
- Plan·Do·See를 별도 엔터티로 나눌지 여부
- 계약 파일의 정확한 경로와 JSON Schema 형식
- 배포 서비스와 DB 백업 정책

