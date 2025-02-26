# Instructions

## Installation

#### Requirements

Civilization IV Beyond the Sword. See [below](#installing-beyond-the-sword-in-proton) for instructions on installing in Steam Proton.

#### Install the mod from the zip file

ⓘ This installs a mod allowing Beyond the Sword (without other mods) to be played more quickly.

1. Go to [Releases](https://github.com/bmaupin/micro-civ-4/releases) and download _MicroCiv4.zip_

1. Extract the zip file and move it to your `Beyond the Sword/Mods` directory, e.g. for Proton:

   ```
   unzip MicroCiv4.zip
   mv Micro\ Civ\ 4 ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/
   ```

1. (Optional) Change the Steam launch options to automatically load the mod

   e.g. for Proton, right-click the game in the Steam client > _Properties_ and set _Launch Options_ to

   ```
   %command% "mod=\\Micro Civ 4"
   ```

1. Launch Beyond the Sword and go to _Advanced_ > _Load a Mod_ and load _Micro Civ 4_

#### Run the mod patcher

ⓘ This will apply the changes in this mod to another mod, allowing it to be played more quickly.

Requirements: Node.js 20+

1. Clone this Git repository

1. Install dependencies

   ```
   npm install
   ```

1. Run the install script on whichever mod you wish to mod, e.g.

   ```
   npx tsx src/install.ts ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/
   ```

   - For tips on installing specific mods, see [install-mods.md](install-mods.md)

1. Launch Beyond the Sword and go to _Advanced_ > _Load a Mod_

1. A new mod will be created from the name of the old mod with the prefix "Micro," for example, _Micro DuneWars Revival_

1. If you encounter errors with a particular mod, see [add-new-mod.md](add-new-mod.md)

#### Uninstall this mod

1. Navigate to the `Beyond the Sword/Mods` directory (e.g. `~/.steam/steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword/Beyond the Sword/Mods/`)

1. Delete the directory of the mod you wish to uninstall, e.g. `Micro Civ 4` or `Micro DuneWars Revival`

#### Installing Beyond the Sword in Proton

1. In Steam, install _Sid Meier's Civilization IV: Beyond the Sword_
1. Right-click the game > _Properties_ > _Betas_ > select _original_release_unsupported_

   ⓘ This is needed in order to play the game with mods (see below)

1. In the Steam client, go to the game and click the ⓘ icon to see which version of Proton is used

   - Make sure it's at least Proton 8, otherwise you'll need to use workarounds to fix graphical glitches

1. In game, set graphical options

   1. Set all graphical settings except antialiasing to highest and restart the game
   1. Set resolution to desired resolution
   1. Gradually increase antialiasing until it starts affecting framerate
   1. Exit the game

## Tips for faster gameplay

#### In-game tips

- Read this guide first: [Useful shortcuts and features to improve gameplay speed](https://steamcommunity.com/sharedfiles/filedetails/?id=2313060416)
- While in game, in many places in the UI you can right-click on text to go directly to the Civilopedia entry for that item (e.g. units, technologies, buildings, etc)
  - This is especially helpful since some screens can't be dismissed without making a choice, like when it's time to choose a new technology to research or a new unit or building for a city's building queue
- When you see an event, you can expand the event log on the left and click on the event to go right to the location related to that event (the unit, city, etc.)

#### General options

These options apply to all games and can be changed at any time, including during a game

1. Go to the general game options page

   - In the main menu before starting a game, go to _Advanced_ > _Options_
   - Or in a game, go to the main menu > _Options_

1. Change the options as desired

   - Uncheck _Wait at End of Turn_
     - It will still pause at the end of the turn if no decisions need to be made that turn
     - This is especially nice at the beginning of the game when turns tend to be short. Later it can be checked if desired, e.g. during wars.
   - Check:
     - _Quick Moves_
     - _Quick Combat (Offense)_
     - _Workers Start Automated_
     - _Missionaries Start Automated_

#### Game-specific options

These options only apply to one specific game and can only be set before the game is started

1. At the main screen, instead of clicking _Play Now!_, click _Custom Game_ and set these options as desired

   1. Set the map _Size_
      - This has the biggest impact on game length; a smaller map will mean a much quicker game
   1. Set _Speed_ to _Quick_
   1. Under _Options_, check these (these should all be set by default by this mod, but may get overwritten):
      - _No City Razing_
        - This speeds up the game because without it, razed cities would need to be rebuilt
      - _No City Flipping From Culture_
        - This gives you one less thing to worry about
      - _No Vassal States_
        - Vassal states can be annoying because they can lock you into a war with multiple civilizations
   1. Under _Victories_, turn off any victory conditions you don't want to worry about
   1. Don't forget to set the difficulty

#### Tips for playing with this mod

1. Take the new map sizes into account when starting a game. For example, with the unmodded duel map size you could easily fit 5-6 players in the map, with this duel map size it can only realistically fit 2 players, tiny can only fit 3 players, etc.

1. When playing the game you may also want to make other adjustments. For example, with an unmodded map size one strategy is to build cities 4 tiles apart to maximise the number of tiles the city can work. With these modded map sizes, you'll probably want to build cities as close together as possible.
