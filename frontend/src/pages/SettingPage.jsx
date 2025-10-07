import { useAuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SettingPage = () => {
  const { authUser, logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900 mb-6'>
              Configuración
            </h3>
            
            <div className='space-y-6'>
              {/* Información de la cuenta */}
              <div className='border-b border-gray-200 pb-6'>
                <h4 className='text-md font-medium text-gray-900 mb-4'>Información de la Cuenta</h4>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Nombre:</span>
                    <span className='text-sm font-medium text-gray-900'>{authUser?.fullName}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Email:</span>
                    <span className='text-sm font-medium text-gray-900'>{authUser?.email}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>ID de Usuario:</span>
                    <span className='text-sm font-medium text-gray-900 font-mono'>{authUser?._id}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className='border-b border-gray-200 pb-6'>
                <h4 className='text-md font-medium text-gray-900 mb-4'>Acciones</h4>
                <div className='space-y-3'>
                  <button
                    onClick={() => navigate('/profile')}
                    className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  >
                    <svg className='h-4 w-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                    Editar Perfil
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  >
                    <svg className='h-4 w-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                    </svg>
                    Volver al Chat
                  </button>
                </div>
              </div>

              {/* Zona de peligro */}
              <div>
                <h4 className='text-md font-medium text-red-600 mb-4'>Zona de Peligro</h4>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                  <svg className='h-4 w-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage
