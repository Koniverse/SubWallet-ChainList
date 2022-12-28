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
var typedefs_1 = require("@phala/typedefs");
var crust_maxwell_1 = require("./crust-maxwell");
// alphabetical, based on the actual displayed name
exports["default"] = __assign(__assign({}, typedefs_1.typesChain), { 'Crust Maxwell': crust_maxwell_1["default"] });
