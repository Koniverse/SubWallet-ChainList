import { PATCH_SAVE_PATH, readJSONFile, STABLE_VERSION, writeChainAssetChange, writeChainInfoChange } from "../strapi/strapi-api.mjs";
import crypto from "crypto";
const CHAIN_PATH = './packages/chain-list/src/data/ChainInfo.json';
const ASSET_PATH = './packages/chain-list/src/data/ChainAsset.json';
const STABLE_SOURCE = `https://raw.githubusercontent.com/Koniverse/SubWallet-Chain/v${STABLE_VERSION}/packages/chain-list/src/data`


const main = async () => {
  // 1.1. init chainMap
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout when fetching stable chain map'));
    }, 5000);
  });

  const fetchOldChainMap = fetch(`${STABLE_SOURCE}/ChainInfo.json`, {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then(res => res.json());

  const oldChainMap = await Promise.race([fetchOldChainMap, timeoutPromise]).catch(console.error);
  const newChainMap = await readJSONFile(CHAIN_PATH);
  const patchChainMap = {};
  const patchChainHashMap = {};
  const patchChainLogoMap = {};

  // 1.2. add, edit chain
  for (const chainInfo of Object.values(newChainMap)) {
    if (!oldChainMap[chainInfo.slug] || JSON.stringify(chainInfo) !== JSON.stringify(oldChainMap[chainInfo.slug])) {
      patchChainMap[chainInfo.slug] = chainInfo;
      patchChainLogoMap[chainInfo.slug] = chainInfo.icon;

      const { providers, chainStatus, ...chainWithoutProvidersAndStatus } = chainInfo;

      patchChainHashMap[chainInfo.slug] = crypto.createHash('md5').update(JSON.stringify(chainWithoutProvidersAndStatus)).digest('hex');
    }
  }

  // 1.3. delete chain
  const deletedChain = Object.keys(oldChainMap).filter((chain) => !Object.keys(newChainMap).includes(chain));
  if (deletedChain.length) {
    deletedChain.forEach((chainSlug) => {
      const chainInfo = oldChainMap[chainSlug];
      chainInfo.chainStatus = "INACTIVE";
      patchChainMap[chainSlug] = chainInfo;
      patchChainLogoMap[chainInfo.slug] = chainInfo.icon;

      const { providers, chainStatus, ...chainWithoutProvidersAndStatus } = chainInfo;

      patchChainHashMap[chainSlug] = crypto.createHash('md5').update(JSON.stringify(chainWithoutProvidersAndStatus)).digest('hex');
    })
  }

  // 2.1. init assetMap
  const fetchOldAssetMap = fetch(`${STABLE_SOURCE}/ChainAsset.json`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(res => res.json());

  const oldAssetMap = await Promise.race([fetchOldAssetMap, timeoutPromise]).catch(console.error);
  const newAssetMap = await readJSONFile(ASSET_PATH);
  const patchAssetMap = {};
  const patchAssetHashMap = {};
  const patchAssetLogoMap = {};

  // 2.2. add, edit asset
  for (const assetInfo of Object.values(newAssetMap)) {
    if (!oldAssetMap[assetInfo.slug] || JSON.stringify(assetInfo) !== JSON.stringify(oldAssetMap[assetInfo.slug])) {
      patchAssetMap[assetInfo.slug] = assetInfo;
      patchAssetLogoMap[assetInfo.slug.toLowerCase()] = assetInfo.icon;
      patchAssetHashMap[assetInfo.slug] = crypto.createHash('md5').update(JSON.stringify(assetInfo)).digest('hex');
    }
  }

  // 3. save to file
  await writeChainInfoChange(PATCH_SAVE_PATH, patchChainMap, patchChainHashMap, patchChainLogoMap);
  await writeChainAssetChange(PATCH_SAVE_PATH, patchAssetMap, patchAssetHashMap, patchAssetLogoMap);
}

main().catch((error) => console.error(error));
