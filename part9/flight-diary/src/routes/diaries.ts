import express from 'express'
import * as diaryService from '../diaryService'

const router = express.Router()

router.get('/', (_req, res) => {
	res.json(diaryService.getNonSensitiveEntries())
})

router.get('/:id', (req, res) => {
	const entry = diaryService.findById(Number(req.params.id))
	if (entry) {
		res.json(entry)
	} else {
		res.status(404).send('Entry not found')
	}
})

router.post('/', (req, res) => {
	try {
		// toNewDiaryEntry validates and narrows the request body type.
		const newEntry = diaryService.toNewDiaryEntry(req.body)
		const savedEntry = diaryService.addEntry(newEntry)
		res.json(savedEntry)
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(400).send(error.message)
		}
	}
})

export default router
