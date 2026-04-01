import { describe, expect, it } from 'vitest'

describe('Vitest Setup', () => {
	it('should work with basic assertions', () => {
		expect(true).toBe(true)
	})

	it('should work with jest-dom matchers', () => {
		const element = document.createElement('div')
		element.className = 'test-class'
		expect(element).toHaveClass('test-class')
	})
})
