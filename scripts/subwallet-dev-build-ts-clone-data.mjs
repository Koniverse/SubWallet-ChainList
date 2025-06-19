import fs from 'fs';

const BRANCH_NAME = process.env.BRANCH_NAME || 'dev';
const DEV_LOGO_PREFIX = "https://dev.sw-chain-list-assets.pages.dev";
const PRODUCT_LOGO_PREFIX = "https://chain-list-assets.subwallet.app";
const BUILD_DIR = './packages/chain-list/build/data/';
const BUILD_CJS_DIR = './packages/chain-list/build/cjs/data/';
const dataFiles = [
  "AssetRef.json",
  "ChainAsset.json",
  "ChainInfo.json",
  "MultiChainAsset.json",
];

const mapFiles = [
  "AssetLogoMap.json",
  "ChainLogoMap.json",
];

const main = async () => {
  const logoUrlPrefix = BRANCH_NAME === 'master' ? PRODUCT_LOGO_PREFIX : DEV_LOGO_PREFIX;

  // Override logo prefix in data files
  for (const file of dataFiles) {
    const filePath = `${BUILD_DIR}${file}`;
    const migrationData = fs.readFileSync(filePath, 'utf-8').replaceAll('"icon": "', `"icon": "${logoUrlPrefix}` );

    fs.writeFileSync(filePath, migrationData);
  }

  // Override logo prefix in logo map files
  for (const file of mapFiles) {
    const filePath = `${BUILD_DIR}${file}`;
    const migrationData = fs.readFileSync(filePath, 'utf-8').replaceAll('": "', `": "${logoUrlPrefix}` );

    fs.writeFileSync(filePath, migrationData);
  }

  fs.mkdirSync(BUILD_CJS_DIR);

  // Clone file from build dir to cjs build dir
  for (const dataFile of [dataFiles, mapFiles].flat()) {
    const sourcePath = `${BUILD_DIR}${dataFile}`;
    const destPath = `${BUILD_CJS_DIR}${dataFile}`;

    // Clone file from build dir to cjs build dir
    fs.copyFileSync(sourcePath, destPath);
  }
}

main().catch((error) => console.error(error));
