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
exports.typesFromDefs = exports.balanceOf = void 0;
var types_1 = require("@polkadot/types");
function balanceOf(number) {
    return new types_1.U128(new types_1.TypeRegistry(), number);
}
exports.balanceOf = balanceOf;
function typesFromDefs(definitions) {
    return Object
        .values(definitions)
        .reduce(function (res, _a) {
        var types = _a.types;
        return (__assign(__assign({}, res), types));
    }, {});
}
exports.typesFromDefs = typesFromDefs;
