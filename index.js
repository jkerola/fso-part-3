const express = require('express')
var morgan = require('morgan')
const app = express()

// custom morgan token for body content
morgan.token('body', function (req, res) { 
  if (req.body && req.method=='POST') {
    return JSON.stringify(req.body)
  } else return ' ' // if no body content, return this to keep console clean
})

app.use(express.json())
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
app.get('/api/persons', (req, res) => { // ALL CONTACTS
  res.json(persons)
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
app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    const missing = body.name ? 'number' : 'name'
    return res.status(400).json(
      {
        'error': `no ${missing} content`
      }
    )
  }
  const existingContact = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
  if (existingContact) {
    return res.status(400).json(
      {
        'error': `${body.name} already exists in phonebook`
      }
    )
  }
  const contact = {
    ...body,
    "id": Math.random(100000)
  }
  persons = persons.concat(contact)
  res.json(contact)
})
// DELETE ROUTES
app.delete('/api/persons/:id', (req, res) => { // DELETE CONTACT
  const id = Number(req.params.id)
  const removedContact = persons.find(person => person.id == id)
  if (removedContact) {
    persons = persons.filter(person => person.id != id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})