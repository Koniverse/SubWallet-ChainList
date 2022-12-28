"use strict";
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.typesChain = exports.typesBundle = exports.ethereumChains = exports.moonbeamBaseChains = exports.getChainTypes = void 0;
var chain_1 = require("./chain");
exports.typesChain = chain_1["default"];
var spec_1 = require("./spec");
function getChainTypes(_specName, chainName) {
    return __assign({}, (chain_1["default"][chainName] || {}));
}
exports.getChainTypes = getChainTypes;
exports.moonbeamBaseChains = ['moonbase', 'moonbeam', 'moonriver'];
// deprecated
exports.ethereumChains = [
    'moonbase',
    'moonbeam',
    'moonriver',
    'moonshadow',
    'ethereum',
    'binance',
    'astarEvm',
    'shidenEvm',
    'shibuyaEvm',
    'origintrail-parachain'
];
exports.typesBundle = { spec: spec_1["default"] };
