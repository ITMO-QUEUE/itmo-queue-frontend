import http.cookiejar
import json
import random
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

BASE_URL = ("http://localhost:8000")

# Укажите логин и пароль существующего администратора
ADMIN_LOGIN = "admin"
ADMIN_PASSWORD = "adminpasw"

# Пароль по умолчанию для всех создаваемых тестовых аккаунтов (минимум 8 символов)
DEFAULT_USER_PASSWORD = "Password123!"

DISCIPLINE_NAMES = [
    "Веб-программирование",
    "Алгоритмы и структуры данных",
    "Базы данных",
    "Операционные системы",
    "Архитектура компьютера",
]

FIRST_NAMES = [
    "Александр", "Дмитрий", "Максим", "Артём", "Иван",
    "Анна", "Мария", "Елена", "Дарья", "Полина",
]

LAST_NAMES = [
    "Иванов", "Смирнов", "Кузнецов", "Попов", "Васильев",
    "Петров", "Соколов", "Михайлов", "Новиков", "Фёдоров",
]


class ApiClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self.cookie_jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self.cookie_jar)
        )

    def request(self, method: str, path: str, body: dict | None = None):
        url = f"{self.base_url}{path}"
        data = json.dumps(body).encode("utf-8") if body is not None else None
        headers = {"Content-Type": "application/json"} if data is not None else {}

        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with self.opener.open(req) as resp:
                raw = resp.read().decode("utf-8")
                return resp.status, json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            raise RuntimeError(f"{method} {path} -> HTTP {e.code}: {err_body}") from e


def main():
    api = ApiClient(BASE_URL)
    suffix = random.randint(100, 999)

    print(f"1. Авторизация под администратором ({ADMIN_LOGIN})...")
    api.request("POST", "/api/v1/auth/login", {
        "login": ADMIN_LOGIN,
        "password": ADMIN_PASSWORD,
    })

    print("2. Создание 5 дисциплин и работ к ним...")
    disciplines = []
    works_by_discipline: dict[str, list[dict]] = {}

    for idx, title in enumerate(DISCIPLINE_NAMES, start=1):
        _, disc = api.request("POST", "/api/v1/disciplines", {
            "name": f"{title} ({suffix}-{idx})"
        })
        disciplines.append(disc)
        works_by_discipline[disc["id"]] = []

        for work_no in range(1, 4):
            _, work = api.request("POST", "/api/v1/works", {
                "discipline_id": disc["id"],
                "title": f"Лабораторная работа №{work_no}",
                "position_no": work_no,
                "is_active": True,
            })
            works_by_discipline[disc["id"]].append(work)

    print("3. Создание 10 преподавателей и привязка к дисциплинам...")
    teachers = []
    for i in range(1, 11):
        full_name = f"{random.choice(LAST_NAMES)} {random.choice(FIRST_NAMES)} (Преп. {i})"
        login = f"teacher_{suffix}_{i:02d}"
        isu = f"{200000 + suffix * 100 + i}"

        _, teacher = api.request("POST", "/api/v1/auth/register", {
            "name": full_name,
            "login": login,
            "isu": isu,
            "password": DEFAULT_USER_PASSWORD,
            "role": "teacher",
            "can_create_queues": True,
        })

        # Назначаем каждому преподавателю по 2 случайные дисциплины
        assigned_disciplines = random.sample(disciplines, k=2)
        api.request("PATCH", f"/api/v1/users/{teacher['id']}", {
            "discipline_ids": [d["id"] for d in assigned_disciplines]
        })

        teachers.append({
            **teacher,
            "discipline_ids": [d["id"] for d in assigned_disciplines],
        })

    print("4. Создание 50 студентов...")
    students = []
    for i in range(1, 51):
        full_name = f"{random.choice(LAST_NAMES)} {random.choice(FIRST_NAMES)} (Студ. {i})"
        login = f"student_{suffix}_{i:02d}"
        isu = f"{400000 + suffix * 100 + i}"

        _, student = api.request("POST", "/api/v1/auth/register", {
            "name": full_name,
            "login": login,
            "isu": isu,
            "password": DEFAULT_USER_PASSWORD,
            "role": "student",
            "can_create_queues": False,
        })
        students.append(student)

    print("5. Создание 30 очередей...")
    base_time = datetime.now(timezone.utc) + timedelta(hours=1)
    queues = []

    for i in range(1, 31):
        discipline = disciplines[(i - 1) % len(disciplines)]
        disc_id = discipline["id"]

        # Подбираем преподавателей, привязанных к этой дисциплине
        eligible_teachers = [t for t in teachers if disc_id in t["discipline_ids"]]
        if not eligible_teachers:
            eligible_teachers = teachers

        selected_teachers = random.sample(
            eligible_teachers, k=min(len(eligible_teachers), random.randint(1, 2))
        )
        disc_works = works_by_discipline[disc_id]

        start_dt = base_time + timedelta(days=(i // 5), hours=(i % 5) * 2)
        end_dt = start_dt + timedelta(hours=3)

        _, queue = api.request("POST", "/api/v1/queues", {
            "discipline_id": disc_id,
            "title": f"Защита работ #{i} — {discipline['name']}",
            "description": f"Тестовая очередь №{i} для проверки нагрузки и UI",
            "planned_start": start_dt.isoformat(),
            "planned_end": end_dt.isoformat(),
            "location": f"Кронверкский пр., д. 49, ауд. {200 + i}",
            "avg_duration_min": random.choice([10, 15, 20]),
            "quota": random.choice([None, 15, 25, 30]),
            "registration_open": True,
            "teacher_ids": [t["id"] for t in selected_teachers],
            "works": [
                {"work_id": w["id"], "priority": idx + 1}
                for idx, w in enumerate(disc_works)
            ],
        })
        queues.append(queue)

    print("\nГотово! Успешно создано:")
    print(f"  - Дисциплин:     {len(disciplines)}")
    print(f"  - Преподавателей:{len(teachers)} (логины teacher_{suffix}_01 .. teacher_{suffix}_10)")
    print(f"  - Студентов:     {len(students)} (логины student_{suffix}_01 .. student_{suffix}_50)")
    print(f"  - Очередей:      {len(queues)}")
    print(f"  - Пароль для всех созданных пользователей: {DEFAULT_USER_PASSWORD}")


if __name__ == "__main__":
    main()
