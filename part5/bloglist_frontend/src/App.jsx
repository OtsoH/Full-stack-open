import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Blogfrom from './components/Blogform'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`A new blog '${returnedBlog.title}' by ${returnedBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()

    } catch (exception) {
      setNotification('Error creating blog:' + exception.message)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`welcome ${user.name}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('wrong username or password')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('logged out successfully')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    ))
  }
  const handleRemoveBlog = async (blogToRemove) => {
    try {
      if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
        await blogService.remove(blogToRemove.id)
        setBlogs(blogs.filter(b => b.id !== blogToRemove.id))
        setNotification(`Blog '${blogToRemove.title}' removed successfully`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    } catch (exception) {
      setNotification(`Error removing blog: ${exception.message}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const blogForm = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

    return (
      <div>
        <h2>blogs</h2>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            user={user}
            handleRemoveBlog={handleRemoveBlog}
          />
        )}
      </div>
    )
  }
  return (
    <div>
      <Notification message={notification} />
      {!user && loginForm()}
      {user && (
        <div>
          <p> {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <Blogfrom createBlog={createBlog} />
          </Togglable>
        </div>
      )}
      {!user && blogForm()}
    </div>
  )
}

export default App