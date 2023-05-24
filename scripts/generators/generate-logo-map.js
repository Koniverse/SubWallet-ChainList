import fs from "fs";
import ChainInfoMap from '../../packages/chain-list/src/data/ChainInfo.json' assert { type: "json" };
import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };

const BRANCH_NAME = process.env.BRANCH_NAME || 'master';
const LOGO_URL = `https://raw.githubusercontent.com/Koniverse/SubWallet-Chain/${BRANCH_NAME}/packages/chain-list/src/logo`;

try {
  const chainLogoMap = {
    default: `${LOGO_URL}/default.png`
  };

  Object.entries(ChainInfoMap).forEach(([slug, item]) => {
    chainLogoMap[slug] = `${LOGO_URL}/${item.icon}`;
  });

  const fileName = `packages/chain-list/src/data/ChainLogoMap.json`;
  fs.writeFile(fileName, JSON.stringify(chainLogoMap, undefined, 2), function(err) {
    if (err) throw err;
    console.log(`Update ${fileName} successfully`);
  });

  const assetLogoMap = {
    default: `${LOGO_URL}/default.png`
  };
  Object.entries(ChainAssetMap).forEach(([slug, item]) => {
    if (item.symbol && !assetLogoMap[item.symbol.toLowerCase()] && item.icon) {
      assetLogoMap[item.symbol.toLowerCase()] = `${LOGO_URL}/${item.icon}`;
    }
  });

  const fileName2 = `packages/chain-list/src/data/AssetLogoMap.json`;
  fs.writeFile(fileName2, JSON.stringify(assetLogoMap, undefined, 2), function(err) {
    if (err) throw err;
    console.log(`Update ${fileName2} successfully`);
  });

} catch (err) {
  console.error(err);
}
