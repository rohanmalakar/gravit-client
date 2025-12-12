import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            
            {/* Admin Routes */}
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/events/new" element={<AdminEventForm />} />
            <Route path="/admin/events/:id/edit" element={<AdminEventForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
