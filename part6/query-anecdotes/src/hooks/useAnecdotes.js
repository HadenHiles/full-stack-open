import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { create, getAll, update } from '../services/anecdotes'

const useAnecdotes = ({ onCreateError } = {}) => {
	const queryClient = useQueryClient()
	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAll,
		retry: false,
	})
	// Mutations change the server, so refresh the cached list afterwards.
	const invalidateAnecdotes = () =>
		queryClient.invalidateQueries({
			queryKey: ['anecdotes'],
		})
	const newAnecdoteMutation = useMutation({
		mutationFn: create,
		onSuccess: invalidateAnecdotes,
		onError: onCreateError,
	})
	const voteMutation = useMutation({
		mutationFn: update,
		onSuccess: invalidateAnecdotes,
	})

	return {
		anecdotes: result.data,
		isError: result.isError,
		isPending: result.isPending,
		createAnecdote: (content) =>
			newAnecdoteMutation.mutate({ content, votes: 0 }),
		voteForAnecdote: (anecdote) =>
			voteMutation.mutate({
				...anecdote,
				votes: anecdote.votes + 1,
			}),
	}
}

export default useAnecdotes
