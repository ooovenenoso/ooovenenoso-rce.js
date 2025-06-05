# rce.js

TypeScript library for integrating Rust Console Edition servers with external applications through GPORTAL's API and WebSocket.

## Features

- Manage multiple servers simultaneously.
- Event-driven interface for reacting to console messages and player events.
- Helper utilities for sending commands and fetching server information.
- Precompiled JavaScript available in `dist`.

## Requirements

- Node.js **16** or higher.
- Access to a Rust Console Edition server hosted on GPORTAL.

## Documentation

For a more in-depth guide visit [GitBook](https://rcejs.gitbook.io/rcejs). You can also join our support [Discord server](https://discord.gg/npYygkeXSa). The repository provides a [cheatsheet](./cheatsheet.md) that lists formatting options for in-game messages.

## Installation

```bash
npm i b1nzeex/rce.js
```

## Building from Source

```bash
npm install
npx tsc
```

The compiled files are generated in the `dist` directory.

## Example Usage - TypeScript

```typescript
import { RCEManager, LogLevel, RCEEvent, RCEIntent } from "rce.js";

const rce = new RCEManager();
await rce.init({ username: "", password: "" }, { level: LogLevel.Info });

await rce.servers.addMany([
  {
    identifier: "server1", // A Unique Name For your Server To Be Recognised By
    region: "US", // It's Either EU or US
    serverId: 1387554, // Find This In The URL On Your Server Page
    intents: [RCEIntent.ConsoleMessages], // Specify Which WebSocket Subscriptions To Use
    playerRefreshing: true, // Enable Playerlist Caching
    radioRefreshing: true, // Enable RF Events
    extendedEventRefreshing: true, // Enable Bradley / Heli Events
  },
  {
    identifier: "server2",
    region: "EU",
    serverId: 1487367,
    intents: [RCEIntent.All],
  },
]);

rce.events.on(RCEEvent.PlayerKill, (data) => {
  console.log(
    `[${data.server.identifier}] ${data.killer.name} killed ${data.victim.name}`
  );

  // Send an in-game command to the Rust server by the unique identifier (kill-feed!)
  await rce.servers.command(
    data.server.identifier,
    `say <color=red>${data.killer.name}</color> killed <color=red>${data.victim.name}</color>`
  );
});

// Optional Methods
await rce.servers.add(SERVER_INFO); // Add A Single Server
await rce.servers.addMany([SERVER_INFO]); // Add Multiple Servers
rce.servers.remove("identifier"); // Remove A Server
rce.servers.removeAll(); // Remove All Servers
rce.servers.get("identifier"); // Get Server
await rce.servers.info("identifier"); // Get "serverinfo" Command Details
await rce.servers.command("identifier", "say Hello World"); // Send Command
rce.destroy(); // Gracefully Close RCE.JS
```
