import { Parser } from '@json2csv/plainjs';

import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };
import AssetRefMap from '../../packages/chain-list/src/data/AssetRef.json' assert { type: "json" };

import fs from "fs";
import {src} from "@babel/core/lib/vendor/import-meta-resolve.js";

const allXcmChannels = [];

Object.values(AssetRefMap).forEach((assetRef) => {
  const key = `${assetRef.srcChain}___${assetRef.destChain}`;

  if (!allXcmChannels.includes(key)) {
    allXcmChannels.push(key);
  }
});

console.log(`Parsed ${allXcmChannels.length} channels`);

const data = [];

allXcmChannels.forEach((channel) => {
  const srcChain = channel.split('___')[0];
  const destChain = channel.split('___')[1];

  const channelData = {
    slug: channel,
    srcChain,
    destChain,
    supportedTokens: ''
  }

  Object.values(AssetRefMap).forEach((assetRef) => {
    if (assetRef.srcChain === srcChain && assetRef.destChain === destChain) {
      const tokenInfo = ChainAssetMap[assetRef.srcAsset];

      if (channelData.supportedTokens.length > 0) {
        channelData.supportedTokens = channelData.supportedTokens.concat(', ');
      }

      channelData.supportedTokens = channelData.supportedTokens.concat(tokenInfo.symbol);
    }
  });

  data.push(channelData);
});

try {
  const opts = {
    fields: ['srcChain', 'destChain', 'supportedTokens', 'slug'],
  };
  const parser = new Parser(opts);
  const csv = parser.parse(data);

  const fileName = `exports/supported-xcm-channels.csv`;

  fs.mkdirSync('exports', { recursive: true });
  fs.writeFile(fileName, csv, function(err) {
    if (err) throw err;
    console.log(`Saved ${fileName} successfully`);
  });
} catch (err) {
  console.error(err);
}
