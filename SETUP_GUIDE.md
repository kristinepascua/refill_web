# Setup Guide

Complete step-by-step guide to get your full-stack application running locally.

## Prerequisites Check

Before starting, ensure you have:

- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] MySQL Server running (XAMPP on localhost:3306)
- [ ] Git installed (optional, for version control)

## Step 1: Database Setup

### XAMPP MySQL Setup

1. **Start MySQL in XAMPP Control Panel**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait for it to show as running

2. **Create Database**

   Option A: Using Command Line

   ```bash
   mysql -u root
   CREATE DATABASE refill_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   exit
   ```

   Option B: Using phpMyAdmin
   - Open `http://localhost/phpmyadmin`
   - Click "New"
   - Database name: `refill_web`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

## Step 2: Backend Setup

### 2.1 Navigate and Create Virtual Environment

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

Expected output:

```
Successfully installed Django-4.1.13
Successfully installed djangorestframework-3.14.0
Successfully installed django-cors-headers-4.0.0
Successfully installed mysqlclient-2.2.0
Successfully installed python-decouple-3.8
```

### 2.3 Create Environment File (Optional)

```bash
cp .env.example .env
# Edit .env if needed - defaults should work with XAMPP
```

### 2.4 Run Migrations

```bash
python manage.py migrate
```

Expected output:

```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, orders, products, sessions, users
Running migrations:
  Applying sessions.0001_initial... OK
  Applying admin.0001_initial... OK
  ...
```

### 2.5 Create Superuser

```bash
python manage.py createsuperuser
```

Prompts:

```
Username: admin
Email address: admin@example.com
Password: (enter a password)
Password (again): (confirm password)
Superuser created successfully.
```

### 2.6 Start Django Development Server

```bash
python manage.py runserver
```

Expected output:

```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
March 05, 2026 - 10:00:00
Django version 4.1.13, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✓ **Backend is running on http://localhost:8000**

Test it:

- API Products: http://localhost:8000/api/products/
- Admin Panel: http://localhost:8000/admin

## Step 3: Frontend Setup

### 3.1 Open New Terminal/Command Prompt

**Keep the Django server running in the previous terminal!**

### 3.2 Navigate and Install Dependencies

```bash
cd frontend

npm install
```

Expected output:

```
added XXX packages, and audited XXX packages in XXs
```

### 3.3 Create Environment File (Optional)

```bash
cp .env.example .env
# Defaults should work - no changes needed
```

### 3.4 Start Vite Development Server

```bash
npm run dev
```

Expected output:

```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

✓ **Frontend is running on http://localhost:5173**

Open in browser: http://localhost:5173

You should see the React app with API connection test.

## Step 4: Test Communication

### 4.1 Test API from Frontend

1. Open http://localhost:5173 in your browser
2. Check the "API Status" section
3. Should show: ✓ Connected to Django API

### 4.2 Add Sample Data (Admin Panel)

1. Open http://localhost:8000/admin
2. Login with superuser credentials
3. Add a Category:
   - Click "Categories" → "Add Category"
   - Name: "Electronics"
   - Save
4. Add a Product:
   - Click "Products" → "Add Product"
   - Name: "USB Cable"
   - Price: 9.99
   - Stock: 100
   - Category: Electronics
   - Save

### 4.3 View Data in Frontend

1. Refresh http://localhost:5173
2. Products should appear on the page
3. Test API endpoints in browser developer console:

```javascript
// Get products
fetch("http://localhost:8000/api/products/")
  .then((r) => r.json())
  .then((d) => console.log(d));

// Get categories
fetch("http://localhost:8000/api/products/categories/")
  .then((r) => r.json())
  .then((d) => console.log(d));
```

## Running the Application

### Terminal 1: Django Backend

```bash
cd backend
venv\Scripts\activate          # Windows
# OR: source venv/bin/activate  # macOS/Linux
python manage.py runserver
```

Runs on: **http://localhost:8000**

### Terminal 2: React Frontend

```bash
cd frontend
npm run dev
```

Runs on: **http://localhost:5173**

### Browser

- Frontend: http://localhost:5173
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin

## Database: XAMPP MySQL

Ensure MySQL is running in XAMPP Control Panel:

- Click "Start" next to MySQL
- Stays running while you use the app
- Stop when done

## Stopping the Application

1. **Backend:** Press `CTRL+C` in Terminal 1
2. **Frontend:** Press `q` then Enter in Terminal 2
3. **MySQL:** Click "Stop" in XAMPP Control Panel

## Troubleshooting

### MySQL Connection Failed

```
Error: (2002, "Can't connect to MySQL server")
```

→ Start MySQL in XAMPP Control Panel

### Port 8000 Already in Use

```bash
python manage.py runserver 8001
```

### Port 5173 Already in Use

```bash
npm run dev -- --port 3000
```

### CORS Error in Browser

```
Access to XMLHttpRequest blocked by CORS policy
```

→ Verify Django settings.py has correct CORS_ALLOWED_ORIGINS
→ Restart Django server after any changes

### Dependencies Not Installing

```bash
# Update pip first
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Node Modules Won't Install

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

### Backend (.env)

```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=refill_web
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Project Layout

```
refill_web/
├── backend/          ← Django REST API
│   ├── venv/         ← Python virtual environment
│   ├── config/       ← Django settings
│   ├── apps/         ← Business logic (users, products, orders)
│   └── manage.py     ← Django CLI
├── frontend/         ← React + Vite app
│   ├── node_modules/ ← Dependencies
│   ├── src/          ← React components
│   ├── public/       ← Static files
│   └── package.json  ← Dependencies list
└── README.md         ← Project documentation
```

## Common Development Tasks

### Add New Product via API (Curl)

```bash
curl -X POST http://localhost:8000/api/products/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-end laptop",
    "category": 1,
    "price": 999.99,
    "stock": 5
  }'
```

### Create React Component Using API

```jsx
import { useEffect, useState } from "react";
import { productsAPI } from "./api/products";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI
      .getAll()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>
          {p.name} - ${p.price}
        </div>
      ))}
    </div>
  );
}
```

### Deploy to Production

See `README.md` in project root for production deployment guidelines.

## Next Steps

1. Explore the API endpoints: http://localhost:8000/api/
2. Review Django admin: http://localhost:8000/admin
3. Check frontend: http://localhost:5173
4. Read detailed docs:
   - [backend/README.md](backend/README.md)
   - [frontend/README.md](frontend/README.md)
5. Start building features!

## Support & Resources

- Django Docs: https://docs.djangoproject.com/4.1/
- DRF Docs: https://www.django-rest-framework.org/
- React Docs: https://react.dev/
- Vite Docs: https://vitejs.dev/
