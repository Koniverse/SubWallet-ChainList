import fs from "fs";
import {writeJSONFile} from "../strapi/strapi-api.mjs";
import crypto from "crypto";

const DEV_LOGO_PREFIX = "https://dev.sw-chain-list-assets.pages.dev";
const PRODUCT_LOGO_PREFIX = "https://chain-list-assets.subwallet.app";

export async function writeChainInfoChange(filePath, changeMap, hashMap, chainLogoMap) {
  const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

  data.ChainInfo = changeMap;
  data.ChainInfoHashMap = hashMap;
  data.ChainLogoMap = chainLogoMap;
  await writeJSONFile(filePath, data);
}

export async function writeChainAssetChange(filePath, changeMap, hashMap, assetLogoMap) {
  const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

  data.ChainAsset = changeMap;
  data.ChainAssetHashMap = hashMap;
  data.AssetLogoMap = assetLogoMap;
  await writeJSONFile(filePath, data);
}

export const md5Hash = (data) => {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

export const getMigrateIcon = (icon) => {
  if (icon.startsWith(DEV_LOGO_PREFIX)) {
    return icon.replace(DEV_LOGO_PREFIX, PRODUCT_LOGO_PREFIX);
  }

  return icon;
}

export const STABLE_VERSION = '0.2.95';
export const PATCH_VERSION = '0.2.96-beta.0'
export const PATCH_SAVE_DIR =  `./packages/chain-list-assets/public/patch/${STABLE_VERSION}`
export const PATCH_SAVE_DEV = `${PATCH_SAVE_DIR}/preview.json`;
export const PATCH_SAVE_STABLE = `${PATCH_SAVE_DIR}/list.json`;
