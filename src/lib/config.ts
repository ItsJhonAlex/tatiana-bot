import 'dotenv/config';

export const config = {
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    devGuildId: process.env.DISCORD_DEV_GUILD_ID
  },
  database: {
    url: process.env.DATABASE_URL
  },
  app: {
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en-US'
  }
} as const;

// Validar configuración requerida
if (!config.discord.token) {
  throw new Error('DISCORD_BOT_TOKEN is not set in environment variables');
}

if (!config.database.url) {
  throw new Error('DATABASE_URL is not set in environment variables');
}
