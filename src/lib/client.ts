import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { config } from './config';

// Plugin sapphire framework
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';

// Initialize database connection
import './db';

// Configure command registration behavior
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

export const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  loadDefaultErrorListeners: true,
  defaultPrefix: '!',
  baseUserDirectory: './src',
  i18n: {
    defaultLanguageDirectory: './languages',
    defaultNS: 'common',
    defaultMissingKey: 'default:key_not_found',
    i18next: {
      fallbackLng: config.app.defaultLanguage,
      supportedLngs: ['en-US', 'es-ES'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false
      }
    }
  }
});
