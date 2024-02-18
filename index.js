
if(Server.getIP().includes("hypixel.net")) {

    let lastNames = TabList.getNames();
    let lastLength = lastNames.length;
    let ticks = 0;
    let changedTick;
    let changedName;
    let cancelMapMessage = false;
    let uuid;
    let playerRegex = /(p(§[0-9a-z])*l(§[0-9a-z])*a(§[0-9a-z])*y(§[0-9a-z])*e(§[0-9a-z])*r|p)((§[0-9a-z])*\s)*(§[0-9a-z])*\#?((§[0-9a-z])*\s)*((§[0-9a-z])*\-?((§[0-9a-z])*\,?(§[0-9a-z])*[0-9])+)/i;
    let joinedHouse = 0;

    let playerIDs = JSON.parse(FileLib.read("./config/ChatTriggers/modules/playerIDs/playerIDs.json"));
    let settings = JSON.parse(FileLib.read("./config/ChatTriggers/modules/playerIDs/settings.json"));

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
        if(!arg[0] || arg.length != 1) {
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
        console.log(arg[0]);
        if(!arg[0] || arg.length != 1) {
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
                settings.showJoinMessages = !settings.showJoinMessages;

                if(settings.showJoinMessages) {
                    ChatLib.chat("&aJoin Messages Enabled in All Houses! (Except houses manually set)");
                } else {
                    ChatLib.chat("&aJoin Messages Disabled in All Houses! (Except houses manually set)");
                }
            break;
            case "house":
            
                if(Object.keys(settings.manualShowJoinMessages).includes(uuid)) {
                    settings.manualShowJoinMessages[uuid] = !settings.manualShowJoinMessages[uuid];
                } else {
                    settings.manualShowJoinMessages[uuid] = !settings.showJoinMessages;
                }

                if(settings.manualShowJoinMessages[uuid] === true) {
                    ChatLib.chat(`&aJoin Messages Enabled in House ${uuid}!`);
                } else {
                    ChatLib.chat(`&aJoin Messages Disabled in House ${uuid}!`);
                }
            
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
    
        if(TabList.getNames().length !== lastLength) {
            let currentNames = TabList.getNames();
            changedName = currentNames.filter(n => !lastNames.includes(n)).concat(lastNames.filter(n => !currentNames.includes(n)));
            if(changedName.length === 1) {
                changedName = changedName[0].removeFormatting().split(' ');
                if(changedName[0].includes('[')) changedName.shift();
                changedName = changedName[0];
                changedTick = ticks;
            }
        }
    
        lastNames = TabList.getNames();
        lastLength = lastNames.length;
    }))

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
    
    register("packetReceived", (packet, event) => {
        
        if(packet.class.toString() === "class net.minecraft.class_7439" && packet.content() && !packet.overlay()) {

            if(/^(\[(VIP|MVP\+?)\+?\] )?[a-zA-Z0-9_\-]{3,16} (entered|left) the world\.$/.test(packet.content().getString())) {
                if(Object.keys(settings.manualShowJoinMessages).includes(uuid)) {
                    if(settings.manualShowJoinMessages[uuid] === false) {
                        cancel(event);
                    }
                } else if(!settings.showJoinMessages) {
                    cancel(event);
                }
            }

            if(packet.content().getString().startsWith("*")) {

                let message = format(packet.content());

                // console.log(message)
                // ChatLib.chat(message)

                let id = message.match(playerRegex);

                if(id && (ticks - changedTick) < 20 && joinedHouse > 60) {
                    let checkChangedName = changedName;
                    setTimeout(() => {
                        if(checkChangedName === changedName) {
                            playerIDs[uuid][id[12].removeFormatting().replaceAll(',', '')] = changedName;
                        }
                    }, 500)
                }
        
                let oldMessage = message;
                let lexedMessage = [];
                let newMessage = "";
                let IDReplaced = false;
        
                while(playerRegex.test(oldMessage)) {
        
                    ((match) => {

                        oldMessage = [oldMessage.substring(0, oldMessage.indexOf(match[0])), oldMessage.substring((oldMessage.indexOf(match[0]) + match[0].length))];
        
                        lexedMessage.push({type: "text", value: oldMessage.shift()});
                        lexedMessage.push({type: "player", value: match[0]});
        
                        oldMessage = oldMessage[0];

                    })(oldMessage.match(playerRegex));       

                }
        
                if(oldMessage) {
        
                    lexedMessage.push({type: "text", value: oldMessage});
                }

                // console.log(JSON.stringify(lexedMessage))
        
                for(let token of lexedMessage) {

                    if(token.type === "player" && playerRegex.test(token.value)) {

                        let match = token.value.match(playerRegex);

                        if(playerIDs[uuid][match[12].removeFormatting().replaceAll(',', '')]) {
                            token.value = playerIDs[uuid][match[12].removeFormatting().replaceAll(',', '')];
                            IDReplaced = true;
                        }

                    }
                    newMessage = newMessage + token.value;
                }

                if(!settings.showAsterisk && newMessage.startsWith("§7*")) {
                    newMessage = newMessage.substring(6);
                    IDReplaced = true;
                }
        
                if(IDReplaced) {
                    cancel(event);
                    ChatLib.chat(newMessage);
                }

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
            }
        };

    }).setChatCriteria("${message}");
 
    register("gameUnload", () => {
        FileLib.write("./config/ChatTriggers/modules/playerIDs/playerIDs.json", JSON.stringify(playerIDs, null, 4));
        FileLib.write("./config/ChatTriggers/modules/playerIDs/settings.json", JSON.stringify(settings, null, 4));
    });

}