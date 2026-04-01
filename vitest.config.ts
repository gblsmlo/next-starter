import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'happy-dom',
		setupFiles: ['./src/setupTests.ts'],
		globals: true,
	},
	resolve: {
		alias: {
			'@features': path.resolve(__dirname, './src/features'),
			'@components': path.resolve(__dirname, './src/components'),
			'@routes': path.resolve(__dirname, './src/routes'),
			'@types': path.resolve(__dirname, './src/types'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
		},
	},
})
