const Notification = ({ message }) => {
	if (!message) return null
	return (
		<div style={{ border: '1px solid green', padding: '8px', marginBottom: '8px', color: 'green' }}>
			{message}
		</div>
	)
}

export default Notification
