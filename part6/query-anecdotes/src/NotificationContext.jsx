import { useRef, useState } from 'react'
import NotificationContext from './notificationContext'

export const NotificationContextProvider = ({ children }) => {
	const [notification, setNotification] = useState(null)
	const timeoutId = useRef()

	const notify = message => {
		clearTimeout(timeoutId.current)
		setNotification(message)
		timeoutId.current = setTimeout(() => setNotification(null), 5000)
	}

	return (
		<NotificationContext.Provider value={{ notification, notify }}>
			{children}
		</NotificationContext.Provider>
	)
}
