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
                Keys: 'AccountId',
                Address: 'MultiAddress',
                LookupSource: 'MultiAddress',
                AmountOf: 'Amount',
                Amount: 'i128',
                SmartContract: {
                    _enum: {
                        Evm: 'H160',
                        Wasm: 'AccountId'
                    }
                },
                EraStakingPoints: {
                    total: 'Balance',
                    stakers: 'BTreeMap<AccountId, Balance>',
                    formerStakedEra: 'EraIndex',
                    claimedRewards: 'Balance'
                },
                PalletDappsStakingEraStakingPoints: {
                    total: 'Balance',
                    stakers: 'BTreeMap<AccountId, Balance>',
                    formerStakedEra: 'EraIndex',
                    claimedRewards: 'Balance'
                },
                EraRewardAndStake: {
                    rewards: 'Balance',
                    staked: 'Balance'
                },
                PalletDappsStakingEraRewardAndStake: {
                    rewards: 'Balance',
                    staked: 'Balance'
                },
                EraIndex: 'u32'
            }
        }
    ]
};
exports["default"] = definitions;
