"use strict";
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
exports.__esModule = true;
// structs need to be in order
/* eslint-disable sort-keys */
var definitions = {
    types: [
        {
            minmax: [0, 8],
            types: {
                Address: 'AccountId',
                Keys: 'SessionKeys2',
                LookupSource: 'AccountId',
                Schedule: 'ScheduleTo258'
            }
        },
        {
            // updated to Substrate master
            minmax: [9, undefined],
            types: {
                Keys: 'SessionKeys2'
            }
        }
    ]
};
exports["default"] = definitions;
