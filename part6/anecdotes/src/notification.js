import { create } from 'zustand'

let timeoutId

const useNotificationStore = create((set) => ({
	message: null,
	actions: {
		show: (message) => {
			// Otherwise an older timeout could hide a newer notification too soon.
			clearTimeout(timeoutId)
			set({ message })
			timeoutId = setTimeout(() => set({ message: null }), 5000)
		},
	},
}))

export const useNotification = () =>
	useNotificationStore((state) => state.message)
export const useNotificationActions = () =>
	useNotificationStore((state) => state.actions)
