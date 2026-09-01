# T06 decision log

Record material decisions here. Do not rewrite old decisions; add a superseding row.

| ID | Status | Decision | Reason | Affected requirements |
|---|---|---|---|---|
| D-001 | Active | Keep the project in preparation mode until the official card is reconciled. | Preliminary material conflicts with the course overview. | All |
| D-002 | Active | Use only synthetic or masked data in public and submitted artifacts. | The preliminary assignment explicitly keeps real records on the PC. | Privacy, five-day use |
| D-003 | Candidate | Prefer React + Flask + SQLAlchemy + PostgreSQL if server DB remains required. | Keeps the existing frontend workflow while adding an independently testable Python API. | Storage, deployment |
| D-004 | Candidate | Use study-session minutes as the diary subject. | Easy daily use and a clear single unit, but this remains the user's decision. | Fields, summary |
| D-005 | Active | Supersede D-001: begin implementation after reconciling the official source received on 2026-09-01. | The final five cards and 44 acceptance IDs are now available. | All |
| D-006 | Active | Supersede D-003: use React + Vite, Flask + SQLAlchemy, and PostgreSQL; tests may substitute SQLite in memory. | The assignment requires a real server database, and the user chose Flask for this project. | T06-C04–T06-C36, T06-C78–T06-C83 |
| D-007 | Active | Supersede D-004: use “T06 프로젝트 완주” as the initial real plan and minutes as the only duration unit. | It is genuine current work, safe to disclose when phrased without secrets, and directly supports Plan→Do→See. | T06-C07, T06-C17, T06-C25, T06-C32, T06-C78–T06-C81 |
| D-008 | Active | Use UUID primary keys, UTC database timestamps, and `Asia/Seoul` display and overdue rules. | IDs must survive refresh and Seoul-date comparisons must be deterministic. | T06-C04, T06-C14, T06-C23–T06-C24, T06-C30, T06-C35 |
| D-009 | Active | Enforce duplicate completion prevention with a client-supplied idempotency key and a database unique constraint. | Button disabling alone does not satisfy the official duplicate-click requirement. | T06-C21–T06-C22 |
| D-010 | Active | Use soft deletion for tasks so current counts exclude them while historical evidence remains traceable. | The See task count explicitly excludes deleted tasks and drill-down needs stable records. | T06-C13, T06-C28, T06-C83 |
