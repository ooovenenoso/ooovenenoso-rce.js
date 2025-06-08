# @ooovenenoso/rce.js

`rce.js` is a TypeScript library that exposes a simple interface for controlling and monitoring **Rust Console Edition** servers hosted on **GPORTAL**. It wraps the official HTTP and WebSocket APIs so external tools can automate server administration and react to in‑game events.


This repository is a personal fork of [b1nzeex/rce.js](https://github.com/b1nzeex/rce.js) for experiments and improvements according to my own criteria. All credit goes to the original project.

The fork lives at [ooovenenoso/rce.js](https://github.com/ooovenenoso/rce.js) and is published on NPM as [@ooovenenoso/rce.js](https://www.npmjs.com/package/@ooovenenoso/rce.js).

## Features

- Login and token management via the GPORTAL authentication API.
- WebSocket connection that forwards console output and service status updates.
- Manage multiple servers simultaneously (start, stop, execute commands).
- Event‑driven architecture with typed payloads for common in‑game actions.
- Helpers to fetch server information and parse command responses.
- Precompiled JavaScript available under `dist/`.

## Requirements

- Node.js **16** or newer.
- Access to a Rust Console Edition server hosted on GPORTAL.

## Installation

```bash
npm i @ooovenenoso/rce.js
```

## Building from Source

```bash
npm install
npm run build
```

The compiled files are written to the `dist` directory. Credentials may also be supplied through the `RCE_USERNAME` and `RCE_PASSWORD` environment variables during development.

## Quick Example

```typescript
import { RCEManager, RCEEvent, RCEIntent, LogLevel } from "@ooovenenoso/rce.js";

const rce = new RCEManager();
await rce.init({ username: "", password: "" }, { level: LogLevel.Info });

await rce.servers.addMany([
  {
    identifier: "server1",
    region: "US",
    serverId: 1387554,
    intents: [RCEIntent.ConsoleMessages],
    playerRefreshing: true,
    radioRefreshing: true,
    extendedEventRefreshing: true,
  },
]);

rce.events.on(RCEEvent.PlayerKill, async (data) => {
  console.log(
    `[${data.server.identifier}] ${data.killer.name} killed ${data.victim.name}`
  );

  await rce.servers.command(
    data.server.identifier,
    `say <color=red>${data.killer.name}</color> killed <color=red>${data.victim.name}</color>`
  );
});
```

## Module Overview

### Manager (`src/Manager.ts`)
Creates the core `RCEManager` class which:
- Handles authentication, WebSocket setup and server management.
- Exposes an [`EventEmitter`](https://nodejs.org/api/events.html) compatible interface through `events`.
- Provides a pluggable logger and simple plugin registration system.

### Authentication (`src/auth`)
`GPortalAuth` performs the OAuth flow against GPORTAL and keeps the access token refreshed. It exposes `accessToken` for other modules.

### Socket (`src/socket`)
`GPortalSocket` maintains the WebSocket connection. Incoming messages are dispatched to handlers:
- `ConsoleMessages` parses console logs to raise events such as player joins, kills and kit usage.
- `ServiceState` emits status changes like server starting or stopping.
- `ServiceSensors` forwards CPU and memory statistics.

### Servers (`src/servers`)
`ServerManager` stores the configured servers and exposes high level methods:
- `add`/`addMany` and `remove`/`removeAll` for managing the list.
- `command` to execute in‑game commands and wait for the output.
- `info` and `fetchAdvanced` to retrieve server information from the API.
- Helpers for periodic player lists, radio broadcasters and event detection.

### Logger (`src/logger`)
`RCELogger` implements a minimal logger with colored console output and optional file logging. It conforms to the `ILogger` interface so a custom logger can be provided.

### Utilities
- `Helper` contains functions for cleaning command responses and comparing player lists.
- `ServerUtils` exposes common helpers used internally and for emitting errors.
- `constants.ts` and `interfaces.ts` define the enums, event names and payload types used throughout the library.

## Cheatsheet

A [cheatsheet](./cheatsheet.md) is available that documents the formatting options for in‑game chat messages (colors, styles, sizes, etc.).

## Further Documentation

A full guide can be found on [GitBook](https://rcejs.gitbook.io/rcejs). Community support is also available on [Discord](https://discord.gg/npYygkeXSa).

