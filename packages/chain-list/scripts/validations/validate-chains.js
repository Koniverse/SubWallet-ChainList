import ChainInfoMap from '../../src/data/ChainInfo.json' with { type: "json" };
import ChainAssetMap from '../../src/data/ChainAsset.json' with { type: "json" };

// Last update: 10/4/2023
// Validations:
// Count number of native tokens and number of chains
// Validate chain and native token slug

const chainCount = Object.keys(ChainInfoMap).length;

console.log('Total chains: ', chainCount);

Object.entries(ChainInfoMap).forEach(([chainSlug, chainInfo]) => {
  if (chainInfo.slug !== chainSlug) {
    console.error('Error chain slug: ', chainSlug);
  }

  const symbol = chainInfo?.evmInfo ? chainInfo?.evmInfo?.symbol : chainInfo?.substrateInfo?.symbol;
  const decimals = chainInfo?.evmInfo ? chainInfo?.evmInfo?.decimals : chainInfo?.substrateInfo?.decimals;
  const nativeTokenSlug = `${chainInfo.slug}-NATIVE-${symbol}`;

  if (!(nativeTokenSlug in ChainAssetMap)) {
    console.error('Cannot find native token for chain: ', chainSlug);
  } else {
    const nativeToken = ChainAssetMap[nativeTokenSlug];

    if (nativeToken.symbol !== symbol || nativeToken.decimals !== decimals) {
      console.error('Error symbol/decimals for native token: ', nativeTokenSlug);
    }
  }
});
