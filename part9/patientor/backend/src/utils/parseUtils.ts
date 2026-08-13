import { NewPatient, Gender, NewEntry, HealthCheckRating, Entry } from '../types'

const isString = (value: unknown): value is string => typeof value === 'string'
const isNumber = (value: unknown): value is number => typeof value === 'number'

const isGender = (value: unknown): value is Gender =>
	isString(value) && Object.values(Gender).includes(value as Gender)

const isHealthCheckRating = (value: unknown): value is HealthCheckRating =>
	isNumber(value) && Object.values(HealthCheckRating).includes(value as HealthCheckRating)

const parseString = (value: unknown, field: string): string => {
	if (!isString(value)) throw new Error(`Missing or invalid ${field}`)
	return value
}

const parseGender = (value: unknown): Gender => {
	if (!isGender(value)) throw new Error('Missing or invalid gender')
	return value
}

export const toNewPatient = (body: unknown): NewPatient => {
	if (!body || typeof body !== 'object') throw new Error('Incorrect or missing data')
	const data = body as Record<string, unknown>
	return {
		name: parseString(data.name, 'name'),
		dateOfBirth: parseString(data.dateOfBirth, 'dateOfBirth'),
		ssn: parseString(data.ssn, 'ssn'),
		gender: parseGender(data.gender),
		occupation: parseString(data.occupation, 'occupation'),
		entries: [],
	}
}

// Validates and narrows the raw entry body to the correct Entry subtype.
export const toNewEntry = (body: unknown): NewEntry => {
	if (!body || typeof body !== 'object') throw new Error('Incorrect or missing data')
	const data = body as Record<string, unknown>
	const base = {
		date: parseString(data.date, 'date'),
		specialist: parseString(data.specialist, 'specialist'),
		description: parseString(data.description, 'description'),
		diagnosisCodes: Array.isArray(data.diagnosisCodes) ? data.diagnosisCodes as string[] : [],
	}

	switch (data.type) {
		case 'HealthCheck':
			if (!isHealthCheckRating(data.healthCheckRating)) throw new Error('Invalid healthCheckRating')
			return { ...base, type: 'HealthCheck', healthCheckRating: data.healthCheckRating }
		case 'OccupationalHealthcare': {
			const sickLeave = data.sickLeave && typeof data.sickLeave === 'object'
				? {
						startDate: parseString((data.sickLeave as Record<string, unknown>).startDate, 'sickLeave.startDate'),
						endDate: parseString((data.sickLeave as Record<string, unknown>).endDate, 'sickLeave.endDate'),
					}
				: undefined
			return {
				...base,
				type: 'OccupationalHealthcare',
				employerName: parseString(data.employerName, 'employerName'),
				sickLeave,
			}
		}
		case 'Hospital':
			if (!data.discharge || typeof data.discharge !== 'object') throw new Error('Invalid discharge')
			const discharge = data.discharge as Record<string, unknown>
			return {
				...base,
				type: 'Hospital',
				discharge: {
					date: parseString(discharge.date, 'discharge.date'),
					criteria: parseString(discharge.criteria, 'discharge.criteria'),
				},
			}
		default:
			throw new Error(`Unknown entry type: ${String(data.type)}`)
	}
}
