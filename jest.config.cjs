// Copyright 2017-2022 @subwallet/base authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {
    '@subwallet/base/(.*)$': '<rootDir>/packages/base/src/$1',
    '@subwallet/chain-services/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/controllers/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/keyring/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/networks/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/storage/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/stream/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/utils/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/web2-services/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@subwallet/web3-services/(.*)$': '<rootDir>/packages/storage/src/$1'
  },
  testTimeout: 30000
};
