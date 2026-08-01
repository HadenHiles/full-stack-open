import { useState } from 'react'

// Returns controlled input props (type, value, onChange) as a reusable hook.
export const useField = (type) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	return { type, value, onChange }
}
