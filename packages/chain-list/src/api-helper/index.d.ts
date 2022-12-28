import type { OverrideBundleType } from '@polkadot/types/types';
import typesChain from './chain';
export declare function getChainTypes(_specName: string, chainName: string): Record<string, string | Record<string, unknown>>;
export declare const moonbeamBaseChains: string[];
export declare const ethereumChains: string[];
export declare const typesBundle: OverrideBundleType;
export { typesChain };
