# SmartBishkek

Платформа краудсорс-мониторинга городской инфраструктуры:
жители фиксируют проблемы (ямы, мусор, освещение) через мобильное приложение,
бэкенд автоматически классифицирует фото, операторы обрабатывают заявки
через веб-панель с картой.

## Структура монорепо

```
smartbishkek/
├── backend/   # Django + DRF + ML-классификатор (SQLite)
├── admin/     # Next.js 14 + React-Leaflet (панель оператора)
└── mobile/    # Flutter (приложение горожанина)
```

## 1. Backend (Django)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations issues
python manage.py migrate
python manage.py createsuperuser   # для /admin
python manage.py runserver 0.0.0.0:8000
```

Эндпоинты:
- `POST /api/issues/` — создать заявку (multipart: `image`, `latitude`, `longitude`, `description`)
- `GET  /api/issues/` — список всех заявок
- `GET  /api/issues/<id>/` — одна заявка
- `PATCH /api/issues/<id>/` — обновить статус (`{"status": "resolved"}`)
- `/admin/` — Django admin

ML-классификатор — заглушка в [backend/issues/ml.py](backend/issues/ml.py)
(эвристика по среднему цвету). Замените `classify_image()` на вызов
TensorFlow/PyTorch-модели или внешнего API.

## 2. Admin (Next.js)

```bash
cd admin
cp .env.local.example .env.local   # при необходимости поменяйте API URL
npm install
npm run dev
```

Откройте http://localhost:3000 — карта Бишкека с маркерами заявок
(цвет = статус) и таблица для смены статусов. Данные обновляются каждые 10с.

## 3. Mobile (Flutter)

```bash
cd mobile
flutter create .            # сгенерирует android/ ios/ папки
# затем добавьте разрешения из PERMISSIONS.md
flutter pub get
flutter run
```

В приложении: **Настройки** → задать API base URL.
- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://localhost:8000`
- Реальное устройство: `http://<IP-вашего-ПК>:8000`

Экраны:
- **Сообщить** — фото + GPS + комментарий → POST `/api/issues/`
- **Мои заявки** — список локально сохранённых заявок и их актуальный статус

## Демо-сценарий

1. Запустите backend (`runserver`).
2. Запустите admin (`npm run dev`) — увидите пустую карту.
3. С телефона/эмулятора отправьте заявку через Flutter-приложение.
4. В админке появится маркер на карте + строка в таблице с категорией от ML.
5. Поменяйте статус в таблице → в мобильном приложении (потяните вниз) увидите обновление.

## Технологии

- **Backend:** Django 4.2, DRF, Pillow, SQLite, django-cors-headers
- **Admin:** Next.js 14 (App Router), React-Leaflet, OpenStreetMap
- **Mobile:** Flutter 3, image_picker, geolocator, http, shared_preferences
- **ML:** Pillow-эвристика (заглушка под TF/PyTorch)
