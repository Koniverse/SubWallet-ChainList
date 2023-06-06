import BigN from "bignumber.js";

import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };
import ChainInfoMap from '../../packages/chain-list/src/data/ChainInfo.json' assert { type: "json" };

import fs from "fs";


const allAssets = [];


Object.values(ChainAssetMap)
  .filter((chainAsset) => {
    return !!chainAsset.minAmount;
  })
  .forEach((chainAsset) => {
    allAssets.push({
      slug: chainAsset.slug,
      symbol: chainAsset.symbol,
      name: chainAsset.name,
      network: ChainInfoMap[chainAsset.originChain].name,
      type: chainAsset.assetType,
      decimals: chainAsset.decimals || 0,
      minAmount: chainAsset.minAmount || '',
      minAmountConverted: new BigN(chainAsset.minAmount || 0).div(new BigN(10).pow(chainAsset.decimals || 0)).toFixed()
    });
  });

console.log(`Parsed ${allAssets.length} assets`);

try {
  const rows = [];
  const headers = ['Slug','Network','Token','Symbol','Type','Decimals','Min amount','Min amount converted'];

  rows.push(headers.join(','));

  const fileName = `exports/assets-ed.csv`;

  for (const asset of allAssets) {
    const data = [asset.slug, asset.network, asset.name, asset.symbol, asset.type, asset.decimals, asset.minAmount, asset.minAmountConverted];

    rows.push(data.map((value) => JSON.stringify(value)).join(','));
  }


  fs.mkdirSync('exports', { recursive: true });
  fs.writeFile(fileName, rows.join('\n'), function(err) {
    if (err) throw err;
    console.log(`Saved ${fileName} successfully`);
  });
} catch (err) {
  console.error(err);
}
