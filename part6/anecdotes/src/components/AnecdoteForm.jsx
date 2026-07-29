import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
	const { create } = useAnecdoteActions()

	const handleCreate = event => {
		event.preventDefault()
		create(event.target.anecdote.value)
		event.target.reset()
	}

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleCreate}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	)
}

export default AnecdoteForm
