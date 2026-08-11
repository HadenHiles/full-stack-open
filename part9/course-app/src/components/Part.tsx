import { CoursePart } from '../types'

interface PartProps {
	part: CoursePart
}

// Exhaustive switch ensures TypeScript warns if a new CoursePart kind is added but not handled.
const Part = ({ part }: PartProps) => {
	switch (part.kind) {
		case 'basic':
			return (
				<div>
					<strong>{part.name} {part.exerciseCount}</strong>
					<br /><em>{part.description}</em>
				</div>
			)
		case 'group':
			return (
				<div>
					<strong>{part.name} {part.exerciseCount}</strong>
					<br />project exercises: {part.groupProjectCount}
				</div>
			)
		case 'background':
			return (
				<div>
					<strong>{part.name} {part.exerciseCount}</strong>
					<br /><em>{part.description}</em>
					<br />submit to: {part.backgroundMaterial}
				</div>
			)
		case 'special':
			return (
				<div>
					<strong>{part.name} {part.exerciseCount}</strong>
					<br /><em>{part.description}</em>
					<br />required skills: {part.requirements.join(', ')}
				</div>
			)
		default: {
			// This never case ensures exhaustive handling is enforced at compile time.
			const _exhaustiveCheck: never = part
			return _exhaustiveCheck
		}
	}
}

export default Part
