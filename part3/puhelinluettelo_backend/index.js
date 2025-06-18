require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
const Person = require('./models/person.js')


morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
    console.log(persons)
  })
})

app.get('/info', (request, response) => {
    Person.countDocuments({})
    .then(count => {
      const time = new Date()
      response.send(
        `Phonebook has info for ${count} people<br><br>${time}`
    )
  })
  .catch(error => (next(error)))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
  })




app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  Person.findOne({ name: body.name })
  .then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number


      return person.save()
    })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)