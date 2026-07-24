const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
	try {
		const { username, name, password } = request.body

		if (!username || username.length < 3 || !password || password.length < 3) {
			return response
				.status(400)
				.json({ error: 'username and password must be at least 3 characters long' })
		}

		// always hash before saving
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(password, saltRounds)
		const newUser = new User({ username, name, passwordHash })
		const savedUser = await newUser.save()

		response.status(201).json(savedUser)
	} catch (error) {
		if (error.code === 11000) {
			// map mongodb duplicate key to a readable message
			return response
				.status(400)
				.json({ error: 'username must be unique' })
		}

		next(error)
	}
})

usersRouter.get('/', async (_request, response, next) => {
	try {
		const users = await User
			.find({})
			.populate('blogs', {
				title: 1,
				author: 1,
				url: 1,
				likes: 1,
			})

		response.json(users)
	} catch (error) {
		next(error)
	}
})

module.exports = usersRouter
