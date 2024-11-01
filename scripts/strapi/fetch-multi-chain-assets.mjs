import {gql} from "graphql-request";
import * as fs from "fs";
import {
  DOWNLOAD_DIR,
  DOWNLOAD_LINK,
  downloadFile,
  PATCH_SAVE_PATH,
  readJSONFile,
  writeMultiAssetChange
} from "./strapi-api.mjs";
import crypto from "crypto";

const SAVE_PATH = './packages/chain-list/src/data/MultiChainAsset.json';
const BRANCH_NAME = process.env.BRANCH_NAME || 'dev';

const query = gql`
query {
  multiChainAssets(pagination: {pageSize: 1000}, sort: "id:asc") {
    data {
      attributes {
        slug
        originChainAsset {
          data {
            attributes {
              slug
            }
          }
        }
        name
        symbol
        priceId
        hasValue
        icon {
          data {
            attributes {
              url
            }
          }
        }
      }
    }
  }
}

`;

const main = async () => {
    const oldMultiAssetMap = await readJSONFile(SAVE_PATH);
    const downloadDir = `${DOWNLOAD_DIR}/multi-chain-assets`;
    const apiUrl = BRANCH_NAME === 'master' ? 'https://content.subwallet.app/api/list/multi-chain-asset' : 'https://content.subwallet.app/api/list/multi-chain-asset?preview=true';
    const results = await fetch(apiUrl);
    const data = await results.json();

    const patchMultiAssetMap = {};
    const patchHashMap = {};

    const chains = await Promise.all(data.map(async mAsset => {
        let iconURL = mAsset.icon;
        if (iconURL) {
            try {
                const newFileName = await downloadFile(iconURL, downloadDir, mAsset.slug.toLowerCase());
                iconURL = `${DOWNLOAD_LINK}/assets/multi-chain-assets/${newFileName}`;
            } catch (e) {
                console.error(e);
            }
        }

        const newMultiAsset = {
            slug: mAsset.slug,
            originChainAsset: mAsset.originChainAsset,
            name: mAsset.name,
            symbol: mAsset.symbol,
            priceId: mAsset.priceId,
            hasValue: mAsset.hasValue,
            icon: iconURL,
        }

        if (!oldMultiAssetMap[mAsset.slug] || JSON.stringify(newMultiAsset) !== JSON.stringify(oldMultiAssetMap[newMultiAsset.slug])) {
          patchMultiAssetMap[mAsset.slug] = newMultiAsset;
          patchHashMap[mAsset.slug] = crypto.createHash('sha256').update(JSON.stringify(newMultiAsset)).digest('hex');
        }

        return newMultiAsset
    }));
    const mAssetMap = Object.fromEntries(chains.map(chain => [chain.slug, chain]));

    // save to json file
    await writeMultiAssetChange(PATCH_SAVE_PATH, patchMultiAssetMap, patchHashMap);
    fs.writeFile(SAVE_PATH, JSON.stringify(mAssetMap, null, 2), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + SAVE_PATH);
        }
    });
}

main().catch((error) => console.error(error));
