// To run: npx tsx src/install.ts

import { ModPatcher } from './ModPatcher';

const main = async () => {
  // TODO: add a command-line parameter for game path
  const modInstaller = new ModPatcher();

  // Start with a clean slate every time
  await modInstaller.uninstallMod();
  await modInstaller.modMapSizes();
  await modInstaller.modGameOptions();
  await modInstaller.modCivics();
  // await modInstaller.removeCorporations();
  // await modInstaller.removeReligion();
  // await modInstaller.removeEspionage();
};

main().then(() => {});
