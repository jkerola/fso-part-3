const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Contact = require('./models/Contact')
const { response } = require('express')

const app = express()

// custom morgan token for body content
morgan.token('body', function (req, res) {
  if (req.body && req.method == 'POST') {
    return JSON.stringify(req.body)
  } else return ' ' // if no body content, return this to keep console clean
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]
// GET routes
app.get('/info', (req, res) => { // API INFO
  const currentDate = new Date()
  const message = `Phonebook has information on ${persons.length} contacts!<br/>${currentDate}`
  res.send(message)
})
app.get('/api/persons', (req, res, next) => { // ALL CONTACTS
  //res.json(persons)
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
    .catch(error => next(error))
})
app.get('/api/persons/:id', (req, res) => { // UNIQUE CONTACT
  const id = Number(req.params.id)
  const contact = persons.find(person => person.id === id)
  if (contact) {
    res.json(contact)
  } else {
    res.status(404).end()
  }
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
    console.log('new contact saved')
    res.json(response)
  })
    .catch(error => next(error))
})
// DELETE ROUTES
app.delete('/api/persons/:id', (req, res, next) => { // DELETE CONTACT
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// errorHandler from example at
//https://fullstackopen.com/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#virheidenkasittelyn-keskittaminen-middlewareen
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    console.log('been here')
    return res.status(400).send({ error: 'malformatted id' })
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