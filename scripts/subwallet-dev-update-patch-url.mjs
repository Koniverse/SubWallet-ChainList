import fs from 'fs';

const REF_NAME = process.env.REF_NAME || 'dev';
const REFORMAT_REF_NAME = REF_NAME.replaceAll('/', '-'); // For compatibility with old data
const DEV_LOGO_PREFIX = `https://${REFORMAT_REF_NAME}.sw-chain-list-assets.pages.dev`;
const PRODUCT_LOGO_PREFIX = "https://chain-list-assets.subwallet.app";
const SRC_DIR = './packages/chain-list-assets/public/patch';
const dataFiles = [
  "list.json",
  "preview.json",
];

const main = async () => {
  const logoUrlPrefix = REF_NAME === 'master' ? PRODUCT_LOGO_PREFIX : DEV_LOGO_PREFIX;

  /**
   * @const
   * @type {string[]}
   * */

  const patches = fs.readdirSync(SRC_DIR);

  for (const patch of patches) {
    for (const file of dataFiles) {
      const filePath = `${SRC_DIR}/${patch}/${file}`;

      if (fs.existsSync(filePath)) {
        const migrationData = fs.readFileSync(filePath, 'utf-8').replaceAll(': "/assets', `: "${logoUrlPrefix}/assets` );

        fs.writeFileSync(filePath, migrationData);
      }
    }
  }
}

main().catch((error) => console.error(error));
