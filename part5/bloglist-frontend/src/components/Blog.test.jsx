import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('<Blog />', () => {
  test('shows title and author but hides URL and likes by default', () => {
    render(
      <Blog blog={blog} handleLike={vi.fn()} handleRemove={vi.fn()} />,
    )

    expect(screen.getByText(/Testing React Components Ada Lovelace/)).toBeVisible()
    expect(screen.getByText(blog.url)).not.toBeVisible()
    expect(screen.getByText(/likes 7/)).not.toBeVisible()
  })

  test('shows URL and likes after view is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Blog blog={blog} handleLike={vi.fn()} handleRemove={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(/likes 7/)).toBeVisible()
  })
})
