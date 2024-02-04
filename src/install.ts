// To run: npx tsx src/install.ts INSTALL_PATH
// - INSTALL_PATH can be the path to the Beyond the Sword directory or a mod.
//   It defaults to ~/.steam/steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword

import { ModPatcher } from './ModPatcher';

const main = async () => {
  let installPath = undefined;
  if (process.argv.length === 3) {
    installPath = process.argv[2];
  }

  const modPatcher = new ModPatcher(installPath);
  await modPatcher.applyModPatches();
};

main().then(() => {});
