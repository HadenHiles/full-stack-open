const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as JSON with the correct count', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  assert.ok(response.body[0].id)
  assert.strictEqual(response.body[0]._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt',
    url: 'https://example.com/pragmatic-programmer',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(blogsAtEnd.some(blog => blog.title === newBlog.title))
})

test('a blog without likes defaults to zero', async () => {
  const response = await api
    .post('/api/blogs')
    .send({ title: 'No likes yet', author: 'Ada Lovelace', url: 'https://example.com/no-likes' })
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog without a title or URL is rejected', async () => {
  await api
    .post('/api/blogs')
    .send({ author: 'Ada Lovelace', likes: 1 })
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
