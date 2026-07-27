import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('submits a new blog with the entered details', async () => {
	const browserUser = userEvent.setup()
	const createBlogHandler = vi.fn()
	render(<BlogForm createBlog={createBlogHandler} />)

	await browserUser.type(
		screen.getByRole('textbox', { name: /title/i }),
		'A Blog'
	)
	await browserUser.type(
		screen.getByRole('textbox', { name: /author/i }),
		'Grace Hopper'
	)
	await browserUser.type(
		screen.getByRole('textbox', { name: /url/i }),
		'https://example.com'
	)
	await browserUser.click(screen.getByRole('button', { name: 'create' }))

	expect(createBlogHandler).toHaveBeenCalledWith({
		title: 'A Blog',
		author: 'Grace Hopper',
		url: 'https://example.com',
	})
})
