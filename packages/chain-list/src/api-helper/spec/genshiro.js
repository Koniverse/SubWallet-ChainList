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
var definitions_1 = require("@equilab/definitions");
var equilibrium_1 = require("./equilibrium");
var definitions = {
    derives: __assign({}, definitions_1.genshiro.instances.balances.reduce(function (all, cur) {
        var _a;
        return (__assign(__assign({}, all), (_a = {}, _a[cur] = {
            customAccount: (0, equilibrium_1.createCustomAccount)(cur, function (currency) { return ({ 0: (0, equilibrium_1.u64FromCurrency)(currency) }); }, 'CompatAccountData')
        }, _a)));
    }, {})),
    instances: definitions_1.genshiro.instances,
    types: [
        {
            // on all versions
            minmax: [0, undefined],
            types: definitions_1.genshiro.types
        }
    ]
};
exports["default"] = definitions;
