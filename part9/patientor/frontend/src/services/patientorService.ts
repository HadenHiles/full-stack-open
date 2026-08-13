import axios from 'axios'
import { Patient, PatientFormValues, Diagnosis, Entry, NewEntry } from '../types'

const baseUrl = 'http://localhost:3001/api'

export const getAllPatients = async (): Promise<Patient[]> => {
	const response = await axios.get<Patient[]>(`${baseUrl}/patients`)
	return response.data
}

export const getPatient = async (id: string): Promise<Patient> => {
	// Fetches the full record including entries (not included in the patient list response).
	const response = await axios.get<Patient>(`${baseUrl}/patients/${id}`)
	return response.data
}

export const createPatient = async (values: PatientFormValues): Promise<Patient> => {
	const response = await axios.post<Patient>(`${baseUrl}/patients`, values)
	return response.data
}

export const addEntry = async (patientId: string, entry: NewEntry): Promise<Entry> => {
	const response = await axios.post<Entry>(`${baseUrl}/patients/${patientId}/entries`, entry)
	return response.data
}

export const getAllDiagnoses = async (): Promise<Diagnosis[]> => {
	const response = await axios.get<Diagnosis[]>(`${baseUrl}/diagnoses`)
	return response.data
}
