import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'

function App() {
  const { authUser } = useAuthContext()

  return (
    <div className='min-h-screen bg-gray-50'>
      <Routes>
        <Route 
          path='/' 
          element={authUser ? <HomePage /> : <Navigate to='/login' />} 
        />
        <Route 
          path='/login' 
          element={authUser ? <Navigate to='/' /> : <LoginPage />} 
        />
        <Route 
          path='/signup' 
          element={authUser ? <Navigate to='/' /> : <SignUpPage />} 
        />
        <Route 
          path='/profile' 
          element={authUser ? <ProfilePage /> : <Navigate to='/login' />} 
        />
        <Route 
          path='/setting' 
          element={authUser ? <SettingPage /> : <Navigate to='/login' />} 
        />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App