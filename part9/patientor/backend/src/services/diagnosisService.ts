import diagnosisData from '../data/diagnoses.json'
import { Diagnosis } from '../types'

const diagnoses: Diagnosis[] = diagnosisData as Diagnosis[]

export const getAll = (): Diagnosis[] => diagnoses
