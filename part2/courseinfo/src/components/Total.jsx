const Total = ({ parts }) => {
	const exerciseTotal = parts.reduce(
		(runningTotal, part) => runningTotal + part.exercises,
		0
	)

	return (
		<p>
			<strong>total of {exerciseTotal} exercises</strong>
		</p>
	)
}

export default Total
