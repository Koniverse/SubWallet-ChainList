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
exports.createCustomAccount = exports.u64FromCurrency = void 0;
var definitions_1 = require("@equilab/definitions");
var rxjs_1 = require("rxjs");
var types_1 = require("@polkadot/types");
var util_1 = require("@polkadot/util");
var u64FromCurrency = function (currency) {
    var buf = Buffer.from(currency.toLowerCase());
    var size = buf.length;
    return buf.reduce(function (val, digit, i) { return val + Math.pow(256, size - 1 - i) * digit; }, 0);
};
exports.u64FromCurrency = u64FromCurrency;
var transformBalanceStorage = function (query, currency, transform, currencyToAsset, api) {
    var arg = currencyToAsset(currency, api);
    // HACK as we cannot properly transform queryMulti result, define AccountData getters on standard Enum
    if (!types_1.Enum.hacked) {
        types_1.Enum.hacked = true;
        var _loop_1 = function (prop) {
            Object.defineProperty(types_1.Enum.prototype, prop, {
                get: function () {
                    var accData = transform(this);
                    return accData[prop];
                },
                set: function () {
                    // Do nothing
                }
            });
        };
        for (var _i = 0, _a = ['free', 'reserved', 'miscFrozen', 'feeFrozen']; _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_1(prop);
        }
    }
    // Transform result if we call the func normally
    var boundFunction = function (account) {
        return query(account, arg).pipe((0, rxjs_1.map)(transform));
    };
    // Bind currency as second key for doubleMap for queryMulti
    var boundCreator = function (account) {
        return query.creator([account, arg]);
    };
    Object.assign(boundCreator, __assign({}, query.creator));
    return Object.assign(boundFunction, __assign(__assign({}, query), { creator: boundCreator }));
};
var signedBalancePredicate = function (raw) {
    return ['asNegative', 'asPositive', 'isNegative', 'isPositive'].some(function (key) {
        return Object.prototype.hasOwnProperty.call(raw, key);
    });
};
var createCustomAccount = function (currency, currencyToAsset, accountDataType) {
    if (accountDataType === void 0) { accountDataType = 'AccountData'; }
    return function (instanceId, api) {
        var registry = api.registry;
        var transform = function (balance) {
            var free = registry.createType('Balance');
            var reserved = registry.createType('Balance');
            var miscFrozen = registry.createType('Balance');
            var feeFrozen = registry.createType('Balance');
            if (signedBalancePredicate(balance)) {
                if (balance.isPositive) {
                    free = registry.createType('Balance', balance.asPositive);
                }
                else if (balance.isNegative) {
                    free = registry.createType('Balance', balance.asNegative.mul(new util_1.BN(-1)));
                }
            }
            return registry.createType(accountDataType, { feeFrozen: feeFrozen, free: free, miscFrozen: miscFrozen, reserved: reserved });
        };
        return transformBalanceStorage(api.query.eqBalances.account, currency, transform, currencyToAsset, api);
    };
};
exports.createCustomAccount = createCustomAccount;
var definitions = {
    derives: __assign({}, definitions_1.equilibrium.instances.balances.reduce(function (all, cur) {
        var _a;
        return (__assign(__assign({}, all), (_a = {}, _a[cur] = {
            customAccount: (0, exports.createCustomAccount)(cur, function (currency, api) {
                var assetsEnabled = true;
                try {
                    api === null || api === void 0 ? void 0 : api.registry.createType('AssetIdInnerType');
                }
                catch (_) {
                    assetsEnabled = false;
                }
                return assetsEnabled ? { 0: (0, exports.u64FromCurrency)(currency) } : currency;
            })
        }, _a)));
    }, {})),
    instances: definitions_1.equilibrium.instances,
    types: [
        {
            minmax: [0, 264],
            types: definitions_1.equilibrium.types
        },
        {
            minmax: [265, undefined],
            types: definitions_1.equilibriumNext.types
        }
    ]
};
exports["default"] = definitions;
