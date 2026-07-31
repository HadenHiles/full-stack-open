import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useAnecdoteStore from './store'

const fetchMock = vi.fn()

beforeEach(() => {
	vi.stubGlobal('fetch', fetchMock)
	fetchMock.mockReset()
	useAnecdoteStore.setState({ anecdotes: [], filter: 'all' })
})

describe('anecdote initialization', () => {
	it('uses the anecdotes returned by the backend', async () => {
		const anecdotes = [
			{ id: '1', content: 'A backend anecdote', votes: 2 },
		]
		fetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue(anecdotes) })

		await act(async () => {
			await useAnecdoteStore.getState().actions.initialize()
		})

		expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotes)
	})
})
