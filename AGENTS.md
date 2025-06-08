This file provides guidelines for contributors and how automated checks should be executed when modifying files in this repository.

## Repository Overview

This project is a TypeScript library located under `src/` with precompiled JavaScript output in `dist/`. It relies on Node.js and has no unit tests at the moment. The library can be built with `npm run build`.

## Coding Guidelines

- Use TypeScript syntax that targets Node.js 16 or newer.
- Follow the existing file and folder structure. Source files live in `src/`. Compiled output should remain in `dist/`.
- Keep code style consistent with the surrounding files (2 spaces for indentation, Unix line endings).
- Document exported classes and functions using JSDoc comments.

## Documentation

- Any major changes should include updates to the relevant Markdown documents.
- The English version of the project documentation is located in `README.en.md`.

## Build Checks

- Run `npm install` if dependencies have not been installed.
- Run `npm run build` before committing changes to ensure the TypeScript code compiles successfully. Commit the code only if the build passes.

## Pull Request Description

When creating a pull request, summarize the major changes in a "Summary" section and provide the build command output in a "Testing" section. If any command fails due to environment limitations, include the provided disclaimer.

## Additional Documentation

### Getting Started

#### Installation
- **NPM**: run `npm install rce.js` to install the stable version.
- **GitHub**: run `npm install b1nzeex/rce.js` to install the latest master branch (may require Git and can contain bugs).

#### Authentication
After creating an instance of `RCEManager`, call `init()` to authenticate with G-PORTAL. Your credentials are only used locally to obtain tokens.

```ts
import { RCEManager, LogLevel } from "rce.js";

const rce = new RCEManager();
await rce.init({
  username: "", // Your GPORTAL email address
  password: ""  // Your GPORTAL password
}, {
  level: LogLevel.Info,
  file: "rce.log"
});
```

```js
const { RCEManager, LogLevel } = require("rce.js");

const rce = new RCEManager();
await rce.init({
  username: "", // Your GPORTAL email address
  password: ""  // Your GPORTAL password
}, {
  level: LogLevel.Info,
  file: "rce.log"
});
```

#### Logger
RCE.JS includes a configurable logger. Available levels are `None`, `Info`, `Warn`, `Error` and `Debug` (default is `Info`). You can also specify a `logFile` to log everything to a file.

```ts
import { RCEManager, LogLevel } from "rce.js";

const rce = new RCEManager();
await rce.init({
  // ... AuthOptions
}, {
  logLevel: LogLevel.Info,
  logFile: "rce.log"
});
```

```js
const { RCEManager, LogLevel } = require("rce.js");

const rce = new RCEManager();
await rce.init({
  // ... AuthOptions
}, {
  logLevel: LogLevel.Info,
  logFile: "rce.log"
});
```

A custom logger can be created in TypeScript by implementing the `ILogger` interface:

```ts
import { ILogger, LogLevel } from "rce.js";
import { inspect } from "util";

export default class MyCustomLogger implements ILogger {
  private level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  private format(content: any) {
    return typeof content === "string" ? content : inspect(content, { depth: 5 });
  }

  private has(level: LogLevel): boolean {
    return level >= this.level;
  }

  public debug(content: string) {
    if (!this.has(LogLevel.Debug)) return;
    console.log(`[DEBUG] ${this.format(content)}`);
  }

  public error(content: string) {
    if (!this.has(LogLevel.Error)) return;
    console.log(`[ERROR] ${this.format(content)}`);
  }

  public info(content: string) {
    if (!this.has(LogLevel.Info)) return;
    console.log(`[INFO] ${this.format(content)}`);
  }

  public warn(content: string) {
    if (!this.has(LogLevel.Warn)) return;
    console.log(`[WARN] ${this.format(content)}`);
  }
}
```

Use it like so:

```ts
import { RCEManager, LogLevel } from "rce.js";
import MyCustomLogger from "./logger";

const rce = new RCEManager();
await rce.init({
  // AuthOptions ...
}, {
  instance: new MyCustomLogger(LogLevel.Info)
});
```

#### Adding Servers
Use `addMany()` to add multiple servers or `add()` for one at a time.

```ts
import { RCEManager, RCEIntent } from "rce.js";

const rce = new RCEManager();
await rce.init({ /* auth options */ }, { /* logger options */ });

await rce.servers.addMany([
  {
    identifier: "my-solo-duo-trio-3x",
    serverId: 1234567,
    region: "US",
    intents: [RCEIntent.All],
    playerRefreshing: true,
    radioRefreshing: true,
    extendedEventRefreshing: true,
    state: ["trio", "3x"]
  },
  {
    identifier: "my-zerg-2x",
    serverId: 7654321,
    region: "EU",
    intents: [RCEIntent.ConsoleMessages],
    state: ["zerg", "2x"],
    silent: true
  }
]);
```

```js
const { RCEManager, RCEIntent } = require("rce.js");

const rce = new RCEManager();
await rce.init({ /* auth options */ }, { /* logger options */ });

await rce.servers.addMany([
  {
    identifier: "my-solo-duo-trio-3x",
    serverId: 1234567,
    region: "US",
    intents: [RCEIntent.All],
    playerRefreshing: true,
    radioRefreshing: true,
    extendedEventRefreshing: true,
    state: ["trio", "3x"]
  },
  {
    identifier: "my-zerg-2x",
    serverId: 7654321,
    region: "EU",
    intents: [RCEIntent.ConsoleMessages],
    state: ["zerg", "2x"]
  }
]);
```

To add a single server:

```ts
await rce.servers.add({
  identifier: "solo-only-3x",
  serverId: 1111111,
  region: "EU",
  intents: [RCEIntent.All],
  state: ["solo", "3x"]
});
```

```js
await rce.servers.add({
  identifier: "solo-only-3x",
  serverId: 1111111,
  region: "EU",
  intents: [RCEIntent.All],
  state: ["solo", "3x"]
});
```

Server option fields:
- `identifier` (string, required) – unique ID, recommend UUID.
- `serverId` (number or number[], required) – server ID from the G-PORTAL URL.
- `region` (`"US" | "EU"`, required) – server location.
- `intents` (`RCEIntent[]`, required) – WebSocket subscriptions.
- `state` (any[], optional, default `[]`) – custom metadata.
- `playerRefreshing` (boolean, optional, default `false`) – refresh player list every minute.
- `radioRefreshing` (boolean, optional, default `false`) – track radio frequencies every 30 seconds.
- `extendedEventRefreshing` (boolean, optional, default `false`) – check for debris fields.
- `silent` (boolean, optional) – suppress console warnings.

#### Removing Servers

```ts
import { RCEManager } from "rce.js";

const rce = new RCEManager();
await rce.init({ /* auth options */ }, { /* logger options */ });

rce.servers.remove("solo-only-2x");
```

```js
const { RCEManager } = require("rce.js");

const rce = new RCEManager();
await rce.init({ /* auth options */ }, { /* logger options */ });

rce.servers.remove("solo-only-2x");
```

#### Fetching Servers
Retrieve all servers or filter by region.

```ts
import { RCEManager } from "rce.js";

const rce = new RCEManager();
await rce.init({ /* auth options */ }, { /* logger options */ });

const allServers = await rce.servers.fetch();
const usServers = await rce.servers.fetch("US");
const euServers = await rce.servers.fetch("EU");
```

```js
const { RCEManager } = require("rce.js");

const rce = new RCEManager();
await rce.init({ /* auth options */ }, { /* logger options */ });

const allServers = await rce.servers.fetch();
const usServers = await rce.servers.fetch("US");
const euServers = await rce.servers.fetch("EU");
```

### Plugins

#### Registering a Plugin

Install the plugin:

```bash
npm install rce.js-datastore
```

Use it with the manager:

```ts
import { RCEManager } from "rce.js";
import DatabasePlugin from "rce.js-datastore";

const rce = new RCEManager();
await rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });

rce.registerPlugin("database", new DatabasePlugin());

await rce.database.connect();
console.log(await rce.database.get("testKey", "defaultValue"));
```

```js
const { RCEManager } = require("rce.js");
const DatabasePlugin = require("rce.js-datastore");

const rce = new RCEManager();
await rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });

rce.registerPlugin("database", new DatabasePlugin());

await rce.database.connect();
console.log(await rce.database.get("testKey", "defaultValue"));
```

#### Developing a Plugin

Install `rce.js` and implement an `init` method that receives the `RCEManager` instance.

```bash
npm install rce.js
```

Example structure:

```ts
import type { RCEManager } from "rce.js";

export class ExamplePlugin {
  private rce: RCEManager;

  constructor() {}

  public init(rce: RCEManager) {
    this.rce = rce;
    (rce as any).example = this;
  }

  public test() {
    this.rce.logger.info("This is a test log!");
  }
}
```

Usage:

```ts
import { RCEManager } from "rce.js";
import ExamplePlugin from "rce.js-example";

const rce = new RCEManager();
await rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });

rce.registerPlugin("example", new ExamplePlugin());
rce.example.test(); // Logs: This is a test log!
```

```js
const { RCEManager } = require("rce.js");
const ExamplePlugin = require("rce.js-example");

const rce = new RCEManager();
await rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });

rce.registerPlugin("example", new ExamplePlugin());
rce.example.test(); // Logs: This is a test log!
```
