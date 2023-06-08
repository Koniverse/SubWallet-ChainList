import MultiChainAssetMap from '../../packages/chain-list/src/data/MultiChainAsset.json' assert { type: "json" };
import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };
import ChainInfoMap from '../../packages/chain-list/src/data/ChainInfo.json' assert { type: "json" };

const assetCount = Object.keys(ChainAssetMap).length;

console.log('Total assets: ', assetCount);

const ASSET_TYPES = [
  'NATIVE',
  'LOCAL',
  'ERC20',
  'ERC721',
  'PSP22',
  'PSP34',
  'UNKNOWN'
]

Object.entries(ChainAssetMap).forEach(([assetSlug, chainAsset]) => {
  const originChainSlug = assetSlug.split('-')[0];
  const tokenType = assetSlug.split('-')[1];
  const tokenSymbol = assetSlug.split('-')[2];

  const isValidOriginChain = originChainSlug === chainAsset.originChain && originChainSlug in ChainInfoMap;
  const isValidTokenType = ASSET_TYPES.includes(tokenType) && tokenType === chainAsset.assetType.toString();
  const isValidTokenSymbol = tokenSymbol === chainAsset.symbol;

  if (!(isValidOriginChain && isValidTokenType && isValidTokenSymbol)) {
    console.error('Invalid asset info: ', assetSlug);
  } else {
    // Check multichain asset
    if (chainAsset.multiChainAsset !== null)  {
      if (!(chainAsset.multiChainAsset in MultiChainAssetMap)) {
        console.error('Cannot find multi-chain asset: ', assetSlug);
      } else {
        const multiChainAsset = MultiChainAssetMap[chainAsset.multiChainAsset];

        if (multiChainAsset.symbol !== chainAsset.symbol) {
          console.warn('Symbol mismatch: ', chainAsset.slug, multiChainAsset.slug);
        }

        if (multiChainAsset.priceId !== chainAsset.priceId) {
          console.warn('PriceId mismatch: ', chainAsset.slug, multiChainAsset.slug);
        }
      }
    }

    if (['ERC20', 'ERC721', 'PSP22', 'PSP34'].includes(chainAsset.assetType)) {
      if (!chainAsset.metadata.contractAddress) {
        console.error('Cannot find multi-chain asset: ', assetSlug);

        if (['ERC20', 'ERC721'].includes(chainAsset.assetType)) {
          const isDuplicated = Object.entries(ChainAssetMap).some(([, tokenInfo]) => chainAsset?.metadata?.contractAddress === tokenInfo?.metadata?.contractAddress);
          isDuplicated && console.error('Asset existed: ', assetSlug);
        }
      }
    }

    if (chainAsset.assetType === 'LOCAL' && ['bifrost', 'acala', 'karura', 'acala_testnet', 'pioneer', 'bitcountry', 'kintsugi', 'interlay', 'kintsugi_test'].includes(chainAsset.originChain)) {
      if (!chainAsset.metadata?.onChainInfo) {
        console.error('Asset must have onChainInfo: ', assetSlug);
      }
    }

    if (chainAsset.assetType === 'LOCAL' && ['statemine', 'astar', 'shiden', 'statemint', 'moonbeam', 'moonbase', 'moonriver', 'crabParachain', 'equilibrium_parachain', 'genshiro_testnet', 'genshiro'].includes(chainAsset.originChain)) {
      if (!chainAsset.metadata?.assetId) {
        console.error('Asset must have assetId: ', assetSlug);
      }
    }

    // if (chainAsset.originChain === 'astar') {
    //   if (!chainAsset.metadata.multilocation) {
    //     console.error('Astar assets should have multilocation: ', assetSlug);
    //   }
    // }
  }
});
