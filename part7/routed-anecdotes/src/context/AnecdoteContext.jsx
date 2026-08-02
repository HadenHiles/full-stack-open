import { createContext, useContext } from 'react'
import { useAnecdotes, useNotification } from '../hooks'

// Shares anecdote state across components without prop drilling.
const AnecdoteContext = createContext(null)

export const AnecdoteProvider = ({ children }) => {
	const anecdoteState = useAnecdotes()
	const notificationState = useNotification()

	return (
		<AnecdoteContext.Provider value={{ ...anecdoteState, ...notificationState }}>
			{children}
		</AnecdoteContext.Provider>
	)
}

export const useAnecdoteContext = () => useContext(AnecdoteContext)
