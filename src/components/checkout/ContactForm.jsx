import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ContactForm({ data, onChange }) {
  const { user } = useAuth();

  // Pre-fill from authenticated user
  const defaults = {
    fullName: data.fullName || user?.displayName || '',
    email: data.email || user?.email || '',
    phone: data.phone || '',
  };

  const handleChange = (field) => (e) => {
    onChange({ ...defaults, ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">person</span>
        Contact Information
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Full Name</label>
          <input
            type="text"
            value={data.fullName ?? defaults.fullName}
            onChange={handleChange('fullName')}
            className="td-input"
            placeholder="Sarah Jenkins"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Email</label>
          <input
            type="email"
            value={data.email ?? defaults.email}
            onChange={handleChange('email')}
            className="td-input"
            placeholder="sarah@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Phone</label>
          <input
            type="tel"
            value={data.phone ?? defaults.phone}
            onChange={handleChange('phone')}
            className="td-input"
            placeholder="(503) 555-0123"
          />
        </div>
      </div>
    </div>
  );
}
