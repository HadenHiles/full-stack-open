import { create } from 'zustand'

// Stores the current notification message and its type (success | error).
const useNotificationStore = create((set) => ({
	notification: null,

	showNotification: (message, type = 'success', durationMs = 5000) => {
		set({ notification: { message, type } })
		// Automatically clear so stale messages do not mislead the user.
		setTimeout(() => set({ notification: null }), durationMs)
	},

	clearNotification: () => set({ notification: null }),
}))

export default useNotificationStore
