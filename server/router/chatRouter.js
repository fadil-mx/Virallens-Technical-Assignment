import express from 'express'
import {
  getConversations,
  sendmessage,
  startconv,
} from '../controllers/chatController.js'
import getusermiddleware from '../middleware/authmiddleware.js'

const chatRouter = express.Router()

chatRouter.post('/sendmessage', getusermiddleware, sendmessage)
chatRouter.post('/startconversation', getusermiddleware, startconv)
chatRouter.post('/history', getusermiddleware, getConversations)

export default chatRouter
