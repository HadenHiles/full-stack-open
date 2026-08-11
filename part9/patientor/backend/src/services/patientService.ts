import patientData from '../data/patients.json'
import { Patient, PublicPatient, NewPatient, NewEntry, Entry } from '../types'
import { v1 as uuid } from 'uuid'

const patients: Patient[] = patientData as Patient[]

export const getAll = (): PublicPatient[] =>
	patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id, name, dateOfBirth, gender, occupation,
	}))

export const findById = (id: string): Patient | undefined =>
	patients.find(p => p.id === id)

export const addPatient = (patient: NewPatient): Patient => {
	const newPatient = { id: uuid(), ...patient }
	patients.push(newPatient)
	return newPatient
}

export const addEntry = (patientId: string, entry: NewEntry): Entry => {
	const patient = patients.find(p => p.id === patientId)
	if (!patient) throw new Error('Patient not found')
	const newEntry = { id: uuid(), ...entry } as Entry
	patient.entries.push(newEntry)
	return newEntry
}
