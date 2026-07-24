const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
		trim: true,
	},
	name: String,
	passwordHash: String,
	blogs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Blog',
	}],
})

userSchema.set('toJSON', {
	transform: (_document, jsonUser) => {
		// The password hash should never leave the backend.
		jsonUser.id = jsonUser._id.toString()

		delete jsonUser._id
		delete jsonUser.__v
		delete jsonUser.passwordHash
	},
})

module.exports = mongoose.model('User', userSchema)
