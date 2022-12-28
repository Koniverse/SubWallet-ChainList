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
var typeDefs = require("@zeitgeistpm/type-defs");
var util_1 = require("../util");
var bundle = {
    alias: {
        tokens: {
            AccountData: 'TokensAccountData'
        }
    },
    types: [{
            minmax: [0, undefined],
            types: __assign(__assign({}, (0, util_1.typesFromDefs)(typeDefs)), { TokensAccountData: {
                    free: 'Balance',
                    frozen: 'Balance',
                    reserved: 'Balance'
                } })
        }]
};
exports["default"] = bundle;
