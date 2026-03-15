# 💧 Refill Web

> A full-stack water delivery ordering platform — browse refill stations, place orders, schedule deliveries, and track shipments in real time.

![Django](https://img.shields.io/badge/Django-4.1-092E20?style=flat&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-3.14-red?style=flat)

---
1️⃣ Backend Setup
Requirements

Install the following:

Python 3.8+

Node.js 16+

XAMPP (for MySQL)

Make sure MySQL is running in XAMPP.

Step 1 — Create Virtual Environment

Open Command Prompt or PowerShell.

cd backend
python -m venv venv

Activate the virtual environment:

venv\Scripts\activate

Step 2 — Install Dependencies

pip install djangorestframework django-cors-headers django-filter mysqlclient python-decouple Pillow

Step 3 — Create MySQL Database

Open MySQL from terminal:

mysql -u root

Create the database:

CREATE DATABASE refill_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
Step 4 — Configure Database

Edit:

backend/config/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'refill_web',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
Step 5 — Enable CORS (Required for React)

In settings.py:

INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
Step 6 — Run Migrations
python manage.py migrate
python manage.py createsuperuser
Step 7 — Start Backend Server
python manage.py runserver

Backend will run at:

http://localhost:8000
http://localhost:8000/admin
2️⃣ Frontend Setup (React + Vite)

Open a new terminal.

Step 1 — Install Dependencies
cd frontend
npm install
Step 2 — Configure API URL

Create or edit:

frontend/.env
VITE_API_BASE_URL=http://localhost:8000/api
Step 3 — Start Frontend
npm run dev

Frontend will run at:

http://localhost:5173
🔗 Connecting Frontend to Backend

The frontend connects to the Django API using Axios.

Example (src/api/client.js):

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default apiClient;

All requests are sent to:

http://localhost:8000/api/
