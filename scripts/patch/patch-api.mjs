import crypto from "crypto";

export const DEV_LOGO_PREFIX = "https://dev.sw-chain-list-assets.pages.dev";
export const PRODUCT_LOGO_PREFIX = "https://chain-list-assets.subwallet.app";
export const STABLE_VERSION = '0.2.95';
export const PATCH_VERSION = '0.2.96-beta.0';
export const PATCH_SAVE_DIR =  `./packages/chain-list-assets/public/patch/${STABLE_VERSION}`;
export const PATCH_SAVE_DEV = `${PATCH_SAVE_DIR}/preview.json`;
export const PATCH_SAVE_STABLE = `${PATCH_SAVE_DIR}/list.json`;

export function md5HashJson (data) {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}
