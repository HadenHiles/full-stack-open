import { NewDiaryEntry, Weather, Visibility } from './types'

const parseDate = (date: unknown): string => {
	if (!date || typeof date !== 'string') throw new Error('Incorrect or missing date')
	return date
}

const parseComment = (comment: unknown): string => {
	if (typeof comment !== 'string') throw new Error('Incorrect or missing comment')
	return comment
}

const isWeather = (value: unknown): value is Weather =>
	typeof value === 'string' && Object.values(Weather).includes(value as Weather)

const isVisibility = (value: unknown): value is Visibility =>
	typeof value === 'string' && Object.values(Visibility).includes(value as Visibility)

const parseWeather = (weather: unknown): Weather => {
	if (!isWeather(weather)) throw new Error('Incorrect or missing weather')
	return weather
}

const parseVisibility = (visibility: unknown): Visibility => {
	if (!isVisibility(visibility)) throw new Error('Incorrect or missing visibility')
	return visibility
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
