// To run: npx tsx src/install.ts

import fs from 'node:fs/promises';
import path from 'node:path';

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
  await modMapSizes();
  // await modGameOptions();
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
  const worldInfoFile = 'Assets/XML/GameInfo/CIV4WorldInfo.xml';

  await prepGameFile(worldInfoFile);

  // TODO
};

/**
 * Make sure the asset file at the given path exists in the mod, otherwise copy it from
 * the game files.
 *
 * @param assetPath The path of the file to check, starting with "Assets/"
 * @returns
 */
const prepGameFile = async (assetPath: string): Promise<void> => {
  if (!assetPath.startsWith('Assets/')) {
    throw new Error(`Asset file does not start with "Assets/": ${assetPath}`);
  }

  // First, see if the file already exists
  if (await doesFileExist(path.join(modPath, assetPath))) {
    return;
  }

  // If not, and the file exists in BtS, copy it to the mod
  if (await doesFileExist(path.join(btsPath, assetPath))) {
    await copyFile(
      path.join(btsPath, assetPath),
      path.join(modPath, assetPath)
    );
    return;
  }

  // If not, and the file exists in the base game directory, copy it to the mod
  if (await doesFileExist(path.join(gamePath, assetPath))) {
    await copyFile(
      path.join(gamePath, assetPath),
      path.join(modPath, assetPath)
    );
    return;
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
