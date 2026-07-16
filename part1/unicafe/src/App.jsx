import { useState } from 'react'

const Header = ({ children }) => <h2>{children}</h2>

const Button = ({ onClick, text }) => (
	<button onClick={onClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
	<tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
)

const Statistics = ({ good, neutral, bad }) => {
	const total = good + neutral + bad
	const average = total === 0 ? 0 : (good - bad) / total
	const positive = total === 0 ? 0 : (good / total) * 100

	if (total === 0) {
		return (
			<div>
				<Header>statistics</Header>
				<p>No feedback given</p>
			</div>
		)
	}

	return (
		<div>
			<Header>statistics</Header>
			<table>
				<tbody>
					<StatisticLine text="good" value={good} />
					<StatisticLine text="neutral" value={neutral} />
					<StatisticLine text="bad" value={bad} />
					<StatisticLine text="all" value={total} />
					<StatisticLine text="average" value={average.toFixed(2)} />
					<StatisticLine text="positive" value={`${positive.toFixed(2)} %`} />
				</tbody>
			</table>
		</div>
	)
}

const App = () => {
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const handleGoodClick = () => setGood(good + 1)
	const handleNeutralClick = () => setNeutral(neutral + 1)
	const handleBadClick = () => setBad(bad + 1)

	return (
		<div>
			<Header>give feedback</Header>
			<Button onClick={handleGoodClick} text="good" />
			<Button onClick={handleNeutralClick} text="neutral" />
			<Button onClick={handleBadClick} text="bad" />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

export default App
