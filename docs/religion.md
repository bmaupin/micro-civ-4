# Religion

## Motivation

Religion wasn't a separate system in previous Civilization games. Instead it was broadly a category of buildings and/or technologies that typically gave an increase in happiness. Religion as a separate system seems to be an innovation with Civ 4. While it does add depth to the game, it doesn't add much flavour; religions in Civ 4 are mostly interchangeable.

More pertinent to this mod is that when trying to play a game of Civ 4 quickly, religion serves as one more system to balance without providing much benefit. In particular, other civilisations can use it as a pretext for declaring war, meaning religion cannot be ignored and this can be frustrating when trying to play quickly.

#### References

For other people's thoughts on religion in Civ 4:

- [Three Moves Ahead Episode 56: Civ 5, Sid Meier and Farmville](https://www.idlethumbs.net/3ma/episodes/civ-5-sid-meier-and-farmville) (starts around 18:03)

## For now, remove religion

#### Steps to remove a religion

1. Comment out the religion in CIV4ReligionInfo.xml
1. Search the Assets/XML directory for any other files containing that religion, e.g. `RELIGION_BUDDHISM`
1. In the other XML files, find anything containing that religion and comment it out too
   - Event triggers, unit, buildings, etc.
1. In CIV4LeaderHeadInfos.xml, replace the name of the religion with `NONE`
1. Edit Civilopedia entries referencing removed religions, units, buildings, etc
   - The actual entries for the removed items won't be there, but descriptions in other entries may reference them
   - Also the _Religions_ category will be there, but it will be empty

#### Remove religion advisor from UI

Assets/Python/Screens/CvMainInterface.py ?

## Later, simplify religion?

As religion existed since the first Civilization games, it could be nice to add back a more simplified form of religion.

For example, in Civ 1 - 3 and Civ Rev, religion consisted mostly of buildings (e.g. temples and cathedrals) which increased happiness. Religion was not a system which would cause other civilisations to go to war.

#### Alternate idea: remove favourite religions of each civ

This would allow leaving the religious systems in place without the annoying proclivity to hostility if yours doesn't match. But I'm not sure if religion as-is would be less annoying when trying to play a quick game.

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
  - Assets/Python/Screens/CvMainInterface.py ?
- ~~Technologies?~~
- ~~Effects?~~

#### Technologies

- Meditation (Buddhism)
- Monotheism (Judaism)
- Polytheism (Hinduism)
- Theology (Christianity)
-
