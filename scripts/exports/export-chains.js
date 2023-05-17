import { Parser } from '@json2csv/plainjs';
import ChainInfoMap from '../../packages/chain-list/src/data/ChainInfo.json' assert { type: "json" };

import fs from "fs";

const LOGO_URL = 'https://raw.githubusercontent.com/Koniverse/SubWallet-Chain/master/packages/chain-list/src/logo';
const allChains = [];
const NOMINATION_POOL_CHAINS = ['polkadot', 'kusama', 'westend', 'alephTest', 'aleph'];

function getChainTypes (chainInfo) {
  let chainTypes = '';

  if (chainInfo.substrateInfo) {
    if (chainTypes.length > 0) {
      chainTypes = chainTypes.concat(', ');
    }

    chainTypes = chainTypes.concat('Substrate');
  }

  if (chainInfo.evmInfo) {
    if (chainTypes.length > 0) {
      chainTypes = chainTypes.concat(', ');
    }

    chainTypes = chainTypes.concat('EVM');
  }

  return chainTypes;
}

function getChainSymbol (chainInfo) {
  if (chainInfo.substrateInfo) { // substrate by default
    return chainInfo.substrateInfo.symbol
  }

  return chainInfo.evmInfo.symbol;
}

function getSpecialFeatures (chainInfo) {
  let specialFeatures = '';

  if (chainInfo?.substrateInfo?.hasNativeNft) {
    if (specialFeatures.length > 0) {
      specialFeatures = specialFeatures.concat(', ');
    }

    specialFeatures = specialFeatures.concat('NATIVE_NFT');
  }

  if (chainInfo?.substrateInfo?.supportStaking) {
    if (specialFeatures.length > 0) {
      specialFeatures = specialFeatures.concat(', ');
    }

    specialFeatures = specialFeatures.concat('NATIVE_STAKING');

    if (NOMINATION_POOL_CHAINS.includes(chainInfo.slug)) {
      if (specialFeatures.length > 0) {
        specialFeatures = specialFeatures.concat(', ');
      }

      specialFeatures = specialFeatures.concat('NOMINATION_POOL');
    }
  }

  if (chainInfo?.substrateInfo?.supportSmartContract) {
    chainInfo?.substrateInfo?.supportSmartContract.forEach((contractType) => {
      if (specialFeatures.length > 0) {
        specialFeatures = specialFeatures.concat(', ');
      }

      specialFeatures = specialFeatures.concat(contractType);
    });
  }

  if (chainInfo?.evmInfo?.supportSmartContract) {
    chainInfo?.evmInfo?.supportSmartContract.forEach((contractType) => {
      if (specialFeatures.length > 0) {
        specialFeatures = specialFeatures.concat(', ');
      }

      specialFeatures = specialFeatures.concat(contractType);
    });
  }

  return specialFeatures;
}

Object.values(ChainInfoMap).forEach((chainInfo) => {
  allChains.push({
    slug: chainInfo.slug,
    name: chainInfo.name,
    symbol: getChainSymbol(chainInfo),
    status: chainInfo.chainStatus,
    isTestnet: chainInfo.isTestnet,
    types: getChainTypes(chainInfo),
    specialFeatures: getSpecialFeatures(chainInfo),
    icon: `${LOGO_URL}/${chainInfo.icon}`
  });
});

console.log(`Parsed ${allChains.length} chains`);

try {
  const opts = {
    fields: ['name', 'symbol', 'types', 'specialFeatures', 'isTestnet', 'status', 'slug', 'icon'],
  };
  const parser = new Parser(opts);
  const csv = parser.parse(allChains);

  const fileName = `exports/supported-chains.csv`;

  fs.mkdirSync('exports', { recursive: true });
  fs.writeFile(fileName, csv, function(err) {
    if (err) throw err;
    console.log(`Saved ${fileName} successfully`);
  });
} catch (err) {
  console.error(err);
}
