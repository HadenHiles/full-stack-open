import { Box, Button, TextField } from '@mui/material'
import { useField } from '../hooks'

// LoginForm manages its own field state via useField; only the submit handler is passed in.
const LoginForm = ({ handleLogin }) => {
	const username = useField('text')
	const password = useField('password')

	const onSubmit = (event) => {
		event.preventDefault()
		handleLogin({ username: username.value, password: password.value })
		username.reset()
		password.reset()
	}

	return (
		<div>
			<h2>Log in to application</h2>
			<Box
				component="form"
				onSubmit={onSubmit}
				sx={{ maxWidth: 420 }}
			>
				<TextField
					fullWidth
					label="username"
					value={username.value}
					onChange={username.onChange}
					margin="normal"
				/>
				<TextField
					fullWidth
					label="password"
					type="password"
					value={password.value}
					onChange={password.onChange}
					margin="normal"
				/>
				<Button type="submit" variant="contained" sx={{ mt: 1 }}>
					login
				</Button>
			</Box>
		</div>
	)
}

export default LoginForm
