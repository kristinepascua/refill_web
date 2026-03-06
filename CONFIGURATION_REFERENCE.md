# Configuration Reference

Detailed explanation of all configuration settings for Django and React.

## Django Backend Configuration

### Database (MySQL via XAMPP)

**File:** `backend/config/settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # MySQL driver
        'NAME': 'refill_web',                  # Database name
        'USER': 'root',                        # XAMPP default user
        'PASSWORD': '',                        # XAMPP default (empty)
        'HOST': 'localhost',                   # Connection host
        'PORT': '3306',                        # MySQL standard port
        'OPTIONS': {
            'charset': 'utf8mb4',              # UTF-8 multi-byte
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    }
}
```

**Key Points:**

- Uses `mysqlclient` Python driver (installed via requirements.txt)
- UTF-8 support for international characters
- Strict transaction mode for data integrity
- XAMPP default credentials (no password)

**Environment Variables (Optional):**

```
DB_ENGINE=django.db.backends.mysql
DB_NAME=refill_web
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

---

### CORS Configuration

**File:** `backend/config/settings.py`

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',    # Vite default port
    'http://localhost:3000',    # Alternative port
    'http://127.0.0.1:5173',    # Loopback address
    'http://127.0.0.1:3000',
]
```

**What Each Setting Does:**

| Setting                  | Value                                                  | Purpose                                                     |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------------------- |
| `CORS_ALLOW_CREDENTIALS` | `True`                                                 | Allow cookies to be sent with CORS requests                 |
| `CORS_ALLOW_METHODS`     | `['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']` | Allowed HTTP methods                                        |
| `CORS_ALLOW_HEADERS`     | Various                                                | Allowed request headers (content-type, authorization, etc.) |

**Middleware Order:**

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ← MUST BE HERE
    'django.middleware.common.CommonMiddleware',
    # ... rest of middleware
]
```

⚠️ **CRITICAL:** `CorsMiddleware` must be before `CommonMiddleware`

---

### CSRF Configuration

**File:** `backend/config/settings.py`

```python
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
]

# Development settings (change for production)
CSRF_COOKIE_SECURE = False          # Set to True with HTTPS
CSRF_COOKIE_HTTPONLY = False        # Allow JavaScript to read
CSRF_COOKIE_SAMESITE = 'Lax'        # SameSite policy
```

**CSRF Protection Flow:**

1. Django sets CSRF token in response cookies
2. JavaScript reads token from cookie
3. JavaScript includes token in `X-CSRFToken` header
4. Django validates token for POST, PUT, PATCH, DELETE requests

---

### Session Configuration

**File:** `backend/config/settings.py`

```python
SESSION_COOKIE_SECURE = False       # Set to True with HTTPS
SESSION_COOKIE_HTTPONLY = True      # Protect from JavaScript
SESSION_COOKIE_SAMESITE = 'Lax'     # Cross-site policy
```

**Session Flow:**

1. User logs in via POST to Django auth endpoint
2. Django creates session and sets cookies
3. Frontend sends cookies with `withCredentials: true`
4. Django validates session and user is authenticated

---

### REST Framework Configuration

**File:** `backend/config/settings.py`

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,                 # Items per page
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```

**Authentication Methods:**

- `SessionAuthentication` - Uses Django sessions (current)
- `TokenAuthentication` - API tokens (production)
- `JWTAuthentication` - JSON Web Tokens (modern)

**Permission Classes:**

- `IsAuthenticatedOrReadOnly` - Anyone can read, authenticated users can write
- `IsAuthenticated` - Requires authentication for all requests
- `IsAdminUser` - Admin only

---

### Installed Apps

**File:** `backend/config/settings.py`

```python
INSTALLED_APPS = [
    # Django built-ins
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',               # Django REST Framework
    'corsheaders',                  # CORS support

    # Local apps (modular structure)
    'apps.users',                   # User management
    'apps.products',                # Product catalog
    'apps.orders',                  # Order management
]
```

**Modular Structure Benefits:**

- Easy to manage and reuse apps
- Clear separation of concerns
- Each app has models, views, serializers, URLs

---

### Static and Media Files

**File:** `backend/config/settings.py`

```python
# Static files (CSS, JavaScript, images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (User uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

**In Development (settings.py):**

```python
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

**In Production:**

- Use cloud storage (AWS S3, Azure Storage, etc.)
- Or separate static file server
- Never serve from Django directly

---

## Frontend React Configuration

### Vite Configuration

**File:** `frontend/vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Dev server port
    proxy: {
      // API proxy
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**What the Proxy Does:**

- Requests to `/api` → forwarded to `http://localhost:8000/api`
- Allows using relative URLs in development
- Eliminates CORS issues during development

**Example:**

```javascript
// Both work the same in development:
fetch("/api/products/"); // Uses proxy
fetch("http://localhost:8000/api/products/"); // Direct
```

---

### Environment Variables

**File:** `frontend/.env`

```
VITE_API_BASE_URL=http://localhost:8000/api
```

**Accessing in Code:**

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

**Important:** Variables must start with `VITE_` to be accessible in browser.

---

### API Client Configuration

**File:** `frontend/src/api/client.js`

```javascript
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies
});
```

**Request Interceptor:**

- Automatically adds CSRF token from cookies
- Runs before each request

**Response Interceptor:**

- Handles 401 (Unauthorized) - redirects to login
- Handles 403 (Forbidden) - logs permission error

---

## Development vs Production

### Development Settings

**Backend:**

```python
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
```

**Frontend:**

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Production Settings

**Backend:**

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
SECRET_KEY = 'your-secret-key-from-env'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CORS_ALLOWED_ORIGINS = ['https://yourdomain.com']
```

**Frontend:**

```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## Environment Variables Summary

### Backend (.env)

```ini
# Django settings
DEBUG=True
SECRET_KEY=django-insecure-your-secret-key-change-in-production

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=refill_web
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env)

```ini
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## API Endpoint Patterns

All endpoints follow REST conventions:

```
GET    /api/{resource}/           List all
POST   /api/{resource}/           Create new
GET    /api/{resource}/{id}/      Get one
PUT    /api/{resource}/{id}/      Replace
PATCH  /api/{resource}/{id}/      Update
DELETE /api/{resource}/{id}/      Delete
```

**With Filtering & Search:**

```
GET /api/products/?category=1&price__lte=100&search=laptop
```

**With Pagination:**

```
GET /api/products/?page=2&page_size=20
```

---

## Security Checklist

### Development ✓

- [x] DEBUG = True (development only)
- [x] CSRF protection enabled
- [x] CORS configured for localhost
- [x] Session cookies set to HTTP only

### Production ⚠️

- [ ] DEBUG = False
- [ ] SECRET_KEY from environment (not in code)
- [ ] CORS_ALLOWED_ORIGINS set to specific domains
- [ ] CSRF_COOKIE_SECURE = True (HTTPS only)
- [ ] SESSION_COOKIE_SECURE = True (HTTPS only)
- [ ] Use production database (not local SQLite)
- [ ] Use production WSGI server (Gunicorn, uWSGI)
- [ ] Static files served from CDN or reverse proxy
- [ ] HTTPS enabled (SSL certificate)
- [ ] Regular backups configured

---

## Troubleshooting Configuration Issues

### Issue: CORS Error

**Check:**

1. Is frontend URL in `CORS_ALLOWED_ORIGINS`?
2. Is `CorsMiddleware` before `CommonMiddleware`?
3. Are you using `withCredentials: true` in fetch?

**Fix:**

```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = ['http://localhost:5173']
```

### Issue: CSRF Token Error

**Check:**

1. Is `CSRF_COOKIE_HTTPONLY = False`?
2. Are you setting `X-CSRFToken` header?
3. Is JWT token in Authorization header?

**Fix:**

```python
CSRF_COOKIE_HTTPONLY = False  # Allow JS to read token
```

### Issue: MySQL Connection Error

**Check:**

1. Is MySQL running in XAMPP?
2. Is `DB_HOST` correct (localhost)?
3. Is `DB_NAME` database created?

**Fix:**

```sql
CREATE DATABASE refill_web CHARACTER SET utf8mb4;
```

### Issue: Frontend Can't Connect to API

**Check:**

1. Is Django running on port 8000?
2. Is `VITE_API_BASE_URL` correct?
3. Are request headers correct?

**Fix:**

```javascript
// Verify in browser console
fetch("http://localhost:8000/api/products/").then((r) => console.log(r.status));
```

---

## Performance Optimization

### Django

```python
# Use database indexing
class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)

# Use select_related for ForeignKey
products = Product.objects.select_related('category')

# Use prefetch_related for reverse relations
orders = Order.objects.prefetch_related('items')

# Paginate large queries
from rest_framework.pagination import PageNumberPagination
```

### Frontend

```javascript
// Memoize components
const ProductList = React.memo(({ products }) => {
  return products.map((p) => <Product key={p.id} {...p} />);
});

// Cache API responses
const cache = new Map();
async function fetchProducts() {
  if (cache.has("products")) {
    return cache.get("products");
  }
  const res = await apiClient.get("/products/");
  cache.set("products", res.data);
  return res.data;
}
```

---

## Further Reading

- [Django Settings Reference](https://docs.djangoproject.com/4.1/ref/settings/)
- [Django CORS Headers](https://pypi.org/project/django-cors-headers/)
- [Vite Configuration](https://vitejs.dev/config/)
- [Axios Documentation](https://axios-http.com/)
