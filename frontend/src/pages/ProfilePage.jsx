import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuthContext()
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    setLoading(true)
    try {
      const result = await updateProfile(preview)
      if (result.success) {
        setSelectedFile(null)
        setPreview(null)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900 mb-6'>
              Información del Perfil
            </h3>
            
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Información actual */}
              <div>
                <h4 className='text-md font-medium text-gray-900 mb-4'>Perfil Actual</h4>
                <div className='flex items-center space-x-4'>
                  {authUser?.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt='Profile'
                      className='h-20 w-20 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center'>
                      <span className='text-2xl font-medium text-gray-600'>
                        {authUser?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className='text-lg font-medium text-gray-900'>{authUser?.fullName}</p>
                    <p className='text-sm text-gray-500'>{authUser?.email}</p>
                  </div>
                </div>
              </div>

              {/* Actualizar foto */}
              <div>
                <h4 className='text-md font-medium text-gray-900 mb-4'>Actualizar Foto de Perfil</h4>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Seleccionar Imagen
                    </label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                    />
                  </div>

                  {preview && (
                    <div className='mt-4'>
                      <p className='text-sm font-medium text-gray-700 mb-2'>Vista previa:</p>
                      <img
                        src={preview}
                        alt='Preview'
                        className='h-20 w-20 rounded-full object-cover'
                      />
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={!selectedFile || loading}
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? (
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    ) : (
                      'Actualizar Foto'
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className='mt-6 flex justify-end'>
              <button
                onClick={() => navigate('/')}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded'
              >
                Volver al Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
