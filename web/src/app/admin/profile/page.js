'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { getImageUrl } from '@/utils/imageUtils';
import api from '@/lib/api';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '../layout';

export default function AdminProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone || '');
      setValue('bio', user.bio || '');
      if (user.avatar) {
        setAvatarPreview(getImageUrl(user.avatar));
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.bio) formData.append('bio', data.bio);
    if (data.avatar && data.avatar[0]) {
      formData.append('avatar', data.avatar[0]);
    }

    try {
      setLoading(true);
      const response = await api.put('/users/profile', formData);
      setSuccess('Profile updated successfully!');
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (authLoading) return <Loader />;
  if (!user) return null;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your account information</p>
            </div>

            <div className="p-6">
              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-3xl font-bold text-gray-400">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        {...register('avatar')}
                        onChange={handleAvatarChange}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+1 234 567 8900"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user.role === 'admin' ? 'Administrator' : 'Customer'}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}