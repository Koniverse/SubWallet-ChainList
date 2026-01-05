import { describe, it, expect } from 'vitest';
import { compareData, compareObjects } from './compare';
import { _ChainInfo, _ChainStatus } from '../../src/types';

describe('compareObjects', () => {
  it('returns empty object when objects are equal', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(compareObjects(obj1, obj2)).toEqual({});
  });

  it('returns differences for different values', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    expect(compareObjects(obj1, obj2)).toEqual({
      b: { from: 2, to: 3 },
    });
  });

  it('returns differences for missing keys', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1 };
    expect(compareObjects(obj1, obj2)).toEqual({
      b: { from: 2, to: undefined },
    });
    expect(compareObjects(obj2, obj1)).toEqual({
      b: { from: undefined, to: 2 },
    });
  });

  it('ignores specified keys', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 4, c: 3 };
    expect(compareObjects(obj1, obj2, ['b'])).toEqual({});
  });

  it('handles empty objects', () => {
    expect(compareObjects({}, {})).toEqual({});
    expect(compareObjects({ a: 1 }, {})).toEqual({
      a: { from: 1, to: undefined },
    });
    expect(compareObjects({}, { a: 1 })).toEqual({
      a: { from: undefined, to: 1 },
    });
  });

  it('handles nested objects as values (shallow compare)', () => {
    const obj1 = { a: { x: 1 } };
    const obj2 = { a: { x: 1 } };
    // Different references, so should be considered different
    expect(compareObjects(obj1, obj2)).toEqual({
      a: { from: { x: 1 }, to: { x: 1 } },
    });
  });

  it('handles arrays as values (shallow compare)', () => {
    const obj1 = { a: [1, 2] };
    const obj2 = { a: [1, 2] };
    expect(compareObjects(obj1, obj2)).toEqual({
      a: { from: [1, 2], to: [1, 2] },
    });
  });

  it('ignores keys not present in either object if ignored', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1 };
    expect(compareObjects(obj1, obj2, ['b'])).toEqual({});
  });
});

// Test compare chains

describe('compareChains', () => {
  const rawChain = {
    slug: 'polkadot',
    name: 'Polkadot',
    isTestnet: false,
    chainStatus: 'ACTIVE',
    icon: '/assets/chains/polkadot.png',
    providers: {
      Dwellir: 'wss://polkadot-rpc.dwellir.com',
      RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://dot-rpc.stakeworld.io',
      LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
      'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
      'Light Client': 'light://substrate-connect/polkadot',
      BlockOps: 'wss://polkadot-public-rpc.blockops.network/ws',
      Allnodes: 'wss://polkadot-rpc.publicnode.com',
      Onfinality: 'wss://polkadot.api.onfinality.io/public-ws',
      Helixstreet: 'wss://rpc-polkadot.helixstreet.io',
      IBP2: 'wss://polkadot.dotters.network',
      'Permanence DAO EU': 'wss://polkadot.rpc.permanence.io',
    },
    evmInfo: null,
    substrateInfo: {
      relaySlug: null,
      paraId: null,
      genesisHash:
        '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
      addressPrefix: 0,
      chainType: 'RELAYCHAIN',
      crowdloanUrl: null,
      blockExplorer: 'https://polkadot.subscan.io/',
      existentialDeposit: '10000000000',
      symbol: 'DOT',
      decimals: 10,
      hasNativeNft: false,
      supportStaking: true,
      supportSmartContract: null,
      crowdloanParaId: null,
      crowdloanFunds: [],
    },
    extraInfo: {
      subscanSlug: 'polkadot',
      chainBalanceSlug: 'polkadot',
    },
    bitcoinInfo: null,
    tonInfo: null,
    cardanoInfo: null,
  } as _ChainInfo;
  let updateChain: _ChainInfo;

  beforeEach(() => {
    updateChain = JSON.parse(JSON.stringify(rawChain)) as _ChainInfo;
  });

  it('compares rename chain', () => {
    updateChain.name = 'Polkadot New';
    const differences = compareData<_ChainInfo>(rawChain, updateChain);
    expect(differences).toEqual({
      name: { from: 'Polkadot', to: 'Polkadot New' },
    });
  });

  it('compares inactive chain', () => {
    updateChain.chainStatus = _ChainStatus.INACTIVE;
    const differences = compareData<_ChainInfo>(rawChain, updateChain);
    expect(differences).toEqual({
      chainStatus: { from: _ChainStatus.ACTIVE, to: _ChainStatus.INACTIVE },
    });
  });

  it('compares add provider', () => {
    updateChain.providers = {
      ...updateChain.providers,
      NewProvider: 'wss://new-provider.io',
    };

    const differences = compareData<_ChainInfo>(rawChain, updateChain);
    expect(differences).toEqual({
      'providers.NewProvider': { from: undefined, to: 'wss://new-provider.io' },
    });
  });

  it('compares remove provider', () => {
    delete updateChain.providers['Dwellir'];
    const differences = compareData<_ChainInfo>(rawChain, updateChain);
    expect(differences).toEqual({
      'providers.Dwellir': { from: 'wss://polkadot-rpc.dwellir.com', to: undefined },
    });
  });
  
  // Compare update native token
  it('compares update native token', () => {
    if (updateChain.substrateInfo) {
      updateChain.substrateInfo.symbol = 'DOTN';
      const differences = compareData<_ChainInfo>(rawChain, updateChain);
      expect(differences).toEqual({
        'substrateInfo.symbol': { from: 'DOT', to: 'DOTN' },
      });
    }
  });

  // Compare update blockExplorer
  it('compares update blockExplorer', () => {
    if (updateChain.substrateInfo) {
      updateChain.substrateInfo.blockExplorer = 'https://polkadot-new.subscan.io/';
      const differences = compareData<_ChainInfo>(rawChain, updateChain);
      expect(differences).toEqual({
        'substrateInfo.blockExplorer': { from: 'https://polkadot.subscan.io/', to: 'https://polkadot-new.subscan.io/' },
      });
    }
  });

  // Compare extraInfo subscanSlug
  it('compares update extraInfo subscanSlug', () => {
    if (updateChain.extraInfo) {
      updateChain.extraInfo.subscanSlug = 'polkadot-new';
      const differences = compareData<_ChainInfo>(rawChain, updateChain);
      expect(differences).toEqual({
        'extraInfo.subscanSlug': { from: 'polkadot', to: 'polkadot-new' },
      });
    }
  });
});
