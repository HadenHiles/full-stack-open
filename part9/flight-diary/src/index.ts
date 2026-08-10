import express from 'express'
import cors from 'cors'
import diariesRouter from './routes/diaries'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/ping', (_req, res) => {
	console.log('someone pinged here')
	res.send('pong')
})

app.use('/api/diaries', diariesRouter)

const PORT = 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
