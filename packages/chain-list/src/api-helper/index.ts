// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleType } from '@polkadot/types/types';

import typesChain from './chain';
import spec from './spec';

export const typesBundle: OverrideBundleType = { spec };

export { typesChain };
