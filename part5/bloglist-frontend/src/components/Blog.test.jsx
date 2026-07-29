import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

const blog = {
	id: 'blog-id',
	title: 'Testing React Components',
	author: 'Ada Lovelace',
	url: 'https://example.com/testing',
	likes: 7,
	user: { username: 'ada', name: 'Ada Lovelace' },
}

describe('<Blog /> routed detail view', () => {
	test('shows information but no actions to an unauthenticated user', () => {
		render(
			<Blog blog={blog} handleLike={vi.fn()} handleRemove={vi.fn()} />,
		)

		expect(screen.getByRole('heading', { name: blog.title })).toBeVisible()
		expect(screen.getByRole('link', { name: blog.url })).toBeVisible()
		expect(screen.getByText('7 likes')).toBeVisible()
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	test('shows only like to an authenticated non-creator', () => {
		render(
			<Blog
				blog={blog}
				user={{ username: 'grace', name: 'Grace Hopper' }}
				handleLike={vi.fn()}
				handleRemove={vi.fn()}
			/>,
		)

		expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
		expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
	})

	test('shows like and remove to the creator', () => {
		render(
			<Blog
				blog={blog}
				user={{ username: 'ada', name: 'Ada Lovelace' }}
				handleLike={vi.fn()}
				handleRemove={vi.fn()}
			/>,
		)

		expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
		expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
	})
})
