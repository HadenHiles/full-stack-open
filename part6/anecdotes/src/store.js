
import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

const anecdotesAtStart = [
	'If it hurts, do it more often',
	'Adding manpower to a late software project makes it later!',
	'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
	'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
	'Premature optimization is the root of all evil.',
	'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
	content: anecdote,
	id: getId(),
	votes: 0
})

const useAnecdoteStore = create((set, get) => ({
	anecdotes: anecdotesAtStart.map(asObject),
	filter: 'all',
	actions: {
		initialize: async () => {
			const response = await fetch(baseUrl)
			const anecdotes = await response.json()

			set({ anecdotes })
		},
		create: async content => {
			const response = await fetch(baseUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(asObject(content)),
			})
			const anecdote = await response.json()

			set(state => ({ anecdotes: state.anecdotes.concat(anecdote) }))
		},
		vote: async id => {
			const anecdote = get().anecdotes.find(item => item.id === id)
			const response = await fetch(`${baseUrl}/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ votes: anecdote.votes + 1 }),
			})
			const updatedAnecdote = await response.json()

			set(state => ({
				anecdotes: state.anecdotes.map(item =>
					item.id === id ? updatedAnecdote : item
				)
			}))
		},
		remove: async id => {
			await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })

			set(state => ({
				anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
			}))
		},
		setFilter: filter => set({ filter }),
	},
}))

export const useAnecdotes = () => {
	const anecdotes = useAnecdoteStore((state) => state.anecdotes)
	const filter = useAnecdoteStore((state) => state.filter)

	if (filter === 'popular') {
		return anecdotes.filter(anecdote => anecdote.votes > 0)
	}

	return anecdotes
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
