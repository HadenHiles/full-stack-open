import { useState, useEffect } from 'react'
import axios from 'axios'
import { DiaryEntry, NewDiaryEntry } from './types'
import * as diaryService from './services/diaryService'
import DiaryList from './components/DiaryList'
import DiaryForm from './components/DiaryForm'

const App = () => {
	const [entries, setEntries] = useState<DiaryEntry[]>([])
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		diaryService.getAll().then(setEntries)
	}, [])

	const handleAddEntry = async (newEntry: NewDiaryEntry) => {
		try {
			const addedEntry = await diaryService.create(newEntry)
			setEntries(entries.concat(addedEntry))
			setErrorMessage(null)
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response) {
				setErrorMessage(String(error.response.data))
			} else {
				setErrorMessage('An unexpected error occurred')
			}
		}
	}

	return (
		<div>
			<DiaryForm onAdd={handleAddEntry} errorMessage={errorMessage} />
			<DiaryList entries={entries} />
		</div>
	)
}

export default App
