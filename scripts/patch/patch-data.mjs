import { md5Hash, PATCH_SAVE_PATH, readJSONFile, STABLE_VERSION, writeChainAssetChange, writeChainInfoChange } from "../strapi/strapi-api.mjs";
const CHAIN_PATH = './packages/chain-list/src/data/ChainInfo.json';
const ASSET_PATH = './packages/chain-list/src/data/ChainAsset.json';
const STABLE_SOURCE = `https://raw.githubusercontent.com/Koniverse/SubWallet-Chain/v${STABLE_VERSION}/packages/chain-list/src/data`


const main = async () => {
  function getNewTimeoutPromise () {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout when fetching stable chain map'));
      }, 10000);
    });
  }

  // 1.1. init chainMap
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
    const { chainStatus, icon, providers, ...chainBaseInfo } = chainInfo;

    if (isOld) {
      chainInfo.chainStatus = "INACTIVE";
    }

    patchChainMap[chainInfo.slug] = chainInfo;
    patchChainLogoMap[chainInfo.slug] = chainInfo.icon;
    patchChainHashMap[chainInfo.slug] = md5Hash(chainBaseInfo);
  }

  for (const newChainInfo of Object.values(newChainMap)) {
    // 1.2. add chain
    if (!oldChainMap[newChainInfo.slug]) {
      addPatchChain(newChainInfo);
      continue;
    }

    // 1.3. edit chain
    const { icon: newChainIcon, ...newChainWithoutLogo } = newChainInfo;
    const { icon: oldChainIcon, ...oldChainWithoutLogo } = oldChainMap[newChainInfo.slug];
    if (JSON.stringify(newChainWithoutLogo) !== JSON.stringify(oldChainWithoutLogo)) {
      addPatchChain(newChainInfo);
    }
  }

  // 1.4. delete chain
  const deletedChain = Object.keys(oldChainMap).filter((chain) => !Object.keys(newChainMap).includes(chain));
  if (deletedChain.length) {
    deletedChain.forEach((slug) => {
      addPatchChain(oldChainMap[slug], true);
    });
  }

  // 2.1. init assetMap
  const fetchOldAssetMapPromise = fetch(`${STABLE_SOURCE}/ChainAsset.json`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(res => res.json());
  const oldAssetMap = await Promise.race([fetchOldAssetMapPromise, getNewTimeoutPromise()]).catch(console.error);
  const newAssetMap = await readJSONFile(ASSET_PATH);
  const patchAssetMap = {};
  const patchAssetHashMap = {};
  const patchAssetLogoMap = {};

  const addPatchAsset = (assetInfo) => {
    const { icon, ...assetBaseInfo } = assetInfo;

    patchAssetMap[assetInfo.slug] = assetInfo;
    patchAssetLogoMap[assetInfo.slug.toLowerCase()] = assetInfo.icon;
    patchAssetHashMap[assetInfo.slug] = md5Hash(assetBaseInfo);
  }

  for (const assetInfo of Object.values(newAssetMap)) {
    // 2.2. add asset
    if (!oldAssetMap[assetInfo.slug]) {
      addPatchAsset(assetInfo);
      continue;
    }

    // 2.3 edit asset
    const { icon: newAssetIcon, ...newAssetWithoutLogo } = assetInfo;
    const { icon: oldAssetIcon, ...oldAssetWithoutLogo } = oldAssetMap[assetInfo.slug];
    if (JSON.stringify(newAssetWithoutLogo) !== JSON.stringify(oldAssetWithoutLogo)) {
      addPatchAsset(assetInfo);
    }
  }

  // 3. save to file
  await writeChainInfoChange(PATCH_SAVE_PATH, patchChainMap, patchChainHashMap, patchChainLogoMap);
  await writeChainAssetChange(PATCH_SAVE_PATH, patchAssetMap, patchAssetHashMap, patchAssetLogoMap);
}

main().catch((error) => console.error(error));
