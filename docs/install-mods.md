## Install mods

#### Install [Dune Wars](https://forums.civfanatics.com/resources/dune-wars-revival-villeneuve-inspired-patch.28465/) mod on Proton

1. Download DuneWars Revival v1.10 from here: [https://www.moddb.com/mods/dune-wars/downloads/dunewars-revival-v110](https://www.moddb.com/mods/dune-wars/downloads/dunewars-revival-v110)

1. Extract it and move it to the mods directory

   ```
   unzip DuneWars_Revival-v.1.10.zip
   mv DuneWars\ Revival/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/
   ```

1. Change the case of a couple directories so they'll be properly overwritten

   ```
   mv ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/Sounds/soundtrack/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/Sounds/Soundtrack
   mv ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/XML/GameInfo/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/XML/Gameinfo
   ```

1. Download the latest VIP update from here: [https://forums.civfanatics.com/resources/dune-wars-revival-villeneuve-inspired-patch.28465/updates](https://forums.civfanatics.com/resources/dune-wars-revival-villeneuve-inspired-patch.28465/updates) > _Go to download_

1. Extract it and overwrite the DuneWars Revival mods directory

   ```
   unzip DuneWarsRevival_VilleneuveInspiredPatch-dwr-vip-5.8.zip
   cp -av DuneWarsRevival_VilleneuveInspiredPatch-dwr-vip-5.8/DuneWars\ Revival/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/
   ```

1. (Optional) Double-check that there are no duplicate files with different case

   ```
   find ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/ | sort -f | uniq -i -d
   ```

   (Source: [How to find duplicate files with same name but in different case that exist in same directory in Linux?](https://stackoverflow.com/a/6705008/399105))

1. (Optional) To launch Dune Wars directly when starting Civ IV, right-click the game in the Steam client > _Properties_ and set _Launch Options_ to

   ```
   %command% "mod=\\DuneWars Revival"
   ```

#### Install [Planetfall](https://forums.civfanatics.com/threads/download-thread.253775/) mod on Proton

1. Download Planetfall from here: https://forums.civfanatics.com/threads/download-thread.253775/
   1. Download the main file
   1. Download the latest patch
   1. (Optional) download the audio files
   1. (Optional) download the movies **from the link in the last comment in the thread**
1. In Proton, enable showing dotfiles
   1. `protontricks 8800 winecfg`
   2. _Drives_ > check _Show dot files_ > _OK_
1. In the Steam client, go to the game and click the ⓘ icon to see which version of Proton is used
1. Run the mod main installer

   ```
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/8800" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 8.0"/proton waitforexitandrun Planetfall_v16_Main.exe
   ```

   (Adjust `Proton 8.0` as needed)

   1. In the installer, browse to your **Sid Meier's Civilization IV Beyond the Sword\Beyond the Sword** directory, e.g. Z:\home\user\.local\share\Steam\steamapps\common\Sid Meier's Civilization IV Beyond the Sword\Beyond the Sword\

      ⚠ If you browse to _Sid Meier's Civilization IV Beyond the Sword_ instead, the installer won't let you continue

1. Run the mod patch installer

   ```
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/8800" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 8.0"/proton waitforexitandrun Planetfall_v16f_Patch.exe
   ```

1. (Optional) To launch Planetfall directly when starting Civ IV, right-click the game in the Steam client > _Properties_ and set _Launch Options_ to

   ```
   %command% "mod=\\Planetfall v16"
   ```

#### Install other Civ 4 mods on Proton

1. Go to the page for the mod, e.g.

   - [Middle Earth](https://forums.civfanatics.com/resources/middle-earth-mod.22813/)
   - [Mars, Now](https://forums.civfanatics.com/threads/bts-mars-now.312246/)

1. Download the mod

1. Check the page for any specific installation instructions. Otherwise, extract it and move it to the mods directory, e.g.

   ```
   unzip Middle-earth_0410.zip
   mv Middle-earth ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/
   ```

1. (Optional) To launch the mod directly when starting Civ 4, right-click the game in the Steam client > _Properties_ and set _Launch Options_ to

   ```
   %command% "mod=\\Mod Directory"
   ```

   (Replace `Mod Directory` with the exact directory name of the mod in `Mods/`)

## Play with a mod

1. In the Civ 4 menu, go to _Advanced_ > _Load a Mod_ and choose the mod you wish to play with

1. Start a game as usual, or choose _Single Player_ > _Play a Scenario_

   ⓘ Note that _Play a Scenario_ includes scenarios from all mods

## Mods with custom maps

To see if a mod comes with custom maps, look in the `PrivateMaps/` directory of the mod.

- If the map file ends with `.py`, it's a map script
- If the map file ends with `.CivBeyondSwordWBSave`, it's a World Builder map

#### Map scripts

Custom map scripts can be modified by this mod but will need to be added manually. Currently only the DuneWars Revival Arrakis map script has been added.

To play a mod with a map script, the map script will be in the list of maps once the mod is loaded (see above to load a mod).

#### World Builder maps

World Builder maps need to be individually rescaled. It seems there's a tool here that can do this: [Civ4 Map Maker](https://forums.civfanatics.com/threads/civ4-map-maker.271351/).

To play a mod with a World Builder map, in the Civ 4 menu choose _Play a Scenario_ and choose the appropriate map.
