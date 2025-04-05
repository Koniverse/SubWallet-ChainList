import { Parser } from '@json2csv/plainjs';

import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };

function findAssetByGroup (multiAsset, hasPsSymbol) {
  if (hasPsSymbol) {
    return Object.values(ChainAssetMap).filter((asset) => asset.metadata?.psSymbol && asset.multiChainAsset === multiAsset).map((asset) => asset.slug);
  }

  return Object.values(ChainAssetMap).filter((asset) => !asset.metadata?.psSymbol && asset.multiChainAsset === multiAsset).map((asset) => asset.slug);
}

function findAllXcmAsset () {
  return Object.values(ChainAssetMap).filter((asset) => asset.metadata?.psSymbol).map((asset) => asset.slug);
}

function findAllGroupHasXcm () {
  const group = [];
  const allXcmAssets = findAllXcmAsset();

  for (const asset of allXcmAssets) {
    const assetInfo = ChainAssetMap[asset];
    const multichainAsset = assetInfo.multiChainAsset;

    if (multichainAsset && !group.includes(multichainAsset)) {
      group.push(multichainAsset);
    }
  }

  return group;
}

async function allParaSpellChains () {
  const response = await fetch('https://api.lightspell.xyz/nodes');

  return await response.json();
}

// console.log('Has PS Symbol', findAssetByGroup('ACA-Acala', true))
// console.log('Not Has PS Symbol', findAssetByGroup('ACA-Acala', false))
// console.log('All Assets XCM', findAllXcmAsset())
console.log('All Groups XCM', findAllGroupHasXcm())

for (const group of findAllGroupHasXcm()) {
  console.log('Not Has PS Symbol', findAssetByGroup(group, false))
}
