import fs from "fs";

const assetMapPath = 'packages/chain-list/src/data/ChainAsset.json';
const multiChainAssetMapPath = 'packages/chain-list/src/data/MultiChainAsset.json';

const assetMap = JSON.parse(fs.readFileSync(assetMapPath).toString());
const multiChainAssetMap = JSON.parse(fs.readFileSync(multiChainAssetMapPath).toString());


for (const value of Object.values(multiChainAssetMap)) {
  if (!value.icon) {
    if (value.originChainAsset) {
      value.icon = assetMap[value.originChainAsset].icon
    } else {
      const asset = Object.values(assetMap).find((item) => item.multiChainAsset === value.slug);
      if (asset) {
        value.icon = asset.icon
      } else {
        value.icon = 'default.png'
      }
    }
  }
}

fs.writeFileSync(multiChainAssetMapPath, JSON.stringify(multiChainAssetMap, undefined, 2))
