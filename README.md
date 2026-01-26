# 🤖 Tatiana Bot

A powerful Discord bot built with modern technologies for scalability and maintainability.

## 🚀 Tech Stack

- **Runtime:** [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- **Framework:** [Sapphire Framework](https://www.sapphirejs.dev/) - Advanced Discord.js bot framework
- **Language:** TypeScript
- **Database:** PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Discord Library:** [Discord.js](https://discord.js.org/) v14

## ✨ Features

- 🔥 **Hot Module Replacement** - Reload commands without restarting
- 🌍 **Internationalization** - Multi-language support with i18next
- 📝 **Advanced Logging** - Comprehensive logging system
- 🗄️ **Type-safe Database** - Drizzle ORM for PostgreSQL
- 🎯 **Slash Commands** - Modern Discord interaction support
- 🔒 **Preconditions** - Command permission and validation system

## 📋 Prerequisites

Before you begin, ensure you have installed:

- [Bun](https://bun.sh) v1.3.6 or higher
- [PostgreSQL](https://www.postgresql.org/) 14 or higher
- [Git](https://git-scm.com/)
- A Discord Bot Token ([Guide](https://discord.com/developers/applications))

## 🛠️ Installation

### Option 1: Development with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/ItsJhonAlex/tatiana-bot.git
   cd tatiana-bot
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your Discord bot token:

   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tatiana_bot_dev
   ```

4. **Start PostgreSQL with Docker**

   ```bash
   bun run docker:dev:up
   ```

5. **Set up the database schema**

   ```bash
   bun run db:push
   ```

6. **Start the bot**
   ```bash
   bun run dev
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed)
2. **Create database**

   ```sql
   CREATE DATABASE tatiana_bot;
   ```

3. **Follow steps 1-3 from Option 1**, then update `DATABASE_URL` with your local credentials

4. **Continue with steps 5-6**

## 🚀 Usage

### Development Mode

```bash
# Start PostgreSQL (if using Docker)
bun run docker:dev:up

# Run bot with hot reload
bun run dev
```

### Production with Docker

```bash
# Build and start all services (database + bot)
bun run docker:build
bun run docker:up

# View logs
bun run docker:logs
```

### Database Management

```bash
# Push schema changes to database
bun run db:push

# Open Drizzle Studio (Database GUI)
bun run db:studio

# Stop PostgreSQL (Docker)
bun run docker:dev:down
```

### Docker Commands

```bash
# Development (PostgreSQL only)
bun run docker:dev:up      # Start database
bun run docker:dev:down    # Stop database
bun run docker:dev:logs    # View database logs

# Production (Full stack)
bun run docker:up          # Start all services
bun run docker:down        # Stop all services
bun run docker:build       # Build bot image
bun run docker:logs        # View bot logs
```

### Code Quality

```bash
# Run linter
bun run lint

# Fix linting issues
bun run lint:fix

# Format code
bun run format

# Check formatting
bun run format:check
```

## 📁 Project Structure

```
tatiana-bot/
├── src/
│   ├── commands/           # Slash commands
│   ├── listeners/          # Event listeners
│   ├── interaction-handlers/ # Button, select menu handlers
│   ├── preconditions/      # Command preconditions
│   ├── arguments/          # Custom argument types
│   └── lib/               # Utilities and configurations
├── docs/                   # Documentation
├── index.ts               # Entry point
├── .sapphirerc.yml        # Sapphire configuration
└── drizzle.config.ts      # Drizzle ORM configuration
```

## 🔧 Configuration

### Sapphire Framework

Configuration is in [`.sapphirerc.yml`](.sapphirerc.yml). Customize:

- Base directory
- Command/listener locations
- Custom file templates

### Environment Variables

| Variable            | Description                  | Required |
| ------------------- | ---------------------------- | -------- |
| `DISCORD_BOT_TOKEN` | Your Discord bot token       | ✅       |
| `DATABASE_URL`      | PostgreSQL connection string | ✅       |

## 📚 Commands

> Commands are located in [`src/commands/`](src/commands/)

To create a new command:

```bash
# Use Sapphire CLI (if installed globally)
sapphire generate command <name>
```

## 🎨 Development

### Adding a Command

Create a file in `src/commands/`:

```typescript
import { Command } from '@sapphire/framework';

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ping',
      description: 'Ping the bot'
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return interaction.reply({ content: 'Pong!' });
  }
}
```

### Adding a Listener

Create a file in `src/listeners/`:

```typescript
import { Listener } from '@sapphire/framework';

export class ReadyListener extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: 'ready',
      once: true
    });
  }

  public run() {
    this.container.logger.info('Bot is ready!');
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint rules
- Use Prettier for formatting
- Write TypeScript with strict mode
- Add JSDoc comments for public APIs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**ItsJhonAlex**

- GitHub: [@ItsJhonAlex](https://github.com/ItsJhonAlex)
- Repository: [tatiana-bot](https://github.com/ItsJhonAlex/tatiana-bot)

## 🙏 Acknowledgments

- [Sapphire Framework](https://www.sapphirejs.dev/) - Powerful Discord.js framework
- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Bun](https://bun.sh) - Fast JavaScript runtime

---

Made with ❤️ by ItsJhonAlex
