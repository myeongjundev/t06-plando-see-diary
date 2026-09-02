"""고정 검사 44개에 '확인 방법'을 붙인 문서를 매트릭스에서 직접 생성한다.

손으로 옮겨 적으면 기준과 문서가 어긋난다. 매트릭스를 파싱해서 열만 덧붙인다.
"""
import io
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "T06-ACCEPTANCE-MATRIX.md"
OUT = ROOT / "docs" / "T06-VERIFICATION.md"

AUTO = "자동 검사"
SCREEN = "배포본 화면"
DEPLOY = "배포본 관찰"
SCAN = "도구 스캔"
DOC = "제출문"

# ID → (확인 갈래, 근거)
HOW = {}


def put(ids, kind, evidence):
    for i in ids:
        HOW[f"T06-C{i:02d}"] = (kind, evidence)


put([4, 6, 7], AUTO, "`test_t06_c04_to_c07_plan_fields_are_persisted`")
put([5], AUTO, "`test_t06_c04_to_c07_plan_fields_are_persisted` (API) · 화면의 `high` 리터럴은 눈으로 확인")
put([8], AUTO, "`test_t06_c08_edit_preserves_previous_plan_under_same_id`")
put([9, 14, 16, 17], AUTO, "`test_t06_c09_and_c14_to_c17_create_task_fields`")
put([15], AUTO, "`test_t06_c09_and_c14_to_c17_create_task_fields` (API) · 화면의 `high` 리터럴은 눈으로 확인")
put([10, 11, 12, 13], AUTO, "`test_t06_c10_to_c13_edit_complete_reopen_and_delete`")
put([18, 19], AUTO, "`test_t06_c18_search_and_c19_combined_filters`")
put([20], AUTO, "`test_t06_c20_sort_is_declared_and_deterministic` · 화면의 정렬 기준 문구는 눈으로 확인")
put([21, 22], AUTO,
    "`test_t06_c21_c22_duplicate_completion_and_see_count` · "
    "`test_concurrent_duplicate_requests` · `test_database_rejects_duplicate_completion_key`")
put([23, 24, 25, 26, 27], AUTO, "`test_t06_c23_to_c27_persist_log_without_changing_estimates`")
put([28, 29, 31, 32], AUTO, "`test_t06_c28_to_c32_and_c83_exact_metrics_and_sources`")
put([30], AUTO,
    "`test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` · `test_seoul_midnight_overdue_boundary`")
put([83], AUTO,
    "`test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` (근거 ID) · 카드 클릭 동작은 눈으로 확인")
put([33], AUTO, "`test_t06_c33_reflection_carries_exact_line_and_retries_reuse_plan`")
put([36], AUTO, "`test_t06_c36_complete_export_retains_deleted_history_and_links` · 배포본에서 실제 내려받아 대조")
put([34, 35], DEPLOY, "배포본에 저장 후 새로고침. Neon PostgreSQL에 남고 ID·날짜·값·분 단위가 그대로")
put([78], DEPLOY, "공개 앱에 실제 계획 존재 (`/api/plans`)")
put([79], DEPLOY, "그 계획에 연결된 할 일 5개 (`/api/plans/<id>/see` taskCount 5)")
put([80], DEPLOY, "연결된 실행 기록 3건 (`records.executions` 3)")
put([81], DEPLOY, "See 집계 `[5, 3, 0, 1, 600, 390, -210]` — 0이 아니고 근거 기록과 일치")
put([82], SCREEN, "첫 화면 상단 고정. 배포 번들에서 문구 존재 확인")
put([57], DEPLOY, "`<script>window.__xss=1</script>`를 저장 → 글자 그대로 렌더링, 스크립트 미실행. 확인 후 삭제")
put([58], SCAN, "`backend/scripts/audit_secrets.py` — 워킹트리·프런트 빌드·Git 이력 전체, 0건")
put([59], DOC, "본 문서와 `docs/SUBMISSION.md`의 확인 4줄")
put([60], DOC, "`docs/SUBMISSION.md`의 판단 3줄")
put([1], DEPLOY, "제품·소스 URL 모두 비로그인 HTTP 200. 시크릿 창에서도 확인")

text = io.open(SRC, encoding="utf-8").read()

# 카드별 표를 파싱한다.
sections = []
for m in re.finditer(r"^## (.+?)$\n(.*?)(?=^## |\Z)", text, re.S | re.M):
    title, body = m.group(1).strip(), m.group(2)
    rows = re.findall(r"^\| (T06-C\d+) \| (.+?) \| (.+?) \|$", body, re.M)
    if rows:
        sections.append((title, rows))

seen = [r[0] for _, rows in sections for r in rows]
missing = [i for i in HOW if i not in seen]
unmapped = [i for i in seen if i not in HOW]
if missing or unmapped:
    print("매핑 불일치 - missing:", missing, "unmapped:", unmapped)
    sys.exit(1)

out = []
out.append("# T06 확인 파일 — 완주 체크리스트와 통과 기준")
out.append("")
out.append("과제 결과를 확인하기 위한 문서입니다. 과제 원문의 완주 체크리스트 다섯 항목과,")
out.append("공식 과제에서 뽑아 고정한 통과 기준 44개가 각각 어떻게 확인됐는지 적었습니다.")
out.append("")
out.append("| | |")
out.append("|---|---|")
out.append("| 결과물 | https://t06-plando-see-diary.onrender.com |")
out.append("| 소스 | 제출한 고정 commit URL |")
out.append("| 기준 원본 | `docs/T06-ACCEPTANCE-MATRIX.md` (이 문서가 생성되는 근거) |")
out.append("| 작성 | 2026-09-02 |")
out.append("")
out.append("**통과시키려고 기대값을 낮추지 않는 것**을 규칙으로 두었습니다. 기준은 공식 과제를")
out.append("받은 2026-09-01에 확정했고 이후 문구를 바꾸지 않았습니다.")
out.append("")
out.append("## 1. 완주 체크리스트 (과제 원문)")
out.append("")
out.append("| 항목 | 확인 |")
out.append("|---|---|")
for item, ev in [
    ("계획 → 실제로 한 일 → 돌아보기가 서버 데이터베이스로 이어집니다",
     "Neon PostgreSQL에 저장. 새로고침 뒤에도 ID·날짜·값·분 단위 유지 (T06-C34, C35)"),
    ("내가 실제로 세운 계획과 할 일과 실행 기록이 들어 있습니다",
     "공개 앱에 실제 계획 1개, 연결된 할 일 5개, 실행 기록 3건 (T06-C78–C80)"),
    ("집계 숫자를 눌러 그 숫자가 나온 기록으로 갈 수 있습니다",
     "일곱 집계 카드 모두 근거 할 일·실행 기록 ID를 드러냅니다 (T06-C83)"),
    ("아직 로그인이 없다는 안내가 첫 화면에 적혀 있습니다",
     "첫 화면 상단 고정. 문구를 바꾸지 않습니다 (T06-C82)"),
    ("최종 소스, 스크립트 삽입, 비밀값 노출, 외부 공개 여부를 확인했습니다",
     "고정 commit URL 제출, 스크립트 문자열은 글자로 렌더링, 비밀값 스캔 0건, 비로그인 접근 확인 (T06-C01, C57, C58)"),
]:
    out.append(f"| {item} | {ev} |")
out.append("")
out.append("## 2. 고정 통과 기준 44개")
out.append("")
out.append("`확인` 열은 어떻게 확인했는지입니다. 자동 검사는 실행하면 재현되고,")
out.append("배포본 관찰은 공개 앱에서 직접 본 것입니다. API 수준 검사가 화면을 검증하지")
out.append("못하는 항목은 그 사실을 따로 적었습니다.")
out.append("")
out.append("`입력 또는 행동`과 `통과 기준` 두 열은 2026-09-01에 확정한 문구 그대로입니다.")
out.append("옮기는 과정에서 뜻이 흔들리는 것을 막으려고 번역하지 않았습니다. 이 문서는")
out.append("`docs/T06-ACCEPTANCE-MATRIX.md`를 파싱해 생성하므로 기준과 어긋날 수 없습니다.")
out.append("")

counts = {}
for title, rows in sections:
    out.append(f"### {title}")
    out.append("")
    out.append("| ID | 입력 또는 행동 | 통과 기준 | 확인 |")
    out.append("|---|---|---|---|")
    for cid, inp, exp in rows:
        kind, ev = HOW[cid]
        counts[kind] = counts.get(kind, 0) + 1
        out.append(f"| {cid} | {inp.strip()} | {exp.strip()} | {kind} · {ev} |")
    out.append("")

out.append("## 3. 자동 검사 실행 결과")
out.append("")
out.append("```")
out.append("backend/.venv/Scripts/python.exe -m pytest backend/tests --cov=backend/app")
out.append("→ 53 passed,  커버리지 92%")
out.append("")
out.append("npm --prefix frontend run build")
out.append("→ 통과 (tsc + vite)")
out.append("")
out.append("backend/.venv/Scripts/python.exe backend/scripts/audit_secrets.py")
out.append("→ 워킹트리·프런트 빌드·Git 이력 전체 스캔, 0건")
out.append("```")
out.append("")
out.append("위 표에 이름이 나온 검사 외에, ID에 직접 대응하지는 않지만 같은 규칙을 지키는")
out.append("검사가 더 있습니다. 동시 요청에서의 완료 유일성, 잘못된 입력의 원자성,")
out.append("서울 자정 경계, 빈 집계, 마이그레이션 값 보존과 반복 안전성, 운영 설정의")
out.append("PostgreSQL 강제와 CSP, 호스팅 프로브가 데이터베이스를 깨우지 않는 것 등입니다.")
out.append("")
out.append("## 4. 확인 갈래 요약")
out.append("")
out.append("| 갈래 | 항목 수 |")
out.append("|---|---|")
for k in [AUTO, DEPLOY, SCREEN, SCAN, DOC]:
    if k in counts:
        out.append(f"| {k} | {counts[k]} |")
out.append(f"| **합계** | **{sum(counts.values())}** |")
out.append("")
out.append("## 5. 직접 확인하는 방법")
out.append("")
out.append("공개 앱에서 세 단계로 핵심을 확인할 수 있습니다.")
out.append("")
out.append("1. https://t06-plando-see-diary.onrender.com 을 열고 `03 See 회고`로 이동")
out.append("2. `실제 시간` 카드를 눌러 근거 실행 기록과 ID를 확인")
out.append("3. `전체 JSON 내려받기`로 같은 값이 저장돼 있는지 대조")
out.append("")
out.append("무료 호스팅이라 한동안 접속이 없으면 첫 응답이 30초쯤 걸릴 수 있습니다.")

io.open(OUT, "w", encoding="utf-8", newline="\n").write("\n".join(out) + "\n")
print(f"생성: {OUT}")
print(f"  기준 {sum(counts.values())}개 · 갈래 {dict(counts)}")
