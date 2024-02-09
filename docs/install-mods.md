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
