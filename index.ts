import { client } from './src/lib/client';
import { config } from './src/lib/config';

async function main() {
  try {
    client.logger.info('Starting Tatiana Bot...');
    await client.login(config.discord.token);
  } catch (error) {
    client.logger.fatal('Failed to start bot:', error);
    process.exit(1);
  }
}

main();
