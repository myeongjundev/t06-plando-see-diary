from pathlib import Path

from flask_migrate import upgrade

from app import create_app
from app.extensions import db
from test_card2_tasks import create_plan, create_task
from test_card3_executions import KEY, LOG


def test_card3_upgrade_preserves_card2_data_and_is_repeatable(tmp_path):
    app = create_app({"TESTING": True, "SQLALCHEMY_DATABASE_URI": f"sqlite:///{(tmp_path / 'migration.db').as_posix()}"})
    migrations = str(Path(__file__).resolve().parents[2] / "migrations")
    try:
        with app.app_context():
            upgrade(directory=migrations, revision="7f02f5379407")
        client = app.test_client()
        plan = create_plan(client)
        task = create_task(client, plan["id"])
        with app.app_context():
            upgrade(directory=migrations)
            upgrade(directory=migrations)
        assert client.get(f"/api/tasks/{task['id']}").json["task"] == task
        assert client.get(f"/api/plans/{plan['id']}").json["plan"] == plan
        assert client.post(f"/api/tasks/{task['id']}/executions", json=LOG).status_code == 201
        first = client.post(f"/api/tasks/{task['id']}/complete", json=KEY)
        second = client.post(f"/api/tasks/{task['id']}/complete", json=KEY)
        assert first.status_code == second.status_code == 200
        assert first.json["completionEvent"] == second.json["completionEvent"]
    finally:
        with app.app_context():
            db.session.remove()
            db.engine.dispose()
