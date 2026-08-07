import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true, minlength: 3 },
	favoriteGenre: { type: String, required: true },
})

userSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString()
		delete ret._id
		delete ret.__v
	},
})

export default mongoose.model('User', userSchema)
