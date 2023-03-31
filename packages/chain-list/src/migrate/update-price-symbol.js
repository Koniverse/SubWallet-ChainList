// Convert chain list

import fs from 'fs';

const CoinGeckoList = JSON.parse(fs.readFileSync('./CoinGeckoTokens.json'));
const AssetMap = JSON.parse(fs.readFileSync('../data/ChainAsset.json'));
const ChainMap = JSON.parse(fs.readFileSync('../data/ChainInfo.json'));

const symbolMap = CoinGeckoList.reduce((map, item) => {
  if (map[item.symbol]) {
    map[item.symbol].push(item.id);
  } else {
    map[item.symbol] = [item.id];
  }

  return map;
}, {});

Object.entries(AssetMap).forEach(([slug, asset]) => {
  const lsym = (asset.symbol || '').toLowerCase();

  if (!asset.priceId && symbolMap[lsym]) {
    if (ChainMap[asset.originChain] && ChainMap[asset.originChain].isTestnet) {
      if (asset.priceId) {
        console.warn(slug)
      }
      return;
    }

    console.log(slug, asset.originChain, asset.symbol, symbolMap[lsym]);
  }
});
