# 학원 PC에서 이어하기 — 2026-09-02

## 1. 목표

집에서 완료한 T06 구현·디자인·사용성 개선을 학원 PC에서 이어서 검증하고 제출 준비를 마친다.
지금은 카드 3을 새로 구현할 단계가 아니다. 카드 1~5 구현과 공개 배포가 끝났으며,
실제 사용 기록과 제출 검증이 남아 있다.

## 2. 현재 상태와 완료 작업

- 저장소: https://github.com/myeongjundev/t06-plando-see-diary
- 이어갈 브랜치: **main**. 예전 `design/css-token-layer` 대신 최신 main을 받는다.
- 공개 앱: https://t06-plando-see-diary.onrender.com
- 배포 구성: Render Free 웹 서비스 + Neon Free PostgreSQL, 두 서비스 모두 Oregon.
- Render는 main 변경 시 자동 배포한다. 배포 설정은 `docs/RENDER-NEON.md` 참고.
- 마지막 확인한 앱 코드: `92a115672a5a07068f6a97f99c625c9fe2f29eee`.
  이후 커밋은 문서 정리이며 현재 상태는 `git log -5 --oneline`으로 확인한다.

완료 기능:

- Plan: 계획 저장, UUID 유지, 예상 시간 수정 및 이전 값 이력 보존.
- Tasks/Do: 할 일 생성·수정·완료·되돌리기·삭제·검색·필터, 실행 시각·실제 분·막힌 이유 저장.
- 완료 요청 중복은 키와 DB 제약으로 방지한다.
- See: 7개 집계와 집계에 사용된 할 일/실행 기록 ID 확인, 회고와 다음 계획 연결.
- 전체 JSON 내보내기, Docker 배포, PostgreSQL 저장, 공개 안내 및 보안 헤더.
- Claude 디자인 브랜치를 리뷰 후 main에 통합했다. Gothic A1 글꼴은 앱에 포함했고
  외부 글꼴 차단 문제를 해결했다. 정렬 기준/근거 ID는 더 진한 13px 글씨로 표시한다.
- 저장된 계획을 먼저 보여준다. 새 계획 폼은 버튼으로 열며, 계획이 없으면 바로 표시한다.
- 상단 **현재 계획** 선택 하나가 Do와 See에 공통 적용된다.
- 고정된 Plan/Do/See 이동 메뉴로 단계 사이를 이동해도 같은 계획의 작성 중 내용은 유지된다.
  다른 계획을 선택하면 할 일 입력·필터 등은 초기화된다. 선택 계획 자체를 새로고침 후까지
  기억하는 기능은 추가하지 않았다.
- 새 계획 저장 후 Do로 이동하고, 회고에서 다음 계획 생성/링크 이동 시 해당 계획을 선택한다.
- 320px 모바일에서도 실행 시각 입력칸이 카드 밖으로 나가지 않도록 수정했다.

## 3. 학원 PC 실행 방법

Git, Node.js 24, Python 3.12를 준비한다. 공개 앱만 확인할 때는 로컬 설치가 필요 없다.

처음 받는 PC에서는 원하는 작업 폴더에서:

```powershell
git clone https://github.com/myeongjundev/t06-plando-see-diary.git
cd t06-plando-see-diary
git switch main
```

이미 저장소가 있다면 해당 폴더에서 아래 명령을 실행한다. 로컬 변경이 있으면 먼저 확인하고
보존한다. 강제 초기화로 덮어쓰지 않는다.

```powershell
git status --short
git switch main
git pull --ff-only origin main
git log -5 --oneline
```

로컬 개발은 운영 Neon DB와 별개인 SQLite를 사용한다. 운영 비밀번호가 필요 없다.
첫 번째 PowerShell 터미널에서 저장소 루트를 기준으로:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
$env:REQUIRE_POSTGRES = "0"
.\.venv\Scripts\flask.exe --app app:create_app db upgrade
.\.venv\Scripts\flask.exe --app app:create_app run --host 127.0.0.1 --port 5000
```

두 번째 PowerShell 터미널에서 저장소 루트를 기준으로:

```powershell
cd frontend
npm ci
npm run dev -- --host 127.0.0.1
```

5000번을 다른 앱이 쓰고 있으면 Flask가 뜨지 않거나 `/api` 요청이 엉뚱한 앱으로 간다.
그때는 백엔드 포트를 바꾸고 프런트에 그 주소를 알려 준다. 첫 번째 터미널에서
`--port 5055`로 띄우고, 두 번째 터미널에서 `npm run dev` 앞에 아래 줄을 먼저 실행한다.

```powershell
$env:T06_API_TARGET = "http://127.0.0.1:5055"
```

이 변수는 개발 서버에만 쓰인다. 배포본은 Flask가 API와 화면을 같은 출처에서 서빙해서
프록시가 아예 없다.

브라우저에서 http://127.0.0.1:5173 을 연다. 로컬 DB는 처음에는 비어 있으며
`backend/instance/t06.db`에 저장된다. 집의 로컬 데이터가 Git으로 이동되지는 않는다.
클라우드에 저장된 데이터는 공개 앱에서 확인한다.

검사 명령은 저장소 루트에서:

```powershell
backend/.venv/Scripts/python.exe -m pytest backend/tests -q
npm --prefix frontend run build
git diff --check
```

기존 문서의 `tmp/review_design_server.py`, `tmp/verify_flow_deploy.py`는 집 PC의
임시 검증 도구여서 clone에 포함되지 않는다. 학원에서는 위 표준 실행 방법을 사용한다.

## 4. 확인한 결과

- 마지막 코드 작업에서 프런트엔드 빌드와 백엔드 테스트 **53개 통과**.
- 합성 데이터로 계획 A/B 선택 시 Do와 See 범위가 함께 바뀌는 것 확인.
- Do → See → Do 이동 후 작성 중인 할 일 유지 확인.
- 빈 화면에서 첫 계획 저장, Do로 자동 이동, 새로고침 후 저장된 계획 유지 확인.
- 모바일에서 실행 25분 저장 후 See 실제 시간 갱신, 원래 예상 시간 유지 확인.
- 회고 문장 그대로 다음 계획에 전달, 자동 선택 및 기존 다음 계획 링크 동작 확인.
- 320px 화면에서 가로 넘침 없음, 시각 입력칸이 카드 내부에 위치함을 확인.
- 배포 앱의 새 JS/CSS, 글꼴, 라이선스 파일 응답 및 PostgreSQL health 확인.
  마지막 앱 자산은 `index-DnSTSqUZ.js`, `index-Dr1DAnWc.css`였다.

이 결과는 전체 44개 요구사항에 대한 최종 제출 승인과 다르다.
이번 인수인계 문서 작업에서는 코드 테스트를 다시 돌리지 않았다.

## 5. 미완료·주의할 점

- 공개 앱에서 저장 → 새로고침 → 집계 근거 → 전체 JSON의 값/ID 일치 최종 확인.
- 시크릿 창에서 제품 주소와 전체 커밋 소스 주소가 인증 없이 열리는지 확인.
- 본인의 실제이면서 공개해도 되는 계획 1개, 할 일 5개, 실행 기록 3개 이상 및 0이 아닌 집계.
  충족 여부를 아직 확정하지 않았다. 합성 테스트 기록으로 대체하지 않는다.
- `docs/SUBMISSION.md`의 검증 4줄과 본인 판단/거절한 제안 및 이유 작성.
- 선택 개선안 4번인 **집계 숫자의 자연어 설명**은 아직 구현하지 않았다.
  추가한다면 음수 차이를 무조건 시간 절약으로 판정하지 않는다. 미완료 기록이 있을 수 있다.
- 기존 Flask-SQLAlchemy `get_engine` 폐기 예정 경고 12개가 있으며 테스트 실패는 아니다.

## 6. 다음 작업 순서와 이어가기 프롬프트

먼저 공개 앱의 현재 기록과 저장/새로고침/집계/JSON 동작을 확인한다.
그다음 부족한 실제 사용 기록과 제출 문구를 사용자와 채운다.
추가 기능은 위 미완료 목록과 구분해서 진행한다.

학원의 Codex/Claude에 다음 내용을 전달하면 된다:

```text
T06 작업을 이어서 진행해줘. 최신 main을 기준으로
AGENTS.md, docs/ACADEMY-HANDOFF.md, docs/STATUS.md,
docs/REQUIREMENTS.md, docs/DECISIONS.md, docs/HANDOFF.md를 먼저 읽어.
카드 1~5 구현과 Render + Neon 배포, 디자인 및 사용성 개선 1~3번은 완료됐어.
공개 앱은 https://t06-plando-see-diary.onrender.com 이야.
우선 현재 상태와 남은 제출 검증을 확인하고 이어서 진행해줘.
실제 기록과 사용자 판단은 임의로 만들어 넣지 마.
```

## 7. 유지해야 할 기준

- `docs/T06-ACCEPTANCE-MATRIX.md`의 고정 검사 44개를 완화하지 않는다.
- T06 로그인 기능은 추가하지 않는다. 공개 안내문 원문을 유지한다.
- UUID, 수정 이력, 분 단위, 시간대/서울 날짜 규칙, 중복 완료 방지 및 집계 근거를 유지한다.
- 운영 DB 연결 문자열은 Render/Neon 설정에서 관리한다. `.env`, 비밀번호,
  개인 데이터, 내려받은 개인 JSON, 로컬 DB를 저장소나 대화에 넣지 않는다.
- 무료 Render/Neon의 유휴 중지를 유지한다. 별도 GCP VM이나 깨워두기 작업은 필요 없다.
- `docs/HANDOFF.md` 아래 Historical 부분의 오래된 계정 설정 대기 문구는 현재 상태가 아니다.

## 8. 주요 파일

- `frontend/src/App.tsx`: 공통 계획 선택, 계획 폼, 단계 이동.
- `frontend/src/features/tasks/TaskPanel.tsx`: 할 일과 실행 기록 배치.
- `frontend/src/features/tasks/ExecutionPanel.tsx`: 실행 입력/이력.
- `frontend/src/features/see/SeePanel.tsx`: 집계·근거·회고·다음 계획.
- `frontend/src/styles.css`: 디자인 토큰·반응형·단계 메뉴.
- `docs/RENDER-NEON.md`: 현재 배포 방법.
- `docs/SUBMISSION.md`: 제출 초안 및 제품/전체 커밋 URL.
- `docs/REVIEW-CSS-TOKEN-LAYER.md`: 디자인 리뷰와 해결 내역.

## 9. Git 상태

- 이번 인수인계 정리 시작점: `113d02f`, 브랜치 `main`.
- 마지막 기능 코드 커밋: `92a115672a5a07068f6a97f99c625c9fe2f29eee`.
- 이번 변경은 인수인계 문서와 문서 안내만 포함한다. 앱 코드는 변경하지 않는다.
- 최신 인수인계 커밋까지 origin/main에 푸시한 뒤 학원 PC에서는 main을 pull한다.
