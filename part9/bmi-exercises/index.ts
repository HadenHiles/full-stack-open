import express from 'express'
import { calculateBmi } from './bmiCalculator'
import { calculateExercises } from './exerciseCalculator'

const app = express()
app.use(express.json())

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack!')
})

// GET /bmi?height=180&weight=72
app.get('/bmi', (req, res) => {
	const height = Number(req.query.height)
	const weight = Number(req.query.weight)

	if (isNaN(height) || isNaN(weight)) {
		res.status(400).json({ error: 'malformatted parameters' })
		return
	}

	res.json({ weight, height, bmi: calculateBmi(height, weight) })
})

// POST /exercises  { daily_exercises: number[], target: number }
app.post('/exercises', (req, res) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const body = req.body as { daily_exercises?: unknown; target?: unknown }

	if (!body.daily_exercises || body.target === undefined) {
		res.status(400).json({ error: 'parameters missing' })
		return
	}
	if (
		!Array.isArray(body.daily_exercises) ||
		typeof body.target !== 'number' ||
		body.daily_exercises.some(v => typeof v !== 'number')
	) {
		res.status(400).json({ error: 'malformatted parameters' })
		return
	}

	const result = calculateExercises(body.daily_exercises as number[], body.target)
	res.json(result)
})

const PORT = 3003
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
