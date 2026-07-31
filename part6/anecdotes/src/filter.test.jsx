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
			{ id: '1', content: 'No votes yet', votes: 0 },
			{ id: '2', content: 'Already voted', votes: 1 },
		],
		filter: 'popular',
	})
})

describe('anecdote filtering', () => {
	it('only passes voted anecdotes to the list', () => {
		render(<AnecdoteList />)

		expect(screen.queryByText('No votes yet')).toBeNull()
		expect(screen.getByText('Already voted')).not.toBeNull()
	})
})
