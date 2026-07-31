import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useAnecdoteStore from './store'

const fetchMock = vi.fn()

beforeEach(() => {
	vi.stubGlobal('fetch', fetchMock)
	fetchMock.mockReset()
	useAnecdoteStore.setState({
		anecdotes: [{ id: '1', content: 'Vote for this', votes: 1 }],
		filter: 'all',
	})
})

describe('anecdote voting', () => {
	it('increases an anecdote vote count', async () => {
		fetchMock.mockResolvedValue({
			json: vi.fn().mockResolvedValue({
				id: '1',
				content: 'Vote for this',
				votes: 2,
			}),
		})

		await act(async () => {
			await useAnecdoteStore.getState().actions.vote('1')
		})

		expect(useAnecdoteStore.getState().anecdotes[0].votes).toBe(2)
	})
})
