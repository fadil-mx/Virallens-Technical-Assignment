import mongoose from 'mongoose'
const { model, models, Schema } = mongoose

const messageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export const Message = models.Message || model('Message', messageSchema)
