import { DiaryEntry } from '../types'

interface DiaryListProps {
	entries: DiaryEntry[]
}

const DiaryList = ({ entries }: DiaryListProps) => (
	<div>
		<h2>diary entries</h2>
		{entries.map(entry => (
			<div key={entry.id} style={{ marginBottom: '0.5rem' }}>
				<strong>{entry.date}</strong>
				<br />weather: {entry.weather}
				<br />visibility: {entry.visibility}
			</div>
		))}
	</div>
)

export default DiaryList
