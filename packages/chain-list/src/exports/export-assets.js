import { Parser } from '@json2csv/plainjs';

import ChainAssetMap from '../data/ChainAsset.json' assert { type: "json" };
import AssetRefMap from '../data/AssetRef.json' assert { type: "json" };

import fs from "fs";

const allAssets = [];

function getAssetRef (chainAsset) {
  let destChains = '';

  Object.values(AssetRefMap).forEach((assetRef) => {
    if (assetRef.srcAsset === chainAsset.slug) {
      if (destChains.length > 0) {
        destChains = destChains.concat(', ');
      }

      destChains = destChains.concat(assetRef.destChain);
    }
  });

  return destChains;
}

Object.values(ChainAssetMap).forEach((chainAsset) => {
  allAssets.push({
    slug: chainAsset.slug,
    name: chainAsset.name,
    symbol: chainAsset.symbol,
    originChain: chainAsset.originChain,
    type: chainAsset.assetType,
    priceId: chainAsset.priceId,
    hasValue: chainAsset.hasValue,
    xcmDestination: getAssetRef(chainAsset),
    multiChainAsset: chainAsset.multiChainAsset
  });
});

console.log(`Parsed ${allAssets.length} assets`);

try {
  const opts = {
    fields: ['name', 'symbol', 'originChain', 'type', 'priceId', 'multiChainAsset', 'xcmDestination', 'hasValue', 'slug'],
  };
  const parser = new Parser(opts);
  const csv = parser.parse(allAssets);

  let currentDate = new Date().toJSON().slice(0, 10);

  fs.writeFile(`data/supported-assets_${currentDate}.csv`, csv, function(err) {
    if (err) throw err;
    console.log('Written to file');
  });
} catch (err) {
  console.error(err);
}




