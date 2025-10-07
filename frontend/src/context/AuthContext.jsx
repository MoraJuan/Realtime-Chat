import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setAuthUser(data)
        } else {
          setAuthUser(null)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        setAuthUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setAuthUser(data)
        toast.success('Inicio de sesión exitoso')
        return { success: true }
      } else {
        toast.error(data.message || 'Error al iniciar sesión')
        return { success: false, error: data.message }
      }
    } catch (error) {
      toast.error('Error de conexión')
      return { success: false, error: 'Error de conexión' }
    }
  }

  const signup = async (fullName, email, password) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ fullName, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setAuthUser(data)
        toast.success('Registro exitoso')
        return { success: true }
      } else {
        toast.error(data.message || 'Error al registrarse')
        return { success: false, error: data.message }
      }
    } catch (error) {
      toast.error('Error de conexión')
      return { success: false, error: 'Error de conexión' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setAuthUser(null)
      toast.success('Sesión cerrada')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  const updateProfile = async (profilePic) => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ profilePic })
      })

      const data = await response.json()

      if (response.ok) {
        setAuthUser(data)
        toast.success('Perfil actualizado')
        return { success: true }
      } else {
        toast.error(data.message || 'Error al actualizar perfil')
        return { success: false, error: data.message }
      }
    } catch (error) {
      toast.error('Error de conexión')
      return { success: false, error: 'Error de conexión' }
    }
  }

  const value = {
    authUser,
    login,
    signup,
    logout,
    updateProfile,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
