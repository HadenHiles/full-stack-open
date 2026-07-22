const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (!url) {
	throw new Error('MONGODB_URI is not defined')
}

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch(error => {
		console.error('error connecting to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		trim: true,
		unique: true,
	},
	number: {
		type: String,
		required: true,
		minLength: 8,
		trim: true,
		validate: {
			validator: number => /^\d{2,3}-\d+$/.test(number),
			message: properties => `${properties.value} is not a valid phone number`,
		},
	},
})

personSchema.set('toJSON', {
	transform: (_document, jsonPerson) => {
		// The frontend only needs one friendly id field.
		jsonPerson.id = jsonPerson._id.toString()

		delete jsonPerson._id
		delete jsonPerson.__v
	},
})

module.exports = mongoose.model('Person', personSchema)
