import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			// Forward GraphQL requests to the Apollo server.
			'/': 'http://localhost:4000',
		},
	},
})
