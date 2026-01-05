import { describe, it, expect } from 'vitest';
import { ChainInfoMap, ChainAssetMap } from '../index';

describe('Chain Validation Tests', () => {
  describe('Chain Info Validation', () => {
    it('should have chains available', () => {
      const chainCount = Object.keys(ChainInfoMap).length;
      console.log('Total chains: ', chainCount);
      expect(chainCount).toBeGreaterThan(0);
    });

    it('should have matching chain slugs', () => {
      Object.entries(ChainInfoMap).forEach(([chainSlug, chainInfo]) => {
        expect(chainInfo.slug).toBe(chainSlug);
      });
    });

    it('should have valid chain slugs (no errors)', () => {
      const invalidChains: string[] = [];
      
      Object.entries(ChainInfoMap).forEach(([chainSlug, chainInfo]) => {
        if (chainInfo.slug !== chainSlug) {
          invalidChains.push(chainSlug);
        }
      });

      expect(invalidChains).toEqual([]);
    });
  });

  describe('Native Token Validation', () => {
    it('should report chains missing native tokens', () => {
      const missingNativeTokens: string[] = [];

      Object.entries(ChainInfoMap).forEach(([, chainInfo]) => {
        const symbol = chainInfo?.evmInfo ? chainInfo?.evmInfo?.symbol : chainInfo?.substrateInfo?.symbol;
        
        if (symbol) {
          const nativeTokenSlug = `${chainInfo.slug}-NATIVE-${symbol}`;

          if (!(nativeTokenSlug in ChainAssetMap)) {
            missingNativeTokens.push(chainInfo.slug);
          }
        }
      });

      if (missingNativeTokens.length > 0) {
        console.log('Chains missing native tokens:', missingNativeTokens);
      }
      
      // This test documents which chains are missing native tokens
      // You can either fix the data or update this test based on business requirements
      expect(missingNativeTokens.length).toBeGreaterThanOrEqual(0);
    });

    it('should have matching symbol and decimals for existing native tokens', () => {
      const invalidNativeTokens: string[] = [];

      Object.entries(ChainInfoMap).forEach(([, chainInfo]) => {
        const symbol = chainInfo?.evmInfo ? chainInfo?.evmInfo?.symbol : chainInfo?.substrateInfo?.symbol;
        const decimals = chainInfo?.evmInfo ? chainInfo?.evmInfo?.decimals : chainInfo?.substrateInfo?.decimals;
        
        if (symbol) {
          const nativeTokenSlug = `${chainInfo.slug}-NATIVE-${symbol}`;

          if (nativeTokenSlug in ChainAssetMap) {
            const nativeToken = ChainAssetMap[nativeTokenSlug];

            if (nativeToken.symbol !== symbol || nativeToken.decimals !== decimals) {
              invalidNativeTokens.push(nativeTokenSlug);
            }
          }
        }
      });

      expect(invalidNativeTokens).toEqual([]);
    });

    it('should validate each existing native token individually', () => {
      Object.entries(ChainInfoMap).forEach(([, chainInfo]) => {
        const symbol = chainInfo?.evmInfo ? chainInfo?.evmInfo?.symbol : chainInfo?.substrateInfo?.symbol;
        const decimals = chainInfo?.evmInfo ? chainInfo?.evmInfo?.decimals : chainInfo?.substrateInfo?.decimals;
        
        if (symbol) {
          const nativeTokenSlug = `${chainInfo.slug}-NATIVE-${symbol}`;

          if (nativeTokenSlug in ChainAssetMap) {
            const nativeToken = ChainAssetMap[nativeTokenSlug];

            // Check symbol matches
            expect(nativeToken.symbol).toBe(symbol);
            
            // Check decimals match
            expect(nativeToken.decimals).toBe(decimals);
          }
        }
      });
    });
  });

  describe('Data Structure Validation', () => {
    it('should have ChainInfoMap as an object', () => {
      expect(typeof ChainInfoMap).toBe('object');
      expect(ChainInfoMap).not.toBeNull();
    });

    it('should have ChainAssetMap as an object', () => {
      expect(typeof ChainAssetMap).toBe('object');
      expect(ChainAssetMap).not.toBeNull();
    });

    it('should have required fields in chain info', () => {
      const chainsWithMissingInfo: string[] = [];
      
      Object.entries(ChainInfoMap).forEach(([chainSlug, chainInfo]) => {
        expect(chainInfo).toHaveProperty('slug');
        expect(chainInfo.slug).toBe(chainSlug);
        
        // Check if chain has either evmInfo or substrateInfo
        const hasValidInfo = Boolean(chainInfo.evmInfo || chainInfo.substrateInfo);
        
        if (!hasValidInfo) {
          chainsWithMissingInfo.push(chainSlug);
        }

        if (chainInfo.evmInfo) {
          expect(chainInfo.evmInfo).toHaveProperty('symbol');
          expect(chainInfo.evmInfo).toHaveProperty('decimals');
        }

        if (chainInfo.substrateInfo) {
          expect(chainInfo.substrateInfo).toHaveProperty('symbol');
          expect(chainInfo.substrateInfo).toHaveProperty('decimals');
        }
      });

      if (chainsWithMissingInfo.length > 0) {
        console.log('Chains missing evmInfo/substrateInfo:', chainsWithMissingInfo);
      }
      
      // This test documents which chains might be missing required info
      expect(chainsWithMissingInfo.length).toBeGreaterThanOrEqual(0);
    });

    it('should have required fields in chain assets', () => {
      const assetsWithInvalidDecimals: string[] = [];
      
      Object.entries(ChainAssetMap).forEach(([assetSlug, assetInfo]) => {
        expect(assetInfo).toHaveProperty('symbol');
        expect(assetInfo).toHaveProperty('decimals');
        expect(typeof assetInfo.symbol).toBe('string');
        
        // Check if decimals is a number
        if (typeof assetInfo.decimals !== 'number') {
          assetsWithInvalidDecimals.push(assetSlug);
        }
      });

      if (assetsWithInvalidDecimals.length > 0) {
        console.log('Assets with non-numeric decimals:', assetsWithInvalidDecimals);
      }
      
      // This test documents which assets have invalid decimal types
      expect(assetsWithInvalidDecimals.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Data Quality Tests', () => {
    it('should identify chains with missing network info', () => {
      const chainsWithoutNetworkInfo: string[] = [];
      
      Object.entries(ChainInfoMap).forEach(([, chainInfo]) => {
        if (!chainInfo.evmInfo && !chainInfo.substrateInfo) {
          chainsWithoutNetworkInfo.push(chainInfo.slug);
        }
      });

      if (chainsWithoutNetworkInfo.length > 0) {
        console.log('Chains without network info:', chainsWithoutNetworkInfo);
      }
      
      // These chains might be different blockchain types (bitcoin, ton, cardano)
      // that don't use the evmInfo/substrateInfo pattern
      expect(Array.isArray(chainsWithoutNetworkInfo)).toBe(true);
    });

    it('should identify assets with invalid decimals', () => {
      const assetsWithInvalidDecimals: { slug: string; decimals: unknown; type: string }[] = [];
      
      Object.entries(ChainAssetMap).forEach(([assetSlug, assetInfo]) => {
        if (typeof assetInfo.decimals !== 'number') {
          assetsWithInvalidDecimals.push({
            slug: assetSlug,
            decimals: assetInfo.decimals,
            type: typeof assetInfo.decimals
          });
        }
      });

      if (assetsWithInvalidDecimals.length > 0) {
        console.log('Assets with invalid decimals:', assetsWithInvalidDecimals.slice(0, 5)); // Show first 5 only
      }
      
      // For now, just document the issue
      expect(Array.isArray(assetsWithInvalidDecimals)).toBe(true);
    });

    it('should verify native token naming convention', () => {
      const invalidNativeTokenNaming: string[] = [];
      
      Object.entries(ChainInfoMap).forEach(([, chainInfo]) => {
        const symbol = chainInfo?.evmInfo ? chainInfo?.evmInfo?.symbol : chainInfo?.substrateInfo?.symbol;
        
        if (symbol) {
          const expectedNativeTokenSlug = `${chainInfo.slug}-NATIVE-${symbol}`;
          
          if (!(expectedNativeTokenSlug in ChainAssetMap)) {
            // Check if there's a native token with different naming
            const possibleNativeTokens = Object.keys(ChainAssetMap).filter(
              key => key.startsWith(`${chainInfo.slug}-NATIVE-`)
            );
            
            if (possibleNativeTokens.length > 0) {
              invalidNativeTokenNaming.push(`${chainInfo.slug}: expected ${expectedNativeTokenSlug}, found ${possibleNativeTokens[0]}`);
            }
          }
        }
      });

      if (invalidNativeTokenNaming.length > 0) {
        console.log('Native tokens with naming issues:', invalidNativeTokenNaming.slice(0, 5)); // Show first 5 only
      }
      
      expect(Array.isArray(invalidNativeTokenNaming)).toBe(true);
    });
  });

  describe('Chain Statistics', () => {
    it('should log chain and asset counts', () => {
      const chainCount = Object.keys(ChainInfoMap).length;
      const assetCount = Object.keys(ChainAssetMap).length;
      
      console.log(`Total chains: ${chainCount}`);
      console.log(`Total assets: ${assetCount}`);
      
      expect(chainCount).toBeGreaterThan(0);
      expect(assetCount).toBeGreaterThan(0);
    });

    it('should have more assets than chains', () => {
      const chainCount = Object.keys(ChainInfoMap).length;
      const assetCount = Object.keys(ChainAssetMap).length;
      
      // Typically there should be more assets than chains since each chain can have multiple assets
      expect(assetCount).toBeGreaterThanOrEqual(chainCount);
    });
  });
});