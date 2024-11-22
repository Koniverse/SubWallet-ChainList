import {PATCH_SAVE_PATH, PATCH_VERSION, STABLE_VERSION, writeJSONFile} from "./strapi-api.mjs";
import * as fs from "fs";

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

  const dir = PATCH_SAVE_PATH.replace('/data.json', '');

  // todo: check update data patch beta

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  await writeJSONFile(PATCH_SAVE_PATH, patch);
}

main().catch((error) => console.error(error));
