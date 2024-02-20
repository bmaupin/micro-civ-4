# Civics

## Motivation

Previous versions of Civilization, including Civ Rev, were limited to government types. Civ 4 added five categories of civics with five civics each.

This adds friction when trying to play quickly; there's a popup every time a new civic is discovered with a suggestion to change to that civic.

Beyond that, it can be annoying because other civilisations may not like the civics of your civilisation and may pester you to change your civics or even go to war over them.

Even Soren Johnson, the creator of Civ 4, expresses some frustration about this: [Three Moves Ahead Episode 134: The Alpha Centauri Show](https://www.idlethumbs.net/3ma/episodes/the-alpha-centauri-show) (starts around 42:00)

## Simplify civics?

Would it be possible to remove non-governmental civics from Civ 4 to make it more like previous versions of Civilization, that only had government types?

#### ~~Alternate idea: remove favourite civics of each civ~~

This would remove the annoying proclivity to hostility if yours doesn't match.

... but then the game would still interrupt you every time you discover a new civic, which is annoying when trying to play quickly.

#### Remove civics

1. Remove a civic option

   ⓘ Civic options are categories of civics. If you want to remove an entire category of civics (e.g. religion), do this step first, then for the next step remove every civic corresponding to the removed civic option. If you just want to remove an individual civic, skip this step.

   1. Remove the corresponding civic option from [Assets/XML/GameInfo/CIV4CivicOptionInfos.xml](../src/Assets/XML/GameInfo/CIV4CivicOptionInfos.xml)
   1. Remove any other items (e.g. buildings) with that same civic option

1. Remove the civic from the game

   1. Remove or comment out civic from [Assets/XML/GameInfo/CIV4CivicInfos.xml](../src/Assets/XML/GameInfo/CIV4CivicInfos.xml)
   1. Replace corresponding `CivicType` in [Assets/XML/Civilizations/CIV4CivilizationInfos.xml](../src/Assets/XML/Civilizations/CIV4CivilizationInfos.xml) with `NONE`, e.g.

   ```xml
   <CivicType>NONE</CivicType>
   ```

   1. Replace corresponding `FavoriteCivic` in [Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml](../src/Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml) with `<FavoriteCivic>NONE</FavoriteCivic>`

      💡 To prevent other civilisations from being unhappy with your civics, just set all `FavoriteCivic` instances to `NONE`

      - Replace

        ```
        (<FavoriteCivic>.*</FavoriteCivic>)
        ```

        with

        ```
        <!--$1-->
              <FavoriteCivic>NONE</FavoriteCivic>
        ```

   1. Remove or comment out events with matching `Civic` in [Assets/XML/Events/CIV4EventTriggerInfos.xml](../src/Assets/XML/Events/CIV4EventTriggerInfos.xml)
   1. Remove or comment out vote infos with matching `CivicType` from [Assets/XML/GameInfo/CIV4VoteInfo.xml](../src/Assets/XML/GameInfo/CIV4VoteInfo.xml)
