const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (_request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body
    if (!username || username.length < 3 || !password || password.length < 3) {
      return response.status(400).json({ error: 'username and password must be at least 3 characters long' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.code === 11000) return response.status(400).json({ error: 'username must be unique' })
    next(error)
  }
})

module.exports = usersRouter
