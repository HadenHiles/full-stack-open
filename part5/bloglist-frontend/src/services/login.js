import axios from 'axios'

const baseUrl = '/api/login'

const login = async (credentials) => {
	const loginResponse = await axios.post(baseUrl, credentials)
	return loginResponse.data
}

export default { login }
