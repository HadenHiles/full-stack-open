import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
	return axios
		.get(baseUrl)
		.then(personResponse => personResponse.data)
}

const create = (newPerson) => {
	return axios
		.post(baseUrl, newPerson)
		.then(personResponse => personResponse.data)
}

const update = (id, updatedPerson) => {
	return axios
		.put(`${baseUrl}/${id}`, updatedPerson)
		.then(personResponse => personResponse.data)
}

const remove = (id) => {
	return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }
