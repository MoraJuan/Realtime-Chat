import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuthContext } from './AuthContext'

const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState({})
  const { authUser } = useAuthContext()

  useEffect(() => {
    if (authUser) {
      // Crear conexión Socket.IO
      const newSocket = io('http://localhost:3000')

      setSocket(newSocket)

      // Notificar que el usuario se conectó
      newSocket.emit('userConnected', {
        userId: authUser._id,
        username: authUser.fullName
      })

      // Escuchar usuarios conectados
      newSocket.on('usersOnline', (users) => {
        console.log('Usuarios online recibidos:', users)
        setOnlineUsers(users)
      })

      // Escuchar indicadores de escritura
      newSocket.on('userTyping', (data) => {
        console.log('Usuario escribiendo recibido:', data)
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.isTyping
        }))
      })

      // Limpiar indicadores de escritura después de 3 segundos
      newSocket.on('userStoppedTyping', (userId) => {
        console.log('Usuario dejó de escribir:', userId)
        setTypingUsers(prev => {
          const newTypingUsers = { ...prev }
          delete newTypingUsers[userId]
          return newTypingUsers
        })
      })

      // Log de conexión exitosa
      newSocket.on('connect', () => {
        console.log('Socket conectado:', newSocket.id)
      })

      // Log de errores
      newSocket.on('connect_error', (error) => {
        console.error('Error de conexión Socket:', error)
      })

      // Cleanup al desmontar
      return () => {
        newSocket.close()
        setSocket(null)
        setOnlineUsers([])
        setTypingUsers({})
      }
    } else {
      // Si no hay usuario autenticado, cerrar socket
      if (socket) {
        socket.close()
        setSocket(null)
        setOnlineUsers([])
        setTypingUsers({})
      }
    }
  }, [authUser])

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('joinRoom', roomId)
    }
  }

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leaveRoom', roomId)
    }
  }

  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit('sendMessage', messageData)
    }
  }

  const startTyping = (receiverId) => {
    if (socket) {
      socket.emit('typing', {
        receiverId,
        isTyping: true
      })
    }
  }

  const stopTyping = (receiverId) => {
    if (socket) {
      socket.emit('typing', {
        receiverId,
        isTyping: false
      })
    }
  }

  const value = {
    socket,
    onlineUsers,
    typingUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
