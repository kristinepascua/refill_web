import apiClient from './client'

/**
 * Stations API Service
 */

export const stationsAPI = {
  // Get all stations
  getAll: (params = {}) => {
    return apiClient.get('/stations/', { params })
  },

  // Get station by ID
  getById: (id) => {
    return apiClient.get(`/stations/${id}/`)
  },

  // Get nearby stations (optional lat/lng params)
  getNearby: (params = {}) => {
    return apiClient.get('/stations/nearby/', { params })
  },
}