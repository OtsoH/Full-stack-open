const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testman1234',
        username: 'testman',
        password: 'salasana'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('user can login with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testman')
      await page.locator('input[name="Password"]').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('testman1234 logged in')).toBeVisible()
    })

    test('login fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('wrong')
      await page.locator('input[name="Password"]').fill('credentials')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testman')
      await page.locator('input[name="Password"]').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Test Blog')
      await page.locator('input[name="Author"]').fill('Test Author')
      await page.locator('input[name="Url"]').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText('Test Blog Test Author').waitFor()
      await expect(page.getByText('Test Blog Test Author')).toBeVisible()
    })
    test('user can like a blog', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('New Blog')
      await page.locator('input[name="Author"]').fill('New Author')
      await page.locator('input[name="Url"]').fill('http://likeableblog.com')
      await page.getByRole('button', { name: 'create' }).click()
       await page.getByText('New Blog New Author').waitFor()

      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()
      const likeButton = page.getByRole('button', { name: 'like' })
      await likeButton.click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user can remove their own blog', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Removable Blog')
      await page.locator('input[name="Author"]').fill('Removable Author')
      await page.locator('input[name="Url"]').fill('http://removableblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText('Removable Blog Removable Author').waitFor()

      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()
      page.on('dialog', async dialog => {
      await dialog.accept()
      })

      const removeButton = page.getByRole('button', { name: 'remove' })
      await removeButton.click()

      await expect(page.getByText('Removable Blog Removable Author')).not.toBeVisible()
    })


    test('only the creator can see the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'another user',
          username: 'user1234',
          password: 'password'
        }
      })
      await page.getByRole('button', { name: 'new blog' }).waitFor()
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Creator Blog')
      await page.locator('input[name="Author"]').fill('Creator Author')
      await page.locator('input[name="Url"]').fill('http://creatorblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText('Creator Blog Creator Author').waitFor()

      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()

      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()
      await page.getByRole('button', { name: 'logout' }).click()
      await page.locator('input[name="Username"]').fill('user1234')
      await page.locator('input[name="Password"]').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('another user logged in')).toBeVisible()
      await expect(page.getByText('Creator Blog Creator Author')).toBeVisible()

      const viewButton2 = page.getByRole('button', { name: 'view' })
      await viewButton2.click()

      await page.waitForLoadState('networkidle')
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})
