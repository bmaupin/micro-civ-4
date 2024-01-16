// To run: npx tsx src/install.ts

import fs from 'node:fs/promises';
import path from 'node:path';

import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM('');
const DOMParser = dom.window.DOMParser;

// import { DOMParser as UpstreamDOMParser, XMLSerializer } from '@xmldom/xmldom';

// Change this as needed
const gamePath = path.join(
  process.env.HOME ?? '',
  "/.steam/steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword"
);

const btsDirectory = 'Beyond the Sword';
const modName = 'Micro Civ 4';
const modsDirectory = 'Mods';

const btsPath = path.join(gamePath, btsDirectory);
const modPath = path.join(btsPath, modsDirectory, modName);

const main = async () => {
  // Start with a clean slate every time
  await uninstallMod();
  // await modMapSizes();
  // await modGameOptions();
  await modCivics();
  // await removeReligion();
  // await removeEspionage();
  // await removeCorporations();
};

const uninstallMod = async () => {
  await fs.rm(modPath, {
    force: true,
    recursive: true,
  });
};

const modMapSizes = async () => {
  console.log('Modding map sizes ...');

  const worldInfoFile = 'Assets/XML/GameInfo/CIV4WorldInfo.xml';
  const modFilePath = await prepModFile(worldInfoFile);

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

  // TODO: we'll need to add back the XML tag since jsdom doesn't add it
  // Replace normal newlines with Windows newlines; this probably isn't necessary but
  // makes diffing easier since the original files have Windows newlines
  await fs.writeFile(
    modFilePath,
    doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
  );

  console.log();
};

const modGameOptions = async () => {
  console.log('Modding game options ...');

  const gameOptionsFile = 'Assets/XML/GameInfo/CIV4GameOptionInfos.xml';
  const modFilePath = await prepModFile(gameOptionsFile);

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
        'GAMEOPTION_NO_CITY_RAZING',
        'GAMEOPTION_NO_VASSAL_STATES',
        'GAMEOPTION_NO_ESPIONAGE',
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

const modCivics = async () => {
  console.log('Removing non-governmental civics ...');

  const removedCivicOptions = await removeCivicOptions();
  console.log('Removed civic options:', removedCivicOptions);

  const removedBuildings = await removeInfoItems(
    'Assets/XML/Buildings/CIV4BuildingInfos.xml',
    'BuildingInfo CivicOption',
    removedCivicOptions
  );

  const removedCivics = await removeInfoItems(
    'Assets/XML/GameInfo/CIV4CivicInfos.xml',
    'CivicInfo CivicOptionType',
    removedCivicOptions
  );

  const updatedCivilizations = await updateCivilizations(
    'InitialCivics',
    'CivicType',
    removedCivics,
    'NONE'
  );

  await updateInfoItem(
    'Assets/XML/Civilizations/CIV4LeaderHeadInfos.xml',
    'LeaderHeadInfo',
    'FavoriteCivic',
    removedCivics,
    'NONE'
  );

  await removeInfoItems(
    'Assets/XML/Events/CIV4EventTriggerInfos.xml',
    'EventTriggerInfo Civic',
    removedCivics
  );

  await removeInfoItems(
    'Assets/XML/GameInfo/CIV4VoteInfo.xml',
    'VoteInfo ForceCivics ForceCivic CivicType',
    removedCivics
  );

  console.log();
};

/**
 * Remove non-governmental civic options
 *
 * @returns The list of removed civic options
 */
const removeCivicOptions = async (): Promise<string[]> => {
  const removedCivicOptions = [] as string[];

  const configurationFile = 'Assets/XML/GameInfo/CIV4CivicOptionInfos.xml';
  const modFilePath = await prepModFile(configurationFile);

  const doc = new DOMParser().parseFromString(
    (await fs.readFile(modFilePath)).toString(),
    'text/xml'
  );

  const civicOptionInfos = doc.getElementsByTagName('CivicOptionInfos')[0];
  Array.prototype.forEach.call(
    civicOptionInfos.getElementsByTagName('CivicOptionInfo'),
    (civicOptionInfo: Element) => {
      const typeElement = civicOptionInfo.getElementsByTagName('Type')[0];
      if (
        typeElement.childNodes[0].textContent &&
        ![
          'CIVICOPTION_GOVERNMENT',
          // Planetfall
          'CIVICOPTION_POLITICS',
        ].includes(typeElement.childNodes[0].textContent)
      ) {
        removedCivicOptions.push(typeElement.childNodes[0].textContent);
        civicOptionInfos.removeChild(civicOptionInfo);
      }
    }
  );

  await fs.writeFile(
    modFilePath,
    doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
  );

  return removedCivicOptions;
};

/**
 * Remove matching Info elements with the given values from a Civ 4 Info XML configuration
 * file
 *
 * @param assetPath The partial path of the file to modify, starting with "Assets/"
 * @param selectors CSS selectors to the XML elements to match on. **NOTE** that the first
 *                  part of the selectors should contain the info element tag (e.g.
 *                  "CivilizationInfo").
 * @param valuesToMatch Values of the element to match on
 * @returns List of the Type values of the removed items
 */
const removeInfoItems = async (
  assetPath: string,
  selectors: string,
  valuesToMatch: string[]
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

  const modFileFullPath = await prepModFile(assetPath);
  const doc = new DOMParser().parseFromString(
    (await fs.readFile(modFileFullPath)).toString(),
    'text/xml'
  );

  const removedInfoItems = [] as string[];

  // Go through all the info elements
  for (const infoElement of doc.querySelectorAll(infoItemTag)) {
    // Within those, apply the query selector to match an element inside
    for (const elementToMatch of infoElement.querySelectorAll(selectors)) {
      const infoItemType =
        infoElement.getElementsByTagName('Type')[0].textContent;
      if (infoItemType) {
        if (valuesToMatch.includes(elementToMatch.textContent || '')) {
          console.log(
            `Removed ${formatInfoTag(infoItemTag)} ${formatElementType(
              infoItemType
            )}`
          );
          removedInfoItems.push(infoItemType);
          // Remove the matching info element
          infoElement.parentElement?.removeChild(infoElement);
        }
      } else {
        throw new Error(
          `Element ${formatInfoTag(infoItemTag)} has no 'Type': ${
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

const updateCivilizations = async (
  parentTag: string,
  tagTomatch: string,
  valuesTomatch: string[],
  newValue: string
): Promise<string[]> => {
  return await updateNestedInfoItem(
    'Assets/XML/Civilizations/CIV4CivilizationInfos.xml',
    'CivilizationInfo',
    parentTag,
    tagTomatch,
    valuesTomatch,
    newValue
  );
};

const updateInfoItem = async (
  assetPath: string,
  infoTag: string,
  tagToMatch: string,
  valuesToMatch: string[],
  newValue: string
): Promise<string[]> => {
  if (!assetPath.startsWith('Assets/')) {
    throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
  }

  const updatedInfoItems = [] as string[];

  const modFileFullPath = await prepModFile(assetPath);
  const doc = new DOMParser().parseFromString(
    (await fs.readFile(modFileFullPath)).toString(),
    'text/xml'
  );

  const infosElement = doc.getElementsByTagName(`${infoTag}s`)[0];
  Array.prototype.forEach.call(
    infosElement.getElementsByTagName(infoTag),
    (infoElement: Element) => {
      const elementToMatch = infoElement.getElementsByTagName(tagToMatch)[0];
      if (
        elementToMatch.childNodes[0].textContent &&
        valuesToMatch.includes(elementToMatch.childNodes[0].textContent)
      ) {
        const elementType =
          infoElement.getElementsByTagName('Type')[0].childNodes[0].textContent;
        if (elementType) {
          updatedInfoItems.push(elementType);
          console.log(
            `Updated ${formatInfoTag(infoTag)} ${formatElementType(
              elementType
            )}`
          );
        } else {
          throw new Error(
            `Element ${formatInfoTag(
              infoTag
            )} has no 'Type': ${infoElement.toString()}`
          );
        }
        elementToMatch.childNodes[0].textContent = newValue;
      }
    }
  );

  await fs.writeFile(
    modFileFullPath,
    doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
  );

  return updatedInfoItems;
};

const updateNestedInfoItem = async (
  assetPath: string,
  infoTag: string,
  parentTag: string,
  tagToMatch: string,
  valuesToMatch: string[],
  newValue: string
): Promise<string[]> => {
  if (!assetPath.startsWith('Assets/')) {
    throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
  }

  const updatedInfoItems = [] as string[];

  const modFileFullPath = await prepModFile(assetPath);
  const doc = new DOMParser().parseFromString(
    (await fs.readFile(modFileFullPath)).toString(),
    'text/xml'
  );

  const infosElement = doc.getElementsByTagName(`${infoTag}s`)[0];
  Array.prototype.forEach.call(
    infosElement.getElementsByTagName(infoTag),
    (infoElement: Element) => {
      let updated = false;
      const childElement = infoElement.getElementsByTagName(parentTag)[0];

      Array.prototype.forEach.call(
        childElement.getElementsByTagName(tagToMatch),
        (elementToMatch: Element) => {
          if (
            elementToMatch.childNodes[0].textContent &&
            valuesToMatch.includes(elementToMatch.childNodes[0].textContent)
          ) {
            updated = true;
            elementToMatch.childNodes[0].textContent = newValue;
          }
        }
      );

      if (updated) {
        const elementType =
          infoElement.getElementsByTagName('Type')[0].childNodes[0].textContent;
        if (elementType) {
          updatedInfoItems.push(elementType);
          console.log(
            `Updated ${formatInfoTag(infoTag)} ${formatElementType(
              elementType
            )}`
          );
        } else {
          throw new Error(
            `Element ${formatInfoTag(
              infoTag
            )} has no 'Type': ${infoElement.toString()}`
          );
        }
      }
    }
  );

  await fs.writeFile(
    modFileFullPath,
    doc.documentElement.outerHTML.replaceAll('\n', '\r\n')
  );

  return updatedInfoItems;
};

const formatInfoTag = (infoTag: string) => {
  return infoTag.slice(0, -4);
};

const formatElementType = (elementType: string) => {
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
const prepModFile = async (assetPath: string): Promise<string> => {
  if (!assetPath.startsWith('Assets/')) {
    throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
  }

  const modFilePath = path.join(modPath, assetPath);

  // First, see if the file already exists
  if (await doesFileExist(modFilePath)) {
    return modFilePath;
  }

  // If not, and the file exists in BtS, copy it to the mod
  if (await doesFileExist(path.join(btsPath, assetPath))) {
    await copyFile(path.join(btsPath, assetPath), modFilePath);
    return modFilePath;
  }

  // If not, and the file exists in the base game directory, copy it to the mod
  if (await doesFileExist(path.join(gamePath, assetPath))) {
    await copyFile(path.join(gamePath, assetPath), modFilePath);
    return modFilePath;
  }

  throw new Error(`File to mod not found in game directory:  ${assetPath}`);
};

const doesFileExist = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const copyFile = async (sourcePath: string, destPath: string) => {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.copyFile(sourcePath, destPath);
};

main().then(() => {});
