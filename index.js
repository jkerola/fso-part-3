const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Contact = require('./models/Contact')
const app = express()

// custom morgan token for body content
morgan.token('body', function (req) {
  if (req.body && req.method === 'POST') {
    return JSON.stringify(req.body)
  } else return ' ' // if no body content, return this to keep console clean
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// GET routes
app.get('/info', (req, res, next) => { // API INFO
  const currentDate = new Date()
  Contact.find({})
    .then(result => {
      const message = `Phonebook has information on ${result.length} contacts!<br/>${currentDate}`
      res.send(message)
    })
    .catch(error => next(error))
})
app.get('/api/persons', (req, res, next) => { // ALL CONTACTS
  //res.json(persons)
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
    .catch(error => next(error))
})
app.get('/api/persons/:id', (req, res, next) => { // UNIQUE CONTACT
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})
// POST ROUTES
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    const missing = body.name ? 'number' : 'name'
    return res.status(400).json(
      {
        'error': `no ${missing} content`
      }
    )
  }
  const contact = new Contact({
    ...body,
  })
  contact.save().then(response => {
    res.json(response)
  })
    .catch(error => next(error))
})
// DELETE ROUTES
app.delete('/api/persons/:id', (req, res, next) => { // DELETE CONTACT
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
// PUT ROUIES
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  const update = {
    name: body.name,
    number: body.number,
  }
  if (!body.name || !body.number) {
    const missing = !body.name ? 'number' : 'name'
    return res.status(400).send({ error: `missing ${missing} content` })
  }
  Contact.findByIdAndUpdate(id, update, { new: true })
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).send({ error: 'not found' })
      }
    })
    .catch(error => next(error))
})

// errorHandler from example at
//https://fullstackopen.com/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#virheidenkasittelyn-keskittaminen-middlewareen
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

// unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})