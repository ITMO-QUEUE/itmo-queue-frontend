# ITMO.Queue

Фронтенд-приложение системы управления электронными очередями для учебного процесса с ролевой моделью доступа (студент, преподаватель, администратор).

---

## 0. Запуск

Для работы используется пакетный менеджер **pnpm** и сборщик **Vite**.

### 1. Установка зависимостей
```bash
pnpm install
```

### 2. Настройка переменных окружения
Создайте файл конфигурации на основе примера `.env.example` (для dev-режима используются переменные окружения Vite):
```bash
cp .env.example .env
```

### 3. Доступные скрипты
* **Запуск сервера разработки (`--mode dev`):**
  ```bash
  pnpm dev
  ```
* **Сборка для production (`tsc -b && vite build --mode prod`):**
  ```bash
  pnpm build
  ```
* **Предпросмотр production-сборки:**
  ```bash
  pnpm preview
  ```
* **Форматирование и линтинг кода (Biome):**
  ```bash
  pnpm format
  ```
* **Генерация TypeScript-типов из OpenAPI-схемы бэкенда** (требует запущенный бэкенд на `http://localhost:8000`):
  ```bash
  pnpm gen:api
  ```

*(Дополнительно в `src/enroll_queue_students.py` находится вспомогательный Python-скрипт для тестовой/пакетной записи студентов в очереди.)*

---

## 1. Стек технологий

В проекте используются только следующие библиотеки и инструменты:

* **Ядро:** React 19 (`^19.2.8`), TypeScript (`~6.0.2`), Vite (`^8.3.0`)
* **Роутинг:** React Router (`^8.4.0`)
* **Управление состоянием:**
  * Серверный стейт и кэширование: TanStack React Query (`5.104.2`) + React Query Devtools
  * Клиентский глобальный стейт: Zustand (`^5.0.15`)
* **Сетевое взаимодействие:**
  * REST API: Axios (`1.20.0`)
  * Real-time (WebSockets): Socket.IO Client (`4.8.4`)
  * Кодогенерация контрактов: `openapi-typescript` (`^7.13.0`)
* **Формы и валидация:** React Hook Form (`7.90.0`), Zod (`4.6.7`), `@hookform/resolvers` (`5.9.1`)
* **UI и стилизация:** Tailwind CSS (`4.3.3`, `@tailwindcss/vite`), Base UI (`@base-ui/react` `^1.9.0`), shadcn (`^4.22.1`), `class-variance-authority`, `tw-animate-css`, иконки Lucide React (`^1.61.0`), шрифт Geist (`@fontsource-variable/geist`)
* **Качество кода и пакетный менеджер:** Biome (`2.5.15`), pnpm

---

## 2. Файловая структура

```text
├── biome.json                   # Конфигурация линтера и форматтера Biome
├── components.json              # Конфигурация UI-компонентов (shadcn / Base UI)
├── index.html                   # Корневой HTML-шаблон
├── package.json                 # Зависимости и npm-скрипты
├── tsconfig.json                # Настройки компилятора TypeScript
├── vite.config.ts               # Конфигурация сборщика Vite
└── src/
    ├── main.tsx                 # Точка входа приложения
    ├── index.css                # Глобальные стили и импорты Tailwind CSS
    ├── app/                     # Слой инициализации приложения
    │   ├── App.tsx              # Корневой компонент с провайдерами и роутером
    │   ├── api/                 # Модули запросов к REST API (academic, auth, queues, system, users)
    │   ├── providers/           # Глобальные провайдеры (AuthProvider.tsx)
    │   └── router/              # Конфигурация роутера (index.tsx) и гарды (ProtectedRoute.tsx)
    ├── assets/                  # Статические ресурсы: Logo.svg и набор SVG-иконок
    ├── components/              # Общие переиспользуемые компоненты
    │   ├── common/              # Бизнес-независимые элементы интерфейса (Header, Sidebar, Profile, MyBreadcrumb)
    │   ├── layout/              # Общие макеты страниц (CommonLayout.tsx)
    │   └── ui/                  # Атомарные компоненты дизайн-системы (UIButton, UIDialog, UIInput, UIQueueCard и др.)
    ├── features/                # Изолированные функциональные модули по ролям и задачам
    │   ├── auth/                # Авторизация (LoginForm, Alerts)
    │   ├── queue-admin/         # Функционал администратора (получение и регистрация пользователей)
    │   ├── queue-student/       # Функционал студента в очереди
    │   └── queue-teacher/       # Функционал преподавателя и управления очередью
    ├── libs/                    # Конфигурация библиотек и утилиты (axios.ts, utils.ts)
    ├── pages/                   # Компоненты страниц (admin, student, teacher, test, AuthPage, NotFoundPage)
    ├── stores/                  # Глобальные Zustand-сторы (useAuthStore.ts)
    └── types/                   # Общие типы (HistoryAttempt.ts, StudentRecord.ts) и автогенерируемая схема schema.d.ts
```

---

## 3. Маршрутизация

Конфигурация роутинга описана в `src/app/router/index.tsx` с использованием `createBrowserRouter`. Доступ разграничен через `GuestOnlyRoute` (только для неавторизованных пользователей) и `ProtectedRoute` с проверкой массива разрешенных ролей (`allowedRoles`).

* **Публичные маршруты (`GuestOnlyRoute`):**
  * `/` и `/auth` — страница входа (`AuthPage`)
* **Маршруты студента (`ProtectedRoute`, роль `student`, обернуты в `CommonLayout`):**
  * `/student/me/queues` (а также fallback `/student/me/*` и `/student/*`) — активные очереди текущего студента (`StudentActiveQueuesPage`)
  * `/student/queues` — список очередей (`StudentQueuesPage`)
  * `/student/queues/:queueId` — детальная страница очереди (`StudentQueuePage`)
  * `/student/profile` — профиль пользователя (`Profile`)
  * `/student/history` — история посещений (`StudentHistoryPage`)
* **Маршруты преподавателя (`ProtectedRoute`, роль `teacher`, обернуты в `CommonLayout`):**
  * `/teacher/queues` (а также fallback `/teacher/*`) — список очередей преподавателя (`TeacherQueuesPage`)
  * `/teacher/queues/:queueId` — управление конкретной очередью (`TeacherQueuePage`)
  * `/teacher/subjects` — дисциплины преподавателя (`TeacherSubjectsPage`)
  * `/teacher/profile` — профиль пользователя (`Profile`)
* **Маршруты администратора (`ProtectedRoute`, роль `admin`, обернуты в `CommonLayout`):**
  * `/admin/users` (index и fallback `/admin/*`) — список пользователей (`AdminUsersPage`)
  * `/admin/users/create` — создание нового пользователя (`AdminCreateUserPage`)
  * `/admin/profile` — профиль пользователя (`Profile`)
* **UI-песочница (доступна только при `import.meta.env.DEV`):**
  * `/test/button`, `/test/queue-row`, `/test/checkbox`, `/test/input`, `/test/select`, `/test/alert`, `/test/numberfield`, `/test/dialog`, `/test/parameters`, `/test/queue-card`, `/test/queue-status`, `/test/tab` — стенды для изолированной проверки компонентов.
* **Обработка несуществующих адресов:**
  * `*` — страница 404 (`NotFoundPage`).

---

## 4. API

Взаимодействие с сервером строится по следующей схеме:

1. **Единый контракт типов (`src/types/schema.d.ts`):**
   Схема типов генерируется напрямую из OpenAPI-спецификации бэкенда командой `pnpm gen:api`. Это гарантирует совпадение моделей данных фронтенда и бэкенда.
2. **HTTP-клиент (`src/libs/axios.ts`) и доменные модули (`src/app/api/`):**
   Поверх инстанса Axios реализованы типизированные API-сервисы (`.api.ts` + файлы типов `.api.d.ts`), разбитые по бизнес-сущностям:
   * `auth/` — авторизация и работа с токенами/сессией
   * `queues/` — создание, редактирование очередей, управление статусами и участниками
   * `users/` — получение данных пользователей и управление профилями
   * `academic/` — учебные данные (дисциплины, группы)
   * `system/` — системные эндпоинты
3. **Кэширование и мутации:**
   Запросы интегрируются с `@tanstack/react-query` для управления состоянием загрузки, кэширования и инвалидации данных.
4. **Real-time обновления:**
   Для синхронизации состояния живой очереди в реальном времени используется `socket.io-client`.

---

## 5. Feature-Sliced Design (разделение на фичи студента и преподавателя)

Архитектура папки `src/` организована по принципам **Feature-Sliced Design (FSD)** с четким разделением бизнес-логики по ролям внутри слоя `features/`:

* **`features/auth`** — общая фича аутентификации: форма входа (`LoginForm.tsx`) с валидацией через React Hook Form + Zod и компонент системных уведомлений (`Alerts.tsx`).
* **`features/queue-student`** — изолированный модуль для роли студента:
  * `components/` — интерфейс очереди для студента (`StudentQueue.tsx`).
  * `types/` — локальные типы данных студенческой очереди (`queue.ts`).
  * `mocks/` — моки (`queues.ts`) для автономной разработки UI.
  * `hooks/`, `socket/` — слои для клиентской логики и обработки сокет-событий студента.
* **`features/queue-teacher`** — расширенный модуль рабочего места преподавателя:
  * `components/` — управление очередью (`TeacherQueue.tsx`), рабочее место преподавателя и прием работ (`TeacherWorkplace.tsx`, `QueueWorkplace.tsx`), настройки параметров очереди (`QueueSettings.tsx`), управление блокировками (`QueueBans.tsx`), история (`QueueHistory.tsx`), а также модальные окна управления участниками (`QueueParticipantDialog.tsx`, `DialogAbsent.tsx`, `FinishQueueDialog.tsx`, `EmptyQueue.tsx`).
  * `utils/` — специализированная бизнес-логика: нормализация и обработка ошибок очереди (`queueError.ts`), работа с черновиками настроек (`queueSettingsDraft.ts`).
  * `types/`, `mocks/` — модели данных преподавателя (`queue.ts`, `StudentRecord.ts`) и полные моки (`FullQueues.ts`).
* **`features/queue-admin`** — изолированный модуль администратора с локальными API-обертками (`getUsersApi.ts`, `registerUserApi.ts`).

---

## 6. Архитектура проекта

Приложение построено на строгой иерархии слоев с однонаправленными зависимостями (верхние слои могут импортировать нижние, но не наоборот):

1. **`app` (Инициализация):** Настраивает глобальные провайдеры (`AuthProvider`, `QueryClientProvider`), подключает клиентский стор авторизации (`useAuthStore` на Zustand) и инициализирует `createBrowserRouter`.
2. **`pages` (Страницы и роутинг):** Тонкие компоненты-контейнеры. Они отвечают за связывание URL-параметров (`:queueId`), общего каркаса `CommonLayout` (включающего `Header`, `Sidebar`, `MyBreadcrumb`) и композицию виджетов из `features/`.
3. **`features` (Бизнес-фичи):** Содержат всю предметную логику, состояние форм, диалоговые окна и обработку событий для конкретной роли (`queue-student`, `queue-teacher`, `queue-admin`, `auth`). Фичи изолированы друг от друга.
4. **`components` (UI-кит и общие блоки):**
   * `components/ui/` — низкоуровневые переиспользуемые примитивы (`UIButton`, `UISelect`, `UIQueueRow`, `UIParticipantStatus`, `UITeacherParameters` и др.), построенные на базе Base UI и Tailwind CSS. Не содержат бизнес-логики.
   * `components/common/` и `components/layout/` — общие элементы навигации и разметки.
5. **`libs` и `types` (Инфраструктура):** Базовые утилиты (`cn`), настроенный клиент `axios`, глобальные контракты типов `schema.d.ts`.
