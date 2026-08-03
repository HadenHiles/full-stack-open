import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'

const STORAGE_KEY = 'loggedBlogappUser'

// Manages the logged-in user and keeps localStorage in sync automatically.
const useUserStore = create((set) => ({
	user: null,

	initUser: () => {
		const storedUserJson = window.localStorage.getItem(STORAGE_KEY)
		if (storedUserJson) {
			const storedUser = JSON.parse(storedUserJson)
			set({ user: storedUser })
			blogService.setToken(storedUser.token)
		}
	},

	login: async (credentials) => {
		const loggedInUser = await loginService.login(credentials)
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
		blogService.setToken(loggedInUser.token)
		set({ user: loggedInUser })
		return loggedInUser
	},

	logout: () => {
		window.localStorage.removeItem(STORAGE_KEY)
		blogService.setToken(null)
		set({ user: null })
	},
}))

export default useUserStore
