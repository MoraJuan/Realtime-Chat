import { useAuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const { authUser, logout } = useAuthContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className='bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[9999] animate-fade-in'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo con animación */}
          <div className='flex items-center'>
            <Link 
              to='/' 
              className='flex items-center space-x-3 hover-lift group'
            >
              <div className='relative'>
                <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm'>
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                  </svg>
                </div>
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
              </div>
              <span className='text-xl font-semibold text-gray-900'>
                ChatApp
              </span>
            </Link>
          </div>
          
          {/* Menu desktop */}
          <div className='hidden md:flex items-center space-x-6'>
            {/* Usuario con animación */}
            <Link
              to='/profile'
              className='flex items-center space-x-3 px-4 py-2 rounded-xl hover-lift group transition-all duration-300'
            >
              <div className='relative'>
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt='Profile'
                    className='h-10 w-10 rounded-full object-cover border-2 border-white/20 group-hover:border-purple-400 transition-all duration-300'
                  />
                ) : (
                  <div className='h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-gray-200'>
                    <span className='text-sm font-bold text-white'>
                      {authUser?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse'></div>
              </div>
              <div className='text-left'>
                <span className='text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors'>
                  {authUser?.fullName}
                </span>
                <p className='text-xs text-gray-500'>Online</p>
              </div>
            </Link>
            
            {/* Botones de acción */}
            <div className='flex items-center space-x-2'>
              <Link
                to='/setting'
                className='p-3 rounded-xl bg-white/50 hover:bg-white/80 text-gray-600 hover:text-purple-600 hover-lift transition-all duration-300 group'
                title='Configuración'
              >
                <svg className='h-5 w-5 group-hover:rotate-90 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </Link>
              
              <button
                onClick={logout}
                className='p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200'
                title='Cerrar sesión'
              >
                <svg className='h-5 w-5 group-hover:rotate-12 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 rounded-xl bg-white/50 hover:bg-white/80 text-gray-600 transition-all duration-300'
            >
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile expandido */}
        {isMenuOpen && (
          <div className='md:hidden animate-slide-in-up'>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-white border border-gray-200 rounded-lg mt-2 shadow-sm'>
              <Link
                to='/profile'
                className='flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/50 transition-all duration-300'
                onClick={() => setIsMenuOpen(false)}
              >
                <div className='relative'>
                  {authUser?.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt='Profile'
                      className='h-10 w-10 rounded-full object-cover border-2 border-white/20'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center'>
                      <span className='text-sm font-bold text-white'>
                        {authUser?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
                </div>
                <div>
                  <span className='text-sm font-semibold text-gray-800'>{authUser?.fullName}</span>
                  <p className='text-xs text-gray-500'>Online</p>
                </div>
              </Link>
              
              <div className='flex space-x-2 px-4 py-2'>
                <Link
                  to='/setting'
                  className='flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/80 text-gray-600 transition-all duration-300'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                  <span className='text-sm'>Configuración</span>
                </Link>
                
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className='flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200'
                >
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                  </svg>
                  <span className='text-sm'>Salir</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
