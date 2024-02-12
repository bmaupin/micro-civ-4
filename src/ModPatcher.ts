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
const modPrefix = 'Quick';
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

    if (this.modName === 'Quick DuneWars Revival') {
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

    await this.removeInfoItemChild('Assets/XML/Units/CIV4UnitInfos.xml', {
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

    await this.removeInfoItemChild(
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

    if (this.modName === 'Quick DuneWars Revival') {
      await this.updateInfoItems(
        'Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml',
        {
          set: 'LeaderHeadInfo HatedCivic',
          to: 'NONE',
          where: 'LeaderHeadInfo HatedCivic',
          in: removedCivics,
        }
      );

      await this.removeInfoItems('Assets/XML/Units/CIV4PromotionInfos.xml', {
        where: 'PromotionInfo PrereqCivics PrereqCivicX',
        in: removedCivics,
      });
    }

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

    await this.removeInfoItemChild('Assets/XML/Units/CIV4UnitInfos.xml', {
      delete: 'UnitInfo Buildings Building',
      where: 'UnitInfo Buildings Building BuildingType',
      in: removedBuildings,
    });

    await this.removeAdvisorButton('CorporationAdvisorButton');

    console.log();
  };

  /**
   * Disables all religions in the game
   *
   * Completely removing the religions is not always possible for some mods (e.g. DuneWars
   * Revival) because the religions are hard-coded into the game logic, and not all mods
   * provide full source code. Instead, this method takes a cue from the American Revolution mod included in the original release of Civ 4; all the religions have
   * their prerequisite technology set to a tech which is disabled. In this case, we've
   * added a dummy technology that doesn't serve any purpose to avoid potential conflicts
   * with existing technologies.
   */
  private disableReligions = async () => {
    console.log('Disabling religions ...');

    await this.updateInfoItems('Assets/XML/GameInfo/CIV4ReligionInfo.xml', {
      set: 'ReligionInfo TechPrereq',
      to: TECH_DISABLED,
    });

    // Disable logic in DuneWars Revival related to hard-coded religions. I tried XML
    // changes first (setting religion modifiers to 0, removing religious buildings, etc)
    // but it wasn't enough.
    if (this.modName === 'Quick DuneWars Revival') {
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
    if (this.modName === 'Quick marsjetzt-v04') {
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

    await this.removeAdvisorButton('ReligiousAdvisorButton');

    console.log();
  };

  private modEspionage = async () => {
    console.log('Modding espionage ...');

    // Remove espionage points given by buildings
    await this.removeInfoItemChild(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      {
        delete: 'BuildingInfo CommerceChanges iCommerce:nth-child(4)',
      }
    );

    // Remove espionage percentage given by buildings
    await this.removeInfoItemChild(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      {
        delete: 'BuildingInfo CommerceModifiers iCommerce:nth-child(4)',
      }
    );

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
    const configurationFile = 'Assets/XML/GameInfo/CIV4CivicOptionInfos.xml';
    const modFilePath = await this.prepModFile(configurationFile);

    const doc = new DOMParser().parseFromString(
      (await fs.readFile(modFilePath)).toString(),
      'text/xml'
    );

    // TODO: In order to use this.removeInfoItems, we're getting all civic options and removing
    //       the ones we want to keep. If we end up needing to reuse this pattern elsewhere,
    //       it might be better to modify this.removeInfoItems so that instead of a list of
    //       values to match it takes a matcher function. This would allow us to remove this
    //       extra step and do everything in this.removeInfoItems.
    const civicOptionsToRemove = Array.from(
      doc.querySelectorAll('CivicOptionInfo')
    )
      .map(
        (civicOption) =>
          civicOption.getElementsByTagName('Type')[0].textContent ?? ''
      )
      .filter(
        (civicOption) =>
          ![
            'CIVICOPTION_GOVERNMENT',
            // DuneWars Revival: This is hard-coded into the code (DuneWars.py) and causes errors if removed
            'CIVICOPTION_ARRAKIS',
            // Planetfall
            'CIVICOPTION_POLITICS',
          ].includes(civicOption)
      );

    return await this.removeInfoItems(configurationFile, {
      where: 'CivicOptionInfo Type',
      in: civicOptionsToRemove,
    });
  };

  /**
   * Remove Info elements from a Civ 4 Info XML configuration file
   *
   * @param assetPath The partial path of the file to modify, starting with "Assets/"
   * @param query.where CSS selectors to the XML elements to match on, or just the info
   *                  element if valuesToMatch isn't provided. **NOTE** that the first
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

    // Get the tag of the info items to go through from the query.where
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
   * Update matching Info elements with the given values from a Civ 4 Info XML configuration
   * file to a new value
   *
   * @param assetPath The partial path of the file to modify, starting with "Assets/"
   * @param query.delete CSS selectors to the XML elements to remove. **NOTE** that the
   *                        first part of the selectors must contain the info element tag
   *                        (e.g. "CivilizationInfo").
   * @param query.where CSS selectors to the XML elements to match on
   * @param query.in Values of the element to match on
   * @returns List of the Type values of the updated items
   */
  // I thought about rolling updateInfoItems into this (add "set" and "to" properties to
  // query, make them all optional, conditionally update depending on whether set or
  // delete were used) but this method is already more convoluted than updateInfoItems
  // which itself already feels too convoluted. Once again, I feel like this could've
  // benefitted from a simpler XML library that allowed for more powerful queries and
  // updates
  private removeInfoItemChild = async (
    assetPath: string,
    query: {
      delete: string;
      where?: string;
      in?: string[];
    }
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    if ((query.where && !query.in) || (!query.where && query.in)) {
      throw new Error(
        'query.where and query.in must both be defined if either is defined'
      );
    }

    // Get the tag of the info items to go through from query.delete
    const infoItemTag = query.delete.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `query.delete does not start with a tag that ends with "Info": ${query.delete}`
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

      // Case 1: nothing to match on, so just delete every element in query.delete
      if (!query.where || !query.in) {
        for (const elementToRemove of infoElement.querySelectorAll(
          query.delete
        )) {
          updated = true;
          elementToRemove.parentElement?.removeChild(elementToRemove);
        }
      }

      // Case 2: if we're updating the same element we're matching on, then go ahead and
      //         remove the element as well, but only if there's a match
      else if (query.where && query.in && query.where === query.delete) {
        for (const elementToRemove of infoElement.querySelectorAll(
          query.delete
        )) {
          if (
            elementToRemove.textContent &&
            query.in.includes(elementToRemove.textContent)
          ) {
            updated = true;
            elementToRemove.parentElement?.removeChild(elementToRemove);
          }
        }
      }

      // Case 3: if what we're matching on is within what we're removing, only remove
      //         elements containing a match
      else if (
        query.where &&
        query.in &&
        query.where.startsWith(query.delete)
      ) {
        for (const elementToRemove of infoElement.querySelectorAll(
          query.delete
        )) {
          for (const elementToMatch of elementToRemove.querySelectorAll(
            // Strip out the part of query.where containing query.delete so we
            // can iterate over elements within query.delete
            query.where.replace(query.delete, '')
          )) {
            if (
              elementToMatch.textContent &&
              query.in.includes(elementToMatch.textContent)
            ) {
              updated = true;
              elementToRemove.parentElement?.removeChild(elementToRemove);
            }
          }
        }
      }

      // Case 4: we want to delete an element that is not a subelement of query.where
      else {
        let matched = false;

        // First, see if there's a match inside the Info element
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

        // If there's a match, delete elements matching query.delete
        if (matched || !query.in) {
          for (const elementToRemove of infoElement.querySelectorAll(
            query.delete
          )) {
            updated = true;
            elementToRemove.parentElement?.removeChild(elementToRemove);
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

  /**
   * Update matching Info elements with the given values from a Civ 4 Info XML configuration
   * file to a new value
   *
   * @param assetPath The partial path of the file to modify, starting with "Assets/"
   * @param query.set CSS selectors to the XML elements to update. **NOTE** that the first
   *                  part of the selectors should contain the info element tag (e.g.
   *                  "CivilizationInfo").
   * @param query.to New value
   * @param query.where CSS selectors to the XML elements to match. If undefined, will
   *                       update all Info items with elements matching query.set.
   *                       NOTE: If this is the same as query.set, only elements
   *                       that match query.in will be updated.
   * @param query.in Values to match on. If undefined, will update all elements
   *                    matching query.set.
   * @returns List of the Type values of the updated items
   */
  // Ugh, this feels super convoluted ... Maybe we should've picked a better XML library?
  private updateInfoItems = async (
    assetPath: string,
    query: {
      set: string;
      to: string;
      where?: string;
      in?: string[];
    }
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    if ((query.where && !query.in) || (!query.where && query.in)) {
      throw new Error(
        'query.where and query.in must both be defined if either is defined'
      );
    }

    // Get the tag of the info items to go through from query.set
    const infoItemTag = query.set.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `query.set does not start with a tag that ends with "Info": ${query.set}`
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
      //
      let matched = false;
      // Track whether the info element has been updated, since it may receive multiple updates
      let updated = false;

      // If we have a value to match, see if the item has matching elements
      if (query.where && query.in) {
        for (const elementToMatch of infoElement.querySelectorAll(
          query.where
        )) {
          if (query.in.includes(elementToMatch.textContent || '')) {
            // If we're updating the same element we're matching on, then go ahead and
            // update the element as well, but only if there's a match
            if (query.where === query.set) {
              updated = true;
              elementToMatch.textContent = query.to;
            }
            // Otherwise, we'll iterate over the element to update and update it later
            else {
              matched = true;
              break;
            }
          }
        }
      }

      // If the Info Item matches (or there's nothing to match on), go through all
      // elements in query.set and update them to the new value
      if (matched || !query.in) {
        for (const elementToUpdate of infoElement.querySelectorAll(query.set)) {
          updated = true;
          elementToUpdate.textContent = query.to;
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
