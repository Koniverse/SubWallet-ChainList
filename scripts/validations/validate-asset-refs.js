import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };
import AssetRefMap from '../../packages/chain-list/src/data/AssetRef.json' assert { type: "json" };

Object.entries(AssetRefMap).forEach(([slug, assetRef]) => {
  const generatedSlug = `${assetRef.srcAsset}___${assetRef.destAsset}`;

  if (generatedSlug !== slug) {
    console.error('Invalid slug: ', slug);
  }

  if (assetRef.path === 'XCM') {
    const srcAsset = ChainAssetMap[assetRef.srcAsset];

    if (!srcAsset) {
      console.error('Asset not found: ', assetRef);
    } else {
      if (['astar', 'shiden', 'statemine', 'statemint', 'pioneer'].includes(srcAsset.originChain)) {
        if (!srcAsset?.metadata?.multilocation) {
          console.error('Token must have multilocation: ', assetRef.srcAsset);
        }
      } else if (['acala', 'karura'].includes(srcAsset.originChain) && srcAsset.assetType === 'NATIVE') {
        if (!srcAsset?.metadata?.multilocation) {
          console.error('Token must have multilocation: ', assetRef.srcAsset);
        }
      } else if (['moonbeam', 'moonbase', 'moonriver'].includes(srcAsset.originChain)) {
        if (!srcAsset?.metadata?.assetId) {
          console.error('Token must have assetId: ', assetRef.srcAsset);
        }

        if (!srcAsset?.metadata?.assetType) {
          console.error('Token must have assetType: ', assetRef.srcAsset);
        }
      }
    }
  }
});
