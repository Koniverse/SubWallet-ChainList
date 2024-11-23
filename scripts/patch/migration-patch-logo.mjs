import {readJSONFile, writeJSONFile} from "../strapi/strapi-api.mjs";
import {getMigrateIcon, PATCH_SAVE_DEV, PATCH_SAVE_STABLE, writeChainAssetChange, writeChainInfoChange} from "./patch-api.mjs";

const main = async () => {
  const patchData = await readJSONFile(PATCH_SAVE_DEV);
  await writeJSONFile(PATCH_SAVE_STABLE, patchData); // init data
  const {ChainInfo, ChainInfoHashMap, ChainLogoMap, ChainAsset, ChainAssetHashMap, AssetLogoMap} = patchData;
  const newChainInfoMap = {};
  const newAssetInfoMap = {};
  const newChainLogoMap = {};
  const newAssetLogoMap = {};

  // chain
  for (const [slug, chainInfo] of Object.entries(ChainInfo)) {
    newChainInfoMap[slug] = {
      ...chainInfo,
      icon: getMigrateIcon(chainInfo.icon)
    }
  }

  for (const [slug, logo] of Object.entries(ChainLogoMap)) {
    newChainLogoMap[slug] = getMigrateIcon(logo);
  }

  // asset
  for (const [slug, assetInfo] of Object.entries(ChainAsset)) {
    newAssetInfoMap[slug] = {
      ...assetInfo,
      icon: getMigrateIcon(assetInfo.icon)
    }
  }

  for (const [slug, logo] of Object.entries(AssetLogoMap)) {
    newAssetLogoMap[slug] = getMigrateIcon(logo);
  }

  console.log('newChainLogoMap', newChainLogoMap);

  // save to file
  await writeChainInfoChange(PATCH_SAVE_STABLE, newChainInfoMap, ChainInfoHashMap, newChainLogoMap);
  await writeChainAssetChange(PATCH_SAVE_STABLE, newAssetInfoMap, ChainAssetHashMap, newAssetLogoMap);
}

main().catch((error) => console.error(error));
