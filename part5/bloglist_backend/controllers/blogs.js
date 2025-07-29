const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  })

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid or missing' })
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author || 'Unknown',
    url: body.url,
    likes: body.likes,
    user: request.user._id
  })

  const newBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(newBlog._id)
  await request.user.save()
  const populatedBlog = await Blog.findById(newBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
  })


blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid or missing' })
  }
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if ( blog.user.toString() !== request.user._id.toString() ){
    return response.status(401).json({ error: 'only the user who created the blog can delete it' })
  }

  const deletedBlog = await Blog.findByIdAndDelete(id)
  if (deletedBlog) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  const populatedBlog = await Blog.findById(updatedBlog._id).populate('user', { username: 1, name: 1 })
  response.json(populatedBlog)
})



module.exports = blogsRouter