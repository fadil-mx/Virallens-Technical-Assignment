import jwt from 'jsonwebtoken'
import { User } from '../models/userModels.js'
import bcrypt from 'bcryptjs'

const createJWT = async (id) => {
  const jwttoken = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
  return jwttoken
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body

  try {
    if (!name || !email || !password)
      return res.json({ success: false, message: 'All fields are require ' })
    const emailexist = await User.findOne({ email })
    if (emailexist) {
      return res.json({ success: false, message: 'Email already exist' })
    }
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
    })
    const token = await createJWT(user._id)
    res
      .status(201)
      .json({ success: true, token, message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'Email not found' })
    }
    const token = await createJWT(user._id)
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: 'password is incorrect' })
    }

    res.status(200).json({ success: true, token, message: 'Login successful' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
