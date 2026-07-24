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

const authHeader = () => `Bearer ${token}`

beforeEach(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})

	const user = await new User({
		username: 'blogger',
		name: 'Blog Creator',
		passwordHash: 'hash',
	}).save()

	token = jwt.sign(
		{ username: user.username, id: user._id },
		config.SECRET
	)

	await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as JSON with the correct count', async () => {
	const blogsResponse = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	assert.strictEqual(blogsResponse.body.length, helper.initialBlogs.length)
})

test('blog identifier is named id', async () => {
	const blogsResponse = await api.get('/api/blogs')

	assert.ok(blogsResponse.body[0].id)
	assert.strictEqual(blogsResponse.body[0]._id, undefined)
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
		.set('Authorization', authHeader())
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
	assert(blogsAtEnd.some(blog => blog.title === newBlog.title))
})

test('a blog cannot be added without a token', async () => {
	await api
		.post('/api/blogs')
		.send({ title: 'Unauthorized', url: 'https://example.com/unauthorized' })
		.expect(401)

	const blogsAtEnd = await helper.blogsInDb()
	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog without likes defaults to zero', async () => {
	const createBlogResponse = await api
		.post('/api/blogs')
		.set('Authorization', authHeader())
		.send({
			title: 'No likes yet',
			author: 'Ada Lovelace',
			url: 'https://example.com/no-likes',
		})
		.expect(201)

	assert.strictEqual(createBlogResponse.body.likes, 0)
})

test('a blog without a title or URL is rejected', async () => {
	await api
		.post('/api/blogs')
		.set('Authorization', authHeader())
		.send({ author: 'Ada Lovelace', likes: 1 })
		.expect(400)

	const blogsAtEnd = await helper.blogsInDb()
	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
	const createBlogResponse = await api
		.post('/api/blogs')
		.set('Authorization', authHeader())
		.send({
			title: 'Disposable',
			url: 'https://example.com/disposable',
		})
		.expect(201)
	const blogToDelete = createBlogResponse.body

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.set('Authorization', authHeader())
		.expect(204)

	const blogsAtEnd = await helper.blogsInDb()
	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be updated', async () => {
	const blogToUpdate = (await helper.blogsInDb())[0]

	const updateBlogResponse = await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.send({ ...blogToUpdate, likes: 42 })
		.expect(200)

	assert.strictEqual(updateBlogResponse.body.likes, 42)
})

test('blogs and users include their related resources', async () => {
	await api
		.post('/api/blogs')
		.set('Authorization', authHeader())
		.send({
			title: 'Owned blog',
			url: 'https://example.com/owned',
		})
		.expect(201)

	const blogsResponse = await api.get('/api/blogs')
	const usersResponse = await api.get('/api/users')
	const ownedBlog = blogsResponse.body.find(blog => blog.title === 'Owned blog')

	assert.strictEqual(ownedBlog.user.username, 'blogger')
	assert.strictEqual(usersResponse.body[0].blogs.length, 1)
})

after(async () => {
	await mongoose.connection.close()
})
