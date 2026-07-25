import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
    } catch {
      // Notifications are introduced in exercise 5.4.
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (event) => {
    event.preventDefault()
    const createdBlog = await blogService.create({ title, author, url })
    setBlogs(blogs.concat(createdBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  if (!user) {
    return (
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
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          title:
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
