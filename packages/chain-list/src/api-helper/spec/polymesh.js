"use strict";
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
exports.__esModule = true;
var polymesh_types_1 = require("@polymathnetwork/polymesh-types");
var definitions = {
    rpc: polymesh_types_1["default"].rpc,
    types: [
        {
            // on all versions
            minmax: [0, undefined],
            types: polymesh_types_1["default"].types
        }
    ]
};
exports["default"] = definitions;
