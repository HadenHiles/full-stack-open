import { useEffect, useState } from 'react'
import {
	Link,
	Navigate,
	Route,
	Routes,
	useNavigate,
	useParams,
} from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const BlogView = ({ blogs, user, likeBlog, removeBlog }) => {
	const { id } = useParams()
	const selectedBlog = blogs.find(blog => blog.id === id)

	if (!selectedBlog) {
		return null
	}

	return (
		<Blog
			blog={selectedBlog}
			user={user}
			handleLike={() => likeBlog(selectedBlog)}
			handleRemove={() => removeBlog(selectedBlog)}
		/>
	)
}

const App = () => {
	const navigate = useNavigate()
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [notification, setNotification] = useState(null)

	const showNotification = (message, type = 'success') => {
		setNotification({ message, type })

		// Notifications are useful, but they should not hang around forever.
		setTimeout(() => setNotification(null), 5000)
	}

	useEffect(() => {
		blogService
			.getAll()
			.then(blogsFromServer => setBlogs(blogsFromServer))
	}, [])

	useEffect(() => {
		// Restore the session before the user tries anything that needs a token.
		const storedUserJson = window.localStorage.getItem('loggedBlogappUser')

		if (storedUserJson) {
			const storedUser = JSON.parse(storedUserJson)
			setUser(storedUser)
			blogService.setToken(storedUser.token)
		}
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()
		try {
			const loggedInUser = await loginService.login({ username, password })
			window.localStorage.setItem(
				'loggedBlogappUser',
				JSON.stringify(loggedInUser),
			)
			blogService.setToken(loggedInUser.token)
			setUser(loggedInUser)
			setUsername('')
			setPassword('')
			navigate('/')
		} catch {
			showNotification('wrong username or password', 'error')
		}
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogappUser')
		blogService.setToken(null)
		setUser(null)
		navigate('/')
	}

	const createBlog = async (blog) => {
		try {
			const createdBlog = await blogService.create(blog)
			setBlogs(blogs.concat({ ...createdBlog, user }))
			showNotification(
				`a new blog ${createdBlog.title} by ${createdBlog.author} added`
			)
			navigate('/')
		} catch {
			showNotification('blog could not be created', 'error')
		}
	}

	const likeBlog = async (blog) => {
		// The backend replaces the full blog, not only the likes field.
		const updatedBlog = await blogService.update(blog.id, {
			title: blog.title,
			author: blog.author,
			url: blog.url,
			likes: blog.likes + 1,
			user: blog.user?.id,
		})

		// The PUT response only has the creator id, so keep the populated user.
		setBlogs(
			blogs.map(savedBlog =>
				savedBlog.id === blog.id
					? { ...updatedBlog, user: blog.user }
					: savedBlog
			)
		)
	}

	const removeBlog = async (blog) => {
		// Give the user one chance to back out of the destructive action.
		const shouldRemoveBlog = window.confirm(
			`Remove blog ${blog.title} by ${blog.author}?`
		)

		if (!shouldRemoveBlog) {
			return
		}

		try {
			await blogService.remove(blog.id)
			setBlogs(blogs.filter(savedBlog => savedBlog.id !== blog.id))
			navigate('/')
		} catch {
			showNotification('blog could not be removed', 'error')
		}
	}

	const loginView = (
		<LoginForm
			handleLogin={handleLogin}
			username={username}
			password={password}
			setUsername={setUsername}
			setPassword={setPassword}
		/>
	)

	return (
		<div>
			<nav>
				<Link to="/">blogs</Link>{' '}
				{user && <Link to="/create">create new</Link>}{' '}
				{!user && <Link to="/login">login</Link>}
				{user && (
					<>
						{user.name} logged in{' '}
						<button onClick={handleLogout}>logout</button>
					</>
				)}
			</nav>
			<h1>Blog application</h1>
			<Notification notification={notification} />
			<Routes>
				<Route
					path="/"
					element={
						<div>
							<h2>blogs</h2>
							{[...blogs]
								.sort((firstBlog, secondBlog) =>
									secondBlog.likes - firstBlog.likes
								)
								.map(blog => (
									<div className="blog" key={blog.id}>
										<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
									</div>
								))}
						</div>
					}
				/>
				<Route
					path="/blogs/:id"
					element={
						<BlogView
							blogs={blogs}
							user={user}
							likeBlog={likeBlog}
							removeBlog={removeBlog}
						/>
					}
				/>
				<Route
					path="/login"
					element={user ? <Navigate to="/" replace /> : loginView}
				/>
				<Route
					path="/create"
					element={
						user
							? <BlogForm createBlog={createBlog} />
							: <Navigate to="/login" />
					}
				/>
			</Routes>
		</div>
	)
}

export default App
