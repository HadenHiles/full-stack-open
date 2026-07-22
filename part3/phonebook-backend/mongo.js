const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../../atlas-credentials.env'), quiet: true })

const commandLineArguments = process.argv.slice(2)

if (![0, 1, 2, 3].includes(commandLineArguments.length)) {
	console.log('usage: node mongo.js [name] [number]')
	process.exit(1)
}

let [name, number] = commandLineArguments

if (commandLineArguments.length === 1 || commandLineArguments.length === 3) {
	// The course's original command accepted the Atlas password separately.
	const [password, suppliedName, suppliedNumber] = commandLineArguments
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
		.then(phonebookEntries => {
			console.log('phonebook:')
			phonebookEntries.forEach(person => {
				console.log(`${person.name} ${person.number}`)
			})
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
