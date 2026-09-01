from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from threading import Barrier

from flask_migrate import upgrade

from app import create_app
from app.extensions import db
from test_card2_tasks import create_plan, create_task
from test_card3_executions import LOG, KEY
from test_card4_see import NEXT, REFLECTION


def test_card4_upgrade_preserves_logs_and_concurrent_next_plan_is_single(tmp_path):
    app = create_app({"TESTING": True, "SQLALCHEMY_DATABASE_URI": f"sqlite:///{(tmp_path / 'card4.db').as_posix()}"})
    migrations = str(Path(__file__).resolve().parents[2] / "migrations")
    try:
        with app.app_context():
            upgrade(directory=migrations, revision="fb630bb3ebd6")
        client = app.test_client()
        plan = create_plan(client)
        task = create_task(client, plan["id"])
        log = client.post(f"/api/tasks/{task['id']}/executions", json=LOG).json["execution"]
        event = client.post(f"/api/tasks/{task['id']}/complete", json=KEY).json["completionEvent"]
        with app.app_context():
            upgrade(directory=migrations)
            upgrade(directory=migrations)
        assert client.get(f"/api/tasks/{task['id']}/executions").json["executions"] == [log]
        assert client.get(f"/api/tasks/{task['id']}/completions").json["completionEvents"] == [event]
        assert client.get(f"/api/plans/{plan['id']}").json["plan"] == plan
        row = client.post(f"/api/plans/{plan['id']}/reflections", json=REFLECTION).json["reflection"]
        barrier = Barrier(4)

        def create(_):
            with app.test_client() as worker:
                barrier.wait(timeout=10)
                return worker.post(f"/api/reflections/{row['id']}/next-plan", json=NEXT)

        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(create, range(4)))
        assert sorted(result.status_code for result in results) == [200, 200, 200, 201]
        assert len({result.json["plan"]["id"] for result in results}) == 1
        assert len(client.get("/api/plans").json["plans"]) == 2
    finally:
        with app.app_context():
            db.session.remove()
            db.engine.dispose()
