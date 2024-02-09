import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from 'vitest';

import { ModPatcher, defaultGamePath } from './ModPatcher';

test('modded files should match files in Assets', async () => {
  const modPatcher = new ModPatcher(defaultGamePath);
  await modPatcher.applyModPatches();

  const modFiles = await fs.readdir(modPatcher.modPath, {
    recursive: true,
    withFileTypes: true,
  });
  for (const modFile of modFiles) {
    if (modFile.isDirectory()) {
      continue;
    }

    const modFilePath = path.join(modFile.path, modFile.name);
    const relativeAssetFilePath = modFilePath.replace(
      `${modPatcher.modPath}/`,
      ''
    );
    const assetFilePath = path.resolve('src', relativeAssetFilePath);

    expect(String(await fs.readFile(modFilePath))).toEqual(
      String(await fs.readFile(assetFilePath))
    );
  }
}, 30000);
