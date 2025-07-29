import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import Blog from './Blog'
import blogService from '../services/blogs'
import BlogForm from './Blogform'

vi.mock('../services/blogs')

test('renders title', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Testman',
    url: 'https://testing.com',
    likes: 12,
    user: {
      username: 'testman1234',
      name: 'testman1234',
      id: '123456'
    }
  }
  const mockUpdateBlog = vi.fn()
  const mockHandleRemoveBlog = vi.fn()
  const user = {
    username: 'someuser',
    name: 'Some User'
  }

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      handleRemoveBlog={mockHandleRemoveBlog}
      user={user}
    />
  )
  screen.getByText('Test Blog', { exact: false })
})

test('expanded view shows likes, url, author and username', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Testman',
    url: 'https://testing.com',
    likes: 12,
    user: {
      username: 'testman1234',
      name: 'testman1234',
      id: '123456'
    }
  }
  const mockUpdateBlog = vi.fn()
  const mockHandleRemoveBlog = vi.fn()
  const user = {
    username: 'currentuser',
    name: 'currentuser'
  }

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      handleRemoveBlog={mockHandleRemoveBlog}
      user={user}
    />
  )

  const testUser = userEvent.setup()

  const viewButton = screen.getByText('view')
  await testUser.click(viewButton)

  expect(screen.getByText('https://testing.com')).toBeDefined()
  expect(screen.getByText('likes 12')).toBeDefined()
  expect(screen.getByText('testman1234', { exact: false })).toBeDefined()
})

test('clicking like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Testman',
    url: 'https://testing.com',
    likes: 12,
    user: {
      username: 'testman1234',
      name: 'testman1234',
      id: '123456'
    }
  }
  const user = {
    username: 'currentuser',
    name: 'currentuser'
  }

  const mockUpdateBlog = vi.fn()
  const mockHandleRemoveBlog = vi.fn()

  blogService.newLike = vi.fn().mockImplementation(blog => {
    return Promise.resolve({ ...blog, likes: blog.likes + 1 })
  })


  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      handleRemoveBlog={mockHandleRemoveBlog}
      user={user}
    />
  )

  const testUser = userEvent.setup()

  const viewButton = screen.getByText('view')
  await testUser.click(viewButton)

  const likeButton = screen.getByText('like')
  await testUser.click(likeButton)
  await testUser.click(likeButton)
  await vi.waitFor(() => {
    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})

test('form calls the event handler with correct details when a new blog is created', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Testman',
    url: 'https://testing.com',
    likes: 12,
    user: {
      username: 'testman1234',
      name: 'testman1234',
      id: '123456'
    }
  }

  const mockCreateBlog = vi.fn()

  render(<BlogForm createBlog={mockCreateBlog} />)

  const user = userEvent.setup()
  const titleInput = screen.getByPlaceholderText('write blog title')
  const authorInput = screen.getByPlaceholderText('write blog author')
  const urlInput = screen.getByPlaceholderText('write blog url')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)

  const submitButton = screen.getByText('create')
  await user.click(submitButton)

  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0]).toEqual({
    title: 'Test Blog',
    author: 'Testman',
    url: 'https://testing.com'
  })
})