// Copyright 2019-2024 @subwallet/chain-list authors & contributors
// SPDX-License-Identifier: Apache-2.0

import _AssetLogoMap from './data/AssetLogoMap.json';
import _AssetRefMap from './data/AssetRef.json';
import _ChainAssetMap from './data/ChainAsset.json';
import _ChainInfoMap from './data/ChainInfo.json';
import _ChainLogoMap from './data/ChainLogoMap.json';
import _MultiChainAssetMap from './data/MultiChainAsset.json';

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
  ASTAR_EVM = 'astarEvm',
  HYDRADX = 'hydradx_main',
  HYDRADX_TESTNET = 'hydradx_rococo',
  ETHEREUM_SEPOLIA = 'sepolia_ethereum',
  CHAINFLIP_POLKADOT = 'chainflip_dot',
  MOONBASE = 'moonbase',
  POLKADOT_ASSET_HUB = 'statemint',
  KUSAMA_ASSET_HUB = 'statemine',
  ROCOCO_ASSET_HUB = 'rococo_assethub'
}

export enum COMMON_ASSETS {
  DOT = 'polkadot-NATIVE-DOT',
  ETH = 'ethereum-NATIVE-ETH',
  KSM = 'kusama-NATIVE-KSM',
  ETH_SEPOLIA = 'sepolia_ethereum-NATIVE-ETH',
  PDOT = 'chainflip_dot-NATIVE-pDOT',
  HDX = 'hydradx_main-NATIVE-HDX',
  USDC_ETHEREUM = 'ethereum-ERC20-USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDC_SEPOLIA = 'sepolia_ethereum-ERC20-USDC-0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  HDX_TESTNET = 'hydradx_rococo-NATIVE-HDX',
  USDT_HYDRADX_TESTNET = 'hydradx_rococo-LOCAL-USDT',
  DOT_HYDRADX_TESTNET = 'hydradx_rococo-LOCAL-DOT'
}

export const _DEFAULT_CHAINS = [
  COMMON_CHAIN_SLUGS.POLKADOT as string,
  COMMON_CHAIN_SLUGS.KUSAMA as string,
  COMMON_CHAIN_SLUGS.ETHEREUM as string
];
