const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../atlas-credentials.env'), quiet: true })

const args = process.argv.slice(2)

if (![0, 1, 2, 3].includes(args.length)) {
  console.log('usage: node mongo.js [name] [number]')
  process.exit(1)
}

let [name, number] = args

if (args.length === 1 || args.length === 3) {
  const [password, suppliedName, suppliedNumber] = args
  const mongoUrl = new URL(process.env.MONGODB_URI)
  mongoUrl.password = password
  process.env.MONGODB_URI = mongoUrl.toString()
  name = suppliedName
  number = suppliedNumber
}

const mongoose = require('mongoose')
const Person = require('./models/person')

const closeConnection = () => mongoose.connection.close()

if (!name) {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => console.log(`${person.name} ${person.number}`))
    })
    .then(closeConnection)
    .catch(error => {
      console.error(error.message)
      closeConnection()
    })
} else {
  const person = new Person({ name, number })

  person.save()
    .then(() => console.log(`added ${name} number ${number} to phonebook`))
    .then(closeConnection)
    .catch(error => {
      console.error(error.message)
      closeConnection()
    })
}
