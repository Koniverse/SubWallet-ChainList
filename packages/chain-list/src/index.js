"use strict";
// Copyright 2019-2022 @subwallet/extension-koni-base authors & contributors
// SPDX-License-Identifier: Apache-2.0
exports.__esModule = true;
exports._DEFAULT_CHAINS = exports.COMMON_CHAIN_SLUGS = exports.ChainAssetMap = exports.ChainInfoMap = void 0;
exports.ChainInfoMap = require('./data/ChainInfo.json');
exports.ChainAssetMap = require('./data/ChainAsset.json');
var COMMON_CHAIN_SLUGS;
(function (COMMON_CHAIN_SLUGS) {
    COMMON_CHAIN_SLUGS["POLKADOT"] = "polkadot";
    COMMON_CHAIN_SLUGS["KUSAMA"] = "kusama";
    COMMON_CHAIN_SLUGS["MOONBEAM"] = "moonbeam";
})(COMMON_CHAIN_SLUGS = exports.COMMON_CHAIN_SLUGS || (exports.COMMON_CHAIN_SLUGS = {}));
exports._DEFAULT_CHAINS = [
    COMMON_CHAIN_SLUGS.POLKADOT,
    COMMON_CHAIN_SLUGS.KUSAMA
];
