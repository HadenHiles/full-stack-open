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

export interface Diagnosis {
	code: string
	name: string
	latin?: string
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

export interface Patient {
	id: string
	name: string
	occupation: string
	gender: Gender
	ssn?: string
	dateOfBirth?: string
	entries: Entry[]
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>

export interface NewEntry {
	type: 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital'
	date: string
	specialist: string
	description: string
	diagnosisCodes?: string[]
	healthCheckRating?: HealthCheckRating
	employerName?: string
	sickLeave?: { startDate: string; endDate: string }
	discharge?: { date: string; criteria: string }
}
