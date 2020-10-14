const { response } = require('express')
const express = require('express')
const app = express()

const persons = [
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
app.get('/info', (request, response) => { // API INFO
  const currentDate = new Date()
  const message = `Phonebook has information on ${persons.length} contacts!<br/>${currentDate}`
  response.send(message)
})
app.get('/api/persons', (request, response) => { // ALL CONTACTS
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})