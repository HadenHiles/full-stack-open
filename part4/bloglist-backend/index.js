const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')

dotenv.config({ path: path.join(__dirname, '../../atlas-credentials.env'), quiet: true })
dotenv.config({ quiet: true })

const app = express()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.get('/api/blogs', async (_request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

app.post('/api/blogs', async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
