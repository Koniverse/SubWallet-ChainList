import {readJSONFile, writeJSONFile} from "../strapi/strapi-api.mjs";
import { DEV_LOGO_PREFIX, md5HashChainAsset, md5HashChainInfo, PATCH_SAVE_DEV, PATCH_SAVE_DIR, PATCH_VERSION, STABLE_VERSION } from './patch-api.mjs';
import fs from "fs";
const CHAIN_PATH = './packages/chain-list/src/data/ChainInfo.json';
const ASSET_PATH = './packages/chain-list/src/data/ChainAsset.json';
const STABLE_SOURCE = `https://raw.githubusercontent.com/Koniverse/SubWallet-Chain/v${STABLE_VERSION}/packages/chain-list/src/data`;


const main = async () => {
  function getNewTimeoutPromise () {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout when fetching stable chain map'));
      }, 10000);
    });
  }

  // 1. init
  const patchInfo = {
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

  if (!fs.existsSync(PATCH_SAVE_DIR)) {
    fs.mkdirSync(PATCH_SAVE_DIR);
  }

  // 2. chain
  const fetchOldChainMapPromise = fetch(`${STABLE_SOURCE}/ChainInfo.json`, {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then(res => res.json());
  const oldChainMap = await Promise.race([fetchOldChainMapPromise, getNewTimeoutPromise()]).catch(console.error);
  const newChainMap = await readJSONFile(CHAIN_PATH);
  const patchChainMap = {};
  const patchChainHashMap = {};
  const patchChainLogoMap = {};

  const addPatchChain = (chainInfo, isOld = false) => {
    if (isOld) {
      chainInfo.chainStatus = "INACTIVE";
    }

    const icon = chainInfo.icon;
    patchChainMap[chainInfo.slug] = { ...chainInfo, icon };
    patchChainLogoMap[chainInfo.slug] = icon;
    patchChainHashMap[chainInfo.slug] = md5HashChainInfo(chainInfo);
  }

  for (const newChainInfo of Object.values(newChainMap)) {
    if (!oldChainMap[newChainInfo.slug]) {
      addPatchChain(newChainInfo);
      continue;
    }

    const { icon: newChainIcon, providers: newChainProviders, ...newChainWithoutLogo } = newChainInfo;
    const { icon: oldChainIcon, providers: oldChainProviders,...oldChainWithoutLogo } = oldChainMap[newChainInfo.slug];
    if (JSON.stringify(newChainWithoutLogo) !== JSON.stringify(oldChainWithoutLogo)) {
      addPatchChain(newChainInfo);
    }
  }

  const deletedChain = Object.keys(oldChainMap).filter((chain) => !Object.keys(newChainMap).includes(chain));
  if (deletedChain.length) {
    deletedChain.forEach((slug) => {
      addPatchChain(oldChainMap[slug], true);
    });
  }

  // 3. asset
  const fetchOldAssetMapPromise = fetch(`${STABLE_SOURCE}/ChainAsset.json`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(res => res.json());
  const fetchOldMultiChainAssetMapPromise = fetch(`${STABLE_SOURCE}/MultiChainAsset.json`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(res => res.json());
  const oldAssetMap = await Promise.race([fetchOldAssetMapPromise, getNewTimeoutPromise()]).catch(console.error);
  const oldMultiChainAssetMap = await Promise.race([fetchOldMultiChainAssetMapPromise, getNewTimeoutPromise()]).catch(console.error);
  const newAssetMap = await readJSONFile(ASSET_PATH);
  const patchAssetMap = {};
  const patchAssetHashMap = {};
  const patchAssetLogoMap = {};

  const addPatchAsset = (assetInfo) => {
    const icon = assetInfo.icon;
    const altAsset = Object.assign(normalizeAsset(assetInfo), { icon });
    patchAssetMap[assetInfo.slug] = altAsset;
    patchAssetLogoMap[assetInfo.slug.toLowerCase()] = icon;
    patchAssetHashMap[assetInfo.slug] = md5HashChainAsset(altAsset);
  }

  const normalizeAsset = (assetInfo) => {
    const { icon, ...rest } = assetInfo;
    const needRemoveMultichainAsset = assetInfo.multiChainAsset
      ? !oldMultiChainAssetMap[assetInfo.multiChainAsset]
      : false;

    return {
      ...rest,
      multiChainAsset: needRemoveMultichainAsset ? null : assetInfo.multiChainAsset
    }
  }

  for (const assetInfo of Object.values(newAssetMap)) {
    if (!oldAssetMap[assetInfo.slug]) {
      addPatchAsset(assetInfo);
      continue;
    }

    const newAssetWithoutLogo = normalizeAsset(assetInfo);
    const oldAssetWithoutLogo = normalizeAsset(oldAssetMap[assetInfo.slug]);
    if (JSON.stringify(newAssetWithoutLogo) !== JSON.stringify(oldAssetWithoutLogo)) {
      addPatchAsset(assetInfo);
    }
  }

  // 3. save to file
  patchInfo.ChainInfo = patchChainMap;
  patchInfo.ChainInfoHashMap = patchChainHashMap;
  patchInfo.ChainLogoMap = patchChainLogoMap;
  patchInfo.ChainAsset = patchAssetMap;
  patchInfo.ChainAssetHashMap = patchAssetHashMap;
  patchInfo.AssetLogoMap = patchAssetLogoMap;

  await writeJSONFile(PATCH_SAVE_DEV, patchInfo);
}

main().catch((error) => console.error(error));
