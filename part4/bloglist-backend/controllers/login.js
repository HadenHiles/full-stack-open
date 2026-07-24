const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
	const { username, password } = request.body
	const userAccount = await User.findOne({ username })

	// Do not run bcrypt when there was no matching account.
	const passwordIsCorrect = userAccount
		&& await bcrypt.compare(password, userAccount.passwordHash)

	if (!passwordIsCorrect) {
		return response
			.status(401)
			.json({ error: 'invalid username or password' })
	}

	// Only put what the middleware actually needs in the token.
	const userForToken = {
		username: userAccount.username,
		id: userAccount._id,
	}
	const token = jwt.sign(userForToken, config.SECRET)

	response.status(200).send({
		token,
		username: userAccount.username,
		name: userAccount.name,
	})
})

module.exports = loginRouter
