import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, user, handleRemoveBlog }) => {
  const [expanded, setExpanded] = useState(false)
  const [currentBlog, setCurrentBlog] = useState(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const ownBlog = () => {
    if (!user || !currentBlog.user) return false

    const loggedInUsername = user.username

    if (typeof currentBlog.user === 'object') {
      return currentBlog.user.username === loggedInUsername
    }

    return false
  }

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.newLike(currentBlog)
      setCurrentBlog(updatedBlog)

      if (updateBlog) {
        updateBlog(updatedBlog)
      }

    } catch (exception) {
      console.error('Error liking blog:', exception)
    }
  }

  const basicView = () => (
    <div style={blogStyle}>
      {currentBlog.title} {currentBlog.author}
      <button onClick={toggleExpanded}>view</button>
    </div>
  )

  const expandedView = () => (
    <div style={blogStyle}>
      <div>
        {currentBlog.title} {currentBlog.author}
        <button onClick={toggleExpanded}>hide</button>
      </div>
      <div>
        <div>{currentBlog.url}</div>
        <div>
          likes {currentBlog.likes}
          <button onClick={handleLike}>like</button>
        </div>
        <div>{currentBlog.user ? currentBlog.user.name : 'unknown user'}</div>
        {ownBlog() && <button onClick={() => handleRemoveBlog(currentBlog)}>remove</button>}
      </div>
    </div>
  )

  return expanded ? expandedView() : basicView()
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
        name: PropTypes.string
      })
    ])
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.object,
  handleRemoveBlog: PropTypes.func.isRequired
}

export default Blog