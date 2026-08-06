import React, { useState, useEffect } from 'react';

export default function UserForm({ initialData, onSubmit, onCancel, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    status: 'active',
    avatar: '',
  });
  const [passwordRequired, setPasswordRequired] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        username: initialData.username || '',
        email: initialData.email || '',
        password: '', // Never pre-fill password for security
        phone: initialData.phone || '',
        role: initialData.role || 'user',
        status: initialData.status || 'active',
        avatar: initialData.avatar || '',
      });
      setPasswordRequired(false); // Password not required for edit unless changed
    } else {
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
role: 'user',
        status: 'active',
        avatar: '',
      });
      setPasswordRequired(true);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || (passwordRequired && !formData.password)) {
      alert('Please fill in all required fields (Name, Email, Password for new users).');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-gray-800 p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-white">
          {initialData ? 'Edit User' : 'Create New User'}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username (optional)"
            value={formData.username}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder={initialData ? 'New Password (optional)' : 'Password'}
            value={formData.password}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
            required={passwordRequired}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="text"
            name="avatar"
            placeholder="Avatar URL (optional)"
            value={formData.avatar}
            onChange={handleChange}
            className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
          />

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="rounded bg-gray-600 px-4 py-2 text-white">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
              {saving ? 'Saving...' : (initialData ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}