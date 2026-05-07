import { createContext, useContext, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ams_user')) } catch { return null }
  })

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    setUser(res.data)
    sessionStorage.setItem('ams_user', JSON.stringify(res.data))
    return res.data
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('ams_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
