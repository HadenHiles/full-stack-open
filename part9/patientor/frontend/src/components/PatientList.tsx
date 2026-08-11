import { Link } from 'react-router-dom'
import { Patient } from '../types'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

const PatientList = ({ patients }: { patients: Patient[] }) => (
	<div>
		<Typography variant="h5" gutterBottom>Patient list</Typography>
		<Table>
			<TableHead>
				<TableRow>
					<TableCell><strong>Name</strong></TableCell>
					<TableCell><strong>Gender</strong></TableCell>
					<TableCell><strong>Occupation</strong></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{patients.map(patient => (
					<TableRow key={patient.id}>
						<TableCell>
							<Link to={`/patients/${patient.id}`}>{patient.name}</Link>
						</TableCell>
						<TableCell>{patient.gender}</TableCell>
						<TableCell>{patient.occupation}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
)

export default PatientList
