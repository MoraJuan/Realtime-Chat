import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const SignUpPage = () => {
  const [inputs, setInputs] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const { signup } = useAuthContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signup(inputs.fullName, inputs.email, inputs.password)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      {/* Contenido */}
      <div className='w-full max-w-md mx-auto px-4'>
        <div className='bg-white rounded-lg p-8 shadow-sm border border-gray-200 animate-fade-in'>
          {/* Logo */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-lg shadow-sm mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            </div>
            <h2 className='text-3xl font-semibold text-gray-900'>
              Únete a nosotros
            </h2>
            <p className='mt-2 text-gray-600'>
              Crea tu cuenta para empezar
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label htmlFor='fullName' className='block text-sm font-semibold text-gray-200 mb-2'>
                  Nombre Completo
                </label>
                <div className='relative'>
                  <input
                    id='fullName'
                    name='fullName'
                    type='text'
                    required
                    value={inputs.fullName}
                    onChange={(e) => setInputs({...inputs, fullName: e.target.value})}
                    className='input-modern w-full px-4 py-3 pl-12 text-gray-800 placeholder-gray-400 focus:outline-none'
                    placeholder='Tu nombre completo'
                  />
                  <svg className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
              </div>
              
              <div>
                <label htmlFor='email' className='block text-sm font-semibold text-gray-200 mb-2'>
                  Email
                </label>
                <div className='relative'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    value={inputs.email}
                    onChange={(e) => setInputs({...inputs, email: e.target.value})}
                    className='input-modern w-full px-4 py-3 pl-12 text-gray-800 placeholder-gray-400 focus:outline-none'
                    placeholder='tu@email.com'
                  />
                  <svg className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                  </svg>
                </div>
              </div>
              
              <div>
                <label htmlFor='password' className='block text-sm font-semibold text-gray-200 mb-2'>
                  Contraseña
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    minLength={6}
                    value={inputs.password}
                    onChange={(e) => setInputs({...inputs, password: e.target.value})}
                    className='input-modern w-full px-4 py-3 pl-12 text-gray-800 placeholder-gray-400 focus:outline-none'
                    placeholder='Mínimo 6 caracteres'
                  />
                  <svg className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <div className='mt-2 flex items-center space-x-2 text-xs text-gray-300'>
                  <div className={`w-2 h-2 rounded-full ${inputs.password.length >= 6 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span>Al menos 6 caracteres</span>
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='btn-gradient w-full py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300'
            >
              Crear Cuenta
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-300'>
              ¿Ya tienes cuenta?{' '}
              <Link
                to='/login'
                className='font-semibold text-white hover:text-purple-200 transition-colors duration-200'
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage