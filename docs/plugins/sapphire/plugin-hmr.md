# Usage

In your main or setup file, register the plugin:

```ts
import '@sapphire/plugin-hmr/register';
```

Or if you want to make sure the plugin is only loaded in development, you can register it dynamically like so:

```ts
import '@sapphire/plugin-hmr/register';

const client = new SapphireClient({
	/* your bot options */
	hmr: {
		enabled: process.env.NODE_ENV === 'development'
	}
});

async function main() {
	await client.login();
}

void main();
```

In order for HMR to pick up your compiled JavaScript files, you will need to recompile your code. To that end, we will configure a dev script in package.json scripts that runs build in parallel with start:

```json
"scripts": {
	"dev": "run-p watch start",
	"build": "tsc",
	"watch": "tsc --watch",
	"start": "node dist/index.js"
}
```

Note: This uses the run-p script which is part of npm-run-all

Note 2: Please do note that because the processes are started simultaneously you should run build at least once before running dev, otherwise the start process will fail because there are no files to run just yet.