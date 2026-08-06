import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true, minlength: 2 },
	published: { type: Number },
	// Author is stored as an ObjectId reference; populated in resolvers.
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
	genres: [{ type: String }],
})

bookSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString()
		delete ret._id
		delete ret.__v
	},
})

export default mongoose.model('Book', bookSchema)
