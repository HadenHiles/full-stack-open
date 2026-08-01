import AnecdoteForm from './components/AnecdoteForm'
import useAnecdotes from './hooks/useAnecdotes'

const App = () => {
	const {
		anecdotes,
		isError,
		isPending,
		createAnecdote,
		voteForAnecdote,
	} = useAnecdotes()

	if (isPending) {
		return <div>loading data...</div>
	}

	if (isError) {
		return <div>Anecdote service is not available due to problems in server</div>
	}

	return (
		<div>
			<h3>Anecdote app</h3>
			<AnecdoteForm onCreate={createAnecdote} />
			{anecdotes.map(anecdote => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => voteForAnecdote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default App
