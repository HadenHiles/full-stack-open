const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../../atlas-credentials.env'), quiet: true })
dotenv.config({ quiet: true })

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

const logFormat = (tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'),
		'-',
		tokens['response-time'](req, res),
		'ms',
		JSON.stringify(req.body),
	].join(' ')
}

// log the body too so i can see what's being sent
app.use(morgan(logFormat))

app.get('/info', async (req, res, next) => {
	try {
		const count = await Person.countDocuments({})
		const currentTime = new Date().toLocaleString()
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

		res.send(
			`
			<div><p>Phonebook has info for ${count} people</p></div>
			<div><p>${currentTime} (${timezone})</p></div>
			`
		)
	} catch (error) {
		next(error)
	}
})

app.get('/api/persons', async (req, res, next) => {
	try {
		const persons = await Person.find({})
		res.json(persons)
	} catch (error) {
		next(error)
	}
})

app.get('/api/persons/:id', async (req, res, next) => {
	try {
		const person = await Person.findById(req.params.id)
		if (!person) {
			return res.status(404).end()
		}

		res.json(person)
	} catch (error) {
		next(error)
	}
})

app.delete('/api/persons/:id', async (req, res, next) => {
	try {
		await Person.findByIdAndDelete(req.params.id)
		res.status(204).end()
	} catch (error) {
		next(error)
	}
})

app.post('/api/persons', async (req, res, next) => {
	try {
		const { name, number } = req.body
		const person = new Person({ name, number })
		const savedPerson = await person.save()
		res.status(201).json(savedPerson)
	} catch (error) {
		next(error)
	}
})

app.put('/api/persons/:id', async (req, res, next) => {
	try {
		const updatedPerson = await Person.findByIdAndUpdate(
			req.params.id,
			{ name: req.body.name, number: req.body.number },
			{ new: true, runValidators: true, context: 'query' }
		)
		if (!updatedPerson) {
			return res.status(404).end()
		}

		res.json(updatedPerson)
	} catch (error) {
		next(error)
	}
})

const unknownEndpoint = (_req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	}

	if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	if (error.code === 11000) {
		return res.status(400).json({ error: 'name must be unique' })
	}

	next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
