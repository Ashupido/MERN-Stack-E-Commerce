import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { User, Lock, Settings, Save } from 'lucide-react';

const SettingsCard = ({ title, icon, children }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
    <div className="flex items-center gap-4 border-b border-slate-700 p-4">
      {icon}
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const InputField = ({ label, id, type = 'text', value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
    />
  </div>
);

export default function AdminSettings() {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.id]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profileData);
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  // Placeholder for password change logic
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    addToast('Password change functionality is not yet implemented.', 'info');
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Admin Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <SettingsCard title="Profile Information" icon={<User className="h-6 w-6 text-cyan-400" />}>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <InputField label="Full Name" id="name" value={profileData.name} onChange={handleProfileChange} />
            <InputField label="Email Address" id="email" type="email" value={profileData.email} onChange={handleProfileChange} />
            <button type="submit" className="flex items-center justify-center gap-2 w-full rounded-md bg-cyan-600 px-4 py-3 font-bold text-white transition hover:bg-cyan-700">
              <Save size={18} />
              Save Profile
            </button>
          </form>
        </SettingsCard>

        {/* Password Settings */}
        <SettingsCard title="Change Password" icon={<Lock className="h-6 w-6 text-cyan-400" />}>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <InputField label="Current Password" id="currentPassword" type="password" />
            <InputField label="New Password" id="newPassword" type="password" />
            <InputField label="Confirm New Password" id="confirmPassword" type="password" />
            <button type="submit" className="flex items-center justify-center gap-2 w-full rounded-md bg-cyan-600 px-4 py-3 font-bold text-white transition hover:bg-cyan-700">
              <Save size={18} />
              Update Password
            </button>
          </form>
        </SettingsCard>

        {/* General Site Settings */}
        <div className="lg:col-span-2">
          <SettingsCard title="General Site Settings" icon={<Settings className="h-6 w-6 text-cyan-400" />}>
            <div className="text-center text-slate-400">
              <p>This section will contain global settings for the website, such as maintenance mode, shipping rates, and payment gateway configurations.</p>
              <p className="mt-2 font-semibold">Feature coming soon!</p>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
