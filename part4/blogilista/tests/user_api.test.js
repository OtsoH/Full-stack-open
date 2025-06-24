const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')


const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('invalid username or password returns 400', async () => {
  const newUser = {
    username: "us",
    name: "Short User",
    password: "pw"
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(response.body.error, 'username must be at least 3 characters long')
})

test('duplicate username returns 400', async () => {
  const newUser = {
    username: "root",
    name: "Duplicate User",
    password: "newpassword"
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(response.body.error, 'username must be unique')
})

after(async () => {
  await mongoose.connection.close()
})