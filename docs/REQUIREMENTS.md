# T06 requirements

Status: **PRELIMINARY — official assignment not reconciled**

## Current source

This document currently reflects the instructor's preliminary five-card material.
The broader course overview differs on planned hours, server DB, Plan→Do→See scope,
and the required data-contract file. Do not treat disputed items as final.

## Stable requirements from the preliminary material

- Synthetic records support create, read, update, and delete.
- Editing data updates the list and related summary together.
- Records survive refresh.
- JSON export, import/restore, and delete-all are visible.
- Invalid import shows a reason and does not alter existing records.
- v1 data migrates to v2 without losing ID, date, value, or unit.
- Running migration twice does not duplicate or re-change data.
- Weekly summaries document their period and exclude invalid dates or values.
- Five distinct real dates of private use are recorded locally.
- Public and submitted evidence contains no real personal record or secret.

## Unresolved until the official card opens

- Planned effort: 5–6h or 8–10h
- Flask/PostgreSQL server DB requirement
- Full Plan → Do → See entity model
- Required `contracts/pds-schema-v2.json`
- Exact submission URL and file fields
- Start date and evidence contract for five-day use

## Reconciliation checklist

When the official assignment opens:

1. Save its original text in the repository.
2. Compare every card with `docs/T06-PRELIMINARY-ANALYSIS.md`.
3. Resolve every item above and record the decisions.
4. Assign stable acceptance IDs with input and observable expectation.
5. Change this status to `OFFICIAL — reconciled on YYYY-MM-DD` before implementation.

