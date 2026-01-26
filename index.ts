import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';

//plugin sapphire framework
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';

const client = new SapphireClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const token = Bun.env.DISCORD_BOT_TOKEN;

client.login(token);