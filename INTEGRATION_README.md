# Frontend Integration with GravitInfo Server

This document describes the complete integration of the Frontend application with the GravitInfo Server API.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Configure Environment
Create/update `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

## 📁 New Files Created

### Authentication System
- **`src/contexts/AuthContext.tsx`** - Authentication context provider with JWT token management
- **`src/api/auth.ts`** - Authentication API calls (login, register)
- **`src/components/ProtectedRoute.tsx`** - Route protection component for authenticated users

### Pages
- **`src/pages/Login.tsx`** - User login page
- **`src/pages/Signup.tsx`** - User registration page
- **`src/pages/UserDashboard.tsx`** - User dashboard with bookings

### API Integration
- **`src/api/events.ts`** - Events API calls
- **`src/api/bookings.ts`** - Bookings API calls

## 🔧 Updated Files

### Core Application
- **`src/App.tsx`** - Added AuthProvider, new routes (login, signup, dashboard), protected routes
- **`src/api/apiClient.ts`** - JWT token interceptor, automatic auth header injection, 401 error handling
- **`src/components/Header.tsx`** - User menu, login/signup buttons, conditional admin links
- **`src/components/BookingForm.tsx`** - Auto-fill user data, authentication check, seat selection support

## 🎯 Features Implemented

### Authentication & Authorization
✅ User registration with name, email, password  
✅ User login with JWT token  
✅ Persistent authentication (localStorage)  
✅ Auto-redirect to login for protected routes  
✅ Role-based access control (user/admin)  
✅ Protected admin routes  
✅ Automatic token injection in API calls  
✅ Token expiration handling (401 redirect)  

### User Dashboard
✅ User profile display  
✅ View all user bookings  
✅ Booking details with event info  
✅ Status badges (confirmed, pending, cancelled)  
✅ Admin quick actions (if admin role)  

### Header Navigation
✅ Dynamic user menu with dropdown  
✅ Login/Signup buttons (when not authenticated)  
✅ User avatar with initial  
✅ Logout functionality  
✅ Conditional admin link visibility  

### Booking System
✅ Auto-fill user information  
✅ Authentication required for booking  
✅ Seat selection support  
✅ Real-time availability check  
✅ Proper error handling  

## 🔑 API Integration Details

### Base URL Configuration
```typescript
// Default: http://localhost:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});
```

### Authentication Flow

#### 1. Register
```typescript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional
}
```

#### 2. Login
```typescript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### 3. Authenticated Requests
```typescript
// Token automatically added via interceptor
Authorization: Bearer <token>
```

### Events API

```typescript
import { eventsApi } from './api/events';

// Get all events
const events = await eventsApi.getAll();

// Get event by ID
const event = await eventsApi.getById(1);

// Create event (admin only)
const newEvent = await eventsApi.create({
  title: "Tech Conference",
  date: "2025-06-15",
  totalSeats: 500,
  price: 99.99
});

// Update event (admin only)
await eventsApi.update(1, { price: 89.99 });

// Delete event (admin only)
await eventsApi.delete(1);
```

### Bookings API

```typescript
import { bookingsApi } from './api/bookings';

// Create booking (requires authentication)
const booking = await bookingsApi.create({
  eventId: 1,
  seats: [5, 6, 7],
  quantity: 3,
  totalAmount: 299.97,
  name: "John Doe",
  email: "john@example.com",
  mobile: "+1234567890"
});

// Get user's bookings
const myBookings = await bookingsApi.getUserBookings(userId);

// Get all bookings (with filters)
const eventBookings = await bookingsApi.getAll({ eventId: 1 });

// Update booking status (admin only)
await bookingsApi.update(bookingId, "confirmed");
```

## 🛡️ Protected Routes

### User Routes (Authentication Required)
- `/dashboard` - User dashboard
- `/booking-success` - Booking confirmation page

### Admin Routes (Admin Role Required)
- `/admin/events` - Manage events
- `/admin/events/new` - Create new event
- `/admin/events/:id/edit` - Edit event

### Public Routes
- `/` - Home page
- `/events` - Events list
- `/events/:id` - Event details
- `/login` - Login page
- `/signup` - Signup page

## 🎨 Component Usage

### AuthContext
```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### ProtectedRoute
```typescript
import ProtectedRoute from './components/ProtectedRoute';

// User route
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  } 
/>

// Admin route
<Route 
  path="/admin/events" 
  element={
    <ProtectedRoute requireAdmin>
      <AdminEvents />
    </ProtectedRoute>
  } 
/>
```

## 🔄 State Management

### Authentication State
- **Stored in:** localStorage
- **Keys:** `auth_token`, `auth_user`
- **Persistence:** Survives page refresh
- **Cleanup:** Automatic on 401 errors or manual logout

### User Data Structure
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
```

## 🚨 Error Handling

### API Errors
```typescript
try {
  await bookingsApi.create(bookingData);
} catch (error) {
  console.error(error.message); // User-friendly error message
}
```

### Authentication Errors
- **401 Unauthorized:** Auto-redirect to login, clear tokens
- **403 Forbidden:** Show access denied message
- **Network errors:** Display error message to user

## 🔐 Security Features

✅ JWT token stored in localStorage  
✅ Automatic token injection via interceptors  
✅ Token expiration handling  
✅ Role-based access control  
✅ Protected routes with redirects  
✅ HTTPS recommended for production  
✅ No sensitive data in URLs  

## 📱 Responsive Design

All authentication pages are fully responsive:
- Mobile-first design
- Touch-friendly buttons
- Adaptive layouts
- Modern gradient backgrounds
- Glassmorphism effects

## 🧪 Testing Authentication

### Create Test User
```bash
# Using the signup page
1. Navigate to /signup
2. Fill in: Name, Email, Password
3. Click "Create Account"
4. Auto-login and redirect to /events
```

### Create Admin User
```bash
# Direct API call (for development)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Test Protected Routes
1. Navigate to `/dashboard` (should redirect to login)
2. Login with credentials
3. Access dashboard (should work)
4. Logout and try again (should redirect)

## 🚀 Production Deployment

### Environment Variables
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

### Build
```bash
npm run build
```

### Security Checklist
- [ ] Update API base URL to production
- [ ] Enable HTTPS
- [ ] Configure CORS on backend
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable CSP headers

## 📚 Additional Resources

- [API Documentation](../GravitInfo_server/API_DOCUMENTATION.md)
- [Backend README](../GravitInfo_server/README.md)
- [React Router Docs](https://reactrouter.com/)
- [Axios Docs](https://axios-http.com/)

## 🤝 Support

For issues or questions:
1. Check API documentation
2. Verify environment variables
3. Check browser console for errors
4. Review network tab in DevTools

---

**Copyright (c) Gravit InfoSystem. All rights reserved.**
