import express from 'express'
import * as patientService from '../services/patientService'
import { toNewPatient, toNewEntry } from '../utils/parseUtils'

const router = express.Router()

router.get('/', (_req, res) => {
	res.json(patientService.getAll())
})

router.get('/:id', (req, res) => {
	const patient = patientService.findById(req.params.id)
	if (patient) {
		res.json(patient)
	} else {
		res.status(404).send('Patient not found')
	}
})

router.post('/', (req, res) => {
	try {
		const newPatient = toNewPatient(req.body)
		const savedPatient = patientService.addPatient(newPatient)
		res.json(savedPatient)
	} catch (error: unknown) {
		if (error instanceof Error) res.status(400).send(error.message)
	}
})

router.post('/:id/entries', (req, res) => {
	try {
		// toNewEntry validates the body and narrows it to the correct Entry subtype.
		const newEntry = toNewEntry(req.body)
		const savedEntry = patientService.addEntry(req.params.id, newEntry)
		res.json(savedEntry)
	} catch (error: unknown) {
		if (error instanceof Error) res.status(400).send(error.message)
	}
})

export default router
