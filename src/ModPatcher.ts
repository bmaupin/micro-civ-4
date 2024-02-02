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
const modName = 'Micro Civ 4';
const modsDirectory = 'Mods';

export class ModPatcher {
  btsPath: string;
  gamePath: string;
  modPath: string;

  constructor(gamePath?: string) {
    this.gamePath = gamePath || defaultGamePath;
    this.btsPath = path.join(this.gamePath, btsDirectory);
    this.modPath = path.join(this.btsPath, modsDirectory, modName);
  }

  applyModPatches = async () => {
    // Start with a clean slate every time
    await this.uninstallMod();
    await this.modMapSizes();
    await this.modGameOptions();
    await this.modCivics();
    await this.removeCorporations();
    await this.removeReligions();
    await this.modEspionage();
  };

  private uninstallMod = async () => {
    await fs.rm(this.modPath, {
      force: true,
      recursive: true,
    });
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
        ['GAMEOPTION_NO_CITY_RAZING', 'GAMEOPTION_NO_VASSAL_STATES'].includes(
          typeElement.childNodes[0].textContent
        )
      ) {
        const bDefault = gameOptionInfo.getElementsByTagName('bDefault')[0];
        bDefault.childNodes[0].textContent = '1';
      }

      if (
        typeElement.childNodes[0].textContent &&
        [
          // Hide pick religion from options since we'll be removing religion
          'GAMEOPTION_PICK_RELIGION',
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

    await this.removeInfoItems(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      'BuildingInfo CivicOption',
      removedCivicOptions
    );

    const removedCivics = await this.removeInfoItems(
      'Assets/XML/GameInfo/CIV4CivicInfos.xml',
      'CivicInfo CivicOptionType',
      removedCivicOptions
    );

    await this.updateInfoItems(
      'Assets/XML/Civilizations/CIV4CivilizationInfos.xml',
      'CivilizationInfo InitialCivics CivicType',
      removedCivics,
      'NONE'
    );

    await this.updateInfoItems(
      'Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml',
      'LeaderHeadInfo FavoriteCivic',
      removedCivics,
      'NONE'
    );

    await this.removeInfoItems(
      'Assets/XML/Events/CIV4EventTriggerInfos.xml',
      'EventTriggerInfo Civic',
      removedCivics
    );

    await this.removeInfoItems(
      'Assets/XML/GameInfo/CIV4VoteInfo.xml',
      'VoteInfo ForceCivics ForceCivic CivicType',
      removedCivics
    );

    console.log();
  };

  private removeCorporations = async () => {
    console.log('Removing corporations ...');

    const removedCorporations = await this.removeInfoItems(
      'Assets/XML/GameInfo/CIV4CorporationInfo.xml',
      'CorporationInfo'
    );

    await this.removeInfoItems(
      'Assets/XML/Units/CIV4UnitInfos.xml',
      'UnitInfo CorporationSpreads CorporationSpread CorporationType',
      removedCorporations
    );

    const removedBuildings = await this.removeInfoItems(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      'BuildingInfo FoundsCorporation',
      removedCorporations
    );

    await this.removeInfoItemChild(
      'Assets/XML/Units/CIV4UnitInfos.xml',
      'UnitInfo Buildings Building',
      'Building BuildingType',
      removedBuildings
    );

    // TODO: Remove advisor button from UI

    console.log();
  };

  private removeReligions = async () => {
    console.log('Removing religions ...');

    const removedReligions = await this.removeInfoItems(
      'Assets/XML/GameInfo/CIV4ReligionInfo.xml',
      'ReligionInfo'
    );

    await this.updateInfoItems(
      'Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml',
      'LeaderHeadInfo FavoriteReligion',
      removedReligions,
      'NONE'
    );

    await this.removeInfoItems(
      'Assets/XML/Units/CIV4UnitInfos.xml',
      'UnitInfo PrereqReligion',
      removedReligions
    );

    const removedBuildings = await this.removeInfoItems(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      'BuildingInfo ReligionType',
      removedReligions
    );

    await this.removeInfoItems(
      'Assets/XML/Units/CIV4UnitInfos.xml',
      'UnitInfo Buildings Building BuildingType',
      removedBuildings
    );

    await this.removeInfoItems(
      'Assets/XML/Events/CIV4EventTriggerInfos.xml',
      'EventTriggerInfo ReligionsRequired ReligionType',
      removedReligions
    );

    // TODO: Remove advisor button from UI

    console.log();
  };

  private modEspionage = async () => {
    console.log('Modding espionage ...');

    // Remove espionage points given by buildings
    await this.removeInfoItemChild(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      'BuildingInfo CommerceChanges iCommerce:nth-child(4)'
    );

    // Remove espionage percentage given by buildings
    await this.removeInfoItemChild(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      'BuildingInfo CommerceModifiers iCommerce:nth-child(4)'
    );

    // Remove espionage-specific buildings
    // TODO: How to do this in mods? Remove buildings where FLAVOR_ESPIONAGE == 10?
    await this.removeInfoItems(
      'Assets/XML/Buildings/CIV4BuildingInfos.xml',
      'BuildingInfo Type',
      [
        'BUILDING_INTELLIGENCE_AGENCY',
        // Security bureau
        'BUILDING_NATIONAL_SECURITY',
        'BUILDING_SCOTLAND_YARD',
      ]
    );

    // Remove espionage units
    await this.removeInfoItems(
      'Assets/XML/Units/CIV4UnitInfos.xml',
      'UnitInfo Flavors Flavor FlavorType',
      ['FLAVOR_ESPIONAGE']
    );

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
            // Planetfall
            'CIVICOPTION_POLITICS',
          ].includes(civicOption)
      );

    return await this.removeInfoItems(
      configurationFile,
      'CivicOptionInfo Type',
      civicOptionsToRemove
    );
  };

  /**
   * Remove Info elements from a Civ 4 Info XML configuration file
   *
   * @param assetPath The partial path of the file to modify, starting with "Assets/"
   * @param selectors CSS selectors to the XML elements to match on, or just the info
   *                  element if valuesToMatch isn't provided. **NOTE** that the first
   *                  part of the selectors should contain the info element tag (e.g.
   *                  "CivilizationInfo").
   * @param matchValues Values of the element to match on
   * @returns List of the Type values of the removed items
   */
  private removeInfoItems = async (
    assetPath: string,
    selectors: string,
    matchValues?: string[]
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    // Get the tag of the info items to go through from the selectors
    const infoItemTag = selectors.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `Selectors does not start with a tag that ends with "Info": ${selectors}`
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

      if (matchValues) {
        // Within those, apply the query selectors to match an element inside
        for (const elementToMatch of infoElement.querySelectorAll(selectors)) {
          if (matchValues.includes(elementToMatch.textContent || '')) {
            matched = true;
            break;
          }
        }
      }

      if (matched || !matchValues) {
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
   * @param removeSelectors CSS selectors to the XML elements to remove. **NOTE** that the
   *                        first part of the selectors must contain the info element tag
   *                        (e.g. "CivilizationInfo").
   * @param matchSelectors CSS selectors to the XML elements to match on
   * @param matchValues Values of the element to match on
   * @returns List of the Type values of the updated items
   */
  private removeInfoItemChild = async (
    assetPath: string,
    removeSelectors: string,
    matchSelectors?: string,
    matchValues?: string[]
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    // Get the tag of the info items to go through from the selectors
    const infoItemTag = removeSelectors.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `Selectors does not start with a tag that ends with "Info": ${removeSelectors}`
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
      const infoItemType =
        infoElement.getElementsByTagName('Type')[0].textContent;
      if (!infoItemType) {
        throw new Error(
          `Element ${ModPatcher.formatInfoTag(infoItemTag)} has no 'Type': ${
            infoElement.outerHTML
          }`
        );
      }

      // Track whether the info element has been updated, since it may receive multiple updates
      let infoItemUpdated = false;

      for (const elementToRemove of infoElement.querySelectorAll(
        removeSelectors
      )) {
        let childElementMatched = false;

        if (matchSelectors && matchValues) {
          for (const elementToMatch of elementToRemove.querySelectorAll(
            matchSelectors
          )) {
            if (
              elementToMatch.textContent &&
              matchValues.includes(elementToMatch.textContent)
            ) {
              childElementMatched = true;
              break;
            }
          }
        }

        if (childElementMatched || !matchSelectors || !matchValues) {
          infoItemUpdated = true;
          elementToRemove.parentElement?.removeChild(elementToRemove);
        }
      }

      if (infoItemUpdated) {
        updatedInfoItems.push(infoItemType);
        console.log(
          `Updated ${ModPatcher.formatInfoTag(
            infoItemTag
          )} ${ModPatcher.formatElementType(infoItemType)}`
        );
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
   * @param selectors CSS selectors to the XML elements to match on. **NOTE** that the first
   *                  part of the selectors should contain the info element tag (e.g.
   *                  "CivilizationInfo").
   * @param matchValues Values of the element to match on
   * @param newValue New value
   * @returns List of the Type values of the updated items
   */
  private updateInfoItems = async (
    assetPath: string,
    selectors: string,
    matchValues: string[],
    newValue: string
  ): Promise<string[]> => {
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    // Get the tag of the info items to go through from the selectors
    const infoItemTag = selectors.split(' ')[0];
    if (!infoItemTag.endsWith('Info')) {
      throw new Error(
        `Selectors does not start with a tag that ends with "Info": ${selectors}`
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

      // Within those, apply the query selector to match an element inside
      for (const elementToMatch of infoElement.querySelectorAll(selectors)) {
        if (matchValues.includes(elementToMatch.textContent || '')) {
          updated = true;

          elementToMatch.textContent = newValue;
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
    if (!assetPath.startsWith('Assets/')) {
      throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
    }

    const modFilePath = path.join(this.modPath, assetPath);

    // First, see if the file already exists
    if (await ModPatcher.doesFileExist(modFilePath)) {
      return modFilePath;
    }

    // If not, and the file exists in BtS, copy it to the mod
    if (await ModPatcher.doesFileExist(path.join(this.btsPath, assetPath))) {
      await ModPatcher.copyFile(
        path.join(this.btsPath, assetPath),
        modFilePath
      );
      return modFilePath;
    }

    // If not, and the file exists in the base game directory, copy it to the mod
    if (await ModPatcher.doesFileExist(path.join(this.gamePath, assetPath))) {
      await ModPatcher.copyFile(
        path.join(this.gamePath, assetPath),
        modFilePath
      );
      return modFilePath;
    }

    throw new Error(`File to mod not found in game directory: ${assetPath}`);
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
}
