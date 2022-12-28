// Copyright 2019-2022 @subwallet/extension-koni-base authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint @typescript-eslint/no-var-requires: "off" */

import { _AssetRef, _ChainAsset, _ChainInfo, _MultiChainAsset } from './types';

export const ChainInfoMap = require('./data/ChainInfo.json') as Record<string, _ChainInfo>;
export const ChainAssetMap = require('./data/ChainAsset.json') as Record<string, _ChainAsset>;
export const AssetRefMap = require('./data/AssetRef.json') as Record<string, _AssetRef>;
export const MultiChainAssetMap = require('./data/MultiChainAsset.json') as Record<string, _MultiChainAsset>;

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
