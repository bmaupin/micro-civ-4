# Civics

#### Simplify civics?

In previous versions of Civilization, including Civ Rev, civics were limited to government types. Would it be possible to remove other civic types in Civ 4?

#### ~~Alternate idea: remove favourite civics of each civ~~

This would remove the annoying proclivity to hostility if yours doesn't match.

... but then the game would still interrupt you every time you discover a new civic, which is annoying when trying to play quickly.

#### Remove civics

1. Remove or comment out civic from Assets/XML/GameInfo/CIV4CivicInfos.xml
1. Comment corresponding `CivicType` from Assets/XML/Civilizations/CIV4CivilizationInfos.xml
1. Replace corresponding `FavoriteCivic` in Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml with `<FavoriteCivic>NONE</FavoriteCivic>`

   - Replace

     ```
     (<FavoriteCivic>.*</FavoriteCivic>)
     ```

     with

     ```
     <!--$1-->
     	     <FavoriteCivic>NONE</FavoriteCivic>
     ```

1. Comment out events with matching `Civic` in Assets/XML/Events/CIV4EventTriggerInfos.xml
1. Comment out matching vote infos with matching `CivicType` from Assets/XML/GameInfo/CIV4VoteInfo.xml
