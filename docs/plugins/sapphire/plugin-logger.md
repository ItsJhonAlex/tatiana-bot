# Usage

This registers the necessary options and methods in the Sapphire client to be able to use the log plugin.

```ts
// Main bot file
// Be sure to register the plugin before instantiating the client.
import '@sapphire/plugin-logger/register';
In order to use the Logger in any place other than a piece (commands, arguments, preconditions, etc.), you must first import the container property of @sapphire/framework. For pieces, you can simply use this.container.logger to access Logger methods.

import { container } from '@sapphire/framework';

export class MyAwesomeService {
	public printAwesomeLog() {
		container.logger.info('log message');
	}
}
```

Here is an example ping command, demonstrating the use of this.container.logger from within a piece by omitting the explicit import.

```ts
// ping command

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
		this.container.logger.warn('warning message');
	}
}
```
# Types of logs

trace
debug
info
warn
error
fatal

```ts
Example: container.logger.debug('log debug message');
```