import { useQuery } from '@tanstack/react-query'
import { getAll } from './services/anecdotes'

const App = () => {
	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAll,
		retry: false,
	})

	if (result.isPending) {
		return <div>loading data...</div>
	}

	if (result.isError) {
		return <div>Anecdote service is not available due to problems in server</div>
	}

	return (
		<div>
			<h3>Anecdote app</h3>
			{result.data.map(anecdote => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>has {anecdote.votes}</div>
				</div>
			))}
		</div>
	)
}

export default App
