# Corporations

#### Remove a corporation

1. Remove or comment out the corporation from [Assets/XML/GameInfo/CIV4CorporationInfo.xml](../src/Assets/XML/GameInfo/CIV4CorporationInfo.xml)
1. Remove corresponding items from the other files (buildings, units, etc.)

   ```
   $ ~/.local/share/Steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword/Beyond the Sword/Assets$ grep -l CORPORATION_1 . -r | egrep -v "XML/Text|XML/Art"
   ./XML/GameInfo/CIV4CorporationInfo.xml
   ./XML/Units/CIV4UnitInfos.xml
   ./XML/Buildings/CIV4BuildingClassInfos.xml
   ./XML/Buildings/CIV4BuildingInfos.xml
   ```

#### Hide corporations advisor from UI

See [ui.md](ui.md)

#### Research

- Dune Wars, Charlemagne, Final frontier, Mesoamerica have all corporations removed from CIV4CorporationInfo.xml
