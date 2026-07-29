import { Box, Button, TextField } from '@mui/material'

const LoginForm = ({
	handleLogin,
	username,
	password,
	setUsername,
	setPassword
}) => {
	return (
		<div>
			<h2>Log in to application</h2>
			<Box
				component="form"
				onSubmit={handleLogin}
				sx={{ maxWidth: 420 }}
			>
				<TextField
					fullWidth
					label="username"
					value={username}
					onChange={({ target }) => setUsername(target.value)}
					margin="normal"
				/>
				<TextField
					fullWidth
					label="password"
					type="password"
					value={password}
					onChange={({ target }) => setPassword(target.value)}
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
