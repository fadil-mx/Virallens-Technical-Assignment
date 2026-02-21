import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './router/authRouter.js'
import chatRouter from './router/chatRouter.js'
import { connectDB } from './config/index.js'

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

connectDB()

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://aiclient-5kmyy0fc7-fadhilshareef369-6266s-projects.vercel.app',
    ],
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)

app.get('/', (req, res) => {
  res.send('working')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
