const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
	await User.deleteMany({})
})

test('a user can be created and listed without a password hash', async () => {
	await api
		.post('/api/users')
		.send({ username: 'ada', name: 'Ada Lovelace', password: 'analytical' })
		.expect(201)

	const usersResponse = await api.get('/api/users').expect(200)

	assert.strictEqual(usersResponse.body.length, 1)
	assert.strictEqual(usersResponse.body[0].username, 'ada')
	assert.strictEqual(usersResponse.body[0].passwordHash, undefined)
})

test('invalid users are rejected without changing the database', async () => {
	const createUserResponse = await api
		.post('/api/users')
		.send({ username: 'ab', password: 'no' })
		.expect(400)

	assert.match(createUserResponse.body.error, /at least 3 characters/)
	const usersAtEnd = await helper.usersInDb()
	assert.strictEqual(usersAtEnd.length, 0)
})

after(async () => {
	await mongoose.connection.close()
})
