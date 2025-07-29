import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const newLike = async (blog) => {
  const updatedBlog = {
    ...blog,
    likes: blog.likes + 1,
    user: typeof blog.user === 'object' ? blog.user.id : blog.user
  }
  const response = await update(blog.id, updatedBlog)
  return { ...response, user: blog.user }
}

export default { getAll, create, update, setToken, newLike, remove }