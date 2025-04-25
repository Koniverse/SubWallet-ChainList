import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };

const allSwapPairMap = {};

const chains = [
  'ethereum',
  'arbitrum_one',
  'optimism',
  'binance',
  'unichain',
  'polygon',
  'zksync_era',
  'world_chain',
  'base_mainnet',
  'celo',
  'avalanche_c',
  'blast_mainnet'
]

chains.forEach((chain) => {
  const assets = Object.values(ChainAssetMap).filter(asset => asset.originChain === chain);

  assets.forEach((asset1) => {
    assets.forEach((asset2) => {
      if (asset1.slug !== asset2.slug) {
        const srcAsset = asset1.slug;
        const destAsset = asset2.slug;
        const srcChain = chain;
        const destChain = chain;
        const path = 'SWAP';

        const slug = `${srcAsset}___${destAsset}`;

        allSwapPairMap[slug] = {
          srcAsset,
          destAsset,
          srcChain,
          destChain,
          path
        }
      }
    })
  })
})

console.log(`Number of path: ${Object.keys(allSwapPairMap).length}`);

try {
  const fileName = `exports/swap-pairs.json`;

  fs.mkdirSync('exports', { recursive: true });
  fs.writeFile(fileName, JSON.stringify(allSwapPairMap), function(err) {
    if (err) throw err;
    console.log(`Saved ${fileName} successfully`);
  });
} catch (err) {
  console.error(err);
}
