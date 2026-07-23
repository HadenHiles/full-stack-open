const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('a user can be created and listed without a password hash', async () => {
  await api
    .post('/api/users')
    .send({ username: 'ada', name: 'Ada Lovelace', password: 'analytical' })
    .expect(201)

  const response = await api.get('/api/users').expect(200)
  assert.strictEqual(response.body.length, 1)
  assert.strictEqual(response.body[0].username, 'ada')
  assert.strictEqual(response.body[0].passwordHash, undefined)
})

after(async () => {
  await mongoose.connection.close()
})
