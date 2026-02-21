import { ArrowUp, TextSelect, ArrowLeft } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '@/context/AuthContext'
import axios from 'axios'

const ChatConversation = () => {
  const navigate = useNavigate()
  const { chatId } = useParams()
  const { url, token, settoken } = useContext(AuthContext)!

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  )
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null) //for automatically reading the textarea after sending a message

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post(
          `${url}/api/chat/history/`,
          {
            chatId: chatId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        setMessages(res.data.messages)
      } catch (err) {
        console.error('Failed to load messages', err)
      } finally {
        setInitialLoading(false)
      }
    }
    if (chatId && token) fetchMessages()
  }, [chatId, token, url])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async () => {
    if (!text.trim() || loading) return

    const userMessage = text.trim()
    setText('')

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await axios.post(
        `${url}/api/chat/sendmessage`,
        { chatId, message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.reply },
      ])
      setLoading(false)
      textareaRef.current?.focus()
    } catch (err) {
      console.log(err)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            ' Please try again something went wrong. If the problem persists contact support.',
        },
      ])
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className='flex flex-col h-screen bg-white text-black overflow-hidden'>
      <div className='flex justify-between items-center p-4 border-b'>
        <div className='flex gap-3 items-center'>
          <button
            onClick={() => navigate('/')}
            className='p-1.5 rounded-md hover:bg-gray-100 transition-colors mr-1'
            title='Back to home'
          >
            <ArrowLeft size={18} className='text-gray-500' />
          </button>
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

      {/* in here i use ai help to make the ui better */}
      <div className='flex-1 bg-gray-100 overflow-y-auto'>
        <div className='max-w-3xl mx-auto px-4 py-6 space-y-6'>
          {!initialLoading &&
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className='shrink-0 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center mr-2 mt-1 shadow-sm'>
                    <TextSelect size={14} className='text-white' />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap wrape-break-words ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className='shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 mt-1 shadow-sm'>
                    <span className='text-white text-xs font-bold'>U</span>
                  </div>
                )}
              </div>
            ))}

          {loading && (
            <div className='flex justify-start'>
              <div className='shrink-0 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center mr-2 mt-1 shadow-sm'>
                <TextSelect size={14} className='text-white' />
              </div>

              <div className='bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm'>
                <div className='flex gap-1 items-center h-5'>
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150' />
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300' />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className='w-full p-4 border-t bg-white'>
        <div className='max-w-3xl mx-auto flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm'>
          <Textarea
            ref={textareaRef}
            disabled={!token}
            placeholder={
              loading ? 'AI is thinking....' : 'Type your message here....'
            }
            className='min-h-15 max-h-50 resize-none border-none bg-transparent focus-visible:ring-0'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            disabled={loading}
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

export default ChatConversation
