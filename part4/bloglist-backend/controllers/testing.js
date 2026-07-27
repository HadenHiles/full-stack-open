const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (_request, response) => {
	// These collections do not depend on each other during a reset.
	await Promise.all([
		Blog.deleteMany({}),
		User.deleteMany({}),
	])

	response.status(204).end()
})

module.exports = testingRouter
