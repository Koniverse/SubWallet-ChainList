// Copyright 2019-2022 @subwallet/chain-list authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { _AssetRef, _ChainAsset, _ChainInfo, _MultiChainAsset } from './types';

import * as _ChainInfoMap from './data/ChainInfo.json';
import * as _ChainAssetMap from './data/ChainAsset.json';
import * as _AssetRefMap from './data/AssetRef.json';
import * as _MultiChainAssetMap from './data/MultiChainAsset.json';

export const ChainInfoMap = _ChainInfoMap as unknown as Record<string, _ChainInfo>;
export const ChainAssetMap = _ChainAssetMap as unknown as Record<string, _ChainInfo>;
export const AssetRefMap = _AssetRefMap as unknown as Record<string, _ChainInfo>;
export const MultiChainAssetMap = _MultiChainAssetMap as unknown as Record<string, _ChainInfo>;

export enum COMMON_CHAIN_SLUGS {
  POLKADOT = 'polkadot',
  KUSAMA = 'kusama',
  MOONBEAM = 'moonbeam',
  ETHEREUM = 'ethereum'
}

export const _DEFAULT_CHAINS = [
  COMMON_CHAIN_SLUGS.POLKADOT as string,
  COMMON_CHAIN_SLUGS.KUSAMA as string
];
