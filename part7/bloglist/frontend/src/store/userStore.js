import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUser from '../services/persistentUser'

// Manages the logged-in user and keeps localStorage in sync automatically.
const useUserStore = create((set) => ({
	user: null,

	initUser: () => {
		const storedUser = persistentUser.getUser()
		if (storedUser) {
			set({ user: storedUser })
			blogService.setToken(storedUser.token)
		}
	},

	login: async (credentials) => {
		const loggedInUser = await loginService.login(credentials)
		persistentUser.saveUser(loggedInUser)
		blogService.setToken(loggedInUser.token)
		set({ user: loggedInUser })
		return loggedInUser
	},

	logout: () => {
		persistentUser.removeUser()
		blogService.setToken(null)
		set({ user: null })
	},
}))

export default useUserStore
