{
  "section": "Getting Started",
  "title": "Installation",
  "description": "Instructions for installing RCE.JS using either Node Package Manager (NPM) or directly from GitHub for accessing the master branch with early features.",
  "methods": [
    {
      "source": "Node Package Manager (NPM)",
      "description": "Installs the stable version of RCE.JS, ideal for amateur developers due to reduced bugs and changes.",
      "command": "npm install rce.js"
    },
    {
      "source": "GitHub",
      "description": "Installs the master branch (beta) of RCE.JS, recommended for experienced developers only due to potential bugs and frequent changes.",
      "command": "npm install b1nzeex/rce.js",
      "note": "May require a Git client installed on the system."
    }
  ]
}


{
  "section": "Getting Started",
  "title": "Authentication",
  "description": "This library requires authentication with G-PORTAL to manage Rust Console community servers. The 'init()' method must be called after creating an instance of RCEManager to authenticate and establish a connection.",
  "authentication": {
    "note": "Your GPORTAL credentials are not stored and are only used in your local code to obtain authentication tokens from GPORTAL.",
    "method": "init()",
    "parameters": {
      "username": "Your GPORTAL email address",
      "password": "Your GPORTAL password"
    },
    "logging": {
      "level": "LogLevel.Info",
      "file": "rce.log"
    },
    "examples": [
      {
        "language": "TypeScript",
        "code": "import { RCEManager, LogLevel } from \"rce.js\";\n\nconst rce = new RCEManager();\nawait rce.init({\n    username: \"\", // Your GPORTAL email address\n    password: \"\"  // Your GPORTAL password\n}, {\n    level: LogLevel.Info,\n    file: \"rce.log\"\n});"
      },
      {
        "language": "JavaScript",
        "code": "const { RCEManager, LogLevel } = require(\"rce.js\");\n\nconst rce = new RCEManager();\nawait rce.init({\n    username: \"\", // Your GPORTAL email address\n    password: \"\"  // Your GPORTAL password\n}, {\n    level: LogLevel.Info,\n    file: \"rce.log\"\n});"
      }
    ]
  }
}


{
  "section": "Getting Started",
  "title": "Logger",
  "description": "RCE.JS provides a built-in logger for handling information, warnings, debugging, and error messages. The logger is configurable and supports custom loggers in TypeScript.",
  "configuration": {
    "defaultLevel": "Info",
    "logLevels": [
      {
        "level": "None",
        "description": "Disables the logger entirely."
      },
      {
        "level": "Info",
        "description": "Logs important information, warnings, and errors."
      },
      {
        "level": "Warn",
        "description": "Logs only warnings and errors."
      },
      {
        "level": "Error",
        "description": "Logs only error messages."
      },
      {
        "level": "Debug",
        "description": "Logs all messages including debugging."
      }
    ],
    "logFile": {
      "description": "An optional 'logFile' parameter can be provided to log all content to a file, useful for debugging.",
      "example": "rce.log"
    }
  },
  "examples": [
    {
      "language": "TypeScript",
      "code": "import { RCEManager, LogLevel } from \"rce.js\";\n\nconst rce = new RCEManager();\nawait rce.init({\n    // ... Your AuthOptions\n}, {\n    logLevel: LogLevel.Info,\n    logFile: \"rce.log\"\n});"
    },
    {
      "language": "JavaScript",
      "code": "const { RCEManager, LogLevel } = require(\"rce.js\");\n\nconst rce = new RCEManager();\nawait rce.init({\n    // ... Your AuthOptions\n}, {\n    logLevel: LogLevel.Info,\n    logFile: \"rce.log\"\n});"
    }
  ],
  "customLogger": {
    "support": "TypeScript only",
    "description": "A custom logger can be created by implementing the ILogger interface. The methods info, warn, error, and debug are required.",
    "example": {
      "code": "import { ILogger, LogLevel } from \"rce.js\";\nimport { inspect } from \"util\";\n\nexport default class MyCustomLogger implements ILogger {\n    private level: LogLevel;\n\n    public constructor(level: LogLevel) {\n        this.level = level;\n    }\n\n    private format(content: any) {\n        return typeof content === \"string\" ? content : inspect(content, { depth: 5 });\n    }\n\n    private has(level: LogLevel): boolean {\n        return level >= this.level;\n    }\n\n    public debug(content: string) {\n        if (!this.has(LogLevel.Debug)) return;\n        console.log(`[DEBUG] ${this.format(content)}`);\n    }\n\n    public error(content: string) {\n        if (!this.has(LogLevel.Error)) return;\n        console.log(`[ERROR] ${this.format(content)}`);\n    }\n\n    public info(content: string) {\n        if (!this.has(LogLevel.Info)) return;\n        console.log(`[INFO] ${this.format(content)}`);\n    }\n\n    public warn(content: string) {\n        if (!this.has(LogLevel.Warn)) return;\n        console.log(`[WARN] ${this.format(content)}`);\n    }\n}"
    },
    "usage": {
      "language": "TypeScript",
      "code": "import { RCEManager, LogLevel } from \"rce.js\";\nimport MyCustomLogger from \"./logger\";\n\nconst rce = new RCEManager();\nawait rce.init({\n    // AuthOptions ...\n}, {\n    instance: new MyCustomLogger(LogLevel.Info)\n});"
    }
  }
}


{
  "section": "Getting Started",
  "title": "Adding Servers",
  "description": "This section explains how to add servers to interact with using the RCE.JS library. You can add multiple servers at once or one at a time using `addMany()` or `add()` methods respectively.",
  "methods": [
    {
      "method": "addMany",
      "description": "Adds multiple servers to the RCE.JS manager instance.",
      "examples": [
        {
          "language": "TypeScript",
          "code": "import { RCEManager, RCEIntent } from \"rce.js\";\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nawait rce.servers.addMany([\n  {\n    identifier: \"my-solo-duo-trio-3x\",\n    serverId: 1234567,\n    region: \"US\",\n    intents: [RCEIntent.All],\n    playerRefreshing: true,\n    radioRefreshing: true,\n    extendedEventRefreshing: true,\n    state: [\"trio\", \"3x\"]\n  },\n  {\n    identifier: \"my-zerg-2x\",\n    serverId: 7654321,\n    region: \"EU\",\n    intents: [RCEIntent.ConsoleMessages],\n    state: [\"zerg\", \"2x\"],\n    silent: true\n  }\n]);"
        },
        {
          "language": "JavaScript",
          "code": "const { RCEManager, RCEIntent } = require(\"rce.js\");\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nawait rce.servers.addMany([\n  {\n    identifier: \"my-solo-duo-trio-3x\",\n    serverId: 1234567,\n    region: \"US\",\n    intents: [RCEIntent.All],\n    playerRefreshing: true,\n    radioRefreshing: true,\n    extendedEventRefreshing: true,\n    state: [\"trio\", \"3x\"]\n  },\n  {\n    identifier: \"my-zerg-2x\",\n    serverId: 7654321,\n    region: \"EU\",\n    intents: [RCEIntent.ConsoleMessages],\n    state: [\"zerg\", \"2x\"]\n  }\n]);"
        }
      ]
    },
    {
      "method": "add",
      "description": "Adds a single server to the RCE.JS manager instance.",
      "examples": [
        {
          "language": "TypeScript",
          "code": "import { RCEManager, RCEIntent } from \"rce.js\";\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nawait rce.servers.add({\n  identifier: \"solo-only-3x\",\n  serverId: 1111111,\n  region: \"EU\",\n  intents: [RCEIntent.All],\n  state: [\"solo\", \"3x\"]\n});"
        },
        {
          "language": "JavaScript",
          "code": "const { RCEManager, RCEIntent } = require(\"rce.js\");\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nawait rce.servers.add({\n  identifier: \"solo-only-3x\",\n  serverId: 1111111,\n  region: \"EU\",\n  intents: [RCEIntent.All],\n  state: [\"solo\", \"3x\"]\n});"
        }
      ]
    }
  ],
  "serverOptions": [
    {
      "name": "identifier",
      "type": "String",
      "required": true,
      "description": "Unique identifier for the server. Suggested to use UUIDs."
    },
    {
      "name": "serverId",
      "type": "Number | Number[]",
      "required": true,
      "description": "Server ID from G-PORTAL URL."
    },
    {
      "name": "region",
      "type": "\"US\" | \"EU\"",
      "required": true,
      "description": "Region where the Rust server is located."
    },
    {
      "name": "intents",
      "type": "RCEIntent[]",
      "required": true,
      "description": "Specifies WebSocket subscriptions. Options: All, ConsoleMessages, ServiceState, ServiceSensors."
    },
    {
      "name": "state",
      "type": "Any[]",
      "required": false,
      "default": [],
      "description": "Custom metadata for the server (e.g., server type)."
    },
    {
      "name": "playerRefreshing",
      "type": "Boolean",
      "required": false,
      "default": false,
      "description": "Enables player list refreshing every minute."
    },
    {
      "name": "radioRefreshing",
      "type": "Boolean",
      "required": false,
      "default": false,
      "description": "Enables radio frequency tracking every 30 seconds, including Oil Rig event emissions."
    },
    {
      "name": "extendedEventRefreshing",
      "type": "Boolean",
      "required": false,
      "default": false,
      "description": "Enables checking for debris fields and emitting related events."
    },
    {
      "name": "silent",
      "type": "Boolean",
      "required": false,
      "description": "Suppresses console warnings for this server."
    }
  ]
}


{
  "section": "Getting Started",
  "title": "Removing Servers",
  "description": "Allows removal of servers from the RCE Manager during runtime using the server's identifier.",
  "method": {
    "name": "remove",
    "parameters": {
      "identifier": {
        "type": "String",
        "description": "The unique identifier for the server you want to remove."
      }
    },
    "examples": [
      {
        "language": "TypeScript",
        "code": "import { RCEManager } from \"rce.js\";\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nrce.servers.remove(\"solo-only-2x\");"
      },
      {
        "language": "JavaScript",
        "code": "const { RCEManager } = require(\"rce.js\");\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nrce.servers.remove(\"solo-only-2x\");"
      }
    ]
  }
}


{
  "section": "Getting Started",
  "title": "Fetching Servers",
  "description": "Enables dynamic retrieval of servers associated with your G-PORTAL account. You can fetch all servers or filter by region.",
  "method": {
    "name": "fetch",
    "parameters": {
      "region": {
        "type": "\"US\" | \"EU\"",
        "required": false,
        "description": "Optional parameter to filter servers by region. If not provided, all servers are fetched."
      }
    },
    "returns": "An array of server objects from the authenticated G-PORTAL account.",
    "examples": [
      {
        "language": "TypeScript",
        "code": "import { RCEManager } from \"rce.js\";\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nconst allServers = await rce.servers.fetch();\nconst usServers = await rce.servers.fetch(\"US\");\nconst euServers = await rce.servers.fetch(\"EU\");"
      },
      {
        "language": "JavaScript",
        "code": "const { RCEManager } = require(\"rce.js\");\n\nconst rce = new RCEManager();\nawait rce.init({ /* auth options */ }, { /* logger options */ });\n\nconst allServers = await rce.servers.fetch();\nconst usServers = await rce.servers.fetch(\"US\");\nconst euServers = await rce.servers.fetch(\"EU\");"
      }
    ]
  }
}




{
  "section": "Plugins",
  "title": "Registering A Plugin",
  "description": "RCE.JS supports plugin registration, allowing developers to extend its functionality. This example demonstrates how to use the `rce.js-datastore` plugin to integrate an SQLite database.",
  "plugin": {
    "name": "rce.js-datastore",
    "description": "An SQLite plugin for RCE.JS providing a simple key-value store.",
    "installation": {
      "command": "npm install rce.js-datastore"
    },
    "registration": {
      "method": "registerPlugin",
      "parameters": {
        "name": "String - a unique name to register the plugin (e.g., 'database')",
        "instance": "Class instance of the plugin to register"
      }
    },
    "usage": {
      "examples": [
        {
          "language": "TypeScript",
          "code": "import { RCEManager } from \"rce.js\";\nimport DatabasePlugin from \"rce.js-datastore\";\n\nconst rce = new RCEManager();\nawait rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });\n\nrce.registerPlugin(\"database\", new DatabasePlugin());\n\nawait rce.database.connect();\nconsole.log(await rce.database.get(\"testKey\", \"defaultValue\"));"
        },
        {
          "language": "JavaScript",
          "code": "const { RCEManager } = require(\"rce.js\");\nconst DatabasePlugin = require(\"rce.js-datastore\");\n\nconst rce = new RCEManager();\nawait rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });\n\nrce.registerPlugin(\"database\", new DatabasePlugin());\n\nawait rce.database.connect();\nconsole.log(await rce.database.get(\"testKey\", \"defaultValue\"));"
        }
      ]
    }
  }
}



{
  "section": "Plugins",
  "title": "Developing A Plugin",
  "description": "This guide demonstrates how to create a custom plugin for RCE.JS. Plugins integrate with the RCEManager instance and can expose new methods and functionality.",
  "requirements": {
    "dependency": "rce.js",
    "installationCommand": "npm install rce.js",
    "baseClass": "Plugins must define an `init` method that receives the RCEManager instance. This allows the plugin to integrate with the core library."
  },
  "pluginStructure": {
    "language": "TypeScript",
    "code": "import type { RCEManager } from \"rce.js\";\n\nexport class ExamplePlugin {\n    private rce: RCEManager;\n\n    public constructor() {}\n\n    public init(rce: RCEManager) {\n        this.rce = rce;\n        (rce as any).example = this;\n    }\n\n    public test() {\n        this.rce.logger.info(\"This is a test log!\");\n    }\n}"
  },
  "usageExample": [
    {
      "language": "TypeScript",
      "code": "import { RCEManager } from \"rce.js\";\nimport ExamplePlugin from \"rce.js-example\";\n\nconst rce = new RCEManager();\nawait rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });\n\nrce.registerPlugin(\"example\", new ExamplePlugin());\nrce.example.test(); // Logs: This is a test log!"
    },
    {
      "language": "JavaScript",
      "code": "const { RCEManager } = require(\"rce.js\");\nconst ExamplePlugin = require(\"rce.js-example\");\n\nconst rce = new RCEManager();\nawait rce.init({ /* AuthOptions */ }, { /* LoggerOptions */ });\n\nrce.registerPlugin(\"example\", new ExamplePlugin());\nrce.example.test(); // Logs: This is a test log!"
    }
  ]
}


