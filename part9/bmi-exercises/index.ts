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

const PORT = 3003
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
