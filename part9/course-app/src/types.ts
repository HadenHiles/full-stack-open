// Discriminated union for different course part types.
export interface CoursePartBase {
	name: string
	exerciseCount: number
}

export interface CoursePartBasic extends CoursePartBase {
	kind: 'basic'
	description: string
}

export interface CoursePartGroup extends CoursePartBase {
	kind: 'group'
	groupProjectCount: number
}

export interface CoursePartBackground extends CoursePartBase {
	kind: 'background'
	description: string
	backgroundMaterial: string
}

export interface CoursePartSpecial extends CoursePartBase {
	kind: 'special'
	description: string
	requirements: string[]
}

export type CoursePart =
	| CoursePartBasic
	| CoursePartGroup
	| CoursePartBackground
	| CoursePartSpecial
