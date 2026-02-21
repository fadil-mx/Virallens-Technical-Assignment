import { Message } from '../models/conversationModel.js'
import { AIChat } from '../models/chatModel.js'

const callAI = async (messages) => {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'AI Support Agent',
      },
      body: JSON.stringify({
        model: 'stepfun/step-3.5-flash:free',
        messages,
        // max_tokens: 500,
      }),
    },
  )

  const data = await response.json()
  return data.choices[0].message.content
}

export const startconv = async (req, res) => {
  try {
    const { message } = req.body

    const conversation = await Message.create({
      userId: req.user._id,
      title: message,
    })

    await AIChat.create({
      chatId: conversation._id,
      role: 'user',
      content: message,
    })

    const aiContent = await callAI([
      {
        role: 'system',
        content:
          'You are a helpful customer support assistant. Be concise and friendly.',
      },
      { role: 'user', content: message },
    ])

    await AIChat.create({
      chatId: conversation._id,
      role: 'assistant',
      content: aiContent,
    })

    res.status(200).json({
      success: true,
      message: 'conversation started ',
      chatId: conversation._id,
    })
  } catch (error) {
    console.error('error in conversation:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || 'Error starting conversation',
    })
  }
}

export const sendmessage = async (req, res) => {
  try {
    const { chatId, message } = req.body

    const conversation = await Message.findOne({
      _id: chatId,
      userId: req.user._id,
    })
    if (!conversation) {
      return res
        .status(400)
        .json({ success: false, message: 'Conversation not found' })
    }

    await AIChat.create({ chatId, role: 'user', content: message })

    const history = await AIChat.find({ chatId }).sort({ createdAt: 1 })
    const aiMessages = [
      {
        role: 'system',
        content:
          'You are a helpful customer support assistant. Be concise and friendly.',
      },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ]

    const aiContent = await callAI(aiMessages)

    await AIChat.create({ chatId, role: 'assistant', content: aiContent })

    res.status(200).json({
      success: true,
      message: 'message sent successfully',
      reply: aiContent,
    })
  } catch (error) {
    console.error('error sending message:', error.message)
    res.status(500).json({ success: false, message: 'Error sending message' })
  }
}

export const getConversations = async (req, res) => {
  try {
    const conversations = await AIChat.find({ chatId: req.body.chatId })
    res.status(200).json({ success: true, messages: conversations })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
