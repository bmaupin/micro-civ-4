# Micro Civ 4

📌 [See my other Civ projects here](https://github.com/search?q=user%3Abmaupin+topic%3Acivilization&type=Repositories)

#### What is this?

A mod to make Civilization IV Beyond the Sword games drastically shorter, as well as a patcher tool to apply these same changes to other Civ 4 mods.

#### Instructions

See [docs/instructions.md](docs/instructions.md)

#### Status

This whole thing is one big experiment, and modding and removing major systems is bound to have unintended consequences.

Beyond that, there are some known issues that haven't yet been dealt with:

- [The maps are all currently square](https://github.com/bmaupin/quick-civ-4/issues/1). They seem to play fine but this was an oversight.
- Only some custom maps will be smaller, others will need to be adjusted
- Victory conditions haven't been adjusted and so they may yield unexpected results
- Some mods have systems hard-coded and so despite their removal they may still show up in certain circumstances (e.g. religion in DuneWars Revival)

The following mods have been tested to various degrees:

- [DuneWars Revival](https://forums.civfanatics.com/resources/dune-wars-revival-villeneuve-inspired-patch.28465/)
- [Mars, Now](https://forums.civfanatics.com/threads/bts-mars-now.312246/)
- [Middle Earth](https://forums.civfanatics.com/resources/middle-earth-mod.22813/)
- [Planetfall](https://forums.civfanatics.com/threads/download-thread.253775/)

#### Changes

- Smaller maps: this change alone drastically reduces the length of the game
- Religions disabled: one less system to worry about, not to mention religions in Civ 4 are all nearly identical
- Corporations removed: one less system to worry about, one that doesn't seem particularly engaging
- Non-governmental civics removed: this brings Civ 4 more in line with earlier Civ games which had different types of government but not multiple categories of civics to worry about
- Spy units disabled: this removes destructive spy missions while still allowing for "passive" spy missions
- Some default game options have been changed as well in order to facilitate quicker games, but these can be adjusted when the game is started

#### Motivation

Civilization is one of my favourite game series of all time, but I'm not able to play it for hours on end like I used to do. I noticed there are some modern 4X games that are designed to be played quickly, so I tried The Battle of Polytopia. Unfortunately, while it looks a lot like Civ it didn't really feel like Civ. Rather than give up Civ altogether, I thought it would be a fun challenge to see how I could make it shorter.

#### Approach

First, where possible, the game options are relied upon; for example, instead of removing vassal states, it has been set to disabled by default in the game options. This allows players to enable it as desired.

One of the biggest factors in game speed is map size, and so this was the first major change as part of this mod.

Beyond that, I considered other systems that break the flow of the game when trying to play quickly and tried first to simplify them, and then if that wasn't possible I removed them.

#### Wishlist

- [ ] Shrink and update mod World Builder maps (e.g. Middle Earth map, ...)
- [ ] Disable buildings and units added in Warlords and Beyond the Sword
- [ ] Mod victory conditions to adjust for smaller map sizes and removed/disabled systems
- [ ] Test and update other mod map scripts
- [ ] Remove disabled items from Civilopedia
