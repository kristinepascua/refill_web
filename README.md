# Refill Web - Full-Stack Application

A complete full-stack web application built with:

- **Backend:** Django 4.1 + Django REST Framework
- **Frontend:** React 18 + Vite
- **Database:** MySQL (via XAMPP on localhost:3306)
- **Communication:** REST API with CORS support

## Project Structure

```
refill_web/
├── backend/                         # Django REST API
│   ├── config/                      # Django project settings
│   │   ├── settings.py             # Main settings (DB, CORS, etc.)
│   │   ├── urls.py                 # URL routing
│   │   ├── wsgi.py                 # WSGI app
│   │   └── __init__.py
│   ├── apps/                        # Modular Django apps
│   │   ├── users/                   # User management
│   │   ├── products/                # Products catalog
│   │   ├── orders/                  # Order management
│   │   └── __init__.py
│   ├── manage.py                    # Django CLI
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment template
│   └── README.md                    # Backend documentation
│
├── frontend/                         # React + Vite application
│   ├── src/
│   │   ├── api/                     # API service layer
│   │   │   ├── client.js           # Axios with CORS config
│   │   │   ├── products.js         # Products API
│   │   │   ├── users.js            # Users API
│   │   │   └── orders.js           # Orders API
│   │   ├── App.jsx                 # Main component
│   │   ├── App.css                 # App styles
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML template
│   ├── vite.config.js              # Vite configuration
│   ├── package.json                # Dependencies
│   ├── .env.example                # Environment template
│   └── README.md                   # Frontend documentation
│
└── README.md                        # This file
```

## Quick Start

### Prerequisites

- **Python 3.8+** for Django
- **Node.js 16+** for React
- **MySQL Server** (XAMPP running on localhost:3306)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create database (MySQL CLI or through XAMPP)
mysql -u root
CREATE DATABASE refill_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend runs on: **`http://localhost:8000`**

Admin panel: **`http://localhost:8000/admin`**

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: **`http://localhost:5173`**

## Configuration

### Database Configuration (Backend)

Located in `backend/config/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'refill_web',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    }
}
```

### CORS Configuration (Backend)

Located in `backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',    # Vite frontend
    'http://localhost:3000',    # Alternative port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
]

CSRF_COOKIE_HTTPONLY = False  # Allow JS to read CSRF token
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
]
```

### Middleware Setup (Backend)

CORS middleware positioned **before** Django's CommonMiddleware:

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ← CORS before CommonMiddleware!
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]
```

### API Base URL (Frontend)

Located in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## API Endpoints Overview

### Products (`/api/products/`)

```
GET    /api/products/                    List all products
POST   /api/products/                    Create product (admin)
GET    /api/products/{id}/               Get product detail
PATCH  /api/products/{id}/               Update product (admin)
DELETE /api/products/{id}/               Delete product (admin)
GET    /api/products/categories/         List categories
POST   /api/products/categories/         Create category (admin)
```

### Users (`/api/auth/`)

```
GET    /api/auth/users/                  List users (admin)
GET    /api/auth/users/me/               Get current user
GET    /api/auth/profiles/               List profiles (admin)
GET    /api/auth/profiles/my_profile/    Get current user's profile
PATCH  /api/auth/profiles/{id}/          Update profile
```

### Orders (`/api/orders/`)

```
GET    /api/orders/                      List orders
POST   /api/orders/                      Create order
GET    /api/orders/{id}/                 Get order detail
PATCH  /api/orders/{id}/                 Update order
DELETE /api/orders/{id}/                 Delete order
```

## Database Schema

### Users App

```
UserProfile
├── user (ForeignKey to Django User)
├── phone
├── address
├── city
├── state
├── postal_code
├── created_at
└── updated_at
```

### Products App

```
Category
├── name
├── description
└── created_at

Product
├── name
├── description
├── category (ForeignKey)
├── price
├── stock
├── image
├── is_active
├── created_at
└── updated_at
```

### Orders App

```
Order
├── user (ForeignKey)
├── status (pending, processing, shipped, delivered, cancelled)
├── total_price
├── shipping_address
├── notes
├── created_at
└── updated_at

OrderItem
├── order (ForeignKey)
├── product (ForeignKey)
├── quantity
├── price
└── created_at
```

## Frontend API Usage Example

```jsx
import { productsAPI } from "./api/products";
import { ordersAPI } from "./api/orders";

function App() {
  useEffect(() => {
    // Fetch products
    productsAPI
      .getAll()
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));

    // Or with async/await
    const fetchProducts = async () => {
      try {
        const { data } = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, []);

  // Create order
  const handleCreateOrder = async () => {
    try {
      const { data } = await ordersAPI.create({
        shipping_address: "123 Main St",
        items: [{ product_id: 1, quantity: 2, price: 29.99 }],
      });
      console.log("Order created:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
}
```

## CORS & CSRF Handling

### How It Works

1. **CORS Headers** - Django sends `Access-Control-Allow-*` headers
2. **Credentials** - Frontend sends `withCredentials: true` with requests
3. **Session Cookie** - Django sets session cookie on login
4. **CSRF Token** - Django sets CSRF token in cookies
5. **Header Inclusion** - API client automatically includes CSRF token

### API Client Setup (Frontend)

```javascript
// src/api/client.js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Include cookies
});

apiClient.interceptors.request.use((config) => {
  // Add CSRF token from cookies
  const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]")?.value;
  if (csrftoken) {
    config.headers["X-CSRFToken"] = csrftoken;
  }
  return config;
});
```

## Authentication Flow

> **Note:** Current setup uses Django Session Authentication. For production, consider JWT:
>
> - Install: `pip install djangorestframework-simplejwt`
> - Configure in Django settings
> - Update frontend to use Bearer token

## Development vs Production

### Development

- Django: `DEBUG = True`
- CORS: Allows `http://localhost:*`
- CSRF: `COOKIE_SECURE = False`
- Frontend port: 5173 or 3000

### Production

**Backend Changes:**

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
CORS_ALLOWED_ORIGINS = ['https://yourdomain.com']
CSRF_COOKIE_SECURE = True  # HTTPS only
SESSION_COOKIE_SECURE = True  # HTTPS only
```

**Frontend:**

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**Build:**

```bash
# Backend: Use Gunicorn
pip install gunicorn
gunicorn config.wsgi:application

# Frontend: Build static files
npm run build
# Serve dist/ folder through web server (Nginx, Apache, etc.)
```

## Troubleshooting

### MySQL Connection Error

```
Error: (2002, "Can't connect to MySQL server on 'localhost'")
```

- Ensure XAMPP MySQL server is running
- Check port 3306 is not blocked

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

- Verify `CORS_ALLOWED_ORIGINS` in Django settings
- Check frontend URL matches allowed origins
- Ensure CORS middleware is before CommonMiddleware

### CSRF Token Missing

```
CSRF token missing or incorrect
```

- Ensure Django renders CSRF token in form/template
- Or manually set header: `X-CSRFToken: <token>`
- Check `CSRF_COOKIE_HTTPONLY = False` in Django

### Port Already in Use

```bash
# Django alternative port
python manage.py runserver 8001

# Vite alternative port
npm run dev -- --port 3000
```

## Environment Variables

### Backend (.env)

```
DEBUG=True
SECRET_KEY=django-insecure-...
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

## Dependencies

### Backend

- Django 4.1
- djangorestframework 3.14
- django-cors-headers 4.0
- mysqlclient 2.2
- python-decouple 3.8

### Frontend

- React 18
- Vite 5
- Axios 1.6

## File Requirements

**Backend:**

```bash
pip install -r requirements.txt
```

**Frontend:**

```bash
npm install
```

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/4.1/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [CORS in Django](https://pypi.org/project/django-cors-headers/)
- [Axios Documentation](https://axios-http.com/)

## License

MIT

## Support

For issues or questions, refer to:

- [backend/README.md](backend/README.md) - Backend-specific docs
- [frontend/README.md](frontend/README.md) - Frontend-specific docs
