import { useImperativeHandle, useState } from 'react'

const Togglable = ({ buttonLabel, children, ref }) => {
	const [visible, setVisible] = useState(false)

	// The parent can use the same toggle after a successful form submit.
	const toggleVisibility = () => {
		setVisible(!visible)
	}

	useImperativeHandle(ref, () => ({ toggleVisibility }))

	return (
		<div>
			<div style={{ display: visible ? 'none' : '' }}>
				<button onClick={toggleVisibility}>{buttonLabel}</button>
			</div>
			<div style={{ display: visible ? '' : 'none' }}>
				{children}
				<button onClick={toggleVisibility}>cancel</button>
			</div>
		</div>
	)
}

export default Togglable
