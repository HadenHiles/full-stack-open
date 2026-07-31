import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AnecdoteList from './components/AnecdoteList'
import useAnecdoteStore from './store'

afterEach(() => {
	cleanup()
})

beforeEach(() => {
	useAnecdoteStore.setState({
		anecdotes: [
			{ id: '1', content: 'One vote', votes: 1 },
			{ id: '2', content: 'Three votes', votes: 3 },
		],
		filter: 'all',
	})
})

describe('anecdote ordering', () => {
	it('displays the highest-voted anecdote first', () => {
		render(<AnecdoteList />)

		expect(screen.getAllByTestId('anecdote')[0].textContent).toContain(
			'Three votes',
		)
	})
})
