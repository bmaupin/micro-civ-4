# Religion

## Steps to remove a religion

1. Comment out the religion in CIV4ReligionInfo.xml
1. Search the Assets/XML directory for any other files containing that religion, e.g. `RELIGION_BUDDHISM`
1. In the other XML files, find anything containing that religion and comment it out too
   - Event triggers, unit, buildings, etc.
1. In CIV4LeaderHeadInfos.xml, replace the name of the religion with `NONE`
1. Edit Civilopedia entries referencing removed religions, units, buildings, etc
   - The actual entries for the removed items won't be there, but descriptions in other entries may reference them
   - Also the _Religions_ category will be there, but it will be empty

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

- [ ] Religions
- [ ] Technologies?
- [ ] Buildings
- [ ] Units
- [ ] Effects?
- [ ] Triggers?
- [ ] Random events?
- [ ] Civilopedia entries

#### Technologies

- Meditation (Buddhism)
- Monotheism (Judaism)
- Polytheism (Hinduism)
- Theology (Christianity)
-
