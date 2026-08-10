import diaryData from './data/diaryEntries.json'
import { DiaryEntry, NewDiaryEntry, PublicDiaryEntry, Weather, Visibility } from './types'

// Cast the imported JSON to the correct type at the module boundary.
const diaryEntries: DiaryEntry[] = diaryData as DiaryEntry[]

export const getEntries = (): DiaryEntry[] => diaryEntries

export const getNonSensitiveEntries = (): PublicDiaryEntry[] =>
	diaryEntries.map(({ id, date, weather, visibility }) => ({ id, date, weather, visibility }))

export const findById = (id: number): DiaryEntry | undefined =>
	diaryEntries.find(d => d.id === id)

// Validates the raw request body and returns a typed NewDiaryEntry.
const parseDate = (date: unknown): string => {
	if (!date || typeof date !== 'string') throw new Error('Incorrect or missing date')
	return date
}

const parseWeather = (weather: unknown): Weather => {
	if (!weather || !Object.values(Weather).includes(weather as Weather)) {
		throw new Error('Incorrect or missing weather')
	}
	return weather as Weather
}

const parseVisibility = (visibility: unknown): Visibility => {
	if (!visibility || !Object.values(Visibility).includes(visibility as Visibility)) {
		throw new Error('Incorrect or missing visibility')
	}
	return visibility as Visibility
}

const parseComment = (comment: unknown): string => {
	if (typeof comment !== 'string') throw new Error('Incorrect or missing comment')
	return comment
}

export const toNewDiaryEntry = (body: unknown): NewDiaryEntry => {
	if (!body || typeof body !== 'object') throw new Error('Incorrect or missing data')
	const data = body as Record<string, unknown>
	return {
		date: parseDate(data.date),
		weather: parseWeather(data.weather),
		visibility: parseVisibility(data.visibility),
		comment: parseComment(data.comment),
	}
}

export const addEntry = (entry: NewDiaryEntry): DiaryEntry => {
	const newEntry = { id: Math.max(...diaryEntries.map(d => d.id)) + 1, ...entry }
	diaryEntries.push(newEntry)
	return newEntry
}
