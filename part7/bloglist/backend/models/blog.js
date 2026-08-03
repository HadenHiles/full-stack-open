const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	author: String,
	url: {
		type: String,
		required: true,
		trim: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	// Comments are anonymous strings stored directly on the blog document.
	comments: {
		type: [String],
		default: [],
	},
})

blogSchema.set('toJSON', {
	transform: (_document, jsonBlog) => {
		// Keep Mongo's internal fields out of API responses.
		jsonBlog.id = jsonBlog._id.toString()

		delete jsonBlog._id
		delete jsonBlog.__v
	},
})

module.exports = mongoose.model('Blog', blogSchema)
