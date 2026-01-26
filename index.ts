import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

//Plugin sapphire framework
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';

// Initialize database connection
import './src/lib/db';

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  throw new Error('DISCORD_BOT_TOKEN is not set in environment variables');
}

client.login(token);
