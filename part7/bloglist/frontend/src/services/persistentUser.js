const STORAGE_KEY = 'loggedBlogappUser'

// Centralise all localStorage access for the logged-in user in one place.
const getUser = () => {
	const storedJson = window.localStorage.getItem(STORAGE_KEY)
	return storedJson ? JSON.parse(storedJson) : null
}

const saveUser = (user) => {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

const removeUser = () => {
	window.localStorage.removeItem(STORAGE_KEY)
}

export default { getUser, saveUser, removeUser }
