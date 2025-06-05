"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const CommandHandler_1 = __importDefault(require("../servers/CommandHandler"));
const EVENTS = {
    event_airdrop: {
        name: "Airdrop",
        special: false,
    },
    event_cargoship: {
        name: "Cargo Ship",
        special: false,
    },
    event_cargoheli: {
        name: "Chinook",
        special: false,
    },
    event_helicopter: {
        name: "Patrol Helicopter",
        special: false,
    },
    event_halloween: {
        name: "Halloween",
        special: true,
    },
    event_xmas: {
        name: "Christmas",
        special: true,
    },
    event_easter: {
        name: "Easter",
        special: true,
    },
};
class ConsoleMessagesHandler {
    static handle(manager, message, server) {
        const messageArray = message.payload.data.consoleMessages.message
            ?.split("\n")
            .filter((e) => e !== "") || [];
        if (!server.flags.includes("INIT_LOGS")) {
            manager.logger.debug(`[${server.identifier}] Initial Logs Received: ${messageArray.length}`);
            server.flags.push("INIT_LOGS");
            return manager.servers.update(server);
        }
        let currentCommand;
        messageArray.forEach((data) => {
            const logMatch = data.match(constants_1.RegularExpressions.Log);
            if (!logMatch)
                return;
            const [, date, content] = logMatch;
            const log = content.trim();
            if (!log)
                return;
            manager.events.emit(constants_1.RCEEvent.Message, { server, message: log });
            // EVENT: COMMAND_EXECUTING
            const commandExecutingMatch = log.match(constants_1.RegularExpressions.CommandExecuting);
            if (commandExecutingMatch) {
                const cmd = commandExecutingMatch[1];
                manager.logger.debug(`[${server.identifier}] Executing Match: ${cmd}`);
                manager.events.emit(constants_1.RCEEvent.ExecutingCommand, {
                    server,
                    command: cmd,
                });
                const command = CommandHandler_1.default.get(server.identifier, cmd);
                if (command && !command.timestamp) {
                    manager.logger.debug(`[${server.identifier}] Command In Queue: ${cmd}`);
                    command.timestamp = date;
                    CommandHandler_1.default.add(command);
                    currentCommand = cmd;
                    return manager.logger.debug(`[${server.identifier}] Command Timestamp Added: ${cmd}`);
                }
            }
            // Check for Command Response
            const command = CommandHandler_1.default.getQueued(server.identifier, date);
            if (command && !log.startsWith("[ SAVE ]")) {
                manager.logger.debug(`[${server.identifier}] Command Response Found: ${command.command}`);
                command.resolve({
                    ok: true,
                    response: log,
                });
                clearTimeout(command.timeout);
                CommandHandler_1.default.remove(command);
            }
            else if (currentCommand) {
                manager.logger.debug(`[${server.identifier}] Command Response Not Found, Using Other Method: ${currentCommand}`);
                const command = CommandHandler_1.default.get(server.identifier, currentCommand);
                if (command) {
                    command.resolve({
                        ok: true,
                        response: log,
                    });
                    clearTimeout(command.timeout);
                    CommandHandler_1.default.remove(command);
                    currentCommand = null;
                }
            }
            // EVENT: VENDING_MACHINE_NAME
            const vendingMachineNameMatch = log.match(constants_1.RegularExpressions.VendingMachineName);
            if (vendingMachineNameMatch) {
                manager.events.emit(constants_1.RCEEvent.VendingMachineName, {
                    server,
                    ign: vendingMachineNameMatch[1],
                    oldName: vendingMachineNameMatch[2],
                    newName: vendingMachineNameMatch[3],
                });
            }
            // EVENT: QUICK_CHAT
            const quickChatMatch = log.match(constants_1.RegularExpressions.QuickChat);
            if (quickChatMatch) {
                const types = {
                    "[CHAT TEAM]": "team",
                    "[CHAT SERVER]": "server",
                    "[CHAT LOCAL]": "local",
                };
                manager.events.emit(constants_1.RCEEvent.QuickChat, {
                    server,
                    type: types[quickChatMatch[1]],
                    ign: quickChatMatch[3],
                    message: quickChatMatch[4],
                });
            }
            // EVENT: PLAYER_SUICIDE
            if (log.includes("was suicide by Suicide")) {
                const ign = log.split(" was suicide by Suicide")[0];
                manager.events.emit(constants_1.RCEEvent.PlayerSuicide, {
                    server,
                    ign,
                });
            }
            // EVENT: PLAYER_RESPAWNED
            if (log.includes("has entered the game")) {
                const ign = log.split(" [")[0];
                const platform = log.includes("[xboxone]") ? "XBL" : "PS";
                manager.events.emit(constants_1.RCEEvent.PlayerRespawned, {
                    server,
                    ign,
                    platform,
                });
            }
            // EVENT: CUSTOM_ZONE_CREATED
            const customZoneCreatedMatch = log.match(constants_1.RegularExpressions.CustomZoneCreated);
            if (customZoneCreatedMatch) {
                manager.events.emit(constants_1.RCEEvent.CustomZoneCreated, {
                    server,
                    zone: customZoneCreatedMatch[1],
                });
            }
            // EVENT: CUSTOM_ZONE_REMOVED
            const customZoneRemovedMatch = log.match(constants_1.RegularExpressions.CustomZoneRemoved);
            if (customZoneRemovedMatch) {
                manager.events.emit(constants_1.RCEEvent.CustomZoneRemoved, {
                    server,
                    zone: customZoneRemovedMatch[1],
                });
            }
            // EVENT: PLAYER_ROLE_ADD
            if (log.includes("Added")) {
                const playerRoleAddMatch = log.match(constants_1.RegularExpressions.PlayerRoleAdd);
                if (playerRoleAddMatch) {
                    manager.events.emit(constants_1.RCEEvent.PlayerRoleAdd, {
                        server,
                        admin: playerRoleAddMatch[1] === "SERVER"
                            ? undefined
                            : playerRoleAddMatch[1],
                        ign: playerRoleAddMatch[2],
                        role: playerRoleAddMatch[3],
                    });
                }
            }
            // EVENT: PLAYER_ROLE_REMOVE
            if (log.includes("Removed")) {
                const playerRoleRemoveMatch = log.match(constants_1.RegularExpressions.PlayerRoleRemove);
                if (playerRoleRemoveMatch) {
                    manager.events.emit(constants_1.RCEEvent.PlayerRoleRemove, {
                        server,
                        admin: playerRoleRemoveMatch[1] === "SERVER"
                            ? undefined
                            : playerRoleRemoveMatch[1],
                        ign: playerRoleRemoveMatch[2],
                        role: playerRoleRemoveMatch[3],
                    });
                }
            }
            // EVENT: ITEM_SPAWN
            const itemSpawnMatch = log.match(constants_1.RegularExpressions.ItemSpawn);
            if (itemSpawnMatch) {
                manager.events.emit(constants_1.RCEEvent.ItemSpawn, {
                    server,
                    ign: itemSpawnMatch[1],
                    item: itemSpawnMatch[3],
                    quantity: parseInt(itemSpawnMatch[2]),
                });
            }
            // EVENT: NOTE_EDIT
            const noteEditMatch = log.match(constants_1.RegularExpressions.NoteEdit);
            if (noteEditMatch) {
                const oldContent = noteEditMatch[2].trim().split("\\n")[0];
                const newContent = noteEditMatch[3].trim().split("\\n")[0];
                if (newContent.length > 0 && oldContent !== newContent) {
                    manager.events.emit(constants_1.RCEEvent.NoteEdit, {
                        server,
                        ign: noteEditMatch[1],
                        oldContent,
                        newContent,
                    });
                }
            }
            // EVENT: TEAM_CREATE
            const teamCreateMatch = log.match(constants_1.RegularExpressions.TeamCreate);
            if (teamCreateMatch) {
                manager.events.emit(constants_1.RCEEvent.TeamCreate, {
                    server,
                    id: parseInt(teamCreateMatch[2]),
                    owner: teamCreateMatch[1],
                });
            }
            // EVENT: TEAM_JOIN
            const teamJoinMatch = log.match(constants_1.RegularExpressions.TeamJoin);
            if (teamJoinMatch) {
                manager.events.emit(constants_1.RCEEvent.TeamJoin, {
                    server,
                    id: parseInt(teamJoinMatch[3]),
                    owner: teamJoinMatch[2],
                    ign: teamJoinMatch[1],
                });
            }
            // EVENT: TEAM_INVITE
            const teamInviteMatch = log.match(constants_1.RegularExpressions.TeamInvite);
            if (teamInviteMatch) {
                manager.events.emit(constants_1.RCEEvent.TeamInvite, {
                    server,
                    id: parseInt(teamInviteMatch[3]),
                    owner: teamInviteMatch[1],
                    ign: teamInviteMatch[2],
                });
            }
            // EVENT: TEAM_LEAVE
            const teamLeaveMatch = log.match(constants_1.RegularExpressions.TeamLeave);
            if (teamLeaveMatch) {
                manager.events.emit(constants_1.RCEEvent.TeamLeave, {
                    server,
                    id: parseInt(teamLeaveMatch[3]),
                    owner: teamLeaveMatch[2],
                    ign: teamLeaveMatch[1],
                });
            }
            // EVENT: TEAM_INVITE_CANCEL
            const teamInviteCancelMatch = log.match(constants_1.RegularExpressions.TeamInviteCancel);
            if (teamInviteCancelMatch) {
                manager.events.emit(constants_1.RCEEvent.TeamInviteCancel, {
                    server,
                    id: parseInt(teamInviteCancelMatch[3]),
                    owner: teamInviteCancelMatch[2],
                    ign: teamInviteCancelMatch[1],
                });
            }
            // EVENT: TEAM_PROMOTED
            const teamPromotedMatch = log.match(constants_1.RegularExpressions.TeamPromoted);
            if (teamPromotedMatch) {
                manager.events.emit(constants_1.RCEEvent.TeamPromoted, {
                    server,
                    id: parseInt(teamPromotedMatch[3]),
                    oldOwner: teamPromotedMatch[1],
                    newOwner: teamPromotedMatch[2],
                });
            }
            // EVENT: KIT_SPAWN
            const kitSpawnMatch = log.match(constants_1.RegularExpressions.KitSpawn);
            if (kitSpawnMatch) {
                manager.events.emit(constants_1.RCEEvent.KitSpawn, {
                    server,
                    ign: kitSpawnMatch[1],
                    kit: kitSpawnMatch[2],
                });
            }
            // EVENT: KIT_GIVE
            const kitGiveMatch = log.match(constants_1.RegularExpressions.KitGive);
            if (kitGiveMatch) {
                manager.events.emit(constants_1.RCEEvent.KitGive, {
                    server,
                    ign: kitGiveMatch[2],
                    admin: kitGiveMatch[1],
                    kit: kitGiveMatch[3],
                });
            }
            // EVENT: SPECIAL_EVENT_SET
            const specialEventSetMatch = log.match(constants_1.RegularExpressions.SpecialEventSet);
            if (specialEventSetMatch) {
                manager.events.emit(constants_1.RCEEvent.SpecialEventSet, {
                    server,
                    event: specialEventSetMatch[1],
                });
            }
            // EVENT: EVENT_START
            if (log.startsWith("[event]")) {
                for (const [key, options] of Object.entries(EVENTS)) {
                    if (log.includes(key)) {
                        manager.events.emit(constants_1.RCEEvent.EventStart, {
                            server,
                            event: options.name,
                            special: options.special,
                        });
                    }
                }
            }
            // EVENT: PLAYER_KILL
            if (log.includes(" was killed by ")) {
                const [victim, killer] = log
                    .split(" was killed by ")
                    .map((str) => str.trim());
                const victimData = this.getKill(victim);
                const killerData = this.getKill(killer);
                manager.events.emit(constants_1.RCEEvent.PlayerKill, {
                    server,
                    victim: victimData,
                    killer: killerData,
                });
            }
        });
    }
    static getKill(ign) {
        const data = constants_1.playerKillData.find((e) => e.id === ign.toLowerCase());
        if (data) {
            return {
                id: ign,
                name: data.name,
                type: data.type,
            };
        }
        if (Number(ign)) {
            return {
                id: ign,
                name: "Scientist",
                type: constants_1.PlayerKillType.Npc,
            };
        }
        return {
            id: ign,
            name: ign,
            type: constants_1.PlayerKillType.Player,
        };
    }
}
exports.default = ConsoleMessagesHandler;
//# sourceMappingURL=ConsoleMessages.js.map