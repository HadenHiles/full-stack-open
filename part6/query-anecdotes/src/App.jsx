import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import useAnecdotes from './hooks/useAnecdotes'
import useNotify from './hooks/useNotify'

const App = () => {
	const { notify } = useNotify()
	const {
		anecdotes,
		isError,
		isPending,
		createAnecdote,
		voteForAnecdote,
	} = useAnecdotes({
		onCreateError: () => notify('anecdote must be at least 5 characters long'),
	})

	const handleCreate = content => {
		createAnecdote(content)
		notify(`you added '${content}'`)
	}

	const handleVote = anecdote => {
		voteForAnecdote(anecdote)
		notify(`you voted '${anecdote.content}'`)
	}

	if (isPending) {
		return <div>loading data...</div>
	}

	if (isError) {
		return <div>Anecdote service is not available due to problems in server</div>
	}

	return (
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
	)
}

export default App
