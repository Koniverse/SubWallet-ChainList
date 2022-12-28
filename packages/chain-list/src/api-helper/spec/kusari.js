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
                EvmAddress: 'H160',
                EthereumTxHash: 'H256',
                Address: 'MultiAddress',
                LookupSource: 'MultiAddress',
                AccountInfo: 'AccountInfoWithTripleRefCount',
                Account: {
                    nonce: 'U256',
                    balance: 'U256'
                },
                Transaction: {
                    nonce: 'U256',
                    action: 'String',
                    gas_price: 'u64',
                    gas_limit: 'u64',
                    value: 'U256',
                    input: 'Vec<u8>',
                    signature: 'Signature'
                },
                Signature: {
                    v: 'u64',
                    r: 'H256',
                    s: 'H256'
                }
            }
        }
    ]
};
exports["default"] = definitions;
