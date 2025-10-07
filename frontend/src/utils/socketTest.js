// Utilidad para probar la conexión de Socket.IO
export const testSocketConnection = () => {
  const socket = io('http://localhost:3000')
  
  socket.on('connect', () => {
    console.log('✅ Socket conectado correctamente:', socket.id)
  })
  
  socket.on('connect_error', (error) => {
    console.error('❌ Error de conexión Socket:', error)
  })
  
  socket.on('disconnect', () => {
    console.log('🔌 Socket desconectado')
  })
  
  return socket
}

// Función para probar eventos de mensajes
export const testMessageEvents = (socket) => {
  socket.emit('userConnected', {
    userId: 'test-user-123',
    username: 'Test User'
  })
  
  socket.on('usersOnline', (users) => {
    console.log('👥 Usuarios online:', users)
  })
  
  // Probar envío de mensaje
  setTimeout(() => {
    socket.emit('sendMessage', {
      message: { _id: 'test-msg-1', text: 'Mensaje de prueba' },
      receiverId: 'other-user-456',
      senderId: 'test-user-123'
    })
  }, 2000)
  
  socket.on('newMessage', (data) => {
    console.log('📨 Nuevo mensaje recibido:', data)
  })
  
  // Probar indicador de escritura
  setTimeout(() => {
    socket.emit('typing', {
      receiverId: 'other-user-456',
      isTyping: true
    })
  }, 3000)
  
  socket.on('userTyping', (data) => {
    console.log('⌨️ Usuario escribiendo:', data)
  })
}
