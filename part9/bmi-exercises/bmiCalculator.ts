// Returns a text description of the BMI category for the given height/weight.
const calculateBmi = (heightCm: number, weightKg: number): string => {
	const heightM = heightCm / 100
	const bmi = weightKg / (heightM * heightM)

	if (bmi < 18.5) return 'Underweight'
	if (bmi < 25) return 'Normal range'
	if (bmi < 30) return 'Overweight'
	return 'Obese'
}

const args = process.argv.slice(2)
if (args.length === 2) {
	const heightCm = Number(args[0])
	const weightKg = Number(args[1])
	if (isNaN(heightCm) || isNaN(weightKg)) {
		console.error('Please provide two numbers: height (cm) and weight (kg)')
		process.exit(1)
	}
	console.log(calculateBmi(heightCm, weightKg))
}

export { calculateBmi }
