"use strict";
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
exports.__esModule = true;
// structs need to be in order
/* eslint-disable sort-keys */
var definitions = {
    types: [
        {
            // on all versions
            minmax: [0, undefined],
            types: {
                Difficulty: 'U256',
                DifficultyAndTimestamp: {
                    difficulty: 'Difficulty',
                    timestamp: 'Moment'
                },
                Era: {
                    genesisBlockHash: 'H256',
                    finalBlockHash: 'H256',
                    finalStateRoot: 'H256'
                },
                RefCount: 'u8'
            }
        }
    ]
};
exports["default"] = definitions;
