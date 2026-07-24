const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')
const logger = require('./logger')

const requestLogger = (request, _response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (_request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, _response, next) => {
	const authorization = request.get('authorization')

	// Store just the token so controllers do not have to parse headers again.
	request.token = authorization && authorization.startsWith('Bearer ')
		? authorization.substring(7)
		: null

	next()
}

const userExtractor = async (request, _response, next) => {
	try {
		if (!request.token) {
			return next()
		}

		const decodedToken = jwt.verify(request.token, config.SECRET)
		// Controllers can now work with the actual user instead of an id.
		request.user = await User.findById(decodedToken.id)

		next()
	} catch (error) {
		next(error)
	}
}

const errorHandler = (error, _request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'token invalid' })
	}

	next(error)
}

module.exports = {
	requestLogger,
	tokenExtractor,
	userExtractor,
	unknownEndpoint,
	errorHandler,
}
