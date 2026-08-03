import { create } from 'zustand'
import blogService from '../services/blogs'

// Stores the full list of blogs and exposes async actions for CRUD operations.
const useBlogStore = create((set, get) => ({
	blogs: [],

	initializeBlogs: async () => {
		const blogsFromServer = await blogService.getAll()
		set({ blogs: blogsFromServer })
	},

	createBlog: async (blogData) => {
		const createdBlog = await blogService.create(blogData)
		set(state => ({ blogs: state.blogs.concat(createdBlog) }))
		return createdBlog
	},

	likeBlog: async (blog) => {
		// The backend replaces the full blog, not only the likes field.
		const updatedBlog = await blogService.update(blog.id, {
			title: blog.title,
			author: blog.author,
			url: blog.url,
			likes: blog.likes + 1,
			user: blog.user?.id,
		})

		// The PUT response only has the creator id, so keep the populated user.
		set(state => ({
			blogs: state.blogs.map(savedBlog =>
				savedBlog.id === blog.id
					? { ...updatedBlog, user: blog.user }
					: savedBlog
			),
		}))
	},

	removeBlog: async (blog) => {
		await blogService.remove(blog.id)
		set(state => ({
			blogs: state.blogs.filter(savedBlog => savedBlog.id !== blog.id),
		}))
	},
}))

export default useBlogStore
