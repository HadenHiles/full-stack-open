import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Patient, Diagnosis } from './types'
import * as patientorService from './services/patientorService'
import PatientList from './components/PatientList'
import PatientView from './components/PatientView'

const App = () => {
	const [patients, setPatients] = useState<Patient[]>([])
	const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])

	useEffect(() => {
		patientorService.getAllPatients().then(setPatients)
		patientorService.getAllDiagnoses().then(setDiagnoses)
	}, [])

	return (
		<div className="App">
			<h1>Patientor</h1>
			<Routes>
				<Route path="/" element={<PatientList patients={patients} />} />
				<Route path="/patients/:id" element={<PatientView diagnoses={diagnoses} />} />
			</Routes>
		</div>
	)
}

export default App
