import BigN from "bignumber.js";

import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert {type: "json"};
import ChainInfoMap from '../../packages/chain-list/src/data/ChainInfo.json' assert {type: "json"};

import fs from "fs";

const convertChainAsset = (chainAsset) => ({
  slug: chainAsset.slug,
  network: ChainInfoMap[chainAsset.originChain].name,
  name: chainAsset.name,
  symbol: chainAsset.symbol,
  type: chainAsset.assetType
})

const evmChains = Object.values(ChainInfoMap)
  .filter((chainInfo) => {
    return !!chainInfo.evmInfo
  })
  .map((chainInfo) => chainInfo.slug)

const availableAssets = []
const unavailableAssets = []
const availableFile = 'exports/export-evm-ledger-support-token.csv'
const unavailableFile = 'exports/export-evm-ledger-not-support-token.csv'

Object.values(ChainAssetMap)
  .filter((chainAsset) => {
    return evmChains.includes(chainAsset.originChain);
  })
  .forEach((chainAsset) => {
    if (['NATIVE', 'ERC20', 'ERC721'].includes(chainAsset.assetType) || chainAsset.metadata?.contractAddress) {
      availableAssets.push(convertChainAsset(chainAsset))
    } else {
      unavailableAssets.push(convertChainAsset(chainAsset))
    }
  })

console.log(`Parsed available ${availableAssets.length} assets`);
console.log(`Parsed unavailable ${unavailableAssets.length} assets`);

const writeFile = (data, fileName) => {
  try {
    const rows = [];
    const headers = ['Slug', 'Network', 'Token', 'Symbol', 'Type'];

    rows.push(headers.join(','));


    for (const asset of data) {
      const data = [asset.slug, asset.network, asset.name, asset.symbol, asset.type];

      rows.push(data.map((value) => JSON.stringify(value)).join(','));
    }


    fs.mkdirSync('exports', {recursive: true});
    fs.writeFile(fileName, rows.join('\n'), function (err) {
      if (err) throw err;
      console.log(`Saved ${fileName} successfully`);
    });
  } catch (err) {
    console.error(err);
  }
}

writeFile(availableAssets, availableFile)
writeFile(unavailableAssets, unavailableFile)
