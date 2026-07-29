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
			<form onSubmit={handleLogin}>
				<div>
					<label>
						username
						<input
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						password
						<input
							type="password"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default LoginForm
