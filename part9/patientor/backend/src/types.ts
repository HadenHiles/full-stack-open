export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other',
}

export enum HealthCheckRating {
	Healthy = 0,
	LowRisk = 1,
	HighRisk = 2,
	CriticalRisk = 3,
}

interface BaseEntry {
	id: string
	date: string
	specialist: string
	description: string
	diagnosisCodes?: string[]
}

export interface HealthCheckEntry extends BaseEntry {
	type: 'HealthCheck'
	healthCheckRating: HealthCheckRating
}

export interface OccupationalHealthcareEntry extends BaseEntry {
	type: 'OccupationalHealthcare'
	employerName: string
	sickLeave?: { startDate: string; endDate: string }
}

export interface HospitalEntry extends BaseEntry {
	type: 'Hospital'
	discharge: { date: string; criteria: string }
}

export type Entry = HealthCheckEntry | OccupationalHealthcareEntry | HospitalEntry

export interface Diagnosis {
	code: string
	name: string
	latin?: string
}

export interface Patient {
	id: string
	name: string
	dateOfBirth: string
	ssn: string
	gender: Gender
	occupation: string
	entries: Entry[]
}

// The public patient list omits the SSN for privacy.
export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>

export type NewPatient = Omit<Patient, 'id'>

export type NewEntry = Omit<Entry, 'id'>
