import { useEffect, useState } from 'react'import {
	AppBar,
	Box,
	Button,
	Container,
	Toolbar,
	Typography,
} from '@mui/material'
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
import useNotificationStore from './store/notificationStore'
import useBlogStore from './store/blogStore'
import useUserStore from './store/userStore'
import './index.css'

const BlogView = ({ user }) => {
	const { id } = useParams()
	const blogs = useBlogStore(state => state.blogs)
	const likeBlog = useBlogStore(state => state.likeBlog)
	const removeBlog = useBlogStore(state => state.removeBlog)
	const showNotification = useNotificationStore(state => state.showNotification)
	const navigate = useNavigate()
	const selectedBlog = blogs.find(blog => blog.id === id)

	if (!selectedBlog) {
		return null
	}

	const handleLike = async () => {
		await likeBlog(selectedBlog)
		showNotification(`liked '${selectedBlog.title}'`)
	}

	const handleRemove = async () => {
		// Give the user one chance to back out of the destructive action.
		const shouldRemove = window.confirm(
			`Remove blog ${selectedBlog.title} by ${selectedBlog.author}?`
		)
		if (!shouldRemove) return

		try {
			await removeBlog(selectedBlog)
			showNotification(`removed '${selectedBlog.title}'`)
			navigate('/')
		} catch {
			showNotification('blog could not be removed', 'error')
		}
	}

	return (
		<Blog
			blog={selectedBlog}
			user={user}
			handleLike={handleLike}
			handleRemove={handleRemove}
		/>
	)
}

const App = () => {
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const user = useUserStore(state => state.user)
	const loginUser = useUserStore(state => state.login)
	const logoutUser = useUserStore(state => state.logout)
	const initUser = useUserStore(state => state.initUser)
	const showNotification = useNotificationStore(state => state.showNotification)
	const blogs = useBlogStore(state => state.blogs)
	const initializeBlogs = useBlogStore(state => state.initializeBlogs)
	const createBlogInStore = useBlogStore(state => state.createBlog)

	useEffect(() => {
		initializeBlogs()
	}, [initializeBlogs])

	useEffect(() => {
		// Restore the session before the user tries anything that needs a token.
		initUser()
	}, [initUser])

	const handleLogin = async (event) => {
		event.preventDefault()
		try {
			await loginUser({ username, password })
			setUsername('')
			setPassword('')
			navigate('/')
		} catch {
			showNotification('wrong username or password', 'error')
		}
	}

	const handleLogout = () => {
		logoutUser()
		navigate('/')
	}

	const createBlog = async (blog) => {
		try {
			const createdBlog = await createBlogInStore(blog)
			showNotification(
				`a new blog ${createdBlog.title} by ${createdBlog.author} added`
			)
			navigate('/')
		} catch {
			showNotification('blog could not be created', 'error')
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
		<Container maxWidth="md">
			<AppBar position="static" sx={{ mt: 2 }}>
				<Toolbar>
					<Button color="inherit" component={Link} to="/">
						blogs
					</Button>
					{user && (
						<Button color="inherit" component={Link} to="/create">
							create new
						</Button>
					)}
					{!user && (
						<Button color="inherit" component={Link} to="/login">
							login
						</Button>
					)}
					{user && (
						<Box
							sx={{
								alignItems: 'center',
								display: 'flex',
								gap: 1,
								ml: 'auto',
							}}
						>
							<Typography>{user.name} logged in</Typography>
							<Button color="inherit" onClick={handleLogout}>
								logout
							</Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>
			<h1>Blog application</h1>
			<Notification />
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
					element={<BlogView user={user} />}
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
				<Route path="*" element={<div><h2>404 - Page not found</h2></div>} />
			</Routes>
		</Container>
	)
}

export default App
