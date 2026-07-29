import { useEffect, useRef, useState } from 'react'
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
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const Notification = ({ notification }) => {
  if (!notification) return null
  return <div className={notification.type}>{notification.message}</div>
}

const BlogView = ({ blogs, user, likeBlog, removeBlog }) => {
  const { id } = useParams()
  const blog = blogs.find((item) => item.id === id)
  if (!blog) return null
  return (
    <Blog
      blog={blog}
      user={user}
      handleLike={() => likeBlog(blog)}
      handleRemove={() => removeBlog(blog)}
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
  const blogFormRef = useRef()

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    blogService.getAll().then(setBlogs)
  }, [])

  useEffect(() => {
    const storedUser = window.localStorage.getItem('loggedBlogappUser')
    if (storedUser) {
      const savedUser = JSON.parse(storedUser)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
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
      notify('wrong username or password', 'error')
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
      notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch {
      notify('blog could not be created', 'error')
    }
  }

  const likeBlog = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id,
    })
    setBlogs(
      blogs.map((item) =>
        item.id === blog.id ? { ...updatedBlog, user: blog.user } : item,
      ),
    )
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((item) => item.id !== blog.id))
    } catch {
      notify('blog could not be removed', 'error')
    }
  }

  const loginView = (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link>{' '}
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
              {user && (
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm createBlog={createBlog} />
                </Togglable>
              )}
              {[...blogs].sort((a, b) => b.likes - a.likes).map((blog) => (
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
      </Routes>
    </div>
  )
}

export default App
