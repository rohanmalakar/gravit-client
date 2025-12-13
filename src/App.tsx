import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import FAQSection from './components/Faq';
import Outteam from "./components/Ourteam"
import PricingSection from './components/Pricing';
import About from './components/About';
import ScrollVideoSection from './components/Video';
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import BookingSuccess from './pages/BookingSuccess';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminEventForm from './pages/Admin/AdminEventForm';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminBookings from './pages/Admin/AdminBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function HomePage() {
  return (
    <div className="bg-black">
      <main className='bg-black'>
        <Hero />
        <About/>
        <ScrollVideoSection />
        <Outteam />
        <PricingSection/>
        <FAQSection/>
      </main>
    </div>
  );
}

function Layout() {
  const location = useLocation();
  
  // Routes where header and footer should be hidden
  const hideHeaderFooter = [
    '/dashboard',
    '/admin/dashboard',
    '/admin/events',
    '/admin/bookings',
    '/admin/events/new'
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <div className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-success" 
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events/new" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminEventForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events/:id/edit" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminEventForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
