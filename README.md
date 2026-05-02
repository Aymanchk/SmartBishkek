<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/map.svg" alt="SmartBishkek Logo" width="80" height="80">
  <br/>
  <h1>SmartBishkek</h1>
  <p><b>Платформа краудсорс-мониторинга городской инфраструктуры</b></p>
  
  [![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
  [![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
</div>

<br/>

**SmartBishkek** — это современная экосистема для взаимодействия жителей и городских служб (мэрии). 
Жители быстро фиксируют проблемы (ямы, мусор, неработающее освещение) через удобное мобильное приложение, ИИ автоматически классифицирует тип проблемы, а операторы мгновенно получают заявку на интерактивной карте в веб-панели и назначают ремонтные бригады.

---

##  Ключевые возможности

###  Для горожан (Мобильное приложение)
- **Умная подача заявки:** 1 фото + 30 секунд. GPS координаты подтягиваются автоматически.
- **Интерактивная карта:** Просмотр всех городских проблем на карте в реальном времени.
- **Мои заявки:** Отслеживание статуса собственных заявок (Новая → В работе → Решена). Безопасная аутентификация по `device_id` без нудной регистрации по номеру телефона.

###  Для мэрии (Веб-панель оператора)
- **Triage Map:** Интерактивная тепловая карта и список всех заявок с фильтрацией по статусу.
- **AI-Ассистент:** Автоматическое распознавание категории проблемы по загруженному фото.
- **Аналитика:** Детализированный дашборд с метриками эффективности работы служб (KPI, время решения, графики).
- **Управление бригадами:** Мониторинг загруженности ремонтных бригад на местах.
- **Гибкие настройки:** Темная/Светлая тема, персонализация профиля (сохраняется глобально) и управление API.

---

##  Архитектура проекта

Проект представляет собой классический монорепозиторий, разделенный на три независимых микросервиса:

```text
smartbishkek/
├──  backend/   # Django + DRF + ML (API для обоих клиентов)
├──  admin/     # Next.js 14 + React (Веб-панель оператора)
└──  mobile/    # Flutter 3 (Приложение для iOS и Android)
```

---

##  Быстрый старт (Демо-сценарий)

Для тестирования локально вам потребуются **Python 3.10+**, **Node.js 18+**, и установленный **Flutter SDK**.

### 1. Запуск Backend (Django)
Бэкенд отвечает за сохранение заявок, работу с БД (SQLite) и ML-модель.

```bash
cd backend
python -m venv .venv 
source .venv/bin/activate  # Для Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations issues
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```
> Бэкенд запущен на `http://localhost:8000`

### 2. Запуск Панели Оператора (Next.js)
Защищенная зона для сотрудников мэрии. 

```bash
cd admin
npm install
npm run dev
```
> Админка запущена на `http://localhost:3000`. 
> **Доступ:** Логин `admin` / Пароль `smartbishkek2026`

### 3. Запуск Мобильного приложения (Flutter)
Приложение горожанина. Запускайте на симуляторе iOS или эмуляторе Android.

```bash
cd mobile
flutter pub get
flutter run
```
> При запуске на эмуляторе Android приложение по умолчанию обращается к `10.0.2.2:8000`. Для тестирования на физическом устройстве измените `api_base_url` в настройках приложения на локальный IP вашего компьютера (например: `192.168.1.5:8000`).

---

## 🛠 Технологический стек

- **Backend:** Django 4.2, Django REST Framework, Pillow, SQLite, CORS Headers.
- **Admin Panel:** Next.js 14 (App Router), React 18, React-Leaflet (OSM Map), Lucide Icons, CSS Modules.
- **Mobile App:** Flutter 3, `geolocator`, `image_picker`, `flutter_map` + `latlong2`, `http`, `uuid`, `shared_preferences`.
- **Machine Learning:** Заглушка на базе эвристики (Pillow). Подготовлена архитектура для замены на TensorFlow Lite / PyTorch Mobile или Hugging Face Inference API.

---

##  Как это работает?
1. Житель делает фото ямы через мобильное приложение.
2. Flutter передает координаты и картинку с заголовком `X-Device-Id` на бэкенд.
3. Django сохраняет заявку в базу и запускает ML-алгоритм для определения категории.
4. В диспетчерской (Next.js) у оператора появляется новая точка на карте и уведомление.
5. Оператор переводит статус в **"В работе"**.
6. Житель свайпает экран в приложении и видит, что статус его проблемы изменился! 🎉

---

<div align="center">
  <i>Разработано с ❤️ для улучшения городской среды.</i>
</div>
