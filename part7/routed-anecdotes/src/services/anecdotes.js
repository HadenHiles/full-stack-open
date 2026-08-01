const anecdoteService = {
	getAll: async () => {
		const response = await fetch('/api/anecdotes')
		return response.json()
	},

	create: async (anecdote) => {
		const response = await fetch('/api/anecdotes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(anecdote),
		})
		return response.json()
	},

	remove: async (id) => {
		await fetch(`/api/anecdotes/${id}`, { method: 'DELETE' })
	},

export default anecdoteService
