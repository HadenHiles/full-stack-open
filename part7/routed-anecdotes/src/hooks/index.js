import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

// Returns controlled input props plus a reset() to clear the field value.
// Keep reset out of the spread when applying to an <input> (see CreateNew).
export const useField = (type) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	const reset = () => {
		setValue('')
	}

	return { type, value, onChange, reset }
}

// Shows a notification message for a given duration, then clears it.
export const useNotification = (durationMs = 5000) => {
	const [message, setMessage] = useState('')

	const notify = (text) => {
		setMessage(text)
		setTimeout(() => setMessage(''), durationMs)
	}

	return { message, notify }
}

// Manages the anecdotes list: fetches on mount, exposes add and remove.
export const useAnecdotes = () => {
	const [anecdotes, setAnecdotes] = useState([])

	useEffect(() => {
		anecdoteService.getAll().then(data => setAnecdotes(data))
	}, [])

	const addAnecdote = async (anecdote) => {
		const savedAnecdote = await anecdoteService.create(anecdote)
		setAnecdotes(prev => prev.concat(savedAnecdote))
		return savedAnecdote
	}

	const removeAnecdote = async (id) => {
		await anecdoteService.remove(id)
		setAnecdotes(prev => prev.filter(a => a.id !== id))
	}

	return { anecdotes, addAnecdote, removeAnecdote }
}
