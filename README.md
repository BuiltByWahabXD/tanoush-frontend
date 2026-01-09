# AuthPractice Full-Stack Application Documentation

## 📋 Project Overview

A complete full-stack authentication system built with **Node.js/Express** backend and **React/Vite** frontend. This project demonstrates secure JWT-based authentication with access tokens, refresh tokens, protected routes, and theme management.

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM v7.10.0
- **UI Library**: Material-UI (MUI) v7
- **HTTP Client**: Axios
- **Charts**: MUI X Charts Pro
- **Token Decoding**: jwt-decode
- **Animations**: Framer Motion

---

## 🔐 BACKEND AUTHENTICATION SYSTEM

### Architecture Overview

The backend implements a **dual-token authentication system** using JWT:
1. **Access Token**: Short-lived (1 minute) for API access
2. **Refresh Token**: Long-lived (7 days) for token renewal

---

### 📁 File Structure

```
AuthPractice-API/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── users.js             # Auth business logic
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   └── users.js             # User schema
│   ├── routes/
│   │   └── users.js             # Auth routes
│   ├── utils/
│   │   └── generateTokens.js    # Token generation utilities
│   ├── validators/
│   │   └── signupValidator.js   # Input validation
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
└── package.json
```

---

### 🗄️ Database Schema

**User Model** (`models/users.js`):
```javascript
{
  email: String (unique, required),
  name: String (required),
  password: String (hashed, required),
  refreshTokens: [String] (array of refresh tokens)
}
```

**Key Features**:
- Stores multiple refresh tokens per user
- Passwords are never stored in plain text
- Email must be unique across the system

---

### 🔑 Token Generation

**Location**: `utils/generateTokens.js`

#### 1. Password Hashing
```javascript
generateHash(password)
```
- Uses bcryptjs with salt rounds (10)
- Generates secure, one-way hash
- Cannot be reversed to get original password

#### 2. Access Token Generation
```javascript
generateToken(user)
```
- **Payload**: `{ id: user._id, email: user.email }`
- **Secret**: `process.env.JWT_SECRET`
- **Expiration**: 1 minute (`JWT_EXPIRATION` in .env)
- **Purpose**: Grants temporary API access

#### 3. Refresh Token Generation
```javascript
generateRefreshToken(user)
```
- **Payload**: `{ id: user._id, email: user.email }`
- **Secret**: `process.env.REFRESH_TOKEN` (different from access token)
- **Expiration**: 7 days (`REFRESH_TOKEN_EXPIRATION` in .env)
- **Purpose**: Used to obtain new access tokens
- **Storage**: Saved in database `refreshTokens` array

---

### 🛣️ API Endpoints

**Base URL**: `http://localhost:3000/api/users`

#### 1. **POST** `/signup`
**Purpose**: Register a new user

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**Process**:
1. Validates input with `signupValidator`
2. Checks if email already exists
3. Hashes password with bcrypt
4. Creates user in database
5. Generates refresh token
6. Saves refresh token in user document

**Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### 2. **POST** `/login`
**Purpose**: Authenticate user and issue tokens

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Process**:
1. Finds user by email in database
2. Compares password with stored hash using `bcrypt.compare()`
3. If match: generates **both** access and refresh tokens
4. Sets tokens as **httpOnly cookies**:
   - `accessToken`: expires in 1 minute
   - `refreshToken`: expires in 7 days
5. Returns user data

**Cookie Settings**:
```javascript
{
  httpOnly: true,      // Cannot be accessed by JavaScript
  secure: false,       // Set to true in production (HTTPS)
  sameSite: "lax",     // CSRF protection
  path: "/",           // Available across entire app
  maxAge: 1 * 60 * 1000  // 1 minute for access token
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "accesstoken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshtoken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### 3. **POST** `/refresh` 🔒 (Protected)
**Purpose**: Obtain new access token using refresh token

**Process**:
1. Extracts `refreshToken` from cookie
2. Verifies token signature and expiration
3. Finds user in database
4. Checks if refresh token exists in user's `refreshTokens` array
5. If valid: generates **new access token**
6. Sets new access token as cookie
7. Refresh token remains unchanged

**Security Checks**:
- Refresh token must be valid (not expired)
- Refresh token must exist in database
- User must exist in database

**Response** (200):
```json
{
  "success": true,
  "message": "Token refreshed"
}
```

---

#### 4. **GET** `/me` 🔒 (Protected)
**Purpose**: Get current authenticated user's data

**Process**:
1. `authMiddleware` verifies access token
2. Extracts user ID from token payload
3. Fetches user from database (excludes password & refresh tokens)
4. Returns user data

**Response** (200):
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

---

#### 5. **POST** `/logout` 🔒 (Protected)
**Purpose**: Log out user and clear tokens

**Process**:
1. Verifies access token via `authMiddleware`
2. Clears both cookies:
   - `accessToken`
   - `refreshToken`
3. Client must delete localStorage state

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 🛡️ Authentication Middleware

**Location**: `middleware/authMiddleware.js`

**Function**: `protect`

**Purpose**: Validates access token on protected routes

**Process**:
```javascript
1. Extract accessToken from cookies
   ↓
2. If no token → Return 401 Unauthorized
   ↓
3. Verify token with jwt.verify()
   ↓
4. If invalid/expired → Return 401
   ↓
5. Extract user ID from decoded token
   ↓
6. Fetch user from database (exclude password)
   ↓
7. If user not found → Return 401
   ↓
8. Attach user to req.user
   ↓
9. Call next() → Proceed to controller
```

**Usage**:
```javascript
router.get('/me', protect, UsersController.getCurrentUser);
```

---

### 🔒 Security Measures

1. **Password Security**:
   - Bcrypt hashing with salt
   - Passwords never stored in plain text
   - Never returned in API responses

2. **Token Security**:
   - Different secrets for access and refresh tokens
   - Short-lived access tokens (1 minute)
   - Refresh tokens stored in database for validation

3. **Cookie Security**:
   - `httpOnly`: Prevents XSS attacks
   - `sameSite: "lax"`: CSRF protection
   - `secure: true` (production): HTTPS only

4. **Database Security**:
   - Refresh tokens validated against stored array
   - Sensitive fields excluded from responses (`.select("-password")`)

---

## 🌐 FRONTEND AUTHENTICATION SYSTEM

### Architecture Overview

The frontend implements a **context-based authentication system** with:
- Automatic token refresh
- Protected route handling
- Persistent authentication state
- Axios interceptors for API calls

---

### 📁 File Structure

```
AuthPractice-frontend/
├── src/
│   ├── api/
│   │   └── api.js                # API utility with auto-refresh
│   ├── auth/
│   │   ├── AuthProvider.jsx      # Auth context & state management
│   │   ├── ProtectedRoute.jsx    # Route protection component
│   │   └── jwtdecode.js          # JWT decoding utility
│   ├── components/
│   │   ├── AppBar.jsx            # Authenticated user navbar
│   │   ├── LandingAppBar.jsx     # Public navbar
│   │   └── [other components]
│   ├── pages/
│   │   ├── login.jsx             # Login page
│   │   ├── signup.jsx            # Signup page
│   │   ├── homePage.jsx          # Protected home
│   │   └── ProfilePage.jsx       # User profile
│   ├── routes/
│   │   ├── index.jsx             # Route definitions
│   │   ├── privateRoutes.jsx     # Protected routes
│   │   └── publicRoutes.jsx      # Public routes
│   ├── context/
│   │   └── themeContext.jsx      # Theme management
│   └── App.jsx                   # Root component
└── package.json
```

---

### 🎯 Authentication Context

**Location**: `auth/AuthProvider.jsx`

**Purpose**: Central authentication state management

#### State Variables

```javascript
{
  user: {                          // User data object
    userId: string,
    name: string,
    email: string
  } | null,
  
  isAuthenticated: boolean,        // Auth status
  loading: boolean                 // Initial load state
}
```

#### Initialization Flow

```javascript
1. Component mounts
   ↓
2. Check localStorage for "isAuthenticated"
   ↓
3. If false → Set loading=false, skip API check
   ↓
4. If true → Call /api/users/me
   ↓
5. If success → Set user & isAuthenticated=true
   ↓
6. If fails → Clear auth state & localStorage
   ↓
7. Set loading=false → Render app
```

#### Key Functions

**`login(userData)`**
```javascript
Purpose: Set authentication state after successful login
Actions:
  - Sets user data
  - Sets isAuthenticated = true
  - Saves "isAuthenticated" to localStorage
```

**`logout()`**
```javascript
Purpose: Clear authentication state
Actions:
  - Sets user = null
  - Sets isAuthenticated = false
  - Removes "isAuthenticated" from localStorage
  - Does NOT clear cookies (server-side responsibility)
```

#### Auto Token Refresh

```javascript
useEffect(() => {
  if (!isAuthenticated) return;
  
  const interval = setInterval(async () => {
    await fetch("/api/users/refresh", {
      method: "POST",
      credentials: "include"  // Send cookies
    });
  }, 50000);  // Every 50 seconds (before 1-minute expiration)
  
  return () => clearInterval(interval);
}, [isAuthenticated]);
```

**Why 50 seconds?**
- Access token expires in 60 seconds
- Refresh at 50 seconds ensures 10-second buffer
- Prevents token expiration during active sessions

---

### 🔐 API Utility

**Location**: `api/api.js`

**Purpose**: Centralized API calls with automatic token refresh

#### Core Function: `apiFetch()`

```javascript
apiFetch(path, options)
```

**Features**:
1. Automatic base URL prefixing
2. Credentials included in every request
3. Auto-retry with token refresh on 401 errors
4. JSON parsing with error handling

#### Request Flow

```javascript
1. Make API request with credentials: "include"
   ↓
2. If response.ok (200-299) → Return data
   ↓
3. If status === 401 (Unauthorized):
   ├─→ Call attemptRefresh()
   ├─→ If refresh succeeds → Retry original request
   └─→ If refresh fails → Throw error
   ↓
4. Any other error → Throw with status & message
```

#### Token Refresh Function

```javascript
async function attemptRefresh() {
  const res = await fetch("/api/users/refresh", {
    method: "POST",
    credentials: "include"  // Sends refresh token cookie
  });
  
  if (!res.ok) return false;
  
  const data = await res.json();
  return data?.success === true;
}
```

**Process**:
1. Sends refresh token (via cookie) to backend
2. Backend validates refresh token
3. Backend issues new access token (via cookie)
4. Returns success status
5. Original request is automatically retried

---

### 🛡️ Protected Routes

**Location**: `auth/ProtectedRoute.jsx`

**Purpose**: Restrict access to authenticated users only

#### Component Logic

```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;  // Redirect to landing
  }
  
  return (
    <>
      <AppBar />                    {/* Authenticated navbar */}
      <main>{children}</main>       {/* Protected content */}
    </>
  );
}
```

#### Usage in Routes

```javascript
<Route 
  path="/home" 
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  } 
/>
```

**Behavior**:
- If `isAuthenticated = false` → Redirect to `/` (landing page)
- If `isAuthenticated = true` → Render protected content
- Shows authenticated AppBar with logout option

---

### 🔓 Login Flow (Detailed)

**Location**: `pages/login.jsx`

#### Step-by-Step Process

```javascript
1. User enters credentials
   ↓
2. Form submission calls handleLogin()
   ↓
3. POST request to /api/users/login via apiFetch()
   ↓
4. Backend validates credentials
   ↓
5. Backend sets access & refresh tokens as cookies
   ↓
6. Backend returns user data
   ↓
7. Frontend receives response
   ↓
8. Call AuthContext.login(userData)
   ↓
9. Update state:
   - user = userData
   - isAuthenticated = true
   - localStorage.setItem("isAuthenticated", "true")
   ↓
10. Navigate to /home
    ↓
11. Auto-refresh timer starts (50-second interval)
```

#### Code Example

```javascript
const handleLogin = async (credentials) => {
  try {
    const response = await apiFetch("/api/users/login", {
      method: "POST",
      body: credentials
    });
    
    if (response.success) {
      login(response.data);        // Update auth context
      navigate("/home");           // Redirect to protected route
    }
  } catch (error) {
    console.error("Login failed:", error.message);
    // Show error notification
  }
};
```

---

### 🚪 Logout Flow (Detailed)

#### Step-by-Step Process

```javascript
1. User clicks "Logout" button
   ↓
2. Call handleLogout()
   ↓
3. POST request to /api/users/logout
   ↓
4. Backend clears cookie headers:
   - res.clearCookie("accessToken")
   - res.clearCookie("refreshToken")
   ↓
5. Backend returns success
   ↓
6. Frontend receives confirmation
   ↓
7. Call AuthContext.logout()
   ↓
8. Update state:
   - user = null
   - isAuthenticated = false
   - localStorage.removeItem("isAuthenticated")
   ↓
9. Auto-refresh timer stops
   ↓
10. Navigate to / (landing page)
    ↓
11. Public navbar shown
```

#### Code Example

```javascript
const handleLogout = async () => {
  try {
    await apiFetch("/api/users/logout", {
      method: "POST"
    });
    
    logout();                      // Clear auth context
    navigate("/");                 // Redirect to landing
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
```

---

### 🔄 Token Refresh Strategies

#### 1. **Proactive Refresh** (Primary)
- **Trigger**: Every 50 seconds while authenticated
- **Mechanism**: `setInterval` in AuthProvider
- **Advantage**: Tokens never expire during active sessions
- **Code**: See AuthProvider useEffect

#### 2. **Reactive Refresh** (Fallback)
- **Trigger**: 401 response from any API call
- **Mechanism**: `apiFetch()` retry logic
- **Advantage**: Handles missed intervals (e.g., suspended tabs)
- **Code**: See api.js attemptRefresh()

#### Combined Strategy

```
User logged in
    ↓
[Timer: Refresh every 50s] ← Proactive
    ↓
User makes API call
    ↓
If 401 received → Attempt refresh → Retry ← Reactive
    ↓
Continue session
```

---

### 📱 JWT Decoding Utility

**Location**: `auth/jwtdecode.js`

**Purpose**: Manually decode JWT payload (not used for validation)

```javascript
function decodeJwt(token) {
  // Split token: header.payload.signature
  const parts = token.split(".");
  
  // Decode base64 payload
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + (4 - (base64.length % 4)) % 4, 
    "="
  );
  
  // Parse JSON
  const json = atob(padded);
  return JSON.parse(json);
}
```

**Use Case**: Extracting user info from tokens (if needed on frontend)

**⚠️ Important**: 
- **NEVER** use for security validation
- Backend MUST validate all tokens
- Frontend decoding is for display purposes only

---

### 🎨 Theme Context Integration

**Location**: `context/themeContext.jsx`

**Purpose**: Separate concern from authentication

**Key Points**:
- Manages light/dark theme state
- Stored in localStorage separately
- Independent of auth state
- Used by components like `ZoomLineChart.jsx`

```javascript
const { theme } = useThemeContext();
// Returns "light" or "dark"
```

---

## 🔒 Security Best Practices Implemented

### Backend
1. ✅ Passwords hashed with bcrypt
2. ✅ Different secrets for access & refresh tokens
3. ✅ Refresh tokens stored and validated in database
4. ✅ HttpOnly cookies prevent XSS attacks
5. ✅ SameSite cookies prevent CSRF attacks
6. ✅ Short-lived access tokens (1 minute)
7. ✅ Sensitive data excluded from responses
8. ✅ Input validation with express-validator

### Frontend
1. ✅ No token storage in localStorage
2. ✅ All requests include credentials (cookies)
3. ✅ Automatic token refresh before expiration
4. ✅ Protected routes prevent unauthorized access
5. ✅ Auth state persisted in localStorage (not tokens)
6. ✅ Loading states prevent flash of wrong content
7. ✅ Error handling for failed auth attempts
8. ✅ JWT decoded client-side only for display (not validation)

---

## 🚀 Environment Variables

### Backend (`.env`)
```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/authpractice
JWT_SECRET=your_access_token_secret
JWT_EXPIRATION=1m
REFRESH_TOKEN=your_refresh_token_secret
REFRESH_TOKEN_EXPIRATION=7d
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER LOGIN FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Frontend                    Backend                    Database
   │                           │                           │
   │─────POST /login───────────>│                           │
   │  (email, password)         │                           │
   │                            │────Find user by email────>│
   │                            │<─────User document────────│
   │                            │                           │
   │                            │──Compare passwords────────│
   │                            │   (bcrypt.compare)        │
   │                            │                           │
   │                            │──Generate access token────│
   │                            │  (JWT, 1min expiry)       │
   │                            │                           │
   │                            │──Generate refresh token───│
   │                            │  (JWT, 7day expiry)       │
   │                            │                           │
   │                            │──Save refresh token──────>│
   │                            │  (user.refreshTokens)     │
   │                            │                           │
   │<─Set-Cookie: accessToken───│                           │
   │<─Set-Cookie: refreshToken──│                           │
   │<─────User data─────────────│                           │
   │                            │                           │
   │──Update AuthContext────────│                           │
   │  (user, isAuthenticated)   │                           │
   │                            │                           │
   │──Navigate to /home─────────│                           │
   │                            │                           │
   │──Start 50s refresh timer───│                           │
   │                            │                           │

┌─────────────────────────────────────────────────────────────────┐
│                      AUTO TOKEN REFRESH                          │
└─────────────────────────────────────────────────────────────────┘

Frontend                    Backend                    Database
   │                           │                           │
   │─[50 seconds elapsed]───────│                           │
   │                            │                           │
   │────POST /refresh──────────>│                           │
   │  (refreshToken cookie)     │                           │
   │                            │──Verify refresh token─────│
   │                            │  (jwt.verify)             │
   │                            │                           │
   │                            │──Find user───────────────>│
   │                            │<──User document───────────│
   │                            │                           │
   │                            │──Validate token in array──│
   │                            │  (refreshTokens.includes) │
   │                            │                           │
   │                            │──Generate new access──────│
   │                            │  token (JWT, 1min)        │
   │                            │                           │
   │<─Set-Cookie: accessToken───│                           │
   │  (new token)               │                           │
   │                            │                           │
   │──Continue session──────────│                           │
   │                            │                           │

┌─────────────────────────────────────────────────────────────────┐
│                    PROTECTED API CALL FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Frontend                    Backend                    Database
   │                           │                           │
   │─────GET /api/users/me─────>│                           │
   │  (accessToken cookie)      │                           │
   │                            │──authMiddleware───────────│
   │                            │  Extract & verify token   │
   │                            │                           │
   │                            │──Find user by token ID───>│
   │                            │<──User document───────────│
   │                            │                           │
   │                            │──Attach to req.user───────│
   │                            │                           │
   │                            │──Controller executes──────│
   │                            │                           │
   │<─────User data─────────────│                           │
   │  (excludes password)       │                           │
   │                            │                           │
```

---

## 🧪 Testing the System

### Manual Testing Checklist

1. **Signup**:
   - ✅ Create new user
   - ✅ Duplicate email rejected
   - ✅ Password validation

2. **Login**:
   - ✅ Valid credentials accepted
   - ✅ Invalid credentials rejected
   - ✅ Cookies set correctly

3. **Token Refresh**:
   - ✅ Auto-refresh after 50 seconds
   - ✅ Manual refresh on 401 error
   - ✅ Invalid refresh token rejected

4. **Protected Routes**:
   - ✅ Authenticated users can access
   - ✅ Unauthenticated users redirected
   - ✅ Token expiration handled gracefully

5. **Logout**:
   - ✅ Cookies cleared
   - ✅ Auth state reset
   - ✅ Redirect to landing page

---

## 🎯 Key Takeaways

### What Makes This System Secure

1. **Dual-Token Strategy**: Short-lived access tokens minimize damage if compromised
2. **HttpOnly Cookies**: Tokens inaccessible to JavaScript (XSS protection)
3. **Database Validation**: Refresh tokens verified against stored values
4. **Automatic Refresh**: Seamless user experience without re-login
5. **Separate Secrets**: Different keys for access and refresh tokens
6. **Password Hashing**: Irreversible one-way encryption

### What Makes This System User-Friendly

1. **Auto-Refresh**: Users stay logged in during active sessions
2. **Loading States**: No flash of unauthenticated content
3. **Error Handling**: Clear feedback on authentication failures
4. **Persistent State**: Authentication survives page refreshes
5. **Protected Routes**: Automatic redirection to appropriate pages

---

## 📚 Additional Features

### Frontend Components

1. **ZoomLineChart**: Interactive chart with theme-aware colors
2. **ThemeSwitch**: Toggle between light/dark modes
3. **AppBar**: Navigation with logout functionality
4. **Material-UI Integration**: Consistent design system

### Backend Features

1. **Morgan Logging**: HTTP request logging
2. **CORS Configuration**: Cross-origin request handling
3. **Error Handling**: Centralized error middleware
4. **Input Validation**: Express-validator for signup

---

## 🔮 Future Enhancements

1. Email verification
2. Password reset functionality
3. Social login (OAuth)
4. Role-based access control (RBAC)
5. Rate limiting
6. Session management (logout from all devices)
7. Two-factor authentication (2FA)
8. Refresh token rotation

---

## 📝 Notes

- This documentation covers the authentication system in detail
- All code examples are from the actual implementation
- Security measures follow industry best practices
- The system is production-ready with minor adjustments (HTTPS, environment-specific configs)

---

**Author**: Abdul Wahab  
**Project**: AuthPractice Full-Stack Application  
**Last Updated**: January 9, 2026
