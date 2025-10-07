import { useState, useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useSocketContext } from '../context/SocketContext'

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { authUser } = useAuthContext()
  const { onlineUsers } = useSocketContext()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/messages/users', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className='w-80 bg-white border-r border-gray-200 h-full flex items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='relative'>
            <div className='w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin'></div>
            <div className='absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin' style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <p className='text-sm text-gray-500 font-medium'>Cargando conversaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='w-80 bg-white border-r border-gray-200 h-full overflow-hidden animate-fade-in sidebar'>
      {/* Header del sidebar */}
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
            Conversaciones
          </h2>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
            <span className='text-xs text-gray-500 font-medium'>
              {onlineUsers.length} online
            </span>
          </div>
        </div>
        
        {/* Barra de búsqueda */}
        <div className='mt-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Buscar conversaciones...'
              className='w-full px-4 py-2 pl-10 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 placeholder-gray-400'
            />
            <svg className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {users.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4'>
              <svg className='w-8 h-8 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 4V8a2 2 0 012-2z' />
              </svg>
            </div>
            <p className='text-gray-500 font-medium'>No hay conversaciones</p>
            <p className='text-sm text-gray-400 mt-1'>Los usuarios aparecerán aquí cuando se conecten</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 hover-lift ${
                selectedUser?._id === user._id 
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-300/50 shadow-lg' 
                  : 'hover:bg-white/30 border border-transparent hover:border-white/30'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Efecto de selección */}
              {selectedUser?._id === user._id && (
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl'></div>
              )}
              
              <div className='relative flex-shrink-0'>
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className='h-12 w-12 rounded-full object-cover border-2 border-white/20 group-hover:border-purple-400 transition-all duration-300'
                  />
                ) : (
                  <div className='h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center border-2 border-white/20 group-hover:border-purple-400 transition-all duration-300'>
                    <span className='text-sm font-bold text-white'>
                      {user.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Indicador de estado online */}
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white transition-all duration-300 ${
                  onlineUsers.includes(user._id) 
                    ? 'bg-green-400 animate-pulse' 
                    : 'bg-gray-400'
                }`}>
                  {onlineUsers.includes(user._id) && (
                    <div className='absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75'></div>
                  )}
                </div>
              </div>
              
              <div className='flex-1 min-w-0 relative'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-semibold text-gray-800 truncate group-hover:text-purple-600 transition-colors'>
                    {user.fullName}
                  </p>
                  {onlineUsers.includes(user._id) && (
                    <span className='text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium animate-fade-in'>
                      Online
                    </span>
                  )}
                </div>
                <p className='text-xs text-gray-500 truncate mt-1'>
                  {user.email}
                </p>
                
                {/* Indicador de mensaje nuevo */}
                <div className='absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full animate-pulse'></div>
              </div>

              {/* Efecto hover */}
              <div className='absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <svg className='w-5 h-5 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer del sidebar */}
      <div className='p-4 border-t border-white/20'>
        <div className='flex items-center justify-between text-xs text-gray-500'>
          <span>Total: {users.length} usuarios</span>
          <span>Online: {onlineUsers.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
