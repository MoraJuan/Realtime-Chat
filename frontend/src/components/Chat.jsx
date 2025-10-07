import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useMessages } from '../hooks/useMessages'
import { useSocketContext } from '../context/SocketContext'
import toast from 'react-hot-toast'

const Chat = ({ selectedUser }) => {
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  const { authUser } = useAuthContext()
  const { messages, loading, sending, sendMessage, handleTyping } = useMessages(selectedUser, authUser)
  const { typingUsers, onlineUsers } = useSocketContext()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser || sending) return

    // Detener indicador de escritura antes de enviar
    handleTyping(false)
    setIsTyping(false)

    const result = await sendMessage(newMessage)
    if (result.success) {
      setNewMessage('')
    } else {
      toast.error(result.error || 'Error al enviar mensaje')
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    
    // Manejar indicador de escritura
    if (!isTyping) {
      console.log('Iniciando indicador de escritura para:', selectedUser._id)
      setIsTyping(true)
      handleTyping(true)
    }

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Detener indicador después de 2 segundos sin escribir
    typingTimeoutRef.current = setTimeout(() => {
      console.log('Deteniendo indicador de escritura para:', selectedUser._id)
      setIsTyping(false)
      handleTyping(false)
    }, 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  // Cleanup timeout al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  if (!selectedUser) {
    return (
      <div className='flex-1 flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>No hay conversación seleccionada</h3>
          <p className='mt-1 text-sm text-gray-500'>Selecciona una conversación para empezar a chatear</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col glass animate-slide-in-right chat-container'>
      {/* Header del chat */}
      <div className='border-b px-6 py-4'>
        <div className='flex items-center space-x-3'>
          <div className='relative'>
            {selectedUser.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.fullName}
                className='h-10 w-10 rounded-full object-cover'
              />
            ) : (
              <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
                <span className='text-sm font-medium text-gray-600'>
                  {selectedUser.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Indicador de estado online */}
            <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
              onlineUsers.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          
          <div>
            <div className='flex items-center space-x-2'>
              <h3 className='text-lg font-medium text-gray-900'>{selectedUser.fullName}</h3>
              {onlineUsers.includes(selectedUser._id) && (
                <span className='text-xs text-green-600 font-medium'>Online</span>
              )}
            </div>
            <p className='text-sm text-gray-500'>{selectedUser.email}</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className='flex-1 overflow-y-auto p-6'>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
          </div>
        ) : messages.length === 0 ? (
          <div className='text-center text-gray-500'>
            <p>No hay mensajes aún. ¡Envía el primer mensaje!</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {messages.map((message, index) => (
                <div
                  key={message._id}
                  className={`flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'} mb-4 animate-slide-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl hover-lift transition-all duration-300 ${
                    message.senderId === authUser._id
                      ? 'message-sent'
                      : 'message-received'
                  }`}>
                    <p className='text-sm leading-relaxed'>{message.text}</p>
                    {message.image && (
                      <img
                        src={message.image}
                        alt='Mensaje'
                        className='mt-2 rounded-xl max-w-full h-auto shadow-lg'
                      />
                    )}
                    <div className={`flex items-center justify-end mt-2 space-x-1 ${
                      message.senderId === authUser._id ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      <span className='text-xs'>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.senderId === authUser._id && (
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                      )}
                    </div>
                    
                    {/* Efecto de brillo al hacer hover */}
                    <div className='absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                  </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Indicador de escritura mejorado */}
      {typingUsers[selectedUser._id] && (
        <div className='px-6 py-3 animate-slide-in-up'>
          <div className='flex items-center space-x-3'>
            <div className='flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm'>
              <div className='typing-indicator'>
                <div className='typing-dot'></div>
                <div className='typing-dot'></div>
                <div className='typing-dot'></div>
              </div>
              <span className='text-sm text-gray-600 font-medium'>
                {selectedUser.fullName} está escribiendo...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Input de mensaje mejorado */}
      <div className='border-t border-white/20 px-6 py-4 glass'>
        <form onSubmit={handleSendMessage} className='flex items-end space-x-3'>
          <div className='flex-1 relative'>
            <input
              type='text'
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder='Escribe un mensaje...'
              className='input-modern w-full px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400'
              disabled={sending}
            />
            
            {/* Botones de acción */}
            <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1'>
              <button
                type='button'
                className='p-2 text-gray-400 hover:text-purple-500 transition-colors duration-200'
                title='Adjuntar archivo'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />
                </svg>
              </button>
              
              <button
                type='button'
                className='p-2 text-gray-400 hover:text-purple-500 transition-colors duration-200'
                title='Emoji'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </button>
            </div>
          </div>
          
          <button
            type='submit'
            disabled={!newMessage.trim() || sending}
            className='btn-gradient px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[100px] justify-center'
          >
            {sending ? (
              <>
                <div className='loading-spinner'></div>
                <span>Enviando</span>
              </>
            ) : (
              <>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                </svg>
                <span>Enviar</span>
              </>
            )}
          </button>
        </form>
        
        {/* Indicador de caracteres */}
        <div className='flex justify-between items-center mt-2 text-xs text-gray-400'>
          <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
          <span className={newMessage.length > 100 ? 'text-orange-400' : ''}>
            {newMessage.length}/200
          </span>
        </div>
      </div>
    </div>
  )
}

export default Chat
