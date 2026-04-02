import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const envClient = createEnv({
	client: {
		NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
	},
	runtimeEnv: {
		NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	},
})

export const envServer = createEnv({
	server: {
		DATABASE_URL: z.url(),
		OPEN_AI_API_KEY: z.string().min(1),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
	},
})
