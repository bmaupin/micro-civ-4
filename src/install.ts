// To run: npx tsx src/install.ts

import { ModPatcher } from './ModPatcher';

const main = async () => {
  // TODO: add a command-line parameter for game path
  const modPatcher = new ModPatcher();
  await modPatcher.applyModPatches();
};

main().then(() => {});
