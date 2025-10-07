import { useState, useEffect, useCallback } from 'react'
import { useSocketContext } from '../context/SocketContext'

export const useMessages = (selectedUser, authUser) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const { socket, startTyping, stopTyping } = useSocketContext()

  // Función para cargar mensajes históricos
  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const response = await fetch(`/api/messages/${selectedUser._id}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedUser])

  // Enviar mensaje usando Socket.IO
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !selectedUser || sending) return

    setSending(true)
    try {
      // Primero guardar en la base de datos
      const response = await fetch(`/api/messages/send/${selectedUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ text })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Agregar mensaje inmediatamente a la UI
        setMessages(prev => [...prev, data])
        
        // Enviar mensaje a través de Socket.IO
        if (socket) {
          socket.emit('sendMessage', {
            message: data,
            receiverId: selectedUser._id,
            senderId: authUser._id
          })
        }
        
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.message }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return { success: false, error: 'Error de conexión' }
    } finally {
      setSending(false)
    }
  }, [selectedUser, sending, socket, authUser])

  // Manejar indicadores de escritura
  const handleTyping = useCallback((isTyping) => {
    if (!selectedUser || !socket) return
    
    if (isTyping) {
      startTyping(selectedUser._id)
    } else {
      stopTyping(selectedUser._id)
    }
  }, [selectedUser, socket, startTyping, stopTyping])

  // Configurar Socket.IO listeners
  useEffect(() => {
    if (!socket || !selectedUser || !authUser) return

    // Escuchar mensajes nuevos
    const handleNewMessage = (messageData) => {
      console.log('Nuevo mensaje recibido:', messageData)
      // Solo agregar mensajes que sean para esta conversación
      if (messageData.message && 
          messageData.message.receiverId === authUser._id && 
          messageData.message.senderId === selectedUser._id) {
        setMessages(prev => {
          // Evitar duplicados
          const exists = prev.some(msg => msg._id === messageData.message._id)
          if (exists) return prev
          return [...prev, messageData.message]
        })
      }
    }

    socket.on('newMessage', handleNewMessage)

    // Unirse a la sala de conversación
    const roomId = [authUser._id, selectedUser._id].sort().join('-')
    console.log('Uniéndose a sala:', roomId)
    socket.emit('joinRoom', roomId)

    // Cargar mensajes históricos al cambiar de conversación
    fetchMessages()

    // Cleanup
    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.emit('leaveRoom', roomId)
    }
  }, [socket, selectedUser, authUser, fetchMessages])

  // Limpiar mensajes al cambiar de usuario
  useEffect(() => {
    setMessages([])
  }, [selectedUser])

  return {
    messages,
    loading,
    sending,
    sendMessage,
    handleTyping,
    refetch: fetchMessages
  }
}
