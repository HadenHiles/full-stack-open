const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
	const response = await fetch(baseUrl)

	if (!response.ok) {
		throw new Error('Anecdote service is not available')
	}

	return response.json()
}
