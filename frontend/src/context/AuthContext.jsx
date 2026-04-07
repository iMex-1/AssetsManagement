import { createContext, useState, useCallback } from 'react'
import { login as apiLogin, logout as apiLogout } from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = useCallback(async (email, password) => {
    const { data } = await apiLogin(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try { await apiLogout() } catch { /* ignore */ }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const hasPermission = useCallback((perm) => {
    if (!user) return false
    if (user.roles?.includes('Admin')) return true
    return user.permissions?.includes(perm) ?? false
  }, [user])

  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) ?? false
  }, [user])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}
