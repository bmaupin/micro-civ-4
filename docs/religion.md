# Religion

## Motivation

Religion wasn't a separate system in previous Civilization games. Instead it was broadly a category of buildings and/or technologies that typically gave an increase in happiness. Religion as a separate system seems to be an innovation with Civ 4. While it does add depth to the game, it doesn't add much flavour; religions in Civ 4 are mostly interchangeable.

More pertinent to this mod is that when trying to play a game of Civ 4 quickly, religion serves as one more system to balance without providing much benefit. In particular, other civilisations can use it as a pretext for declaring war, meaning religion cannot be ignored and this can be frustrating when trying to play quickly.

#### References

For other people's thoughts on religion in Civ 4:

- [Three Moves Ahead Episode 56: Civ 5, Sid Meier and Farmville](https://www.idlethumbs.net/3ma/episodes/civ-5-sid-meier-and-farmville) (starts around 18:03)

## Remove religion

#### Steps to remove a religion

1. Comment out the religion in CIV4ReligionInfo.xml
1. Search the Assets/XML directory for any other files containing that religion, e.g. `RELIGION_BUDDHISM`

   - Event triggers, unit, buildings, etc.

     ```
     ~/.local/share/Steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword/Beyond the Sword/Assets$ grep -l RELIGION_JUDAISM . -r | egrep -v "XML/Text|XML/Art" | egrep -v "/Python/"
     ./XML/GameInfo/CIV4ReligionInfo.xml
     ./XML/Events/CIV4EventTriggerInfos.xml
     ./XML/Units/CIV4UnitInfos.xml
     ./XML/Buildings/CIV4BuildingInfos.xml
     ```

1. In the other XML files, find anything containing that religion and comment it out too

1. In CIV4LeaderHeadInfos.xml, replace the name of the religion with `NONE`
1. Edit Civilopedia entries referencing removed religions, units, buildings, etc
   - The actual entries for the removed items won't be there, but descriptions in other entries may reference them
   - Also the _Religions_ category will be there, but it will be empty

#### Remove religion advisor from UI

See [ui.md](ui.md)

## ~~Later, simplify religion?~~

Instead of removing religion entirely, it could be nice to mod it to be like it was in earlier Civ games.

But in the end I don't think it's really worth the effort just for a few extra buildings that give one extra point of happiness/culture/whatever.

#### ~~Idea 1: generic buildings that increase happiness~~

This idea would be to make religion match the earlier Civ games; for example, in Civ 1 - 3 and Civ Rev, religion consisted mostly of buildings (e.g. temples and cathedrals) which increased happiness. Religion was not a system which would cause other civilisations to go to war.

While there are already buildings which increase happiness, I still like this this idea in favour of removing religion altogether. However, I don't think this is worth the effort. There isn't a generic temple or cathedral, so we'd have to create a new building or modify one. But this would probably be a non-trivial amount of effort as the existing buildings are heavily intertwined with the other aspects of religion (units, specialists, the different religions themselves) and this effort would have to be duplicated for each mod we wish to patch.

#### ~~Idea 2: remove religious proclivities of each leader~~

- Keep religions as well as religious techs, units, buildings, and events
- Remove favourite religions from each leader (set `FavoriteReligion` to `NONE`)
- Set `iDifferentReligion*` and `iSameReligion*` values to `0` (see values for barbarians)

This would allow leaving the religious systems in place without the annoying proclivity to hostility if yours doesn't match.

While this would be simple to implement, I feel like religion would still be added friction when trying to play a quick game. There would still be extra religious units and buildings in the build queue, prompts to switch religions or found religions when a certain tech is discovered, religious events, etc.

#### ~~Idea 3: keep religious buildings only~~

Similar to idea 1 but keep the existing religious buildings without the units/events.

Something like this:

1. Keep religions
1. Keep religious buildings
1. Remove religious civics
1. Remove favourite religions of each civ
   - This should help avoid annoying conflicts with other civilisations
1. Remove religious units
   - These are mostly for spreading religion, which I don't think we'd really care about in a quick game, and removing the units removes some friction
1. Remove religious events

But then it seems like overkill that there would be seven different religions that would need to be founded, switched to, etc. just for a few buildings.

We could even disable all but the first religion and its buildings to further simplify the game, but then it would feel hacky since there would be religious buildings for just one religion.

## Research

#### To do

- [x] Check the tech tree to see which religion comes first
- [x] Try just commenting out one religion in CIV4ReligionInfo.xml to see the effect
  - Whichever comes first; Hinduism?

#### How to disable?

- Comment out the religion in CIV4ReligionInfo.xml?
  - Worth trying 🤷‍♂
  - It would probably be good to disable the buildings and units as well
  - We may need to also disable religious random events (if we don't just disable random events altogether)
- ~~Remove the technology?~~
  - Each religion is founded by whichever civilization discovers that religion's technology first
  - In the end, commenting out the religion works well and allows the technology to remain

#### To remove

- [x] Religions
- [x] Buildings
- [x] Leader preferred religions
- [x] Units
- [x] Random event triggers
- [ ] Civilopedia entries
- [ ] Religion menu from UI
  - See [ui.md](ui.md)
- ~~Technologies?~~
- ~~Effects?~~

#### Technologies

- Meditation (Buddhism)
- Monotheism (Judaism)
- Polytheism (Hinduism)
- Theology (Christianity)
-

#### How have other mods disabled religion

- American Revolution:
  - All religions have prerequisite tech set to rocketry 😆 and all techs are set to disabled via `bDisabled` in XML config files
  - Unfortunately this leaves the tech tree button in the UI but clicking on it doesn't do anything
