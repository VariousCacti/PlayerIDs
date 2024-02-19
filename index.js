
if(Server.getIP().includes("hypixel.net")) {

    let lastNames = TabList.getNames();
    let lastLength = lastNames.length;
    let ticks = 0;
    let changedTick = 0;
    let changedName;
    let cancelMapMessage = false;
    let uuid;
    let joinedHouse = 0;
    let joinMessages = [];
    let nameStack = [];
    let messageStack = [];

    let playerIDs = JSON.parse(FileLib.read("./config/ChatTriggers/modules/playerIDs/playerIDs.json"));
    let settings = JSON.parse(FileLib.read("./config/ChatTriggers/modules/playerIDs/settings.json"));

    function testPlayerRegex(message) {

        for(let IDMessage of settings.customIDMessages[uuid].concat(["P", "Player"])) {
            if(new RegExp(`${IDMessage.replace(/(.)/g, "$1(§[0-9a-z])*")}\s*(§[0-9a-z])*\#?((§[0-9a-z])*\s)*((§[0-9a-z])*\-?((§[0-9a-z])*\,?(§[0-9a-z])*[0-9])+)`, "i").test(message)) return true;
        }
        return false;
    }

    function matchPlayerRegex(message) {
        for(let IDMessage of settings.customIDMessages[uuid].concat(["P", "Player"])) {

            let match = message.match(new RegExp(`${IDMessage.replace(/(.)/g, "$1(§[0-9a-z])*")}\s*(§[0-9a-z])*\#?((§[0-9a-z])*\s)*((§[0-9a-z])*\-?((§[0-9a-z])*\,?(§[0-9a-z])*[0-9])+)`, "i"));

            if(match !== null) {
                return [match[0], match[4 + IDMessage.length]];
            }
        }
        return null;
    }

    register("command", (...arg) => {

        if(arg === undefined || arg.length !== 1) {
            arg = null;
        } else {
            arg = arg[0];
        }

        switch(arg) {
            case "all":
                playerIDs = {};
                ChatLib.chat("&aCleared IDs in all houses!");
            break;
            case "house":
                playerIDs[uuid] = {};
                ChatLib.chat("&aCleared IDs in house " + uuid + "!");
            break;
            default:
                ChatLib.chat("&cInvalid usage! /clearIDCache <all | house>");
            break;
        }
        cancelMapMessage = true;
        ChatLib.say("/map");
        setTimeout(() => {
            cancelMapMessage = false;
        }, 1000);

    }).setName("clearIDCache");

    register("command", (...args) => {

        if(args.length === 2) {
            let ID = parseInt(args[0]).toString();
            if(ID !== "NaN" && (+args[0]).toString() !== "NaN") {
                if(playerIDs[uuid][ID]) {
                    ChatLib.chat(`&aSet ID #${ID} to name "${args[1]}" (Formerly "${playerIDs[uuid][ID]}")!`);
                } else {
                    ChatLib.chat(`&aSet ID #${ID} to name "${args[1]}"!`);
                }
                playerIDs[uuid][ID] = args[1];
            } else {
                ChatLib.chat("&cInvalid usage! id should be an integer, none found!");
            }
        } else {
            ChatLib.chat("&cInvalid usage! /setIDtoName <id> <name>");
        }

    }).setName("setIDtoName");

    register("command", (...arg) => {
        if(!arg[0] || arg.length !== 1) {
            ChatLib.chat("&cInvalid usage! /resetID <id>");
        } else {
            let ID = parseInt(arg[0]).toString();
            if(ID !== "NaN" && (+arg[0]).toString() !== "NaN") {
                if(playerIDs[uuid][ID]) {
                    ChatLib.chat(`&aReset ID #${ID} (Formerly "${playerIDs[uuid][ID]}")!`);
                } else {
                    ChatLib.chat(`&aReset ID #${ID}!`);
                }
                delete playerIDs[uuid][ID];
            } else {
                ChatLib.chat("&cInvalid usage! id should be an integer, none found!");
            }
        }
    }).setName("resetID");

    register("command", (...arg) => {
        if(!arg[0] || arg.length !== 1) {
            ChatLib.chat("&cInvalid usage! /getNameFromID <id>");
        } else {
            let ID = parseInt(arg[0]).toString();
            if(ID !== "NaN" && (+arg[0]).toString() !== "NaN") {
                if(playerIDs[uuid][ID]) {
                    ChatLib.chat(`&aPlayer #${ID} is "${playerIDs[uuid][ID]}"!`);
                } else {
                    ChatLib.chat(`&eNo player found with the ID #${ID}!`);
                }
            } else {
                ChatLib.chat("&cInvalid usage! id should be an integer, none found!");
            }
        }
    }).setName("getNameFromID");

    register("command", (...arg) => {
        if(!arg[0] || arg.length !== 1) {
            ChatLib.chat("&cInvalid usage! /getIDFromName <name>");
        } else {
            let foundID = false;
            for(let ID in playerIDs[uuid]) {
                if(playerIDs[uuid][ID].toLowerCase() === arg[0].toLowerCase()) {
                    ChatLib.chat(`&aThe ID of the player "${playerIDs[uuid][ID]}" is #${ID}!`);
                    foundID = true;
                    break;
                }
            }
            if(!foundID) {
                ChatLib.chat(`&eNo ID found for the player "${arg[0]}"!`);
            }
        }
    }).setName("getIDFromName");

    register("command", (...args) => {

        if(args.length === 1 && args[0] === "list") {
            if(settings.customIDMessages[uuid].length > 0) {
                ChatLib.chat(`&aCustom ID messages for this house:`);
                for(let IDMessage of settings.customIDMessages[uuid]) {
                    ChatLib.chat("&7" + IDMessage);
                }
            } else {
                ChatLib.chat(`&eNo custom ID messages found on this house!`);
            }
        } else if(args.length === 2 && args[0] === "add") {
            if(settings.customIDMessages[uuid].includes(args[1])) {
                ChatLib.chat(`&eThe custom ID message "${args[1]}" is already on this house!`);
            } else {
                settings.customIDMessages[uuid].push(args[1]);
                ChatLib.chat(`&aCustom ID message "${args[1]}" added to this house!`);
            }
        } else if(args.length === 2 && args[0] === "remove") {
            if(settings.customIDMessages[uuid].includes(args[1])) {
                settings.customIDMessages[uuid].splice(settings.customIDMessages[uuid].indexOf(args[1]), 1);
                ChatLib.chat(`&aRemoved ID message "${args[1]}" from this house!`);
            } else {
                ChatLib.chat(`&eCustom ID message "${args[1]}" not found on this house!`);
            }
        } else {
            ChatLib.chat("&cInvalid Usage! /customIDMessages <add | remove | list> <ID message>");
        }

    }).setName("customIDMessages");

    register("command", () => {

        settings.showAsterisk = !settings.showAsterisk;

        if(settings.showAsterisk) {
            ChatLib.chat("&aHousing Asterisk Enabled!");
        } else {
            ChatLib.chat("&aHousing Asterisk Disabled!");
        }


    }).setName("toggleAsterisk");

    register("command", (...arg) => {

        if(arg === undefined || arg.length !== 1) {
            arg = null;
        } else {
            arg = arg[0];
        }

        switch(arg) {
            case "all":
                if(settings.showJoinMessages === "always") {
                    settings.showJoinMessages = "never";
                } else if(settings.showJoinMessages === "never") {
                    settings.showJoinMessages = "detect";
                } else {
                    settings.showJoinMessages = "always";
                }
                ChatLib.chat(`&aJoin messages set to ${settings.showJoinMessages} in all houses!`);
            break;
            case "house":
            
                if(Object.keys(settings.manualShowJoinMessages).includes(uuid)) {
                    settings.manualShowJoinMessages[uuid] = settings.manualShowJoinMessages[uuid];
                }

                if(settings.manualShowJoinMessages[uuid] === "always") {
                    settings.manualShowJoinMessages[uuid] = "never";
                } else if(settings.manualShowJoinMessages[uuid] === "never") {
                    settings.manualShowJoinMessages[uuid] = "detect";
                } else {
                    settings.manualShowJoinMessages[uuid] = "always";
                }

                ChatLib.chat(`&aJoin messages set to ${settings.manualShowJoinMessages[uuid]} in this house!`);
            
            break;
            default:
                ChatLib.chat("&cInvalid usage! /toggleJoinMessages <all | house>");
            break;
        }

    }).setName("toggleJoinMessages");

    register("worldLoad", (() => {

        joinedHouse = 0;

        if(!cancelMapMessage) {
            cancelMapMessage = true;
            ChatLib.say("/map");
            setTimeout(() => {
                cancelMapMessage = false;
            }, 1000);
        }
        
    }));

    register("tick", (() => {

        ticks++;
        joinedHouse++;
    
        if(TabList.getNames().length !== lastLength && joinedHouse > 20) {
            let currentNames = TabList.getNames();
            changedName = currentNames.filter(n => !lastNames.includes(n)).concat(lastNames.filter(n => !currentNames.includes(n)));
            if(ticks - changedTick < 20) {
                changedName = [];
                changedTick = 0;
            }
            if(changedName.length === 1) {
                changedName = changedName[0].removeFormatting().split(' ');
                if(changedName[0].includes('[')) changedName.shift();
                changedName = changedName[0];
                changedTick = ticks;
            }
        }
    
        lastNames = TabList.getNames();
        lastLength = lastNames.length;

    }));

    function format(raw) {

        let formatting = "";

        if(raw.getStyle().getColor()) formatting += net.minecraft.util.Formatting.byName(raw.getStyle().getColor());
        if(raw.getStyle().isBold()) formatting += "§l";
        if(raw.getStyle().isObfuscated()) formatting += "§k";
        if(raw.getStyle().isStrikethrough()) formatting += "§m";
        if(raw.getStyle().isUnderlined()) formatting += "§n";
        if(raw.getStyle().isItalic()) formatting += "§o";

        let formatted;

        if(formatting) {
            formatted = raw.content.string().replace(/(.)/g, formatting + "$1");
        } else {
            formatted = raw.content.string();
        }

        for(let sibling of raw.siblings) {
            formatted += format(sibling);
        }

        return formatted;

    }

    function replaceIDsInMessage(message, forced) {

        let oldMessage = message;
        let lexedMessage = [];
        let newMessage = "";
        let IDReplaced = true;

        if(joinedHouse > 20) {

            while(testPlayerRegex(oldMessage)) {

                ((match) => {

                    oldMessage = [oldMessage.substring(0, oldMessage.indexOf(match)), oldMessage.substring((oldMessage.indexOf(match) + match.length))];

                    lexedMessage.push({type: "text", value: oldMessage.shift()});
                    lexedMessage.push({type: "player", value: match});

                })(matchPlayerRegex(oldMessage)[0]);       

            }

            if(oldMessage) {
                lexedMessage.push({type: "text", value: oldMessage});
            }

            for(let token of lexedMessage) {

                if(token.type === "player" && testPlayerRegex(token.value)) {

                    let match = matchPlayerRegex(token.value)[1];

                    if(playerIDs[uuid][match.removeFormatting().replaceAll(',', '')]) {
                        token.value = playerIDs[uuid][match.removeFormatting().replaceAll(',', '')];
                        joinMessages.push(token.value);
                    } else {
                        IDReplaced = false;
                    }

                }
                newMessage = newMessage + token.value;
            }
        } else {
            newMessage = message;
        }

        if(!settings.showAsterisk && newMessage.startsWith("§7*") && !forced) {
            newMessage = newMessage.substring(6);
        }

        if((forced || (ticks - changedTick) > 20 || IDReplaced) && (joinedHouse > 20 || !testPlayerRegex(message))) {
            ChatLib.chat(newMessage);
        } else {
            messageStack.push(newMessage);
            setTimeout(() => {
                replaceIDsInMessage(messageStack.shift(), true);
            }, ((20 - Math.min((ticks - changedTick), 0)) * 50));
        }
    }
    
    register("packetReceived", (packet, event) => {
        
        if(packet.class.toString() === "class net.minecraft.class_7439" && packet.content() && !packet.overlay()) {

            if(packet.content().getString().startsWith("Sending you to")) joinedHouse = 0;

            if(packet.content().getString().replace(/\s/g, "").length === 0 && joinedHouse < 20) {
                cancel(event);
                ChatLib.chat("");
            }

            if(/^(\[(VIP|MVP\+?)\+?\] )?[a-zA-Z0-9_\-]{3,16} (entered|left) the world\.$/.test(packet.content().getString())) {
                let name = packet.content().getString().match(/([a-zA-Z0-9_\-]{3,16}) (entered|left) the world\.$/)[1];
                if(Object.keys(settings.manualShowJoinMessages).includes(uuid)) {
                    if(settings.manualShowJoinMessages[uuid] === "never") {
                        cancel(event);
                    } else if(settings.manualShowJoinMessages[uuid] === "detect") {
                        cancel(event);
                        joinMessages = joinMessages.filter((item) => { item !== name; });
                        nameStack.push([name, format(packet.content())]);
                        setTimeout(() => {
                            let currentName = nameStack.shift();
                            if(!joinMessages.includes(currentName[0])) ChatLib.chat(currentName[1]);
                        }, 2000);
                    }
                } else if(settings.showJoinMessages === "never") {
                    cancel(event);
                } else if(settings.showJoinMessages === "detect") {
                    cancel(event);
                    joinMessages = joinMessages.filter((item) => { item !== name; });
                    nameStack.push([name, format(packet.content())]);
                    setTimeout(() => {
                        let currentName = nameStack.shift();
                        if(!joinMessages.includes(currentName[0])) ChatLib.chat(currentName[1]);
                    }, 2000);
                }
            }

            if(packet.content().getString().startsWith("*")) {

                let message = format(packet.content());

                // console.log(message)
                // ChatLib.chat(message)

                let id = null;

                try{ id = matchPlayerRegex(message)[1]; } catch(e) {};

                if(id != null && (ticks - changedTick) < 20 && joinedHouse > 60) {
                    let checkChangedName = changedName;
                    setTimeout(() => {
                        if(checkChangedName === changedName) {
                            playerIDs[uuid][id.removeFormatting().replaceAll(',', '')] = changedName;
                        }
                    }, 500)
                }

                replaceIDsInMessage(message, false);
                cancel(event);
        
            } 
        }
    });

    register("chat", (message, event) => {

        if(cancelMapMessage) {
            if(message.includes("Unknown command.")) {
                cancel(event);
            } else if(message.includes("You are currently playing on")) {
                cancel(event);
                uuid = message.split(' ')[5].removeFormatting();
                if(!Object.keys(playerIDs).includes(uuid)) playerIDs[uuid] = {};
                if(!settings.customIDMessages[uuid]) settings.customIDMessages[uuid] = [];
            }
        };

    }).setChatCriteria("${message}");
 
    register("gameUnload", () => {
        FileLib.write("./config/ChatTriggers/modules/playerIDs/playerIDs.json", JSON.stringify(playerIDs, null, 4));
        FileLib.write("./config/ChatTriggers/modules/playerIDs/settings.json", JSON.stringify(settings, null, 4));
    });

    register("messageSent", (message) => {
        if(message.startsWith("/visibility")) ChatLib.chat("&cWarning! PlayerIDs does not work with visibily settings other than unlimited!");
    })

}