# React Frontend - Refill Web

React 18 + Vite frontend with configured CORS support for Django backend communication.

## Project Structure

```
frontend/
├── src/
│   ├── api/                      # API service layer
│   │   ├── client.js            # Axios instance with interceptors
│   │   ├── products.js          # Products endpoints
│   │   ├── users.js             # Users endpoints
│   │   └── orders.js            # Orders endpoints
│   ├── App.jsx                  # Main App component
│   ├── App.css                  # App styles
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ and npm/yarn
- Django backend running on `http://localhost:8000`

### 2. Installation

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit if needed (defaults should work)
# VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Development Server

```bash
# Start Vite dev server
npm run dev

# Or with yarn
yarn dev
```

Frontend runs on: `http://localhost:5173`

### 5. Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

## CORS Configuration

The frontend is configured to work with Django's CORS settings:

### Allowed Ports:

- **5173** (Vite default)
- **3000** (Alternative)

### Frontend API Requests:

All API requests include:

- `Content-Type: application/json`
- `withCredentials: true` (for session authentication)
- CSRF token from cookies (if present)

## API Service Usage

### Example: Fetching Products

```jsx
import { productsAPI } from "./api/products";

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  fetchProducts();
}, []);
```

### Example: Creating an Order

```jsx
import { ordersAPI } from "./api/orders";

const createOrder = async () => {
  try {
    const response = await ordersAPI.create({
      shipping_address: "123 Main St",
      items: [{ product_id: 1, quantity: 2, price: 29.99 }],
    });
    console.log("Order created:", response.data);
  } catch (error) {
    console.error("Error creating order:", error);
  }
};
```

### Example: Updating User Profile

```jsx
import { usersAPI } from "./api/users";

const updateProfile = async () => {
  try {
    const response = await usersAPI.updateProfile(profileId, {
      phone: "+1234567890",
      address: "123 Main St",
    });
    console.log("Profile updated:", response.data);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};
```

## API Endpoints Reference

### Products (`/api/products/`)

```javascript
// Get all products
productsAPI.getAll();

// Get product by ID
productsAPI.getById(1);

// Create product (admin)
productsAPI.create({ name: "Product", price: 29.99 });

// Update product (admin)
productsAPI.update(1, { name: "Updated" });

// Delete product (admin)
productsAPI.delete(1);

// Get all categories
productsAPI.getCategories();

// Create category (admin)
productsAPI.createCategory({ name: "Category" });
```

### Users (`/api/auth/`)

```javascript
// Get current user
usersAPI.getCurrentUser();

// Get all users (admin)
usersAPI.getAll();

// Get current user's profile
usersAPI.getMyProfile();

// Update profile
usersAPI.updateProfile(id, { phone: "..." });

// Get all profiles (admin)
usersAPI.getProfiles();
```

### Orders (`/api/orders/`)

```javascript
// Get all orders (admin) or user's orders
ordersAPI.getAll();

// Get order by ID
ordersAPI.getById(1);

// Create order
ordersAPI.create({ shipping_address: "...", items: [] });

// Update order (change status, etc.)
ordersAPI.update(1, { status: "shipped" });

// Update just the status
ordersAPI.updateStatus(1, "delivered");

// Delete order
ordersAPI.delete(1);
```

## Vite Configuration

### Development Server Proxy

The `vite.config.js` includes a proxy to forward `/api` requests to the Django backend:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    secure: false,
  },
}
```

This allows using relative URLs in development:

```javascript
// Both work the same in development
fetch("/api/products/");
fetch("http://localhost:8000/api/products/");
```

## Handling CORS Errors

### Error: "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**

1. Verify Django's CORS settings include your frontend URL
2. Check `CORS_ALLOWED_ORIGINS` in Django's `settings.py`
3. Ensure the backend is running on the correct port

### Error: "CSRF token missing"

**Solution:**

1. Ensure `withCredentials: true` is set in API client
2. Django will set CSRF token in cookies
3. API client automatically includes it in headers

## Vite Environment Variables

Create a `.env` file to override defaults:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

**Note:** Variables must start with `VITE_` to be accessible in the browser.

## Authentication Flow

1. **Login** - POST credentials to Django's session auth endpoint
2. **Session Cookie** - Django sets session cookie in response
3. **Subsequent Requests** - `withCredentials: true` includes cookie
4. **CSRF Token** - Automatically included from cookie (if present)
5. **Logout** - Clear session and redirect

## Production Deployment

Before deploying to production:

1. **Update API Base URL**

   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

2. **Build the application**

   ```bash
   npm run build
   ```

3. **Deploy `dist/` folder** to hosting service (Vercel, Netlify, etc.)

4. **Update CORS settings** in Django to include your frontend domain

5. **Use HTTPS** for all communications

## Dependencies

- **React 18** - UI library
- **React-DOM 18** - React rendering
- **Vite** - Build tool
- **Axios** - HTTP client with interceptors support

## Troubleshooting

### Port 5173 already in use

```bash
# Run on different port
npm run dev -- --port 3000
```

### Cannot fetch API data

1. Check if Django backend is running: `http://localhost:8000`
2. Check browser console for CORS errors
3. Verify Django `CORS_ALLOWED_ORIGINS` includes your frontend URL

### CSRF token errors

1. Ensure session is active
2. Django should set CSRF token in cookies
3. API client automatically includes it

## License

MIT
