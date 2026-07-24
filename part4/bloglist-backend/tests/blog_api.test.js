const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const helper = require('./test_helper')

const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const user = await new User({ username: 'blogger', name: 'Blog Creator', passwordHash: 'hash' }).save()
  token = jwt.sign({ username: user.username, id: user._id }, config.SECRET)
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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'No likes yet', author: 'Ada Lovelace', url: 'https://example.com/no-likes' })
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog without a title or URL is rejected', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({ author: 'Ada Lovelace', likes: 1 })
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('a blog can be updated', async () => {
  const blogToUpdate = (await helper.blogsInDb())[0]

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ ...blogToUpdate, likes: 42 })
    .expect(200)

  assert.strictEqual(response.body.likes, 42)
})

test('blogs and users include their related resources', async () => {
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'Owned blog', url: 'https://example.com/owned' }).expect(201)

  const blogs = await api.get('/api/blogs')
  const users = await api.get('/api/users')
  assert.strictEqual(blogs.body.find(blog => blog.title === 'Owned blog').user.username, 'blogger')
  assert.strictEqual(users.body[0].blogs.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})
