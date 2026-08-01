import { createContext, useContext } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext()

const Notification = () => {
	const message = useContext(NotificationContext)
	const style = {
		border: 'solid',
		padding: 10,
		borderWidth: 1,
		marginBottom: 5,
	}

	if (!message) {
		return null
	}

	return <div style={style}>{message}</div>
}

export default Notification
