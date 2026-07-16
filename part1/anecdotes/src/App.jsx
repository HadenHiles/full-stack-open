import { useState } from 'react'

const Header = ({ children }) => <h2>{children}</h2>

const Anecdote = ({ text, votes }) => {
	return (
		<div>
			<p>{text}</p>
			<p>has {votes} votes</p>
		</div>
	)
}

const Winner = ({ anecdotes, votes }) => {
	const highestVoteCount = Math.max(...votes)

	if (highestVoteCount === 0) {
		return <p>No votes yet</p>
	}

	const winningIndex = votes.indexOf(highestVoteCount)

	return (
		<Anecdote
			text={anecdotes[winningIndex]}
			votes={highestVoteCount}
		/>
	)
}

const Button = ({ onClick, children }) => {
	return <button onClick={onClick}>{children}</button>
}

const App = () => {
	const anecdotes = [
		'If it hurts, do it more often.',
		'Adding manpower to a late software project makes it later!',
		'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
		'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
		'Premature optimization is the root of all evil.',
		'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
		'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
		'The only way to go fast, is to go well.'
	]

	const [selected, setSelected] = useState(0)
	const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

	const handleNext = () => {
		setSelected(Math.floor(Math.random() * anecdotes.length))
	}

	const handleVote = () => {
		// Copy this first or React will not see the array as changed.
		const updatedVotes = [...votes]
		updatedVotes[selected] += 1

		setVotes(updatedVotes)
	}

	return (
		<div>
			<Header>Anecdote of the day</Header>
			<Anecdote text={anecdotes[selected]} votes={votes[selected]} />
			<Button onClick={handleVote}>vote</Button>
			<Button onClick={handleNext}>next anecdote</Button>

			<Header>Anecdote with most votes</Header>
			<Winner anecdotes={anecdotes} votes={votes} />
		</div>
	)
}

export default App
