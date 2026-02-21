import { ArrowUp, Loader2, TextSelect } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '@/context/AuthContext'
import axios from 'axios'

const Chat = () => {
  const navigate = useNavigate()
  const { url, token, settoken } = useContext(AuthContext)!
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    setLoading(true)
    const res = await axios.post(
      `${url}/api/chat/startconversation`,
      {
        message: text,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const data = await res.data
    navigate(`/chat/${data.chatId}`)
  }
  return (
    <div className=' flex flex-col min-h-screen bg-white text-black'>
      <div className=' flex justify-between items-center p-4 border-b '>
        <div className='flex gap-3 items-center'>
          <TextSelect size={30} className='text-yellow-400' />
          <h1 className='font-bold'>SupportAI</h1>
        </div>
        {token ? (
          <button
            className='px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
            onClick={() => {
              localStorage.removeItem('token')
              settoken(null)
            }}
          >
            Logout
          </button>
        ) : (
          <div className='flex gap-4 items-center'>
            <button
              className='px-4 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200'
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className='px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
      <div className='flex-1 bg-gray-100 flex justify-center items-center '>
        {loading ? (
          <div className='text-center space-y-4'>
            <Loader2 size={40} className='animate-spin text-blue-600 mx-auto' />
            <p className='text-gray-500 text-sm'>Starting conversation...</p>
          </div>
        ) : (
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold'>How can I help you today?</h1>
            <p className='text-gray-500'>
              Ask me anything — I'm here to support you.
            </p>
          </div>
        )}
      </div>
      <div className='w-full p-4 border-t bg-white'>
        <div className='max-w-3xl mx-auto flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm '>
          <Textarea
            disabled={!token}
            placeholder={
              token
                ? 'Type your message here...'
                : 'Please login to start chatting.'
            }
            className='min-h-15 max-h-50 resize-none border-none bg-transparent focus-visible:ring-0'
            onChange={(e) => {
              setText(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()

                handleSubmit()
              }
            }}
          />

          <Button
            disabled={loading || !token}
            onClick={handleSubmit}
            className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors duration-200'
          >
            <ArrowUp size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Chat
