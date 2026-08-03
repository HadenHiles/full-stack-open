import { useState } from 'react'

// Returns controlled input props plus a reset() to clear the field value.
// Keep reset out of the spread when applying to an <input> (see forms).
export const useField = (type) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	const reset = () => {
		setValue('')
	}

	return { type, value, onChange, reset }
}
