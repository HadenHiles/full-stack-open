import { useAnecdoteActions } from '../store'

const Filter = () => {
	const { setFilter } = useAnecdoteActions()

	return (
		<div>
			<label>
				<input
					type="radio"
					name="filter"
					defaultChecked
					onChange={() => setFilter('all')}
				/>
				all
			</label>
			<label>
				<input
					type="radio"
					name="filter"
					onChange={() => setFilter('popular')}
				/>
				voted
			</label>
		</div>
	)
}

export default Filter
