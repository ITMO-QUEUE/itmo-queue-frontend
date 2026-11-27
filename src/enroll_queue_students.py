"""Запись восьми тестовых студентов в очередь на защиту ЛР2 и ЛР3 через API ItmoQueue."""

import argparse
import os
import re
import sys
from pathlib import Path
from urllib.error import URLError

# Используем тот же API-клиент и пароль, с которыми seed.py создавал студентов.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from seed import ApiClient, DEFAULT_USER_PASSWORD


QUEUE_ID = "72cf5171-7fa6-4e8e-9c0a-88cbb3506302"
QUEUE_PATH = f"/api/v1/queues/{QUEUE_ID}"
ARTIFACT_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
STUDENTS = {
    "student_951_06": 2,
    "student_951_36": 2,
    "student_951_47": 2,
    "student_951_18": 2,
    "student_951_11": 2,
    "student_951_22": 2,
    "student_951_24": 3,
    "student_951_17": 3,
}


def find_labs(api, queue):
    allowed = {work["work_id"] for work in queue["works"]}
    labs = {}
    offset = 0
    while True:
        _, page = api.request(
            "GET", f"/api/v1/works?discipline={queue['discipline_id']}&limit=100&offset={offset}"
        )
        for work in page:
            if work["id"] not in allowed:
                continue
            match = re.fullmatch(
                r"(?:ЛР|Лабораторная\s+работа)\s*№?\s*([23])",
                work["title"].strip(), re.IGNORECASE,
            )
            if match:
                number = int(match[1])
                if number in labs:
                    raise ValueError(f"В очереди несколько работ с названием ЛР{number}.")
                labs[number] = work["id"]
        if len(page) < 100:
            break
        offset += len(page)
    for number in sorted(set(STUDENTS.values())):
        if number not in labs:
            raise ValueError(f"В доступных работах этой очереди не найдена ЛР{number}.")
    return labs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://localhost:5173",
                        help="Адрес Vite с прокси /api или прямой адрес backend")
    parser.add_argument("--info", action="store_true", help="Получить данные очереди без записи")
    args = parser.parse_args()
    password = os.environ.get("ITMO_STUDENT_PASSWORD", DEFAULT_USER_PASSWORD)
    labs = None
    errors = 0
    for login, number in STUDENTS.items():
        try:
            api = ApiClient(args.base_url)
            api.request("POST", "/api/v1/auth/login", {"login": login, "password": password})
            _, queue = api.request("GET", QUEUE_PATH)
            if labs is None:
                print(f"{queue['title']} ({QUEUE_ID})")
                registration = "открыта" if queue["registration_open"] else "закрыта"
                print(f"Дисциплина: {queue['discipline_name']}. Стадия: {queue['stage']}. "
                      f"Регистрация {registration}. Ожидают: {queue['waiting_count']}.")
                labs = find_labs(api, queue)
                for lab, work_id in sorted(labs.items()):
                    print(f"ЛР{lab}: {work_id}")
                if args.info:
                    return 0

            work_id = labs[number]
            entry = queue["my_entry"]
            if entry is not None:
                if any(work["work_id"] == work_id and work["artifact_url"] == ARTIFACT_URL
                       for work in entry["works"]):
                    print(f"{login}: уже записан на ЛР{number}.")
                    continue
                raise ValueError("Уже есть запись с другой работой или ссылкой.")
            if not queue["registration_open"] or queue["stage"] == "finished":
                raise SystemExit("Очередь закрыта для новых записей.")
            _, entry = api.request("POST", f"{QUEUE_PATH}/entries", {
                "works": [{"work_id": work_id, "artifact_url": ARTIFACT_URL}],
            })
            print(f"{login}: записан на ЛР{number}, позиция {entry['position']}.")
        except (URLError, TimeoutError) as exc:
            raise SystemExit(f"Не удалось связаться с {args.base_url}: {exc}") from exc
        except (RuntimeError, ValueError) as exc:
            print(f"{login}: {exc}", file=sys.stderr)
            if labs is None:
                return 1
            errors += 1
    print(f"Подтверждено записей: {len(STUDENTS) - errors} из {len(STUDENTS)}.")
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
