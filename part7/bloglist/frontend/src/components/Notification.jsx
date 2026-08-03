import { Alert } from '@mui/material'
import useNotificationStore from '../store/notificationStore'

// Reads directly from the store - no props needed.
const Notification = () => {
	const notification = useNotificationStore(state => state.notification)

	if (!notification) {
		return null
	}

	return (
		<Alert
			severity={notification.type}
			sx={{ mb: 2 }}
		>
			{notification.message}
		</Alert>
	)
}

export default Notification
