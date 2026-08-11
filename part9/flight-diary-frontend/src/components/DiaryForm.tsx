import { useState } from 'react'
import { Weather, Visibility, NewDiaryEntry } from '../types'

interface DiaryFormProps {
	onAdd: (entry: NewDiaryEntry) => void
	errorMessage: string | null
}

const DiaryForm = ({ onAdd, errorMessage }: DiaryFormProps) => {
	const [date, setDate] = useState('')
	const [weather, setWeather] = useState<Weather>(Weather.Sunny)
	const [visibility, setVisibility] = useState<Visibility>(Visibility.Great)
	const [comment, setComment] = useState('')

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		onAdd({ date, weather, visibility, comment })
		setDate('')
		setComment('')
	}

	return (
		<div>
			<h2>add new entry</h2>
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
				</div>
				<div>
					weather
					{Object.values(Weather).map(w => (
						<label key={w}>
							<input type="radio" name="weather" value={w} checked={weather === w} onChange={() => setWeather(w)} />
							{w}
						</label>
					))}
				</div>
				<div>
					visibility
					{Object.values(Visibility).map(v => (
						<label key={v}>
							<input type="radio" name="visibility" value={v} checked={visibility === v} onChange={() => setVisibility(v)} />
							{v}
						</label>
					))}
				</div>
				<div>
					comment <input value={comment} onChange={(e) => setComment(e.target.value)} />
				</div>
				<button type="submit">add</button>
			</form>
		</div>
	)
}

export default DiaryForm
