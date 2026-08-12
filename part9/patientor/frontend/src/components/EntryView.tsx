import { Entry, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry, HealthCheckRating } from '../types'
import FavoriteIcon from '@mui/icons-material/Favorite'
import WorkIcon from '@mui/icons-material/Work'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'

// Color coding for health check ratings makes risk levels scannable at a glance.
const ratingColor: Record<HealthCheckRating, string> = {
	[HealthCheckRating.Healthy]: 'green',
	[HealthCheckRating.LowRisk]: 'yellow',
	[HealthCheckRating.HighRisk]: 'orange',
	[HealthCheckRating.CriticalRisk]: 'red',
}

const cardStyle: React.CSSProperties = {
	border: '1px solid #ccc',
	borderRadius: '8px',
	padding: '0.75rem',
	marginBottom: '0.5rem',
}

const HealthCheckEntryView = ({ entry }: { entry: HealthCheckEntry }) => (
	<div style={cardStyle}>
		{entry.date} <MedicalServicesIcon fontSize="small" />
		<div><em>{entry.description}</em></div>
		<FavoriteIcon style={{ color: ratingColor[entry.healthCheckRating] }} />
		<div>diagnosed by {entry.specialist}</div>
	</div>
)

const OccupationalEntryView = ({ entry }: { entry: OccupationalHealthcareEntry }) => (
	<div style={cardStyle}>
		{entry.date} <WorkIcon fontSize="small" /> <em>{entry.employerName}</em>
		<div><em>{entry.description}</em></div>
		{entry.sickLeave && <div>sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</div>}
		<div>diagnosed by {entry.specialist}</div>
	</div>
)

const HospitalEntryView = ({ entry }: { entry: HospitalEntry }) => (
	<div style={cardStyle}>
		{entry.date} <LocalHospitalIcon fontSize="small" />
		<div><em>{entry.description}</em></div>
		<div>discharge: {entry.discharge.date} - {entry.discharge.criteria}</div>
		<div>diagnosed by {entry.specialist}</div>
	</div>
)

const assertNever = (value: never): never => {
	throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`)
}

const EntryView = ({ entry }: { entry: Entry }) => {
	switch (entry.type) {
		case 'HealthCheck': return <HealthCheckEntryView entry={entry} />
		case 'OccupationalHealthcare': return <OccupationalEntryView entry={entry} />
		case 'Hospital': return <HospitalEntryView entry={entry} />
		default: return assertNever(entry)
	}
}

export default EntryView
