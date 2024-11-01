import {PATCH_SAVE_PATH, PATCH_VERSION, STABLE_VERSION, writeJSONFile} from "./strapi-api.mjs";

const main = async () => {
  const patch = {
    patchVersion: PATCH_VERSION,
    appliedVersion: STABLE_VERSION,
    fetchedDate: Date.now(),
    ChainInfo: {},
    ChainInfoHashMap: {},
    ChainAsset: {},
    ChainAssetHashMap: {},
    MultiChainAsset: {},
    MultiChainAssetHashMap: {}
  }

  await writeJSONFile(PATCH_SAVE_PATH, patch);
}

main().catch((error) => console.error(error));
