const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { title } = require('node:process')

const initialBlogs = [
  {
    title: "First Blog",
    author: "Test",
    url: "http://example.com",
    likes: 10
  }
,
  {
    title: "Second Blog",
    author: "Test2",
    url: "http://example2.com",
    likes: 20
  }
]

const getToken = async () => {
  const testUser = {
    username: 'testman123',
    password: 'password123'
  }

  const passwordHash = await bcrypt.hash(testUser.password, 10)
  const user = new User({ username: testUser.username, passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send(testUser)

  return loginResponse.body.token
}

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
  await User.deleteMany({})
})

test('correct amount of json blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test ('blogs have correct type of id', async () => {
    const response = await api
      .get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
  })
})

test ('new blog is posted correctly', async () => {
  const token = await getToken()

  const newBlog = {
    title: "New Blog",
    author: "test man",
    url: "http://test.com",
    likes: 123
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test ('likes is 0 if not specified', async () => {
  const token = await getToken()
  const newBlog = {
    title: "New Blog",
    author: "test man",
    url: "http://test.com",
    likes: undefined
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
    assert.strictEqual(response.body.likes, 0)
})

test ('blog without title or url is not added', async () => {
  const token = await getToken()
  const newBlog = {
    title: undefined,
    author: "test man",
    url: undefined,
    likes: 123
  }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog can be deleted', async () => {
  const token = await getToken()

  const newBlog = {
    title: "Blog to be deleted",
    author: "test man",
    url: "http://test.com",
    likes: 123
  }

    const createdBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

    await api
    .delete(`/api/blogs/${createdBlog.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfter = await api.get('/api/blogs')
  assert.strictEqual(blogsAfter.body.length, initialBlogs.length)
})

test('deleting a non-existent blog returns 404', async () => {
  const token = await getToken()
  const nonExistingId = '6a422bc61b54a676234d17fc'

  await api
    .delete(`/api/blogs/${nonExistingId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
})

test ('blog can be updated', async () => {
    const response = await api.get('/api/blogs')

    const newBlogData = {
        title: "Updated Blog",
        author: "testman2",
        url: "http://updated.com",
        likes: 1234
    }

    const updatedBlog = await api
      .put(`/api/blogs/${response.body[0].id}`)
      .send(newBlogData)
      .expect(200)

    assert.strictEqual(updatedBlog.body.title, newBlogData.title)
    assert.strictEqual(updatedBlog.body.author, newBlogData.author)
    assert.strictEqual(updatedBlog.body.url, newBlogData.url)
    assert.strictEqual(updatedBlog.body.likes, newBlogData.likes)
})

test('only likes can be updated', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]
    const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 3
    })
    .expect(200)


  assert.strictEqual(updatedBlog.body.title, blogToUpdate.title)
  assert.strictEqual(updatedBlog.body.author, blogToUpdate.author)
  assert.strictEqual(updatedBlog.body.url, blogToUpdate.url)
  assert.strictEqual(updatedBlog.body.likes, blogToUpdate.likes + 3)
})

test('updating a non-existent blog returns 404', async () => {
  const nonExistingId = '6a422bc61b54a676234d17fc'

  await api
    .put(`/api/blogs/${nonExistingId}`)
    .send({
      title: "Non-existent Blog",
      author: "not test man",
      url: "http://non-existent.com",
      likes: 13
    })
    .expect(404)
})

after(async () => {
  await mongoose.connection.close()
})

test('adding a blog fails with status 401 if no token', async () => {
  const newBlog = {
    title: "Blog without token",
    author: "test man",
    url: "http://no-token.com",
    likes: 123
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})