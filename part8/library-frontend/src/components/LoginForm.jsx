import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ onLoginSuccess }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [login] = useMutation(LOGIN, {
		onError: (err) => alert(err.message),
	})

	const handleSubmit = async (event) => {
		event.preventDefault()
		const result = await login({ variables: { username, password } })
		if (result.data) {
			const token = result.data.login.value
			// Persist the token so the page can reload without losing the session.
			localStorage.setItem('library-user-token', token)
			onLoginSuccess(token)
		}
		setUsername('')
		setPassword('')
	}

	return (
		<div>
			<h2>login</h2>
			<form onSubmit={handleSubmit}>
				<div>
					username <input value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
				<div>
					password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default LoginForm
