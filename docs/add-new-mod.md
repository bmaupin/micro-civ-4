# Add a new mod

To add a new mod to this patcher:

1. Run the patcher on the mod you wish to mod, e.g.

   ```
   npx tsx src/install.ts ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/
   ```

1. Start Civ 4 and load the mod

1. Note any errors when the mod is loaded

1. Start a game and note any errors when the game is started

1. Update [../src/ModPatcher.ts](../src/ModPatcher.ts) as needed to fix the errors

   👉 In particular I've run into issues when removing items from XML Info files. Many of these items have dependencies in other XML Info files, which themselves need to be removed. However, sometimes the game logic (either in Assets/Python or even in Assets/CVGameCoreDLL.dll) may have some of these items hard-coded. In this case:

   1. Instead of deleting the items from the XML files, disable them; most items have some kind of `PrereqTech` property that can be set to `TECH_DISABLED`. See ModPatcher.ts for examples.

   1. In some occasions, some of the hard-coded instances may themselves need to be commented out. For example, DuneWars Revival has some code in Assets/Python that founds religions. This code will still found the religion even if it has been set to a disabled tech. See ModPatcher.ts for examples.

1. Open Civ 4 again, load the mod, and start another game. All of the errors should be gone.

1. Play through a game, as this may turn up other issues such as errors in the event logs or even game crashes. If this happens:

   1. In [../src/ModPatcher.ts](../src/ModPatcher.ts), comment individual methods until you discover which one is causing the issues

   1. Within the method causing the issues, comment individual instructions to further narrow down the issue

   1. Once you've narrowed down the instructions causing the issue, check the mod's source code for references to the item in question. Quite often it's caused by an item which has been deleted; see above for more information on some ways to handle this.

1. As desired, play and World Builder map files located in `PrivateMaps/` in the mod (by choosing _Play a Scenario_). You may need to remove any lines in those files (they're text files) containing references to any removed items (e.g. civic options or civics)
