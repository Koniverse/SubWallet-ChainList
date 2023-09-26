import fs from "fs";
import ChainInfoMap from '../../packages/chain-list/src/data/ChainInfo.json' assert { type: "json" };
import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };

const BRANCH_NAME = process.env.BRANCH_NAME || 'dev';
const LOGO_URL = `https://raw.githubusercontent.com/Koniverse/SubWallet-Chain/${BRANCH_NAME}/packages/chain-list/src/logo`;

const SpecialCustomToken = {
  "custom-moonbeam-ERC20-CP-0x6021D2C27B6FBd6e7608D1F39B41398CAee2F824": 'cp.png',
  "custom-aleph-PSP22-ZPF-5ESKJbkpVa1ppUCmrkCmaZDHqm9SHihws9Uqqsoi4VrDCDLE": 'zpf.png'
}

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
    if (item.slug && !assetLogoMap[item.slug.toLowerCase()] && item.icon) {
      assetLogoMap[item.slug.toLowerCase()] = `${LOGO_URL}/${item.icon}`;
    }
  });

  // For special custom token
  Object.entries(SpecialCustomToken).forEach(([token, logo]) => {
    if (!assetLogoMap[token.toLowerCase()] && logo) {
      assetLogoMap[token.toLowerCase()] = `${LOGO_URL}/${logo}`;
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
