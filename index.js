const { res, req } = require('express')
const bodyParser = require('body-parser')

const express = require('express')
const app = express()

app.use(express.json())

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
// DELETE ROUTES
app.delete('/api/persons/:id', (req, res) => {
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