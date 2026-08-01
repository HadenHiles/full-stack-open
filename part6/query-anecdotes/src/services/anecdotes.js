const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
	const response = await fetch(baseUrl)

	if (!response.ok) {
		throw new Error('Anecdote service is not available')
	}

	return response.json()
}

export const create = async (anecdote) => {
	const response = await fetch(baseUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(anecdote),
	})

	if (!response.ok) {
		throw new Error('Could not create anecdote')
	}

	return response.json()
}

export const update = async (anecdote) => {
	const response = await fetch(`${baseUrl}/${anecdote.id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(anecdote),
	})

	if (!response.ok) {
		throw new Error('Could not update anecdote')
	}

	return response.json()
}
