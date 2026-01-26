# Usage

This registers the methods and options necessary for message translations in the Sapphire client.

```ts
// Main bot file
// Be sure to register the plugin before instantiating the client.
import '@sapphire/plugin-i18next/register';
```
The basic structure of a translation file is as follows:

```ts
// languages/en-US/commands/ping.json
{
	"success": "Pong!",
	"success_with_args": "Pong! Took me {{latency}}ms to reply"
}
```

The resolveKey function can be used anywhere to get translated text by its key. In this example, it is used in a method to send a message.

```ts
import { resolveKey } from '@sapphire/plugin-i18next';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class PingCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			description: 'ping pong'
		});
	}

	public async messageRun(message: Message) {
		await message.channel.send(await resolveKey('commands/ping:success'));
	}
}
```

sendLocalized will send translated text resolved from a key to a specified channel.

```ts
import { sendLocalized } from '@sapphire/plugin-i18next';
import { Command } from '@sapphire/framework';

import type { Message } from 'discord.js';

export class PingCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			description: 'ping pong'
		});
	}

	public async messageRun(message: Message) {
		await sendLocalized(message, 'commands/ping:success');
	}
}

```

editLocalized edits a message, replacing its content with translated text resolved from its key.

```ts
import { editLocalized } from '@sapphire/plugin-i18next';
import { Command } from '@sapphire/framework';

import type { Message } from 'discord.js';

export class PingCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			description: 'ping pong'
		});
	}

	public async messageRun(message: Message) {
		await editLocalized(message, 'commands/ping:success_args', { latency: ws.ping });
	}
}
```

fetchLanguage returns the guild-specific language that the client is using.

```ts
import { fetchLanguage } from '@sapphire/plugin-i18next';
import { Command } from '@sapphire/framework';

import type { Message } from 'discord.js';

export class PingCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			description: 'ping pong'
		});
	}

	public async messageRun(message: Message) {
		return message.channel.send(await fetchLanguage(message));
		// ===> en-US
	}
}
```