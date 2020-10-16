require('dotenv').config()
const Mongoose = require('mongoose')
const UniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

// from example at
//https://fullstackopen.com/osa3/tietojen_tallettaminen_mongo_db_tietokantaan
console.log('connecting...')
Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connection succesfull!')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new Mongoose.Schema({
  name: {type: String, required: true, minlength: 1, unique: true},
  number: {type: String, required: true, minlength: 0}
})
contactSchema.plugin(UniqueValidator)

// from same example
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = Mongoose.model('Contact', contactSchema)