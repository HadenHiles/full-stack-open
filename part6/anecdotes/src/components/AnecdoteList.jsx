import { useAnecdoteActions, useAnecdotes } from '../store'
import { useNotificationActions } from '../notification'

const AnecdoteList = () => {
	const anecdotes = useAnecdotes()
	const { vote } = useAnecdoteActions()
	const { show } = useNotificationActions()

	const sortedAnecdotes = [...anecdotes].sort((first, second) => second.votes - first.votes)

	return sortedAnecdotes.map(anecdote => (
		<div key={anecdote.id}>
			<div>{anecdote.content}</div>
			<div>
				has {anecdote.votes}
				<button onClick={() => {
					vote(anecdote.id)
					show(`you voted '${anecdote.content}'`)
				}}>vote</button>
			</div>
		</div>
	))
}

export default AnecdoteList
