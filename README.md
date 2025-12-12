# Event Booking Platform - Frontend

A modern, responsive React application for browsing and booking event tickets with real-time seat updates.

## 🚀 Features

- **Modern UI/UX** - Built with React 19, TypeScript, and TailwindCSS
- **Real-time Updates** - Socket.IO integration for live seat availability
- **Smooth Animations** - Framer Motion for fluid transitions
- **User Authentication** - JWT-based login/signup with persistent sessions
- **Role-based Access** - Different views for users and admins
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Admin Dashboard** - Event management interface for administrators

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see GravitInfo_server README)

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Base URL (Backend server)
VITE_API_BASE_URL=http://localhost:5000/api

# Socket.IO URL (Backend server)
VITE_SOCKET_URL=http://localhost:5000
```

**For Production:**
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Build Output

Built files will be in the `dist/` directory:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Compiled CSS and JavaScript

## 📁 Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client configuration
│   │   └── apiClient.ts
│   ├── assets/         # Images, icons
│   ├── components/     # Reusable components
│   │   ├── About.tsx
│   │   ├── BookingForm.tsx
│   │   ├── Button.tsx
│   │   ├── EventCard.tsx
│   │   ├── Faq.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Ourteam.tsx
│   │   ├── Pricing.tsx
│   │   └── Video.tsx
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useSocket.ts
│   ├── lib/            # Utility functions
│   │   └── animations.ts
│   ├── pages/          # Page components
│   │   ├── Admin/
│   │   │   ├── AdminEventForm.tsx
│   │   │   └── AdminEvents.tsx
│   │   ├── BookingSuccess.tsx
│   │   ├── EventDetail.tsx
│   │   ├── EventsList.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── UserDashboard.tsx
│   ├── types/          # TypeScript type definitions
│   │   └── event.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # TailwindCSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🎨 Tech Stack

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool and dev server
- **TailwindCSS 4.1.17** - Utility-first CSS
- **Framer Motion 12.23.26** - Animation library
- **React Router 7.6.2** - Client-side routing
- **Axios 1.7.9** - HTTP client
- **Socket.IO Client 4.8.1** - Real-time communication
- **Lucide React 0.560.0** - Icon library

## 🔑 Key Features

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes with role-based access
- Persistent login sessions

### Event Browsing
- Grid layout with event cards
- Search and filter functionality
- Real-time seat availability updates
- Event detail pages with full information

### Booking System
- Quantity-based ticket booking
- Real-time price calculation
- Booking confirmation page
- User booking history

### Admin Features
- Create and edit events
- Manage event status (active/closed)
- View all bookings
- Event analytics

## 🔧 Configuration

### API Client (`src/api/apiClient.ts`)

The API client automatically handles:
- JWT token injection in request headers
- Token refresh on expiration
- Error handling and retries
- Request/response interceptors

### Socket.IO (`src/hooks/useSocket.ts`)

Real-time features:
- Live seat availability updates
- Event status changes
- Booking notifications

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript compiler check
npm run type-check

# Lint code
npm run lint
```

## 🌐 Routes

### Public Routes
- `/` - Homepage
- `/events` - Event listing
- `/events/:id` - Event details
- `/login` - User login
- `/signup` - User registration

### Protected Routes (User)
- `/dashboard` - User dashboard with bookings
- `/booking-success` - Booking confirmation

### Protected Routes (Admin)
- `/admin/events` - Event management
- `/admin/events/new` - Create new event
- `/admin/events/:id/edit` - Edit event

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | - |
| `VITE_SOCKET_URL` | Socket.IO server URL | Yes | - |

## 🐛 Troubleshooting

### Build Errors

**TypeScript Errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run build
```

**Dependency Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

**API Connection Failed:**
- Verify backend server is running
- Check `VITE_API_BASE_URL` in `.env`
- Ensure CORS is configured in backend

**Socket.IO Not Connecting:**
- Check `VITE_SOCKET_URL` matches backend
- Verify Socket.IO is enabled in backend
- Check browser console for errors

**Authentication Issues:**
- Clear browser localStorage
- Check JWT token expiration
- Verify backend authentication endpoints

### Development Server Issues

**Port Already in Use:**
```bash
# Vite will automatically use next available port
# Or specify a port in vite.config.ts
```

**Hot Reload Not Working:**
- Check file watcher limits (Linux/Mac)
- Restart development server
- Clear browser cache

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Upload `dist/` folder to your web server

3. Configure environment variables on hosting platform

4. Set up redirect rules for SPA routing:
```
/*    /index.html   200
```

## 🔐 Security Best Practices

- Never commit `.env` files
- Use HTTPS in production
- Implement Content Security Policy
- Sanitize user inputs
- Keep dependencies updated
- Use environment-specific configurations

## 📈 Performance Optimization

- Code splitting with React.lazy()
- Image optimization and lazy loading
- Bundle size optimization with Vite
- Caching strategies
- Minification and compression

## 🤝 Contributing

1. Follow existing code style
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test thoroughly before submitting

## 📄 License

Copyright (c) Gravit InfoSystem. All rights reserved.

## 🆘 Support

For issues or questions:
- Check the main README.md in project root
- Review backend API documentation
- Check browser console for errors
- Verify environment configuration

## 🔗 Related Documentation

- [Backend Setup](../GravitInfo_server/README.md)
- [API Documentation](../GravitInfo_server/API_DOCUMENTATION.md)
- [Main Project README](../README.md)
