import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'happy-dom',
		setupFiles: ['vitest.setup.ts'],
		globals: true,
		globalSetup: ['vitest.global.setup.ts'],
		fileParallelism: false,
		/* integration: .test.ts(x) | unit: .spec.ts(x) */
		include: ['src/**/*.{spec,test}.{ts,tsx}'],
		testTimeout: 10000,
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				// Ignora arquivos de teste
				'**/*.test.{ts,tsx}',
				'**/*.spec.{ts,tsx}',

				// Ignora arquivos que TEM APENAS types ou interfaces
				'**/types/**',
				'**/*.d.ts',
				'**/*.type.{ts,tsx}',
				'**/*.types.{ts,tsx}',
				'**/*.contract.{ts,tsx}',
				'**/*.protocol.{ts,tsx}',
				'**/*.interface.{ts,tsx}',

				// Ignora layout.tsx (se for precisar testar o layout, remova)
				'src/app/**/layout.{ts,tsx}',

				// Ignora arquivos e pastas de mocks e utilitários de testes
				'**/*.mock.{ts,tsx}',
				'**/*.mocks.{ts,tsx}',
				'**/mocks/**',
				'**/__mocks__/**',
				'**/__tests__/**',
				'**/__test-utils__/**',
				'**/*.test-util.ts',

				// Ignora arquivos e pastas do Storybook
				'**/*.story.{ts,tsx}',
				'**/*.stories.{ts,tsx}',
				'**/stories/**',
				'**/__stories__/**',
			],
		},
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
