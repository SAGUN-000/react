# E-Commerce Application - Features Documentation

A comprehensive guide explaining how each feature works in the e-commerce application.

---

## 1. Authentication System

### Overview
The authentication system manages user login, signup, and session management through JWT (JSON Web Tokens).

### How It Works

#### **Login Process**
1. User enters email and password on the login page
2. Credentials are sent to the backend API (`/login` endpoint)
3. Backend validates the credentials
4. If valid, backend returns a JWT token
5. Token is stored in browser's **localStorage** with key `jwt_token`
6. User is redirected to home page
7. Token is now used for all authenticated requests

#### **Signup Process**
1. User fills in registration form with username, email, and password
2. Data is sent to backend (`/signup` endpoint)
3. Backend creates new user account
4. User can then login with their new credentials

#### **Session Management**
- JWT token is stored in `localStorage` (persists across browser sessions)
- Token is sent with every API request in the `Authorization` header
- Format: `Authorization: Bearer <token>`

---

## 2. Navbar Authentication State

### Overview
The navbar displays different UI based on whether the user is logged in or not.

### How It Works

#### **Login Check**
```javascript
// Navbar checks if user has a valid token
const token = localStorage.getItem("jwt_token");
```

#### **Token Expiration Validation**
1. Navbar extracts the JWT token's expiration date (the `exp` claim)
2. Compares current time with expiration time
3. If token is expired:
   - Token is automatically removed from localStorage
   - Navbar switches to show "Login" button
4. Every second, navbar re-checks if token is still valid

#### **What Navbar Shows**

**When NOT Logged In:**
- Shows "Login" button
- User can click to go to login page

**When Logged In (Token Valid):**
- Shows profile icon
- User can click to view their profile page
- Profile icon remains visible as long as token is valid

---

## 3. Profile Page

### Overview
Displays the logged-in user's account information.

### How It Works

#### **Loading Profile**
1. User clicks the profile icon in navbar
2. Application navigates to `/profile` route
3. Profile component runs and fetches user details
4. Sends request to backend with JWT token: `GET /profile`
5. Backend returns user information (username, email)
6. Profile page displays the information

#### **Displaying Information**
- **Username**: Retrieved from `userDetails.username` or `userDetails.name`
- **Email**: Retrieved from `userDetails.email`
- If data is missing, displays "N/A"

#### **Error Handling**
- If token is expired or invalid, shows error message
- If backend is unreachable, shows error message
- While loading, shows "Loading profile..." message

#### **Logout Feature**
1. User clicks "Logout" button
2. JWT token is removed from localStorage
3. User is redirected to login page
4. Navbar automatically updates and shows "Login" button

---

## 4. Token Management

### Overview
Tokens are the key to maintaining user sessions and security.

### How It Works

#### **Token Storage**
- Stored in browser's `localStorage` with key: `jwt_token`
- Persists even after browser is closed and reopened

#### **Token Usage**
- Sent with every API request that requires authentication
- Backend validates token on every request
- If token is invalid/expired, backend returns 401 error

#### **Token Expiration**
- Every JWT token has an expiration time (usually a few hours)
- Navbar constantly checks (every 1 second) if token is expired
- If expired:
  - Token is deleted
  - User is logged out automatically
  - Navbar updates immediately

#### **Token Verification**
The navbar decodes the token to check expiration:
```javascript
// Example: JWT structure
const payload = JSON.parse(atob(token.split('.')[1]));
const expirationTime = payload.exp; // Unix timestamp
const currentTime = Math.floor(Date.now() / 1000);
if (expirationTime < currentTime) {
  // Token is expired
  localStorage.removeItem('jwt_token');
}
```

---

## 5. Cart System

### Overview
Users can add products to a shopping cart and view their cart items.

### How It Works

#### **Adding to Cart**
1. User clicks "Add to Cart" button on a product
2. Product information is sent to backend: `POST /cart/addtocart`
3. Backend adds item to user's cart (associated with their JWT token)
4. Cart updates on the frontend

#### **Viewing Cart**
1. User clicks cart icon in navbar
2. Application navigates to `/cart` route
3. Sends request to backend: `GET /cart/view_cart`
4. Backend returns all items in cart + subtotal
5. Cart page displays items with prices

#### **Authentication Required**
- All cart operations require a valid JWT token
- If user is not logged in, they cannot access cart
- If token expires, cart requests will fail (user is redirected to login)

---

## 6. Protected Routes

### Overview
Certain pages are only accessible to logged-in users.

### How It Works

#### **Route Protection**
Some routes like `/cart` and `/profile` are wrapped in a `ProtectedRoute` component:
```javascript
<ProtectedRoute>
  <Cart />
</ProtectedRoute>
```

#### **Access Control**
1. When user tries to access a protected route
2. Component checks if JWT token exists
3. If token exists: allows access to the page
4. If token doesn't exist: redirects to login page
5. User must login before accessing protected content

---

## 7. Logout Functionality

### Overview
Users can securely end their session.

### How It Works

#### **Logout Steps**
1. User clicks "Logout" button on profile page
2. JWT token is removed from localStorage
3. User is redirected to login page
4. Navbar detects token is gone and shows "Login" button
5. All subsequent requests are no longer authenticated

#### **What Happens After Logout**
- User cannot access cart or profile
- Attempting to access protected routes redirects to login
- User must login again to continue shopping

---

## 8. Search Functionality

### Overview
Users can search for products by keyword.

### How It Works

#### **Search Process**
1. User types in search box in navbar
2. As user types, keyword is stored in state
3. When search triggers, API is called: `GET /products/{keyword}`
4. Backend returns matching products
5. Results are displayed on home page

#### **Without Search**
- Default API call: `GET /products`
- Returns all available products

---

## 9. Product Details

### Overview
Users can view detailed information about a specific product.

### How It Works

#### **Accessing Product Details**
1. User clicks on a product
2. Application navigates to `/product_details/{id}`
3. Page fetches product information from backend
4. Displays product image, price, description, reviews, etc.
5. User can add product to cart from this page

---

## 10. API Integration

### Overview
The application communicates with a backend server via HTTP requests.

### Base URL
```
http://localhost:8080
```

### Key API Endpoints

| Method | Endpoint | Description | Requires Token |
|--------|----------|-------------|-----------------|
| POST | `/login` | User login | No |
| POST | `/signup` | User registration | No |
| GET | `/profile` | Get user details | Yes |
| GET | `/products` | Get all products | No |
| GET | `/products/{keyword}` | Search products | No |
| POST | `/cart/addtocart` | Add item to cart | Yes |
| GET | `/cart/view_cart` | View cart items | Yes |

### Error Handling
- **401 Error**: Token is invalid or expired → Redirect to login
- **500 Error**: Server error → Show error message
- **Network Error**: Backend unreachable → Show error message

---

## 11. Frontend Architecture

### Components Structure
```
App.jsx (Main component)
├── Layout.jsx (Header, Navbar, Footer)
│   ├── Navbar.jsx (Authentication state display)
│   └── Footer.jsx
├── Home.jsx (Product listing)
├── Login.jsx (Login form)
├── Signup.jsx (Registration form)
├── Profile.jsx (User profile)
├── Cart.jsx (Shopping cart)
├── ProductDetails.jsx (Product info)
├── Categories.jsx (Category filtering)
└── ProtectedRoute.jsx (Route protection)
```

### State Management
- **Products**: List of all products
- **Cart Items**: Items in user's cart
- **User Details**: Current user's information
- **Keyword**: Current search keyword
- **Token**: JWT token in localStorage

---

## 12. Quick Start for Users

### For New Users
1. Click "Sign Up" to create an account
2. Enter username, email, and password
3. Submit the form
4. Login with your credentials
5. Browse products and add to cart
6. Click profile icon to view account
7. Click "Logout" to end session

### For Existing Users
1. Click "Login" button
2. Enter email and password
3. Click "Sign In"
4. You're now logged in and can shop
5. Profile icon appears in navbar

---

## 13. Security Features

### Token Security
- Tokens are stored in localStorage (relatively secure)
- Tokens are sent only over HTTPS in production
- Tokens have expiration times (automatic logout)

### Password Security
- Passwords are sent to backend (never stored in frontend)
- Backend should hash passwords
- Never send passwords in plain text (use HTTPS)

### API Security
- All authenticated endpoints require valid JWT token
- Backend validates token on every request
- Invalid tokens are rejected with 401 error

---

## 14. Troubleshooting

### "Loading profile..." stays forever
**Problem**: Backend `/profile` endpoint is not responding
**Solution**: Check if backend server is running and `/profile` endpoint exists

### Profile icon doesn't appear after login
**Problem**: Token was not saved or is invalid
**Solution**: Check browser localStorage for `jwt_token` key

### Cannot access cart after login
**Problem**: Token expired or cart endpoint not responding
**Solution**: Logout and login again, or check backend is running

### Search not working
**Problem**: Backend `/products/{keyword}` endpoint issue
**Solution**: Check backend server is running with product data

---

## 15. How to Extend Features

### Adding New Features
1. Create new component in appropriate folder
2. Add new route in App.jsx
3. Create corresponding backend endpoint
4. Send JWT token with authenticated requests
5. Handle errors appropriately

### Adding New Protected Routes
1. Wrap component with `<ProtectedRoute>`
2. Token validation happens automatically
3. Unauthorized users redirected to login

### Adding New API Calls
1. Use `axios` or `fetch` API
2. Include JWT token in Authorization header
3. Handle 401 errors (token expired/invalid)
4. Show error message if request fails

---

## Summary

This e-commerce application provides:
- ✅ User authentication (login/signup)
- ✅ Secure session management with JWT
- ✅ Protected routes for logged-in users
- ✅ Automatic token expiration checking
- ✅ Shopping cart functionality
- ✅ Product search and browsing
- ✅ User profile management
- ✅ Clean and intuitive UI

All features work together to provide a complete e-commerce experience!
