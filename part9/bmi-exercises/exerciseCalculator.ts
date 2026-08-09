interface ExerciseResult {
	periodLength: number
	trainingDays: number
	success: boolean
	rating: number
	ratingDescription: string
	target: number
	average: number
}

// Returns a summary of how well the given daily hours meet the target.
const calculateExercises = (dailyHours: number[], targetHoursPerDay: number): ExerciseResult => {
	const periodLength = dailyHours.length
	const trainingDays = dailyHours.filter(h => h > 0).length
	const average = dailyHours.reduce((sum, h) => sum + h, 0) / periodLength
	const success = average >= targetHoursPerDay

	let rating: number
	let ratingDescription: string

	if (average >= targetHoursPerDay) {
		rating = 3
		ratingDescription = 'Excellent! Target met.'
	} else if (average >= targetHoursPerDay * 0.75) {
		rating = 2
		ratingDescription = 'Not too bad but could be better'
	} else {
		rating = 1
		ratingDescription = 'Bad - you need to work harder'
	}

	return { periodLength, trainingDays, success, rating, ratingDescription, target: targetHoursPerDay, average }
}

const args = process.argv.slice(2)
if (args.length >= 2) {
	const target = Number(args[0])
	const daily = args.slice(1).map(Number)
	if (isNaN(target) || daily.some(isNaN)) {
		console.error('All arguments must be numbers')
		process.exit(1)
	}
	console.log(calculateExercises(daily, target))
}

export { calculateExercises }
