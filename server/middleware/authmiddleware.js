import jwt from 'jsonwebtoken'

const getusermiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.json({ success: false, message: 'no token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = { _id: decoded.id }
    next()
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' })
  }
}

export default getusermiddleware
