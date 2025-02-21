import fs from 'node:fs/promises';
import path from 'node:path';

import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM('');
const DOMParser = dom.window.DOMParser;

const btsDirectory = 'Beyond the Sword';
export const defaultGamePath = path.join(
  process.env.HOME ?? '',
  "/.steam/steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword"
);
const modPrefix = 'Micro';
const defaultModName = `${modPrefix} Civ 4`;
const modsDirectory = 'Mods';

const TECH_DISABLED = 'TECH_DISABLED';

export class ModPatcher {
  // Full path to Beyond the Sword
  btsPath: string;
  // Full path to Civ 4
  gamePath: string;
  // Name of the mod
  modName = defaultModName;
  // Full path to the mod
  modPath: string;
  // Full path the the original mod, if this is a mod mod
  originalModPath = '';

  constructor(installPath?: string) {
    this.gamePath = installPath || defaultGamePath;

    if (installPath?.includes(modsDirectory)) {
      this.originalModPath = installPath;
      this.gamePath = installPath.slice(
        0,
        installPath.indexOf(path.join(btsDirectory, modsDirectory))
      );
      this.modName = `${modPrefix} ${path.basename(installPath)}`;
    }

    this.btsPath = path.join(this.gamePath, btsDirectory);
    this.modPath = path.join(this.btsPath, modsDirectory, this.modName);
  }

  applyModPatches = async () => {
    await this.prepMod();
    await this.modMapSizes();
    await this.modGameOptions();
    await this.modCivics();
    await this.removeCorporations();
    await this.disableReligions();
    await this.modEspionage();
  };

  private prepMod = async () => {
    // Start with a clean slate every time
    await fs.rm(this.modPath, {
      force: true,
      recursive: true,
    });

    await fs.mkdir(this.modPath);

    // If this is a mod mod, copy all files from the original mod
    if (this.originalModPath !== '') {
      await fs.cp(this.originalModPath, this.modPath, { recursive: true });
    }

    await this.createDisabledTech();
  };

  /**
   * Create a disabled technology, used for disabling other items
   *
   * While items can be removed from the XML files in the games, references to these items
   * may be hard-coded in the game logic; this seems to be particularly true for mods. In
   * these cases, removing the items can cause the game to crash or other errors. Instead,
   * this tech is used to disable items by taking a cue from the American Revolution mod
   * included in the original release of Civ 4 in which religions were disabled by setting
   * their prerequisite technology to a tech which is disabled.
   */
  private createDisabledTech = async () => {
    let disabledTechEra = 'ERA_ANCIENT';
    // Get an era from the mod in case the mod has modified the eras (e.g. Planetfall)
    const erasFileFromMod = await ModPatcher.getFileFromMod(
      this.modPath,
      'Assets/XML/GameInfo/CIV4EraInfos.xml'
    );
    if (erasFileFromMod !== '') {
      const doc = new DOMParser().parseFromString(
        (await fs.readFile(erasFileFromMod)).toString(),
        'text/xml'
      );

      disabledTechEra =
        doc.querySelector('EraInfos EraInfo Type')?.textContent ||
        disabledTechEra;
    }

    const techInfosPath = await this.prepModFile(
      'Assets/XML/Technologies/CIV4TechInfos.xml'
    );
    const techInfosFileContents = await fs.readFile(techInfosPath);

    const disabledTechText = `\t<TechInfo>\r
\t\t\t<Type>${TECH_DISABLED}</Type>\r
\t\t\t<Description>(Disabled)</Description>\r
\t\t\t<Civilopedia></Civilopedia>\r
\t\t\t<Help/>\r
\t\t\t<Strategy></Strategy>\r
\t\t\t<Advisor>ADVISOR_MILITARY</Advisor>\r
\t\t\t<iAIWeight>0</iAIWeight>\r
\t\t\t<iAITradeModifier>0</iAITradeModifier>\r
\t\t\t<iCost>-1</iCost>\r
\t\t\t<iAdvancedStartCost>-1</iAdvancedStartCost>\r
\t\t\t<iAdvancedStartCostIncrease>0</iAdvancedStartCostIncrease>\r
\t\t\t<Era>${disabledTechEra}</Era>\r
\t\t\t<FirstFreeUnitClass>NONE</FirstFreeUnitClass>\r
\t\t\t<iFeatureProductionModifier>0</iFeatureProductionModifier>\r
\t\t\t<iWorkerSpeedModifier>0</iWorkerSpeedModifier>\r
\t\t\t<iTradeRoutes>0</iTradeRoutes>\r
\t\t\t<iHealth>0</iHealth>\r
\t\t\t<iHappiness>0</iHappiness>\r
\t\t\t<iFirstFreeTechs>0</iFirstFreeTechs>\r
\t\t\t<iAsset>0</iAsset>\r
\t\t\t<iPower>0</iPower>\r
\t\t\t<bRepeat>0</bRepeat>\r
\t\t\t<bTrade>0</bTrade>\r
\t\t\t<bDisable>1</bDisable>\r
\t\t\t<bGoodyTech>0</bGoodyTech>\r
\t\t\t<bExtraWaterSeeFrom>0</bExtraWaterSeeFrom>\r
\t\t\t<bMapCentering>0</bMapCentering>\r
\t\t\t<bMapVisible>0</bMapVisible>\r
\t\t\t<bMapTrading>0</bMapTrading>\r
\t\t\t<bTechTrading>0</bTechTrading>\r
\t\t\t<bGoldTrading>0</bGoldTrading>\r
\t\t\t<bOpenBordersTrading>0</bOpenBordersTrading>\r
\t\t\t<bDefensivePactTrading>0</bDefensivePactTrading>\r
\t\t\t<bPermanentAllianceTrading>0</bPermanentAllianceTrading>\r
\t\t\t<bVassalTrading>0</bVassalTrading>\r
\t\t\t<bBridgeBuilding>0</bBridgeBuilding>\r
\t\t\t<bIrrigation>0</bIrrigation>\r
\t\t\t<bIgnoreIrrigation>0</bIgnoreIrrigation>\r
\t\t\t<bWaterWork>0</bWaterWork>\r
\t\t\t<iGridX>-1</iGridX>\r
\t\t\t<iGridY>-1</iGridY>\r
\t\t\t<DomainExtraMoves/>\r
\t\t\t<CommerceFlexible/>\r
\t\t\t<TerrainTrades/>\r
\t\t\t<bRiverTrade>0</bRiverTrade>\r
\t\t\t<Flavors>\r
\t\t\t</Flavors>\r
\t\t\t<OrPreReqs>\r
\t\t\t</OrPreReqs>\r
\t\t\t<AndPreReqs>\r
\t\t\t</AndPreReqs>\r
\t\t\t<Quote></Quote>\r
\t\t\t<Sound></Sound>\r
\t\t\t<SoundMP></SoundMP>\r
\t\t\t<Button>,Art/Interface/Buttons/TechTree/Mysticism.dds,Art/Interface/Buttons/TechTree_Atlas.dds,4,11</Button>\r
\t\t</TechInfo>`;

    const techInfosNewContents = String(techInfosFileContents).replace(
      '</TechInfos>',
      `${disabledTechText}\r
\t</TechInfos>`
    );

    await fs.writeFile(techInfosPath, techInfosNewContents);
  };

  private modMapSizes = async () => {
    console.log('Modding map sizes ...');

    const worldInfoFile = 'Assets/XML/GameInfo/CIV4WorldInfo.xml';
    const modFilePath = await this.prepModFile(worldInfoFile);

    const doc = new DOMParser().parseFromString(
      (await fs.readFile(modFilePath)).toString(),
      'text/xml'
    );

    // NOTE: This creates square maps. At first this was unintentional as I was testing
    //       with the Dune Wars Arrakis map, which is square. But it seems to play fine,
    //       and I think now I prefer it since I like to play with the camera view at a 45
    //       degree angle which gives it an isometric feel. The default angle makes
    //       everything look too square.
    let newGridHeight = 3;
    let newGridWidth = 3;

    const worldInfos = doc.getElementsByTagName('WorldInfo');
    // This seems to be necessary since the return value of getElementsByTagName() isn't an
    // iterator
    for (let i = 0; i < worldInfos.length; i++) {
      const worldInfo = worldInfos[i];

      const iGridHeight = worldInfo.getElementsByTagName('iGridHeight')[0];
      iGridHeight.childNodes[0].textContent = String(newGridHeight);
      newGridHeight++;

      const iGridWidth = worldInfo.getElementsByTagName('iGridWidth')[0];
      iGridWidth.childNodes[0].textContent = String(newGridWidth);
      newGridWidth++;
    }

    // Replace normal newlines with Windows newlines; this probably isn't necessary but
    // makes diffing easier since the original files have Windows newlines
    await fs.writeFile(
      modFilePath,
      // jsdom doesn't add the XML tag or comments back to the file but Civ doesn't seem to care :)
      doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
    );

    if (this.modName === `${modPrefix} DuneWars Revival`) {
      const arrakisFullPath = await this.prepModFile('PrivateMaps/Arrakis.py');
      const arrakisFileContents = await fs.readFile(arrakisFullPath);

      const arrakisNewContents = String(arrakisFileContents).replace(
        `WorldSizeTypes.WORLDSIZE_DUEL:\t\t(8,8),
\t\tWorldSizeTypes.WORLDSIZE_TINY:\t\t(10,10),
\t\tWorldSizeTypes.WORLDSIZE_SMALL:\t\t(13,13),
\t\tWorldSizeTypes.WORLDSIZE_STANDARD:\t(16,16),
\t\tWorldSizeTypes.WORLDSIZE_LARGE:\t\t(18,18),
\t\tWorldSizeTypes.WORLDSIZE_HUGE:\t\t(21,21),`,
        `WorldSizeTypes.WORLDSIZE_DUEL:\t\t(3,3),
\t\tWorldSizeTypes.WORLDSIZE_TINY:\t\t(4,4),
\t\tWorldSizeTypes.WORLDSIZE_SMALL:\t\t(5,5),
\t\tWorldSizeTypes.WORLDSIZE_STANDARD:\t(6,6),
\t\tWorldSizeTypes.WORLDSIZE_LARGE:\t\t(7,7),
\t\tWorldSizeTypes.WORLDSIZE_HUGE:\t\t(8,8),`
      );

      await fs.writeFile(arrakisFullPath, arrakisNewContents);
    }

    // TODO: Mod other maps as desired, e.g. DuneWars Archipelago map, Planetfall, Middle
    //       Earth, Mars Now. See ../docs/install-mods.md and ../docs/notes/map-sizes.md
    //       for more information.

    console.log();
  };

  private modGameOptions = async () => {
    console.log('Modding game options ...');

    const gameOptionsFile = 'Assets/XML/GameInfo/CIV4GameOptionInfos.xml';
    const modFilePath = await this.prepModFile(gameOptionsFile);

    const doc = new DOMParser().parseFromString(
      (await fs.readFile(modFilePath)).toString(),
      'text/xml'
    );

    const gameOptionInfos = doc.getElementsByTagName('GameOptionInfo');
    for (let i = 0; i < gameOptionInfos.length; i++) {
      const gameOptionInfo = gameOptionInfos[i];

      const typeElement = gameOptionInfo.getElementsByTagName('Type')[0];
      if (
        typeElement.childNodes[0].textContent &&
        [
          'GAMEOPTION_NO_CITY_FLIPPING',
          'GAMEOPTION_NO_CITY_RAZING',
          'GAMEOPTION_NO_VASSAL_STATES',
          // Planetfall v16
          'GAMEOPTION_NO_EXPANSION_FACTIONS',
        ].includes(typeElement.childNodes[0].textContent)
      ) {
        const bDefault = gameOptionInfo.getElementsByTagName('bDefault')[0];
        bDefault.childNodes[0].textContent = '1';
      }

      if (
        typeElement.childNodes[0].textContent &&
        [
          // Hide pick religion from options since we'll be removing religion
          'GAMEOPTION_PICK_RELIGION',
          // DuneWars Revival
          'GAMEOPTION_NO_GPS_FROM_RELIGION_FOUNDATION',
        ].includes(typeElement.childNodes[0].textContent)
      ) {
        const bVisible = gameOptionInfo.getElementsByTagName('bVisible')[0];
        bVisible.childNodes[0].textContent = '0';
      }
    }

    await fs.writeFile(
      modFilePath,
      doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
    );

    console.log();
  };

  private modCivics = async () => {
    console.log('Removing non-governmental civics ...');

    const removedCivicOptions = await this.removeCivicOptions();

    const removedBuildings = await this.removeInfoItems(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      {
        where: 'BuildingInfo CivicOption',
        in: removedCivicOptions,
      }
    );

    await this.updateInfoItems('Assets/XML/Units/CIV4UnitInfos.xml', {
      delete: 'UnitInfo Buildings Building',
      where: 'UnitInfo Buildings Building BuildingType',
      in: removedBuildings,
    });

    const removedCivics = await this.removeInfoItems(
      'Assets/XML/GameInfo/CIV4CivicInfos.xml',
      {
        where: 'CivicInfo CivicOptionType',
        in: removedCivicOptions,
      }
    );

    await this.updateInfoItems(
      'Assets/XML/Civilizations/CIV4CivilizationInfos.xml',
      {
        delete: 'CivilizationInfo InitialCivics CivicType',
        where: 'CivilizationInfo InitialCivics CivicType',
        in: removedCivics,
      }
    );

    await this.updateInfoItems(
      'Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml',
      {
        set: 'LeaderHeadInfo FavoriteCivic',
        to: 'NONE',
        where: 'LeaderHeadInfo FavoriteCivic',
        in: removedCivics,
      }
    );

    await this.removeInfoItems('Assets/XML/Events/CIV4EventTriggerInfos.xml', {
      where: 'EventTriggerInfo Civic',
      in: removedCivics,
    });

    await this.removeInfoItems('Assets/XML/GameInfo/CIV4VoteInfo.xml', {
      where: 'VoteInfo ForceCivics ForceCivic CivicType',
      in: removedCivics,
    });

    // DuneWars Revival, Planetfall
    await this.updateInfoItems(
      'Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml',
      {
        set: 'LeaderHeadInfo HatedCivic',
        to: 'NONE',
        where: 'LeaderHeadInfo HatedCivic',
        in: removedCivics,
      }
    );

    // DuneWars Revival
    await this.removeInfoItems('Assets/XML/Units/CIV4PromotionInfos.xml', {
      where: 'PromotionInfo PrereqCivics PrereqCivicX',
      in: removedCivics,
    });

    // TODO: For any *.CivBeyondSwordWBSave files in PrivateMaps/ in the mod, remove any
    //       lines containing removed civic options and removed civics? This is low
    //       priority since those map files will need to be manually shrunk anyway

    console.log();
  };

  private removeCorporations = async () => {
    console.log('Removing corporations ...');

    // NOTE: We've run into issues removing other items (e.g. religions) and have instead
    //       resorted to disabling them by setting prereq tech to TECH_DISABLED. If we
    //       run into any issues with this we should probably do the same.
    const removedCorporations = await this.removeInfoItems(
      'Assets/XML/GameInfo/CIV4CorporationInfo.xml',
      {
        where: 'CorporationInfo',
      }
    );

    await this.removeInfoItems('Assets/XML/Units/CIV4UnitInfos.xml', {
      where: 'UnitInfo CorporationSpreads CorporationSpread CorporationType',
      in: removedCorporations,
    });

    const removedBuildings = await this.removeInfoItems(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      {
        where: 'BuildingInfo FoundsCorporation',
        in: removedCorporations,
      }
    );

    await this.updateInfoItems('Assets/XML/Units/CIV4UnitInfos.xml', {
      delete: 'UnitInfo Buildings Building',
      where: 'UnitInfo Buildings Building BuildingType',
      in: removedBuildings,
    });

    await this.removeAdvisorButton('CorporationAdvisorButton');

    console.log();
  };

  private disableReligions = async () => {
    console.log('Disabling religions ...');

    // Disable religions
    const disabledReligions = await this.updateInfoItems(
      'Assets/XML/GameInfo/CIV4ReligionInfo.xml',
      {
        set: 'ReligionInfo TechPrereq',
        to: TECH_DISABLED,
      }
    );

    // NOTE: While disabling the religion should be enough, sometimes (particularly in
    //       mods, e.g. DuneWars Revival) there may be hard-coded logic that founds a
    //       particular religion or creates a religious unit. The below is a best-effort
    //       attempt to mitigate this as much as possible, but won't

    // Remove free units provided when a religion is founded
    await this.updateInfoItems('Assets/XML/GameInfo/CIV4ReligionInfo.xml', {
      set: 'ReligionInfo iFreeUnits',
      to: '0',
    });

    // Remove favourite religions of Civs so they won't be angry if you have a different
    // religion
    await this.updateInfoItems(
      'Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml',
      {
        set: 'LeaderHeadInfo FavoriteReligion',
        to: 'NONE',
        where: 'LeaderHeadInfo FavoriteReligion',
        in: disabledReligions,
      }
    );

    // Disable religious units
    const disabledUnits = await this.updateInfoItems(
      'Assets/XML/Units/CIV4UnitInfos.xml',
      {
        set: 'UnitInfo PrereqTech',
        to: TECH_DISABLED,
        where: 'UnitInfo PrereqReligion',
        in: disabledReligions,
      }
    );

    // Disable religious buildings
    const disabledBuildings = await this.updateInfoItems(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      {
        set: 'BuildingInfo PrereqTech',
        to: TECH_DISABLED,
        where: 'BuildingInfo ReligionType',
        in: disabledReligions,
      }
    );

    // Disable units able to build buildings we've disabled
    await this.updateInfoItems('Assets/XML/Units/CIV4UnitInfos.xml', {
      set: 'UnitInfo PrereqTech',
      to: TECH_DISABLED,
      where: 'UnitInfo Buildings Building BuildingType',
      in: disabledBuildings,
    });

    // Don't allow units to build buildings we've disabled
    await this.updateInfoItems('Assets/XML/Units/CIV4UnitInfos.xml', {
      delete: 'UnitInfo Buildings Building',
      where: 'UnitInfo Buildings Building BuildingType',
      in: disabledBuildings,
    });

    // Get classes from units we've disabled
    const unitClassesToDisable = await this.getInfoItemsValues(
      'Assets/XML/Units/CIV4UnitInfos.xml',
      {
        select: 'UnitInfo Class',
        where: 'UnitInfo Type',
        in: disabledUnits,
      }
    );

    // Don't generate great person points for the unit classes we've disabled
    // NOTE: Great prophets will still be generated from generic great person points.
    //       They're mostly harmless since their buildings have been disabled. But this
    //       should at least reduce their occurrence in the game.
    await this.updateInfoItems('Assets/XML/Buildings/CIV4BuildingInfos.xml', {
      set: 'BuildingInfo GreatPeopleUnitClass',
      to: 'NONE',
      where: 'BuildingInfo GreatPeopleUnitClass',
      in: ['UNITCLASS_PROPHET', ...unitClassesToDisable],
    });

    // Don't give free unit from techs for the unit classes we've disabled
    await this.updateInfoItems('Assets/XML/Technologies/CIV4TechInfos.xml', {
      set: 'TechInfo FirstFreeUnitClass',
      to: 'NONE',
      where: 'TechInfo FirstFreeUnitClass',
      in: ['UNITCLASS_PROPHET', ...unitClassesToDisable],
    });

    // Don't allow players to create units of the classes we've disabled; it's not
    // certain whether this has any effect given the units have already been disabled and
    // great people generation seems to ignore this (and again, hard-coded unit creation
    // in game logic)
    await this.updateInfoItems('Assets/XML/Units/CIV4UnitClassInfos.xml', {
      set: 'UnitClassInfo iMaxPlayerInstances',
      to: '0',
      where: 'UnitClassInfo Type',
      in: ['UNITCLASS_PROPHET', ...unitClassesToDisable],
    });

    // Disable logic in DuneWars Revival related to hard-coded religions
    // NOTE: There is still some hard-coded logic in the DLL, for example,
    //       "Give Fremen free Sayyadina at Fanaticism"
    if (this.modName === `${modPrefix} DuneWars Revival`) {
      const modFilePath = await this.prepModFile('Assets/Python/DuneWars.py');
      const modFileContents = await fs.readFile(modFilePath);

      // Replace any lines founding, converting, setting religion with "pass", a no-op in Python
      const modFileNewContents = String(modFileContents).replaceAll(
        // Capture the whitespace since it's significant in Python
        /(\s+)(.*(foundReligion|pPlay\.convert|setHasReligion).*)/g,
        '$1pass # $2'
      );

      await fs.writeFile(modFilePath, modFileNewContents);
    }

    // "Mars, Now!" also has hard-coded religion logic
    if (this.modName === `${modPrefix} marsjetzt-v04`) {
      const modFilePath = await this.prepModFile(
        'Assets/Python/CvEventManager.py'
      );
      const modFileContents = await fs.readFile(modFilePath);
      const modFileNewContents = String(modFileContents).replaceAll(
        /(\s+)(.*(foundReligion|setHasReligion).*)/g,
        '$1pass # $2'
      );

      await fs.writeFile(modFilePath, modFileNewContents);
    }

    // DuneWars Revival has complex hard-coded religion logic, so leave the religious
    // advisor button just in case
    if (this.modName !== `${modPrefix} DuneWars Revival`) {
      await this.removeAdvisorButton('ReligiousAdvisorButton');
    }

    console.log();
  };

  private modEspionage = async () => {
    console.log('Modding espionage ...');

    // Remove espionage points given by buildings
    await this.updateInfoItems('Assets/XML/Buildings/CIV4BuildingInfos.xml', {
      delete: 'BuildingInfo CommerceChanges iCommerce:nth-child(4)',
    });

    // Remove espionage percentage given by buildings
    await this.updateInfoItems('Assets/XML/Buildings/CIV4BuildingInfos.xml', {
      delete: 'BuildingInfo CommerceModifiers iCommerce:nth-child(4)',
    });

    // Disable espionage-specific buildings
    // TODO: Add espionage buildings from mods, either hard-coded or maybe where FLAVOR_ESPIONAGE == 10?
    await this.updateInfoItems('Assets/XML/Buildings/CIV4BuildingInfos.xml', {
      set: 'BuildingInfo PrereqTech',
      to: TECH_DISABLED,
      where: 'BuildingInfo Type',
      in: [
        'BUILDING_INTELLIGENCE_AGENCY',
        // Security bureau
        'BUILDING_NATIONAL_SECURITY',
        'BUILDING_SCOTLAND_YARD',
      ],
    });

    // Disable espionage units; removing them caused crashes with the Middle-earth mod. It
    // also seems that there are hard-coded references to the units in Civ 4 itself (e.g.
    // Assets/Python/CvAdvisorUtils.py, Assets/Python/EntryPoints/CvScreensInterface.py)
    await this.updateInfoItems('Assets/XML/Units/CIV4UnitInfos.xml', {
      set: 'UnitInfo PrereqTech',
      to: TECH_DISABLED,
      where: 'UnitInfo Flavors Flavor FlavorType',
      in: ['FLAVOR_ESPIONAGE'],
    });

    console.log();
  };

  /**
   * Remove non-governmental civic options
   *
   * @returns The list of removed civic options
   */
  private removeCivicOptions = async (): Promise<string[]> => {
    // Get all civic options and then remove the ones we want to keep
    const civicOptionsToRemove = (
      await this.getInfoItemsValues(
        'Assets/XML/GameInfo/CIV4CivicOptionInfos.xml',
        {
          select: 'CivicOptionInfo Type',
        }
      )
    ).filter(
      (civicOption) =>
        ![
          'CIVICOPTION_GOVERNMENT',
          // DuneWars Revival: This is hard-coded into the code (DuneWars.py) and causes errors if removed
          'CIVICOPTION_ARRAKIS',
          // Planetfall
          'CIVICOPTION_POLITICS',
        ].includes(civicOption)
    );

    return await this.removeInfoItems(
      'Assets/XML/GameInfo/CIV4CivicOptionInfos.xml',
      {
        where: 'CivicOptionInfo Type',
        in: civicOptionsToRemove,
      }
    );
  };

  /**
   * Get values from Info items
   *
   * @param assetPath The partial path of the file to get values from, starting with "Assets/"
   * @param query.select CSS selectors to the XML elements to get values from
   * @param query.where CSS selectors to the XML elements to match on. **NOTE** that the
   *                    first part of the selectors should contain the info element tag
   *                    (e.g. "CivilizationInfo").
   * @param query.in Values of the element to match on
   * @returns List of values
   */
  private getInfoItemsValues = async (
    assetPath: string,
    query: {
      select: string;
      where?: string;
      in?: string[];
    }
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    if ((query.where && !query.in) || (!query.where && query.in)) {
      throw new Error('query.where and query.in must be used together');
    }

    // Get the tag of the info items to go through from query.select
    const infoItemTag = query.select.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `query.select does not start with a tag that ends with "Info": ${query.select}`
      );
    }

    const modFileFullPath = await this.prepModFile(assetPath);
    const doc = new DOMParser().parseFromString(
      (await fs.readFile(modFileFullPath)).toString(),
      'text/xml'
    );

    const valuesToReturn = [];

    // Go through all the info elements
    for (const infoElement of doc.querySelectorAll(infoItemTag)) {
      let matched = false;

      if (query.where && query.in) {
        for (const elementToMatch of infoElement.querySelectorAll(
          query.where
        )) {
          if (
            elementToMatch.textContent &&
            query.in.includes(elementToMatch.textContent)
          ) {
            matched = true;
            break;
          }
        }
      }

      if (matched || !query.where) {
        for (const elementToGet of infoElement.querySelectorAll(query.select)) {
          if (elementToGet.textContent) {
            valuesToReturn.push(elementToGet.textContent);
          }
        }
      }
    }

    return valuesToReturn;
  };

  /**
   * Remove Info elements from a Civ 4 Info XML configuration file
   *
   * @param assetPath The partial path of the file to modify, starting with "Assets/"
   * @param query.where CSS selectors to the XML elements to match on, or just the info
   *                  element if query.in isn't provided. **NOTE** that the first
   *                  part of the selectors should contain the info element tag (e.g.
   *                  "CivilizationInfo").
   * @param query.in Values of the element to match on
   * @returns List of the Type values of the removed items
   */
  private removeInfoItems = async (
    assetPath: string,
    query: {
      where: string;
      in?: string[];
    }
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    // Get the tag of the info items to go through from query.where
    const infoItemTag = query.where.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `query.where does not start with a tag that ends with "Info": ${query.where}`
      );
    }

    const modFileFullPath = await this.prepModFile(assetPath);
    const doc = new DOMParser().parseFromString(
      (await fs.readFile(modFileFullPath)).toString(),
      'text/xml'
    );

    const removedInfoItems = [] as string[];

    // Go through all the info elements
    for (const infoElement of doc.querySelectorAll(infoItemTag)) {
      let matched = false;

      if (query.in) {
        // Within those, apply the query query.where to match an element inside
        for (const elementToMatch of infoElement.querySelectorAll(
          query.where
        )) {
          if (query.in.includes(elementToMatch.textContent || '')) {
            matched = true;
            break;
          }
        }
      }

      if (matched || !query.in) {
        const infoItemType =
          infoElement.getElementsByTagName('Type')[0].textContent;
        if (infoItemType) {
          removedInfoItems.push(infoItemType);
          // Remove the info element
          infoElement.parentElement?.removeChild(infoElement);
          console.log(
            `Removed ${ModPatcher.formatInfoTag(
              infoItemTag
            )} ${ModPatcher.formatElementType(infoItemType)}`
          );
        } else {
          throw new Error(
            `Element ${ModPatcher.formatInfoTag(infoItemTag)} has no 'Type': ${
              infoElement.outerHTML
            }`
          );
        }
      }
    }

    await fs.writeFile(
      modFileFullPath,
      doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
    );

    return removedInfoItems;
  };

  /**
   * Update Info elements, either deleting subelements or setting them to a new text
   * value, optionally checking first to see if they match certain criteria
   *
   * @param assetPath The partial path of the file to modify, starting with "Assets/"
   * @param query.delete CSS selectors to the XML elements to remove. **NOTE** that the
   *                        first part of the selectors must contain the info element tag
   *                        (e.g. "CivilizationInfo").
   * @param query.set CSS selectors to the XML elements to update. **NOTE** that the first
   *                  part of the selectors should contain the info element tag (e.g.
   *                  "CivilizationInfo").
   * @param query.to New value
   * @param query.where CSS selectors to the XML elements to match on
   * @param query.in Values of the element to match on
   * @returns List of the Type values of the updated Info items
   */
  // NOTE: while this does what we want, it does feel super convoluted. Would it have been
  //       better to use a different XML library, for instance cheerio?
  private updateInfoItems = async (
    assetPath: string,
    query: {
      delete?: string;
      set?: string;
      to?: string;
      where?: string;
      in?: string[];
    }
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    if ((query.delete && query.set) || (!query.delete && !query.set)) {
      throw new Error('query.delete and query.set are mutually exclusive');
    }

    if ((query.set && !query.to) || (!query.set && query.to)) {
      throw new Error('query.set and query.to must be used together');
    }

    if ((query.where && !query.in) || (!query.where && query.in)) {
      throw new Error('query.where and query.in must be used together');
    }

    const deleteOrSetElement = (element: Element) => {
      if (query.delete) {
        element.parentElement?.removeChild(element);
      } else if (query.set && query.to) {
        element.textContent = query.to;
      }
    };

    // This is just a convenience variable so we don't have to do something like
    // query.delete || query.set everywhere
    const deleteOrSetQuery = query.delete ?? query.set ?? '';

    // Get the tag of the info items to go through from query.delete/query.set
    const infoItemTag = deleteOrSetQuery.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `query.delete/query.set does not start with a tag that ends with "Info": ${deleteOrSetQuery}`
      );
    }

    const modFileFullPath = await this.prepModFile(assetPath);
    const doc = new DOMParser().parseFromString(
      (await fs.readFile(modFileFullPath)).toString(),
      'text/xml'
    );

    const updatedInfoItems = [] as string[];

    // Go through all the info elements
    for (const infoElement of doc.querySelectorAll(infoItemTag)) {
      // Track whether the info element has been updated, since it may receive multiple updates
      let updated = false;

      // Case 1: nothing to match on, so just delete/update every element in query.delete/
      //         query.set
      if (!query.where || !query.in) {
        for (const elementToRemove of infoElement.querySelectorAll(
          deleteOrSetQuery
        )) {
          updated = true;
          deleteOrSetElement(elementToRemove);
        }
      }

      // Case 2: if we're deleting/updating the same element we're matching on, then as
      //         soon as we find a match we can delete/update it
      else if (query.where && query.in && query.where === deleteOrSetQuery) {
        for (const elementToRemove of infoElement.querySelectorAll(
          deleteOrSetQuery
        )) {
          if (
            elementToRemove.textContent &&
            query.in.includes(elementToRemove.textContent)
          ) {
            updated = true;
            deleteOrSetElement(elementToRemove);
          }
        }
      }

      // Case 3: if what we're matching on is within what we're removing, only
      //         delete/update elements containing a match
      else if (
        query.where &&
        query.in &&
        query.where.startsWith(deleteOrSetQuery)
      ) {
        for (const elementToRemove of infoElement.querySelectorAll(
          deleteOrSetQuery
        )) {
          for (const elementToMatch of elementToRemove.querySelectorAll(
            // Strip out the part of query.where containing query.delete/query.set so we
            // can iterate over elements within query.delete/query.set
            query.where.replace(deleteOrSetQuery, '')
          )) {
            if (
              elementToMatch.textContent &&
              query.in.includes(elementToMatch.textContent)
            ) {
              updated = true;
              deleteOrSetElement(elementToRemove);
            }
          }
        }
      }

      // Case 4: if the element we want to delete/update is not a subelement of
      //         query.where, then first see if there's a match inside the Info element,
      //         then delete **all** elements in the Info element matching query.delete/
      //         query.set
      else {
        let matched = false;

        for (const elementToMatch of infoElement.querySelectorAll(
          query.where
        )) {
          if (
            elementToMatch.textContent &&
            query.in.includes(elementToMatch.textContent)
          ) {
            matched = true;
            break;
          }
        }

        if (matched) {
          for (const elementToRemove of infoElement.querySelectorAll(
            deleteOrSetQuery
          )) {
            updated = true;
            deleteOrSetElement(elementToRemove);
          }
        }
      }

      if (updated) {
        const infoItemType =
          infoElement.getElementsByTagName('Type')[0].textContent;
        if (infoItemType) {
          updatedInfoItems.push(infoItemType);
          console.log(
            `Updated ${ModPatcher.formatInfoTag(
              infoItemTag
            )} ${ModPatcher.formatElementType(infoItemType)}`
          );
        } else {
          throw new Error(
            `Element ${ModPatcher.formatInfoTag(infoItemTag)} has no 'Type': ${
              infoElement.outerHTML
            }`
          );
        }
      }
    }

    await fs.writeFile(
      modFileFullPath,
      doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
    );

    return updatedInfoItems;
  };

  private static formatInfoTag = (infoTag: string) => {
    return infoTag.slice(0, -4);
  };

  private static formatElementType = (elementType: string) => {
    return (
      elementType
        .split('_')
        // Drop the first word
        .slice(1)
        // Lower-case everything
        .map((word) => word.toLowerCase())
        // Upper-case the first word of each segment
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        // Put it all back together
        .join(' ')
    );
  };

  /**
   * Make sure the asset file at the given path exists in the mod, otherwise copy it from
   * the game files. Then return the full path to the file in the mod.
   *
   * @param assetPath The partial path of the file to check, starting with "Assets/"
   * @returns The full path of the file in the mod
   */
  private prepModFile = async (assetPath: string): Promise<string> => {
    if (
      !assetPath.startsWith('Assets/') &&
      !assetPath.startsWith('PrivateMaps/')
    ) {
      throw new Error(
        `Asset file does not start with "Assets/" or "PrivateMaps/": ${assetPath}`
      );
    }

    // First, try to get the file from the mod, if it exists
    const existingModFile = await ModPatcher.getFileFromMod(
      this.modPath,
      assetPath
    );
    if (existingModFile !== '') {
      return existingModFile;
    }

    const newModFile = path.join(this.modPath, assetPath);

    // If not, and the file exists in BtS, copy it to the mod
    if (await ModPatcher.doesFileExist(path.join(this.btsPath, assetPath))) {
      await ModPatcher.copyFile(path.join(this.btsPath, assetPath), newModFile);
      return newModFile;
    }

    // If not, and the file exists in the base game directory, copy it to the mod
    if (await ModPatcher.doesFileExist(path.join(this.gamePath, assetPath))) {
      await ModPatcher.copyFile(
        path.join(this.gamePath, assetPath),
        newModFile
      );
      return newModFile;
    }

    throw new Error(`File to mod not found in game directory: ${assetPath}`);
  };

  /**
   * Find a file from a mod and return it if it's found. **NOTE** that this will do a
   * case-insensitive search.
   *
   * @param modPath Full path to the mod
   * @param assetPath The partial path of the file to find, starting with "Assets/"
   * @returns The full path to the found file, or an empty string if no file found
   */
  private static getFileFromMod = async (
    modPath: string,
    assetPath: string
  ): Promise<string> => {
    if (!modPath.includes(modsDirectory)) {
      throw new Error(
        `Mod path does not contain ${modsDirectory}": ${modPath}`
      );
    }

    for (const modFilePath of await fs.readdir(modPath, { recursive: true })) {
      if (assetPath.toLowerCase() === modFilePath.toLowerCase()) {
        return path.join(modPath, modFilePath);
      }
    }

    return '';
  };

  private static doesFileExist = async (filePath: string) => {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  };

  private static copyFile = async (sourcePath: string, destPath: string) => {
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(sourcePath, destPath);
  };

  private removeAdvisorButton = async (buttonName: string) => {
    const mainInterfacePath = await this.prepModFile(
      'Assets/Python/Screens/CvMainInterface.py'
    );
    const fileContents = await fs.readFile(mainInterfacePath);

    // Use a regex to match for variations in whitespace and line endings just in case 🤷‍♂️
    const stringsToComment = new RegExp(`(iBtnX\\s?\\+=\\s?iBtnAdvance\\r?)
\\s*screen\\.setImageButton\\(\\s?"${buttonName}".*\\r?
\\s*screen\\.setStyle\\(\\s?"${buttonName}".*\\r?
\\s*screen\\.hide\\(\\s?"${buttonName}".*`);

    const newFileContents = String(fileContents).replace(
      stringsToComment,
      `# Remove ${buttonName}\r
\t\t#$1
\t\t#screen.setImageButton( "${buttonName}", "", iBtnX, iBtnY, iBtnWidth, iBtnWidth, WidgetTypes.WIDGET_ACTION, gc.getControlInfo(ControlTypes.CONTROL_CORPORATION_SCREEN).getActionInfoIndex(), -1 )\r
\t\t#screen.setStyle( "${buttonName}", "Button_HUDAdvisorCorporation_Style" )\r
\t\t#screen.hide( "${buttonName}" )`
    );

    await fs.writeFile(mainInterfacePath, newFileContents);

    console.log(`Removed ${buttonName}`);
  };
}
