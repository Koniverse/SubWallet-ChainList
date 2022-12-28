// Copyright 2019-2022 @subwallet/chain-list authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { _AssetRef, _ChainAsset, _ChainInfo, _MultiChainAsset } from './types';

export const ChainInfoMap = require('@subwallet/chain-list/data/ChainInfo.json') as Record<string, _ChainInfo>;
export const ChainAssetMap = require('@subwallet/chain-list/data/ChainAsset.json') as Record<string, _ChainAsset>;
export const AssetRefMap = require('@subwallet/chain-list/data/AssetRef.json') as Record<string, _AssetRef>;
export const MultiChainAssetMap = require('@subwallet/chain-list/data/MultiChainAsset.json') as Record<string, _MultiChainAsset>;

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
