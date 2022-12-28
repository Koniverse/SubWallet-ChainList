"use strict";
// Copyright 2019-2022 @subwallet/extension-koni-base authors & contributors
// SPDX-License-Identifier: Apache-2.0
exports.__esModule = true;
exports._DEFAULT_NETWORKS = exports.SubstrateChainCategory = exports._ChainProviderStatus = exports._AssetType = exports._ChainStatus = void 0;
var _ChainStatus;
(function (_ChainStatus) {
    _ChainStatus["ACTIVE"] = "ACTIVE";
    _ChainStatus["INACTIVE"] = "INACTIVE";
    _ChainStatus["STOPPED"] = "STOPPED";
})(_ChainStatus = exports._ChainStatus || (exports._ChainStatus = {}));
var _AssetType;
(function (_AssetType) {
    _AssetType["NATIVE"] = "NATIVE";
    _AssetType["LOCAL"] = "LOCAL";
    _AssetType["ERC20"] = "ERC20";
    _AssetType["ERC721"] = "ERC721";
    _AssetType["PSP22"] = "PSP22";
    _AssetType["PSP34"] = "PSP34";
    _AssetType["UNKNOWN"] = "UNKNOWN";
})(_AssetType = exports._AssetType || (exports._AssetType = {}));
var _ChainProviderStatus;
(function (_ChainProviderStatus) {
    _ChainProviderStatus["ONLINE"] = "ONLINE";
    _ChainProviderStatus["OFFLINE"] = "OFFLINE";
    _ChainProviderStatus["UNSTABLE"] = "UNSTABLE";
})(_ChainProviderStatus = exports._ChainProviderStatus || (exports._ChainProviderStatus = {}));
var SubstrateChainCategory;
(function (SubstrateChainCategory) {
    SubstrateChainCategory["RELAYCHAIN"] = "RELAYCHAIN";
    SubstrateChainCategory["PARACHAIN"] = "PARACHAIN";
    SubstrateChainCategory["TEST_NET"] = "TEST_NET";
})(SubstrateChainCategory = exports.SubstrateChainCategory || (exports.SubstrateChainCategory = {}));
exports._DEFAULT_NETWORKS = [
    'polkadot',
    'kusama'
];
