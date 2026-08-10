import diaryData from './data/diaryEntries.json'
import { DiaryEntry, NewDiaryEntry, PublicDiaryEntry } from './types'
export { toNewDiaryEntry } from './utils'

// Cast the imported JSON to the correct type at the module boundary.
const diaryEntries: DiaryEntry[] = diaryData as DiaryEntry[]

export const getEntries = (): DiaryEntry[] => diaryEntries

export const getNonSensitiveEntries = (): PublicDiaryEntry[] =>
	diaryEntries.map(({ id, date, weather, visibility }) => ({ id, date, weather, visibility }))

export const findById = (id: number): DiaryEntry | undefined =>
	diaryEntries.find(d => d.id === id)

export const addEntry = (entry: NewDiaryEntry): DiaryEntry => {
	const newEntry = { id: Math.max(...diaryEntries.map(d => d.id)) + 1, ...entry }
	diaryEntries.push(newEntry)
	return newEntry
}
