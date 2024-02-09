## Install mods

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

1. Start a game as usual, or choose _Play a Scenario_

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
