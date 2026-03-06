import apiClient from './client'

/**
 * Users API Service
 */

export const usersAPI = {
  // Get all users (admin only)
  getAll: () => {
    return apiClient.get('/auth/users/')
  },

  // Get current user
  getCurrentUser: () => {
    return apiClient.get('/auth/users/me/')
  },

  // Get user by ID
  getById: (id) => {
    return apiClient.get(`/auth/users/${id}/`)
  },

  // Get all user profiles (admin only)
  getProfiles: () => {
    return apiClient.get('/auth/profiles/')
  },

  // Get current user's profile
  getMyProfile: () => {
    return apiClient.get('/auth/profiles/my_profile/')
  },

  // Get profile by ID
  getProfileById: (id) => {
    return apiClient.get(`/auth/profiles/${id}/`)
  },

  // Update profile
  updateProfile: (id, data) => {
    return apiClient.patch(`/auth/profiles/${id}/`, data)
  },

  // Delete profile
  deleteProfile: (id) => {
    return apiClient.delete(`/auth/profiles/${id}/`)
  },
}
