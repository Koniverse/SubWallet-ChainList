// Convert chain list

import fs from 'fs';

const ChainMap = JSON.parse(fs.readFileSync('../data/ChainInfo.json'));

const regex = /^https?:\/\/(.+)\.subscan\.io\//;
Object.entries(ChainMap).forEach(([slug, chain]) => {
  const link = chain.substrateInfo?.blockExplorer || chain.evmInfo?.blockExplorer;
  const match = link && link.match(regex);

  if (match) {
    console.log(slug, `'${match[1]}'`);
  }
});
