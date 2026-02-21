import mongoose from 'mongoose'
const { model, models, Schema } = mongoose

const chatSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export const AIChat = models.AIChat || model('AIChat', chatSchema)
