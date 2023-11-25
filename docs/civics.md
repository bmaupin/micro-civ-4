# Civics

#### Simplify civics?

In previous versions of Civilization, including Civ Rev, civics were limited to government types. Would it be possible to remove other civic types in Civ 4?

#### ~~Alternate idea: remove favourite civics of each civ~~

This would remove the annoying proclivity to hostility if yours doesn't match.

... but then the game would still interrupt you every time you discover a new civic, which is annoying when trying to play quickly.

#### Remove civics

💡 Recommendation: First check `InitialCivics` in CIV4CivilizationInfos.xml and don't remove those civics. This removes the need to modify CIV4CivilizationInfos.xml as each civilisation can use its default civic. Otherwise the default government civic gets shown in other categories where all civics are disabled, which could be a bit confusing.

1. Remove or comment out civic from [Assets/XML/GameInfo/CIV4CivicInfos.xml](../src/Assets/XML/GameInfo/CIV4CivicInfos.xml)
1. Comment corresponding `CivicType` from [Assets/XML/Civilizations/CIV4CivilizationInfos.xml](../src/Assets/XML/Civilizations/CIV4CivilizationInfos.xml)
1. Replace corresponding `FavoriteCivic` in [Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml](../src/Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml) with `<FavoriteCivic>NONE</FavoriteCivic>`

   - Replace

     ```
     (<FavoriteCivic>.*</FavoriteCivic>)
     ```

     with

     ```
     <!--$1-->
     	     <FavoriteCivic>NONE</FavoriteCivic>
     ```

1. Comment out events with matching `Civic` in [Assets/XML/Events/CIV4EventTriggerInfos.xml](../src/Assets/XML/Events/CIV4EventTriggerInfos.xml)
1. Comment out vote infos with matching `CivicType` from [Assets/XML/GameInfo/CIV4VoteInfo.xml](../src/Assets/XML/GameInfo/CIV4VoteInfo.xml)
