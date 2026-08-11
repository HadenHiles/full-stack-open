import { useState } from 'react'
import axios from 'axios'
import {
	Button, TextField, Select, MenuItem, FormControl, InputLabel,
	SelectChangeEvent,
} from '@mui/material'
import { NewEntry, Diagnosis, HealthCheckRating } from '../types'

interface AddEntryFormProps {
	patientId: string
	diagnoses: Diagnosis[]
	onAdd: (entry: NewEntry) => void
}

const AddEntryForm = ({ patientId: _patientId, diagnoses, onAdd }: AddEntryFormProps) => {
	const [entryType, setEntryType] = useState<NewEntry['type']>('HealthCheck')
	const [date, setDate] = useState('')
	const [specialist, setSpecialist] = useState('')
	const [description, setDescription] = useState('')
	const [selectedCodes, setSelectedCodes] = useState<string[]>([])
	const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy)
	const [employerName, setEmployerName] = useState('')
	const [sickLeaveStart, setSickLeaveStart] = useState('')
	const [sickLeaveEnd, setSickLeaveEnd] = useState('')
	const [dischargeDate, setDischargeDate] = useState('')
	const [dischargeCriteria, setDischargeCriteria] = useState('')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		const baseEntry = { date, specialist, description, diagnosisCodes: selectedCodes }
		let newEntry: NewEntry

		switch (entryType) {
			case 'HealthCheck':
				newEntry = { ...baseEntry, type: 'HealthCheck', healthCheckRating }
				break
			case 'OccupationalHealthcare':
				newEntry = {
					...baseEntry,
					type: 'OccupationalHealthcare',
					employerName,
					...(sickLeaveStart && { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }),
				}
				break
			case 'Hospital':
				newEntry = { ...baseEntry, type: 'Hospital', discharge: { date: dischargeDate, criteria: dischargeCriteria } }
				break
		}

		try {
			onAdd(newEntry)
			setErrorMessage(null)
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response) {
				setErrorMessage(String(error.response.data))
			}
		}
	}

	return (
		<div style={{ border: '1px dashed black', padding: '1rem', marginTop: '1rem' }}>
			<h3>New {entryType} entry</h3>
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			<form onSubmit={handleSubmit}>
				<FormControl fullWidth margin="normal">
					<InputLabel>Entry type</InputLabel>
					<Select value={entryType} label="Entry type" onChange={(e: SelectChangeEvent) => setEntryType(e.target.value as NewEntry['type'])}>
						<MenuItem value="HealthCheck">Health Check</MenuItem>
						<MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
						<MenuItem value="Hospital">Hospital</MenuItem>
					</Select>
				</FormControl>
				<TextField fullWidth label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
				<TextField fullWidth label="Specialist" value={specialist} onChange={(e) => setSpecialist(e.target.value)} margin="normal" />
				<TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" />
				<FormControl fullWidth margin="normal">
					<InputLabel>Diagnosis codes</InputLabel>
					<Select multiple value={selectedCodes} label="Diagnosis codes" onChange={(e) => setSelectedCodes(e.target.value as string[])}>
						{diagnoses.map(d => <MenuItem key={d.code} value={d.code}>{d.code} {d.name}</MenuItem>)}
					</Select>
				</FormControl>

				{entryType === 'HealthCheck' && (
					<FormControl fullWidth margin="normal">
						<InputLabel>Health check rating</InputLabel>
						<Select value={healthCheckRating} label="Health check rating" onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}>
							{Object.entries(HealthCheckRating).filter(([, v]) => typeof v === 'number').map(([label, value]) => (
								<MenuItem key={label} value={value}>{label}</MenuItem>
							))}
						</Select>
					</FormControl>
				)}

				{entryType === 'OccupationalHealthcare' && (
					<>
						<TextField fullWidth label="Employer name" value={employerName} onChange={(e) => setEmployerName(e.target.value)} margin="normal" />
						<TextField fullWidth label="Sick leave start" type="date" value={sickLeaveStart} onChange={(e) => setSickLeaveStart(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
						<TextField fullWidth label="Sick leave end" type="date" value={sickLeaveEnd} onChange={(e) => setSickLeaveEnd(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
					</>
				)}

				{entryType === 'Hospital' && (
					<>
						<TextField fullWidth label="Discharge date" type="date" value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
						<TextField fullWidth label="Discharge criteria" value={dischargeCriteria} onChange={(e) => setDischargeCriteria(e.target.value)} margin="normal" />
					</>
				)}

				<Button type="submit" variant="contained" style={{ marginRight: '0.5rem' }}>Add</Button>
				<Button type="button" variant="outlined">Cancel</Button>
			</form>
		</div>
	)
}

export default AddEntryForm
