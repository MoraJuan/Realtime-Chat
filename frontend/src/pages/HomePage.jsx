import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className='h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <div className='flex-1 flex overflow-hidden main-content'>
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <Chat selectedUser={selectedUser} />
      </div>
    </div>
  )
}

export default HomePage
