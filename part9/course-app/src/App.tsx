import { CoursePart } from './types'
import Header from './components/Header'
import Content from './components/Content'
import Total from './components/Total'

const courseParts: CoursePart[] = [
	{ name: 'Fundamentals', exerciseCount: 10, description: 'This is an awesome course part', kind: 'basic' },
	{ name: 'Using props to pass data', exerciseCount: 7, groupProjectCount: 3, kind: 'group' },
	{ name: 'Basics of type narrowing', exerciseCount: 7, description: 'How to go from unknown to string', kind: 'basic' },
	{ name: 'Deeper type usage', exerciseCount: 14, description: 'Explore how generics work', backgroundMaterial: 'https://type-level-typescript.com/template-literal-types', kind: 'background' },
	{ name: 'TypeScript in frontend', exerciseCount: 10, description: 'a hard part', kind: 'basic' },
	{ name: 'Backend development', exerciseCount: 21, description: 'Typing the backend', requirements: ['nodejs', 'jest'], kind: 'special' },
]

const App = () => {
	const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0)

	return (
		<div>
			<Header name="Half Stack application development" />
			<Content courseParts={courseParts} />
			<Total totalExercises={totalExercises} />
		</div>
	)
}

export default App
