import axios from 'axios'

const baseUrl = '/api/blogs'

// Kept here so every authenticated request uses the same active session.
let token = null

const setToken = (newToken) => {
	token = newToken ? `Bearer ${newToken}` : null
}

const getAll = async () => {
	const blogResponse = await axios.get(baseUrl)
	return blogResponse.data
}

const create = async (blog) => {
	const config = { headers: { Authorization: token } }
	const blogResponse = await axios.post(baseUrl, blog, config)
	return blogResponse.data
}

const update = async (id, blog) => {
	const blogResponse = await axios.put(`${baseUrl}/${id}`, blog)
	return blogResponse.data
}

const remove = async (id) => {
	const config = { headers: { Authorization: token } }
	await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, setToken, create, update, remove }
