# 학원 PC에서 이어하기 — 2026-09-03

집 PC에서 UI 한 벌을 손보고 배포·태그까지 올린 상태입니다. **남은 것은 제출 폼에
붙여 넣는 일 하나**이고, 나머지는 선택 작업입니다.

앞선 [ACADEMY-HANDOFF.md](ACADEMY-HANDOFF.md)는 2026-09-02 시점 기록입니다. 어긋나면
이 문서가 맞습니다.

## 1. 목표

제출 폼에 두 URL과 두 블록을 붙여 넣어 T06을 제출한다. 그 전에 「AI와 내 판단 3줄」을
본인 문장으로 다듬는다.

구현·배포·검증은 끝났습니다. 새로 만들 카드는 없습니다.

## 2. 현재 상태

- 저장소: <https://github.com/myeongjundev/t06-plando-see-diary> · 브랜치 **main** 하나
- 공개 앱: <https://t06-plando-see-diary.onrender.com>
- `main` = `origin/main` = 태그 `t06-submission` = **`ae4dad89fc6a550e23893e0592e02770c46cb939`**
- 배포 에셋 `index-MZVl8FZ4.js` · `index-CGU0rIJc.css` — `docs/SUBMISSION.md`의 기록과 일치
- 백엔드 테스트 **53개 통과**, 프런트 운영 빌드 통과, `git diff --check` 깨끗
- Render는 `main` 변경 시 자동 배포합니다. 문서만 바꾸면 번들 해시는 그대로입니다.

`design/css-token-layer` 브랜치는 지웠습니다. `main`에 완전히 병합돼 있었고 6,180줄
뒤처져 있었습니다. 되살리려면
`git branch design/css-token-layer d9b23a077b640a6cf4e02be92c356781f52dc958`.

## 3. 학원 PC 실행 방법

```bash
git clone https://github.com/myeongjundev/t06-plando-see-diary.git
cd t06-plando-see-diary
```

백엔드:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
$env:REQUIRE_POSTGRES = "0"
.\.venv\Scripts\flask.exe --app app:create_app db upgrade
.\.venv\Scripts\flask.exe --app app:create_app run --host 127.0.0.1 --port 5055
```

프런트엔드(다른 터미널):

```powershell
cd frontend
npm ci
$env:T06_API_TARGET = "http://127.0.0.1:5055"
npm run dev -- --port 5180
```

**포트 5055를 쓰는 이유**는 집 PC에서 5000번을 다른 앱이 잡고 있었기 때문입니다. 학원
PC에서 5000번이 비어 있으면 기본값 그대로 둬도 되고, 그때는 `T06_API_TARGET`도 필요
없습니다.

검사:

```powershell
backend\.venv\Scripts\python.exe -m pytest backend\tests
npm --prefix frontend run build
```

### 로컬 데이터는 따라오지 않습니다

`backend/instance/`는 `.gitignore` 대상이라 **새 PC에는 계획이 하나도 없습니다.**
화면을 보려면 앱에서 직접 몇 개 만들거나, README 스크린샷과 같은 합성 자료를 심습니다:

```powershell
python tools\seed_screenshot_fixture.py
```

집계가 `할 일 5 · 완료 3 · 지연 1 · 막힘 2 · 예상 300분 · 실제 260분 · 차이 -40분`으로
떨어지도록 마감일을 오늘 기준 상대로 잡습니다. README의 대체 텍스트가 그 숫자입니다.

> 집 PC의 로컬 DB 백업 두 개(`t06.db.bak`, `t06.db.shots`)는 임시 폴더에 있어
> **학원 PC에는 없습니다.** 필요하면 위 시더로 다시 만듭니다.

## 4. 2026-09-02~03에 한 일

커밋 15개(`1180c8d..ae4dad8`). 화면 변경 8개, 문서 7개입니다.

| 커밋 | 내용 |
|---|---|
| `0700967` | 계획 목록의 우선순위 필터를 정렬로 교체 (최신순·중요도순·마감 임박순) |
| `644a46f` | 완료한 할 일을 취소선 대신 초록 배경으로 |
| `9348587` | 할 일 목록도 계획 목록과 같은 19rem에서 안으로 스크롤 |
| `7a7c827` | 날짜 입력 7개를 직접 만든 달력으로 교체 |
| `c55bc36` | 실행 기록 시각도 같은 피커로 (`withTime`) |
| `43f32fb` | 게이지 기준선을 60%에 고정하고 눈금 대신 이음매로 |
| `9b13138` | 오래된 회고를 「이전 회고 N건 더 보기」 뒤로 접기 |
| `af96e10` | `select` 7개를 직접 만든 목록으로 교체, 계획 고르기에 검색 |
| 문서 7개 | STATUS·DECISIONS(D-045~D-054)·SUBMISSION·DESIGN·README·스크린샷 |

**앱에 네이티브 날짜·시각·드롭다운 컨트롤이 0개입니다.** 전부
`frontend/src/components/`의 `DateField.tsx`와 `Select.tsx`로 그립니다.

검증하며 고친 실제 결함 넷:

- `pattern`만으로는 `2026-02-31`이 폼 검증을 통과했습니다 → `setCustomValidity`
- 옆 달 날짜 대비가 2.14:1(라이트)이었습니다 → 투명도를 빼 4.84:1
- 화살표 연타가 한 칸만 움직였습니다(`DateField`·`Select` 둘 다) → 갱신 함수 형태로
- 회고 토글이 펼친 뒤 사라져 다시 접을 수 없었습니다 → 건수를 펼침 여부와 분리

## 5. 남은 일

### 반드시 (제출)

1. **「AI와 내 판단 3줄」을 본인 문장으로 다듬는다.** 지금 글은 어시스턴트가 쓴 것이고,
   `D-019`상 이 세 줄은 본인 판단이어야 합니다. 특히 «같은 종류가 둘로 갈리지 않게
   한다»는 대화에서 관찰한 걸 문장으로 만든 것이라, 실제 기준이 그게 맞는지는 본인만
   압니다. → [`../SUBMISSION.md`](../SUBMISSION.md)의 「AI와 내 판단 3줄」 블록
2. **폼에 붙여 넣는다.**
   - 결과물 URL: `https://t06-plando-see-diary.onrender.com`
   - 소스 URL: `https://github.com/myeongjundev/t06-plando-see-diary/commit/ae4dad89fc6a550e23893e0592e02770c46cb939`
   - 나머지 두 블록은 `docs/SUBMISSION.md`에 원문 그대로 있습니다.

> 소스 URL은 **태그가 가리키는 커밋의 40자 전체 해시**여야 합니다. 폼이 브랜치나
> 저장소 첫 화면을 거부합니다. 커밋을 더 올렸다면 태그를 옮기고 새 해시를 쓰세요.

### 선택

- 공개 앱 계획 목록에 `업데이트 테스트`가 남아 있습니다. 계획 삭제 API가 없어 지우려면
  Neon을 직접 건드려야 하고, 채점 경로(3단계)에 걸리지 않아 **그냥 두기로** 했습니다.
- 회고 목록 접기는 넣었지만, 계획 목록·할 일 목록과 달리 높이 상한은 없습니다.
  회고 카드가 펼쳐지면 「다음 계획」 폼이 되기 때문입니다(D-052).

## 6. 유지해야 할 기준

건드리면 채점에 걸립니다.

| 요소 | 기준 |
|---|---|
| 첫 화면 공개 안내문 | T06-C82, 원문 그대로 |
| `high`/`medium`/`low` 리터럴 | T06-C05·C15. `.priority`에 `text-transform` 재도입 금지 |
| Do 정렬 기준 문구 | T06-C20. `우선순위(높음→보통→낮음) → 마감일 → 생성 시각 → ID` |
| 집계마다 근거 ID 도달 | T06-C83 |
| 차이의 ASCII 하이픈 | T06-C32 |
| 성공 기준 원문 | T06-C06 |

그 밖에:

- 실제 일기 자료는 저장소·스크린샷·테스트에 넣지 않습니다(AGENTS 3번). 스크린샷은
  반드시 로컬 합성 자료로 찍습니다.
- 네이티브 `select`나 날짜 입력을 「일관성」을 이유로 되돌리지 않습니다. 한 화면에
  드롭다운이 두 종류인 상태가 이번에 없앤 것입니다(D-054).
- `docs/T06-VERIFICATION.md`는 손으로 고치지 않고 `python tools/generate_verification.py`로
  다시 만듭니다.

## 7. 주요 파일

| 경로 | 내용 |
|---|---|
| `frontend/src/components/DateField.tsx` | 달력·시각 피커. `withTime`이면 시/분/초 줄 |
| `frontend/src/components/Select.tsx` | 드롭다운. `searchable`이면 목록 안 검색 |
| `frontend/src/lib/date.ts` | 날짜 문자열 연산과 `seoulToday()`·`seoulNow()` |
| `frontend/src/features/plans/PlanGauge.tsx` | 고정 기준선 게이지 |
| `tools/seed_screenshot_fixture.py` | 스크린샷용 합성 자료 시더 |
| `tools/capture_screenshots.mjs` | 스크린샷 생성기. `prepare`로 펼친 상태도 찍습니다 |
| `docs/SUBMISSION.md` | 제출 주소와 붙여 넣을 문구 |
| `docs/DECISIONS.md` | D-045~D-054가 이번 작업 |

## 8. 스크린샷을 다시 찍어야 할 때

화면을 바꾸면 README 사진이 어긋납니다. 순서:

1. 로컬 DB를 비우고 `python tools/seed_screenshot_fixture.py`
2. 백엔드와 `npm run dev` 실행
3. 헤드리스 크롬: `chrome --headless=new --remote-debugging-port=9222 --user-data-dir=<임시>`
4. `SHOTS='[...]' node tools/capture_screenshots.mjs http://localhost:5180/ docs/screenshots`

`SHOTS` 항목은 `name`, `theme`, `selector?`, `pad?`, `maxHeight?`, `height?`,
`prepare?`, `settle?`입니다. 접힌 것을 펼쳐 찍으려면 `prepare`에 클릭 식을 넣습니다.

## 9. Git 상태

- 시작 커밋: `1180c8d` (2026-09-02 밤)
- 끝 커밋: **`ae4dad89fc6a550e23893e0592e02770c46cb939`**, `origin/main`과 태그가 같음
- 미커밋 경로: 없음
- 원격 ref: `refs/heads/main`, `refs/tags/t06-submission` 둘뿐
- 저장소 설명·홈페이지·토픽을 GitHub에서 갱신했습니다(설명이 「skeleton」이라고 적혀
  있었습니다).
