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
exports.getBalance = void 0;
var interbtc_types_1 = require("@interlay/interbtc-types");
var rxjs_1 = require("rxjs");
var util_1 = require("@polkadot/api-derive/util");
var types_1 = require("@polkadot/types");
var util_2 = require("@polkadot/util");
function balanceOf(number) {
    return new types_1.U128(new types_1.TypeRegistry(), number);
}
function defaultAccountBalance() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
        accountNonce: new util_2.BN(1),
        additional: [],
        availableBalance: balanceOf(0),
        freeBalance: balanceOf(0),
        lockedBalance: balanceOf(0),
        lockedBreakdown: [],
        namedReserves: [],
        reservedBalance: balanceOf(0)
    };
}
function getBalance(instanceId, api) {
    var nativeToken = api.registry.chainTokens[0] || util_2.formatBalance.getDefaults().unit;
    return (0, util_1.memo)(instanceId, function (account) {
        return (0, rxjs_1.combineLatest)([api.query.tokens.accounts(account, { Token: nativeToken })]).pipe((0, rxjs_1.map)(function (_a) {
            var data = _a[0];
            return __assign(__assign({}, defaultAccountBalance()), { accountId: api.registry.createType('AccountId', account), availableBalance: api.registry.createType('Balance', data.free.sub(data.frozen)), freeBalance: data.free, lockedBalance: data.frozen, reservedBalance: data.reserved });
        }));
    });
}
exports.getBalance = getBalance;
var definitions = __assign({ derives: {
        balances: {
            all: getBalance
        }
    } }, interbtc_types_1["default"]);
exports["default"] = definitions;
