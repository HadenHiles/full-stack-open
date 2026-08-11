interface TotalProps {
	totalExercises: number
}

const Total = ({ totalExercises }: TotalProps) => (
	<p>Number of exercises {totalExercises}</p>
)

export default Total
