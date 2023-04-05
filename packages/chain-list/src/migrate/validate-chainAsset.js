// Copyright 2017-2023 @subwallet/chain-list authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Convert chain list
import fs from 'fs';

const AssetMap = JSON.parse(fs.readFileSync('../data/ChainAsset.json'));
const ChainMap = JSON.parse(fs.readFileSync('../data/ChainInfo.json'));

Object.entries(AssetMap).forEach(([slug, asset]) => {
  if (slug !== asset.slug) {
    console.warn('Not match:', slug, asset.slug);
  }

  if (!ChainMap[asset.originChain]) {
    console.warn('Notfound:', slug, asset.originChain, asset.symbol);
  }
});

Object.entries(ChainMap).forEach(([slug, chain]) => {
  if (chain.substrateInfo) {
    const nativeTokenSlug = `${slug}-NATIVE-${chain.substrateInfo.symbol}`;

    if (!AssetMap[nativeTokenSlug]) {
      console.warn('Notfound native token:', slug, nativeTokenSlug);
    }
  }

  if (chain.evmInfo) {
    const nativeTokenSlug = `${slug}-NATIVE-${chain.evmInfo.symbol}`;

    if (!AssetMap[nativeTokenSlug]) {
      console.warn('Notfound native token:', slug, nativeTokenSlug);
    }
  }
});

console.log('Finished');
