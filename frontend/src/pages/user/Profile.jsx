import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../components/common/PasswordInput';
import authService from '../../services/authService';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

export default function Profile({ addToast }) {
  const { user: initialUser, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    password: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await authService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        password: '',
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to load profile';
      setError(msg);
      addToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        password: '',
      });
    }
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };
      if (formData.password && formData.password.trim() !== '') {
        payload.password = formData.password.trim();
      }

      const res = await updateUserProfile(payload);
      setProfile(res.user || { ...profile, ...payload });
      addToast?.('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Update failed';
      addToast?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading profile data..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Account Dashboard</p>
            <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">User Profile</h1>
          </div>
          <button
            onClick={handleEditClick}
            className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-300"
          >
            Edit Profile
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-sm font-medium text-red-100">
            {error}
          </div>
        )}

        {profile && (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Card: Summary Header */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center shadow-xl shadow-black/20 md:col-span-1">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-3xl font-black text-slate-950 shadow-lg shadow-amber-500/20">
                {profile.name?.slice(0, 2)?.toUpperCase() || 'US'}
              </div>
              <h2 className="mt-4 text-xl font-black text-white">{profile.name}</h2>
              <p className="text-sm font-medium text-gray-400">{profile.email}</p>
              <div className="mt-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                Role: {profile.role || 'user'}
              </div>
            </div>

            {/* Right Card: Detailed Information */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/20 md:col-span-2">
              <h3 className="border-b border-gray-800 pb-3 text-lg font-black text-white">
                Personal Information
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-950 p-4">
                  <p className="text-xs font-bold uppercase text-gray-500">Full Name</p>
                  <p className="mt-1 text-base font-bold text-white">{profile.name || 'N/A'}</p>
                </div>

                <div className="rounded-lg bg-gray-950 p-4">
                  <p className="text-xs font-bold uppercase text-gray-500">Email Address</p>
                  <p className="mt-1 text-base font-bold text-white">{profile.email || 'N/A'}</p>
                </div>

                <div className="rounded-lg bg-gray-950 p-4">
                  <p className="text-xs font-bold uppercase text-gray-500">Phone Number</p>
                  <p className="mt-1 text-base font-bold text-white">{profile.phone || 'Not provided'}</p>
                </div>

                <div className="rounded-lg bg-gray-950 p-4">
                  <p className="text-xs font-bold uppercase text-gray-500">Account Created</p>
                  <p className="mt-1 text-base font-bold text-white">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-950 p-4 sm:col-span-2">
                  <p className="text-xs font-bold uppercase text-gray-500">Shipping / Billing Address</p>
                  <p className="mt-1 text-base font-bold text-white whitespace-pre-wrap">{profile.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title="Edit Profile Information"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+251 900 000 000"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-300">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, City, Country"
                rows={3}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-300">
                New Password (leave blank to keep unchanged)
              </label>
              <PasswordInput
                id="profile-new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
                className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-black text-slate-950 hover:bg-amber-300 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}