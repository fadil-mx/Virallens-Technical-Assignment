import { Route, Routes } from 'react-router-dom'
import './App.css'
import Chat from './pages/chat'
import Login from './pages/login'
import SignUp from './pages/signUp'
import Conversation from './pages/conversation'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Chat />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/chat/:chatId' element={<Conversation />} />
      </Routes>
    </>
  )
}

export default App
