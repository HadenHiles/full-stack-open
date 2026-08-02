const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (_request, response, next) => {
	try {
		// Populate this now since every blog screen needs the creator name.
		const savedBlogs = await Blog
			.find({})
			.populate('user', { username: 1, name: 1 })

		response.json(savedBlogs)
	} catch (error) {
		next(error)
	}
})

blogsRouter.post('/', async (request, response, next) => {
	try {
		const loggedInUser = request.user
		const { title, author, url, likes } = request.body

		if (!loggedInUser) {
			return response.status(401).json({ error: 'token invalid' })
		}

		const blogToSave = new Blog({
			title,
			author,
			url,
			likes,
			user: loggedInUser._id,
		})
		const savedBlog = await blogToSave.save()

		// Keep the reverse reference in sync for the user endpoint.
		loggedInUser.blogs = loggedInUser.blogs.concat(savedBlog._id)
		await loggedInUser.save()

		logger.info(`added ${savedBlog.title} to the blog list`)
		response.status(201).json(savedBlog)
	} catch (error) {
		next(error)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
		const blogToRemove = await Blog.findById(request.params.id)

		if (!blogToRemove) {
			return response.status(404).end()
		}

		const isBlogOwner = request.user
			&& blogToRemove.user.toString() === request.user.id

		// A valid token is not enough; it has to belong to this blog.
		if (!isBlogOwner) {
			return response.status(401).json({ error: 'token invalid' })
		}

		await blogToRemove.deleteOne()
		logger.info(`removed ${blogToRemove.title} from the blog list`)
		response.status(204).end()
	} catch (error) {
		next(error)
	}
})

blogsRouter.put('/:id', async (request, response, next) => {
	try {
		const { title, author, url, likes, user } = request.body
		const blogChanges = { title, author, url, likes, user }

		const updatedBlog = await Blog.findByIdAndUpdate(
			request.params.id,
			blogChanges,
			{
				new: true,
				runValidators: true,
			}
		)

		if (!updatedBlog) {
			return response.status(404).end()
		}

		logger.info(`updated ${updatedBlog.title}`)
		response.json(updatedBlog)
	} catch (error) {
		next(error)
	}
})

module.exports = blogsRouter
