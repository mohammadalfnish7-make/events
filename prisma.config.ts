import type { PrismaConfig } from 'prisma'

export default {
  earlyAccess: true,
  schema: {
    datasource: {
      provider: 'postgresql',
      url: { fromEnvVar: 'DATABASE_URL' },
    },
  },
} satisfies PrismaConfig
