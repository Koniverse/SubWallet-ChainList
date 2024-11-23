import {writeJSONFile} from "../strapi/strapi-api.mjs";
import * as fs from "fs";
import {PATCH_SAVE_DEV, PATCH_SAVE_DIR, PATCH_VERSION, STABLE_VERSION} from "./patch-api.mjs";

const main = async () => {
  const patch = {
    patchVersion: PATCH_VERSION,
    appliedVersion: STABLE_VERSION,
    timestamp: Date.now(),
    ChainInfo: {},
    ChainInfoHashMap: {},
    ChainAsset: {},
    ChainAssetHashMap: {},
    MultiChainAsset: {}, // currently not use
    MultiChainAssetHashMap: {},
    AssetLogoMap: {},
    ChainLogoMap: {},
    mAssetLogoMap: {}
  }

  const dir = PATCH_SAVE_DIR;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  await writeJSONFile(PATCH_SAVE_DEV, patch);
}

main().catch((error) => console.error(error));
