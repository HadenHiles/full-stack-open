const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{ title: 'Clean Code', author: 'Robert C. Martin', url: 'https://example.com/clean-code', likes: 10 },
	{ title: 'Refactoring', author: 'Martin Fowler', url: 'https://example.com/refactoring', likes: 12 },
]

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

module.exports = {
	initialBlogs,
	blogsInDb,
	usersInDb,
}
