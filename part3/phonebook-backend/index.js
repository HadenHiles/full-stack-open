const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../atlas-credentials.env'), quiet: true })
dotenv.config({ quiet: true })

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', async (_request, response, next) => {
  try {
    const personCount = await Person.countDocuments({})
    response.send(
      `<p>Phonebook has info for ${personCount} people</p><p>${new Date()}</p>`
    )
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons', async (_request, response, next) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (!person) {
      return response.status(404).end()
    }

    response.json(person)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (request, response, next) => {
  try {
    const person = new Person({
      name: request.body.name,
      number: request.body.number,
    })
    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findByIdAndUpdate(
      request.params.id,
      { name: request.body.name, number: request.body.number },
      { new: true, runValidators: true, context: 'query' }
    )
    if (!person) {
      return response.status(404).end()
    }

    response.json(person)
  } catch (error) {
    next(error)
  }
})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.code === 11000) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
