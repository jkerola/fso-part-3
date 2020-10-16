const mongoose = require('mongoose')
require('dotenv').config()
// from example at
// https://fullstackopen.com/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#mongo-db

let name = null
let number = null
if (process.argv.length < 2) {
  console.log('missing params!')
  process.exit(1)
} else if (process.argv.length === 3) {
  console.log('both name and number are required')
  process.exit(1)
} else if (process.argv.length === 4) {
  name = process.argv[2]
  number = process.argv[3]
} else if (process.argv.length > 4) {
  console.log('too many arguments! use ""')
  process.exit(1)
}

const password = process.argv[2]
const appName = 'phonebook'
const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

const getContacts = () => {
  Contact.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
}

if (name && number) {
  const contact = new Contact({
    name,
    number,
    id: Math.random()
  })
  contact.save().then(response => {
    console.log('contact added')
    mongoose.connection.close()
  })
} else {
  getContacts()
}
