import { describe, expect, test } from 'vitest'
import { envClient } from './env'

describe('Environment Variables Config', () => {
	test('should load variables from .env.test automatically on vitest', () => {
		const expected = 'pk_test_publishable_key_12345'

		expect(envClient.NEXT_PUBLIC_PUBLISHABLE_KEY).toBe(expected)
	})
})
