// Copyright 2019-2022 @subwallet/chain-list authors & contributors
// SPDX-License-Identifier: Apache-2.0

import _AssetLogoMap from './data/AssetLogoMap.json' assert { type: 'json' };
import _AssetRefMap from './data/AssetRef.json' assert { type: 'json' };
import _ChainAssetMap from './data/ChainAsset.json' assert { type: 'json' };
import _ChainInfoMap from './data/ChainInfo.json' assert { type: 'json' };
import _ChainLogoMap from './data/ChainLogoMap.json' assert { type: 'json' };
import _MultiChainAssetMap from './data/MultiChainAsset.json' assert { type: 'json' };

import { _AssetRef, _ChainAsset, _ChainInfo, _MultiChainAsset } from './types';

export const ChainInfoMap = _ChainInfoMap as unknown as Record<string, _ChainInfo>;
export const ChainAssetMap = _ChainAssetMap as unknown as Record<string, _ChainAsset>;
export const AssetRefMap = _AssetRefMap as unknown as Record<string, _AssetRef>;
export const MultiChainAssetMap = _MultiChainAssetMap as unknown as Record<string, _MultiChainAsset>;
export const AssetLogoMap = _AssetLogoMap as unknown as Record<string, string>;
export const ChainLogoMap = _ChainLogoMap as unknown as Record<string, string>;

export enum COMMON_CHAIN_SLUGS {
  POLKADOT = 'polkadot',
  KUSAMA = 'kusama',
  MOONBEAM = 'moonbeam',
  MOONRIVER = 'moonriver',
  ETHEREUM = 'ethereum',
  ACALA = 'acala',
  KARURA = 'karura',
  ALEPH_ZERO = 'aleph',
  ASTAR = 'astar',
  WESTEND = 'westend',
  BINANCE = 'binance',
  ASTAR_EVM = 'astarEvm'
}

export const _DEFAULT_CHAINS = [
  COMMON_CHAIN_SLUGS.POLKADOT as string,
  COMMON_CHAIN_SLUGS.KUSAMA as string,
  COMMON_CHAIN_SLUGS.ETHEREUM as string
];
