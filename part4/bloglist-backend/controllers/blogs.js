const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (_request, response, next) => {
	try {
		const blogs = await Blog
			.find({})
			.populate('user', { username: 1, name: 1 })

		response.json(blogs)
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

		const newBlog = new Blog({
			title,
			author,
			url,
			likes,
			user: loggedInUser._id,
		})
		const savedBlog = await newBlog.save()

		// add to user.blogs too
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
		const blog = await Blog.findById(request.params.id)

		if (!blog) {
			return response.status(404).end()
		}

		const canDelete = request.user
			&& blog.user.toString() === request.user.id

		if (!canDelete) {
			return response.status(401).json({ error: 'token invalid' })
		}

		await blog.deleteOne()
		logger.info(`removed ${blog.title} from the blog list`)
		response.status(204).end()
	} catch (error) {
		next(error)
	}
})

blogsRouter.put('/:id', async (request, response, next) => {
	try {
		const { title, author, url, likes, user } = request.body
		const update = { title, author, url, likes, user }

		const updatedBlog = await Blog.findByIdAndUpdate(
			request.params.id,
			update,
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
