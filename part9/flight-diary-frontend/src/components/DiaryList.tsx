import { DiaryEntry } from '../types'

interface DiaryListProps {
	entries: DiaryEntry[]
}

const DiaryList = ({ entries }: DiaryListProps) => (
	<div>
		<h2>diary entries</h2>
		{entries.map(entry => (
			<div key={entry.id}>
				<strong>{entry.date}</strong> - weather: {entry.weather}, visibility: {entry.visibility}
			</div>
		))}
	</div>
)

export default DiaryList
