const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

blogsRouter.get('/', async (_request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const user = await User.findById(decodedToken.id)
    if (!user) return response.status(401).json({ error: 'token invalid' })
    const blog = new Blog({ ...request.body, user: user?._id })
    const savedBlog = await blog.save()
    if (user) {
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
    }
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(404).end()
    if (blog.user.toString() !== decodedToken.id) return response.status(401).json({ error: 'token invalid' })
    await blog.deleteOne()
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    })
    if (!updatedBlog) return response.status(404).end()
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
