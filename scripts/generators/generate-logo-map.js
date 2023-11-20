import fs from "fs";
import ChainInfoMap from '../../packages/chain-list/src/data/ChainInfo.json' assert { type: "json" };
import ChainAssetMap from '../../packages/chain-list/src/data/ChainAsset.json' assert { type: "json" };
import MultiChainAsset from '../../packages/chain-list/src/data/MultiChainAsset.json' assert { type: "json" };
import {DOWNLOAD_LINK} from "../strapi/strapi-api.mjs";

const DEFAULT_ICON = `${DOWNLOAD_LINK}/assets/default.png`;

const SpecialCustomToken = {
  "custom-moonbeam-ERC20-CP-0x6021D2C27B6FBd6e7608D1F39B41398CAee2F824": `${DOWNLOAD_LINK}/assets/custom-chain-assets/cp_77d5363018.png`,
  "custom-aleph-PSP22-ZPF-5ESKJbkpVa1ppUCmrkCmaZDHqm9SHihws9Uqqsoi4VrDCDLE": `${DOWNLOAD_LINK}/assets/custom-chain-assets/zpf_2f06de3f07.png`,
  "custom-custom-Substrate-gosnetwork-NATIVE-GOS": `${DOWNLOAD_LINK}/assets/custom-chain-assets/gos_a4d1a9cf7a.png`,
  "custom-custom-Substrate-gosspectral-NATIVE-GOST": `${DOWNLOAD_LINK}/assets/custom-chain-assets/gos_a4d1a9cf7a.png`
}

const SpecialCustomNetwork = {
  "custom-Substrate-gosnetwork": `${DOWNLOAD_LINK}/assets/custom-chains/gos_37cd7c233c.png`,
  "custom-Substrate-gosspectral": `${DOWNLOAD_LINK}/assets/custom-chains/gos_37cd7c233c.png`,
}

try {
  const chainLogoMap = {
    default: DEFAULT_ICON
  };

  Object.entries(ChainInfoMap).forEach(([slug, item]) => {
    chainLogoMap[slug] = item.icon || DEFAULT_ICON;
  });

  // For special custom network
  Object.entries(SpecialCustomNetwork).forEach(([network, logo]) => {
    if (!chainLogoMap[network] && logo) {
      chainLogoMap[network] = logo;
    }
  });

  const fileName = `packages/chain-list/src/data/ChainLogoMap.json`;
  fs.writeFile(fileName, JSON.stringify(chainLogoMap, undefined, 2), function(err) {
    if (err) throw err;
    console.log(`Update ${fileName} successfully`);
  });

  const assetLogoMap = {
    default: DEFAULT_ICON
  };
  Object.entries(ChainAssetMap).forEach(([slug, item]) => {
    if (item.slug && !assetLogoMap[item.slug.toLowerCase()] && item.icon) {
      assetLogoMap[item.slug.toLowerCase()] = item.icon || DEFAULT_ICON;
    }
  });

  Object.entries(MultiChainAsset).forEach(([slug, item]) => {
    if (item.slug && !assetLogoMap[item.slug.toLowerCase()] && item.icon) {
      assetLogoMap[item.slug.toLowerCase()] = item.icon || DEFAULT_ICON;
    }
  });

  // For special custom token
  Object.entries(SpecialCustomToken).forEach(([token, logo]) => {
    if (!assetLogoMap[token.toLowerCase()] && logo) {
      assetLogoMap[token.toLowerCase()] = logo;
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
