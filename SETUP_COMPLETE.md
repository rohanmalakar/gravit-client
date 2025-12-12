# Event Booking System - Frontend Setup Complete ✅

## 📦 Installation Required

Install the missing dependencies:

```bash
npm install axios react-router-dom socket.io-client
npm install --save-dev @types/react-router-dom
```

## 📁 Files Created

### API & Hooks
- ✅ `src/api/apiClient.ts` - Axios client with admin authentication
- ✅ `src/hooks/useSocket.ts` - Real-time seat updates via Socket.IO
- ✅ `src/types/event.ts` - TypeScript interfaces

### Components
- ✅ `src/components/EventCard.tsx` - Event display card
- ✅ `src/components/BookingForm.tsx` - Ticket booking form

### Pages
- ✅ `src/pages/EventsList.tsx` - Browse all events
- ✅ `src/pages/EventDetail.tsx` - Event details & booking
- ✅ `src/pages/BookingSuccess.tsx` - Booking confirmation

### Admin Pages
- ✅ `src/pages/Admin/AdminEvents.tsx` - Manage events list
- ✅ `src/pages/Admin/AdminEventForm.tsx` - Create/Edit events

### Configuration
- ✅ `src/App.tsx` - Updated with routing
- ✅ `.env.example` - Environment variables template
- ✅ `.env` - Local environment config

## 🚀 Quick Start

1. **Install dependencies** (see above)

2. **Configure environment variables** in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   VITE_SOCKET_URL=http://localhost:4000
   VITE_ADMIN_KEY=your_admin_key
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```

4. **Restart the server** if it was already running (to pick up env vars)

## 🌐 Routes

### Public Routes
- `/` - Home page (existing)
- `/events` - Browse all events
- `/events/:id` - Event detail & booking
- `/booking-success` - Booking confirmation

### Admin Routes
- `/admin/events` - List all events (admin)
- `/admin/events/new` - Create new event
- `/admin/events/:id/edit` - Edit event

## 🔑 Admin Access

Admin routes require the `x-api-key` header. Set it via:
- Environment variable: `VITE_ADMIN_KEY` (development)
- localStorage: Store under `ADMIN_API_KEY` key

## 📡 Backend Requirements

Your backend must support:

### Public Endpoints
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/bookings` - Create booking
  - Body: `{ event_id, name, email, mobile?, quantity }`
  - Returns: `{ booking: { id, name, email, quantity, total_amount, ... } }`

### Admin Endpoints (require `x-api-key` header)
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Socket.IO Events
- Server emits: `seat_update` 
  - Payload: `{ event_id: number, available_seats: number }`
  - Trigger: After booking creation/cancellation

## 🎨 Features

✅ Real-time seat availability updates via WebSocket  
✅ Responsive design with Tailwind CSS  
✅ Smooth animations with Framer Motion  
✅ TypeScript for type safety  
✅ Admin CRUD operations  
✅ Form validation  
✅ Error handling  
✅ Loading states  

## 🧪 Testing

1. **Browse events**: Visit `/events`
2. **Book tickets**: Click on an event → Fill form → Submit
3. **Admin panel**: Visit `/admin/events` (requires API key)
4. **Real-time updates**: Open multiple tabs and book tickets

## 📝 Notes

- Update `placeholder.jpg` in `public/` folder for missing images
- Admin key should be stored securely in production
- Socket URL must match your backend server
- Restart dev server after changing `.env` values

## 🐛 Troubleshooting

**CORS errors**: Ensure backend allows `http://localhost:5173`  
**Socket not connecting**: Check `VITE_SOCKET_URL` and backend Socket.IO setup  
**Admin 401**: Verify `x-api-key` header matches backend  
**Routes not working**: Check React Router is properly configured  

---

**Ready to test!** Start your backend server first, then run `npm run dev` ⚡
