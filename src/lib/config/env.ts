import * as z from "zod"

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
})

type EnvKey = keyof z.infer<typeof EnvSchema>
type Env = z.infer<typeof EnvSchema>

const validated = new Map<string, unknown>()

export function env(): Env {
  return new Proxy({} as Env, {
    get(_, prop: string) {
      if (validated.has(prop)) return validated.get(prop)

      const fieldSchema = EnvSchema.shape[prop as EnvKey]

      if (!fieldSchema) throw new Error(`Unknown env var accessed: ${prop}`)

      const result = fieldSchema.safeParse(process.env[prop])

      if (!result.success) {
        throw new Error(`Missing or invalid env var: ${prop} — ${result.error.message}`)
      }

      validated.set(prop, result.data)

      return result.data
    },
  })
}
