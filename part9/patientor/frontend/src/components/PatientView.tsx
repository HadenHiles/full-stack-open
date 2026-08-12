import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Patient, Diagnosis, Entry, NewEntry } from '../types'
import * as patientorService from '../services/patientorService'
import EntryView from './EntryView'
import AddEntryForm from './AddEntryForm'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import TransgenderIcon from '@mui/icons-material/Transgender'

const genderIcon = (gender: Patient['gender']) => {
	switch (gender) {
		case 'male': return <MaleIcon />
		case 'female': return <FemaleIcon />
		default: return <TransgenderIcon />
	}
}

const PatientView = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
	const { id } = useParams<{ id: string }>()
	const [patient, setPatient] = useState<Patient | null>(null)
	const [showForm, setShowForm] = useState(false)

	useEffect(() => {
		if (id) {
			patientorService.getPatient(id).then(setPatient)
		}
	}, [id])

	const handleAddEntry = async (newEntry: NewEntry) => {
		if (!id) return
		const addedEntry = await patientorService.addEntry(id, newEntry)
		setPatient(prev =>
			prev ? { ...prev, entries: prev.entries.concat(addedEntry as Entry) } : prev
		)
		setShowForm(false)
	}

	if (!patient) return <div>loading...</div>

	return (
		<div>
			<h2>{patient.name} {genderIcon(patient.gender)}</h2>
			<div>date of birth: {patient.dateOfBirth}</div>
			<div>ssn: {patient.ssn}</div>
			<div>occupation: {patient.occupation}</div>
			<h3>entries</h3>
			{patient.entries.map(entry => (
				<div key={entry.id} style={{ border: '1px solid black', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '4px' }}>
					<EntryView entry={entry} />
					{entry.diagnosisCodes && (
						<ul>
							{entry.diagnosisCodes.map(code => {
								const diagnosis = diagnoses.find(d => d.code === code)
								return <li key={code}>{code} {diagnosis?.name}</li>
							})}
						</ul>
					)}
				</div>
			))}
			{showForm
				? <AddEntryForm patientId={patient.id} diagnoses={diagnoses} onAdd={handleAddEntry} />
				: <button onClick={() => setShowForm(true)}>Add New Entry</button>
			}
		</div>
	)
}

export default PatientView
