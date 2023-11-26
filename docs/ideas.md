# Ideas

#### High-level goals

- [x] [Smaller maps](map-sizes.md)
- Simplify, disable, or remove:
  - [x] [Religion](religion.md)
  - [x] [Espionage](espionage.md)
  - [x] Vassal states
  - [ ] Corporations
  - [x] [Civics](civics.md)
  - [ ] [Great people](great-people.md)
- Go back and see if we can simplify:
  - [ ] Religion
  - [ ] Espionage

#### Approach

- Start with the simplest approach first
  - Copy vendor files and modify them for a drop-in mod
  - Later if we settle on something we like we could create a map installation script
    - Maybe a Node script with a shebang? If there's demand we could compile it as an executable
- Base it on vanilla Civ 4 first
  - Expansions add more systems, units, technologies, etc, all of which will only make the games take longer
  - We could potentially re-base the mod on the new expansion packs later, which would be nice for more civilizations since they give more replayability without affecting game speed, but it would be take more work since there would be more to remove/disable
- Do an MVP first
  - Map size, espionage, religion?
- After that, port changes to Beyond the Sword (BtS); unfortunately each expansion is installed as a separate game, and almost no one (myself included) plays the vanilla game, especially since BtS is required for almost any mod.

#### To do

- [x] Rebase current work on BtS?
  - Basing on vanilla may be impractical and a waste of time
- [x] MVP
  - [x] [Reduce map sizes](map-sizes.md)
  - [x] [Remove espionage](espionage.md)
  - [x] [Remove religion](religion.md)
- [ ] Remove Warlords features
  - [x] Vassal states
    - Maybe enough just to change the default game options so this is unchecked?
  - [ ] New units
  - [ ] New buildings?
  - [ ] New wonders?
- [ ] Remove Beyond the Sword features
  - [ ] Corporations
  - [x] Espionage
  - [ ] New technologies
  - [ ] New units
  - [ ] New buildings?
  - [ ] New wonders?
- [ ] Other changes?
  - [ ] Remove great people?
    - This is more-or-less new to Civ 4 (although Civ 3 had military and scientific "leaders")
  - [ ] Disable random events by default?
  - [ ] Remove or simplify civics?
    - Previous Civ games only had governments; could we remove the other civics types?

#### Don't remove or disable

- Wonders
