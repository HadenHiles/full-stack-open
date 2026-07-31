import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notification'

const AnecdoteForm = () => {
	const { create } = useAnecdoteActions()
	const { show } = useNotificationActions()

	const handleCreate = event => {
		event.preventDefault()
		const content = event.target.anecdote.value
		create(content)
		show(`you added '${content}'`)
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
