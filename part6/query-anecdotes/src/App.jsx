import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import { create, getAll, update } from './services/anecdotes'

const App = () => {
	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAll,
		retry: false,
	})
	const queryClient = useQueryClient()
	const newAnecdoteMutation = useMutation({
		mutationFn: create,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
	})
	const voteMutation = useMutation({
		mutationFn: update,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
	})

	const handleCreate = content => {
		newAnecdoteMutation.mutate({ content, votes: 0 })
	}

	const handleVote = anecdote => {
		voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
	}

	if (result.isPending) {
		return <div>loading data...</div>
	}

	if (result.isError) {
		return <div>Anecdote service is not available due to problems in server</div>
	}

	return (
		<div>
			<h3>Anecdote app</h3>
			<AnecdoteForm onCreate={handleCreate} />
			{result.data.map(anecdote => (
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
