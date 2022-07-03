## Welcome!

<strong>Welcome, this is '@djs-modules/moderation' module!</strong> <br />
<strong>"@djs-modules/moderation" is a module that allows you to make a moderation system in your Discord bot.</strong>

## Features

<span><strong>[🔑] Built in TypeScript</strong></span> <br />
<span><strong>[⚙] 100% Promise-based</strong></span> <br />
<span><strong>[🙂] TypeScript Support</strong></span> <br />
<span><strong>[👍] Discord.JS v13</strong></span> <br />
<span><strong>[❗] Remute if member rejoins server</strong></span>

## Requirements

<span><strong>[1] [NodeJS v16 or Above](https://nodejs.org/)</strong></span> <br />
<span><strong>[2] [Discord.JS](https://npmjs.com/package/discord.js/)</strong></span> <br />

## Quick Example

```js
const { Client, Intents } = require("discord.js");
const { Moderation } = require("@djs-modules/moderation");

const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_PRESENCES",
    "GUILD_MEMBERS",
    "GUILD_BANS",
  ],
});

const moderation = new Moderation(client, {
  dbPath: "./",
  locale: "en-US",
  defaultSystems: {
    autoRole: false,
    antiSpam: false,
    antiInvite: false,
    antiJoin: false,
    antiLink: false,
    blacklist: false,
    ghostPing: false,
    logSystem: false,
  },
});
```

## This module uses

<span><strong>[1] [Discord.JS](https://npmjs.com/package/discord.js/)</strong></span> <br />
<span><strong>[2] [colors](https://npmjs.com/package/colors/)</strong></span> <br />
<span><strong>[3] [ms](https://npmjs.com/package/ms/)</strong></span> <br />
<span><strong>[4] [node-fetch](https://npmjs.com/package/node-fetch/)</strong></span> <br />
<span><strong>[5] [enmap (database)](https://npmjs.com/package/enmap/)</strong></span> <br />

## Links

<span><strong>[1] [Documentation (soon)](https://djs-modules.js.org/)</strong></span> <br />
<span><strong>[2] [Module Author](https://npmjs.com/~djs-modules/)</strong></span> <br />
<span><strong>[3] [Support Server](https://discord.gg/zsTgXs24k2/)</strong></span>
