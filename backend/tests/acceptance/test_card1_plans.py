from uuid import UUID


PLAN = {
    "title": "T06 프로젝트 완주",
    "startDate": "2026-09-01",
    "endDate": "2026-09-07",
    "priority": "high",
    "successCriterion": "44개 검사 통과",
    "estimatedMinutes": 600,
    "carriedImprovement": None,
}


def create_plan(client):
    response = client.post("/api/plans", json=PLAN)
    assert response.status_code == 201
    return response.get_json()["plan"]


def test_t06_c04_to_c07_plan_fields_are_persisted(client):
    created = create_plan(client)
    UUID(created["id"])

    fetched = client.get(f"/api/plans/{created['id']}")
    assert fetched.status_code == 200
    plan = fetched.get_json()["plan"]
    assert plan["startDate"] == "2026-09-01"  # T06-C04
    assert plan["endDate"] == "2026-09-07"  # T06-C04
    assert plan["priority"] == "high"  # T06-C05
    assert plan["successCriterion"] == "44개 검사 통과"  # T06-C06
    assert plan["estimatedMinutes"] == 600  # T06-C07
    assert plan["durationUnit"] == "minutes"  # T06-C07


def test_t06_c08_edit_preserves_previous_plan_under_same_id(client):
    created = create_plan(client)
    plan_id = created["id"]

    response = client.patch(f"/api/plans/{plan_id}", json={"estimatedMinutes": 540})
    assert response.status_code == 200
    assert response.get_json()["plan"]["id"] == plan_id
    assert response.get_json()["plan"]["estimatedMinutes"] == 540

    history = client.get(f"/api/plans/{plan_id}/revisions")
    assert history.status_code == 200
    revisions = history.get_json()["revisions"]
    assert len(revisions) == 1
    assert revisions[0]["planId"] == plan_id
    assert revisions[0]["estimatedMinutes"] == 600


def test_invalid_date_order_is_rejected_without_mutation(client):
    created = create_plan(client)
    plan_id = created["id"]

    response = client.patch(f"/api/plans/{plan_id}", json={"endDate": "2026-08-31"})
    assert response.status_code == 400
    assert "endDate" in response.get_json()["error"]["details"]

    plan = client.get(f"/api/plans/{plan_id}").get_json()["plan"]
    assert plan["endDate"] == "2026-09-07"
    assert client.get(f"/api/plans/{plan_id}/revisions").get_json()["revisions"] == []

