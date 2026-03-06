import { createContext, useContext, useState } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (username, password) => {
    const res = await apiClient.post('/auth/token/login/', { username, password })
    const { auth_token, username: uname, email, is_staff } = res.data
    localStorage.setItem('authToken', auth_token)
    localStorage.setItem('authUser', JSON.stringify({ username: uname, email, is_staff }))
    setUser({ username: uname, email, is_staff })
    return res.data
  }

  const logout = async () => {
    try { await apiClient.post('/auth/token/logout/') } catch {}
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)