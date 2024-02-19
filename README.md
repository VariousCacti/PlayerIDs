# PlayerIDs
### [Chattriggers 1.20](https://github.com/ChatTriggers/ctjs/releases) mod
Uses player joins and leaves to link player IDs to usernames

<img src="https://media.discordapp.net/attachments/1158906111278194791/1208209749146075176/image.png?ex=65e27403&is=65cfff03&hm=48df64667d582f0bb88b45977cfc2a4a88460197c89c82179d1a6c98583436a6&=&format=webp&quality=lossless">

## Commands
### /clearIDCache <all | house>
Clears all saved IDs, either in the house the player is currently in, or in all houses
### /setIDtoName \<id\> \<name\>
Links the ID \<id\> to the username \<name\>
### /resetID \<id\>
Resets the value of the ID \<id\>
### /getNameFromID \<id\>
Gets the name associated with the ID \<id\> 
### /getIDFromName \<name\>
Gets the ID associated with the name \<name\> 
### /customIDMessages \<add | remove | list\> \<ID message\>
Add custom triggers for player IDs, not case-sensitive, independent to each house. (Ex: add "gamer" to detect "Gamer#100" as Player #100)
This command supports regex, but it is through the Rhino JS Engine so it may be glitchy!
### /toggleAsterisk
Toggles the astersik that appears before all housing chat messages
### /toggleJoinMessages <all | house>
Toggles the default messages that appear when a player joins or leaves a house