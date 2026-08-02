const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
	try {
		const { username, name, password } = request.body
		const usernameIsTooShort = !username || username.length < 3
		const passwordIsTooShort = !password || password.length < 3

		// Keeping these checks named makes the rule easier to change later.
		if (usernameIsTooShort || passwordIsTooShort) {
			return response
				.status(400)
				.json({
					error: 'username and password must be at least 3 characters long',
				})
		}

		// Raw passwords should never make it as far as MongoDB.
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(password, saltRounds)
		const newUser = new User({ username, name, passwordHash })
		const savedUser = await newUser.save()

		response.status(201).json(savedUser)
	} catch (error) {
		if (error.code === 11000) {
			// Mongo's duplicate-key error is not useful to somebody filling the form.
			return response
				.status(400)
				.json({ error: 'username must be unique' })
		}

		next(error)
	}
})

usersRouter.get('/', async (_request, response, next) => {
	try {
		// The profile view should not need another request for blog titles.
		const registeredUsers = await User
			.find({})
			.populate('blogs', {
				title: 1,
				author: 1,
				url: 1,
				likes: 1,
			})

		response.json(registeredUsers)
	} catch (error) {
		next(error)
	}
})

module.exports = usersRouter
