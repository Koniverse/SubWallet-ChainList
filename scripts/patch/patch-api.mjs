import {Md5} from "ts-md5";

export const DEV_LOGO_PREFIX = "https://dev.sw-chain-list-assets.pages.dev";
export const PRODUCT_LOGO_PREFIX = "https://chain-list-assets.subwallet.app";
export const STABLE_VERSION = '0.2.104';
export const PATCH_VERSION = '0.2.105-beta.9';
export const PATCH_SAVE_DIR =  `./packages/chain-list-assets/public/patch/${STABLE_VERSION}`;
export const PATCH_SAVE_DEV = `${PATCH_SAVE_DIR}/preview.json`;
export const PATCH_SAVE_STABLE = `${PATCH_SAVE_DIR}/list.json`;

export function md5HashChainInfo (data) {
  const { chainStatus, icon, providers, ...chainBaseInfo } = data;

  return Md5.hashStr(JSON.stringify(chainBaseInfo));
}

export function md5HashChainAsset (data) {
  const { icon, ...assetBaseInfo } = data;

  return Md5.hashStr(JSON.stringify(assetBaseInfo));
}
