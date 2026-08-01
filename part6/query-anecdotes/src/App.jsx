import { useRef, useState } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification, { NotificationContext } from './components/Notification'
import useAnecdotes from './hooks/useAnecdotes'

const App = () => {
	const {
		anecdotes,
		isError,
		isPending,
		createAnecdote,
		voteForAnecdote,
	} = useAnecdotes()
	const [notification, setNotification] = useState(null)
	const timeoutId = useRef()

	const showNotification = message => {
		clearTimeout(timeoutId.current)
		setNotification(message)
		timeoutId.current = setTimeout(() => setNotification(null), 5000)
	}

	const handleCreate = content => {
		createAnecdote(content)
		showNotification(`you added '${content}'`)
	}

	const handleVote = anecdote => {
		voteForAnecdote(anecdote)
		showNotification(`you voted '${anecdote.content}'`)
	}

	if (isPending) {
		return <div>loading data...</div>
	}

	if (isError) {
		return <div>Anecdote service is not available due to problems in server</div>
	}

	return (
		<NotificationContext.Provider value={notification}>
		<div>
			<h3>Anecdote app</h3>
			<Notification />
			<AnecdoteForm onCreate={handleCreate} />
			{anecdotes.map(anecdote => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
		</NotificationContext.Provider>
	)
}

export default App
