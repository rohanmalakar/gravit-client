// src/pages/Admin/AdminEventForm.tsx
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/apiClient';

interface EventForm {
  title: string;
  description: string;
  location: string;
  date: string;
  total_seats: number;
  price: number;
  img: string;
}

export default function AdminEventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    location: '',
    date: '',
    total_seats: 0,
    price: 0,
    img: ''
  });

  useEffect(() => {
    if (!id) return;
    
    (async () => {
      try {
        const res = await adminApi().get(`/events/${id}`);
        const event = res.data.event ?? res.data;
        setForm({
          title: event.title || '',
          description: event.description || '',
          location: event.location || '',
          date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
          total_seats: event.total_seats || 0,
          price: event.price || 0,
          img: event.img || ''
        });
      } catch (e: any) {
        alert(e.message || 'Load error');
      }
    })();
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (id) {
        await adminApi().put(`/events/${id}`, { ...form });
      } else {
        await adminApi().post('/events', { ...form });
      }
      navigate('/admin/events');
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Edit' : 'Create'} Event
      </h1>
      
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })} 
            placeholder="Event Title" 
            required 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <input 
            value={form.location} 
            onChange={e => setForm({ ...form, location: e.target.value })} 
            placeholder="Location" 
            required 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input 
            type="datetime-local" 
            value={form.date} 
            onChange={e => setForm({ ...form, date: e.target.value })} 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
            placeholder="Event Description" 
            rows={4}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Total Seats</label>
            <input 
              type="number" 
              value={form.total_seats} 
              onChange={e => setForm({ ...form, total_seats: Number(e.target.value) })} 
              placeholder="Total seats" 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input 
              type="number" 
              step="0.01"
              value={form.price} 
              onChange={e => setForm({ ...form, price: Number(e.target.value) })} 
              placeholder="Price" 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input 
            value={form.img} 
            onChange={e => setForm({ ...form, img: e.target.value })} 
            placeholder="https://example.com/image.jpg" 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {id ? 'Save Changes' : 'Create Event'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 border rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
