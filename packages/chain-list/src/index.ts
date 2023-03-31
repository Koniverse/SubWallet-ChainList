// Copyright 2019-2022 @subwallet/chain-list authors & contributors
// SPDX-License-Identifier: Apache-2.0

import _AssetRefMap from '@subwallet/chain-list/data/AssetRef.json';
import _ChainAssetMap from '@subwallet/chain-list/data/ChainAsset.json';
import _ChainInfoMap from '@subwallet/chain-list/data/ChainInfo.json';
import _MultiChainAssetMap from '@subwallet/chain-list/data/MultiChainAsset.json';

import { _AssetRef, _ChainAsset, _ChainInfo, _MultiChainAsset } from './types';

export const ChainInfoMap = _ChainInfoMap as unknown as Record<string, _ChainInfo>;
export const ChainAssetMap = _ChainAssetMap as unknown as Record<string, _ChainAsset>;
export const AssetRefMap = _AssetRefMap as unknown as Record<string, _AssetRef>;
export const MultiChainAssetMap = _MultiChainAssetMap as unknown as Record<string, _MultiChainAsset>;

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
  COMMON_CHAIN_SLUGS.KUSAMA as string
];
