import { describe, expect, test } from 'vitest'

describe('Vitest Setup', () => {
	test('should work with basic assertions', () => {
		expect(true).toBe(true)
	})

	test('should work with happy-dom matchers', () => {
		const element = document.createElement('div')
		element.className = 'test-class'
		expect(element).toHaveClass('test-class')
	})
})
