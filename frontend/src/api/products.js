import apiClient from './client'

/**
 * Products API Service
 */

export const productsAPI = {
  // Get all products
  getAll: (params = {}) => {
    return apiClient.get('/products/', { params })
  },

  // Get product by ID
  getById: (id) => {
    return apiClient.get(`/products/${id}/`)
  },

  // Create new product
  create: (data) => {
    return apiClient.post('/products/', data)
  },

  // Update product
  update: (id, data) => {
    return apiClient.patch(`/products/${id}/`, data)
  },

  // Delete product
  delete: (id) => {
    return apiClient.delete(`/products/${id}/`)
  },

  // Get all categories
  getCategories: () => {
    return apiClient.get('/products/categories/')
  },

  // Get category by ID
  getCategoryById: (id) => {
    return apiClient.get(`/products/categories/${id}/`)
  },

  // Create category
  createCategory: (data) => {
    return apiClient.post('/products/categories/', data)
  },

  // Update category
  updateCategory: (id, data) => {
    return apiClient.patch(`/products/categories/${id}/`, data)
  },

  // Delete category
  deleteCategory: (id) => {
    return apiClient.delete(`/products/categories/${id}/`)
  },
}
