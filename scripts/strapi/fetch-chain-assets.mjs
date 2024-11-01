import {gql} from "graphql-request";
import * as fs from "fs";
import {
  DOWNLOAD_DIR,
  DOWNLOAD_LINK,
  downloadFile,
  PATCH_SAVE_PATH,
  readJSONFile,
  writeChainAssetChange,
  writeJSONFile
} from "./strapi-api.mjs";
import crypto from "crypto";

const SAVE_PATH = './packages/chain-list/src/data/ChainAsset.json';
const SAVE_REF_PATH = './packages/chain-list/src/data/AssetRef.json';
const BRANCH_NAME = process.env.BRANCH_NAME || 'dev';

const query = gql`
query {
  chainAssets(pagination: {pageSize: 1000}, sort: "ordinal:asc") {
    data {
      attributes {
        originChain {
          data {
            attributes {
              slug
            }
          }
        }
        slug
        name
        symbol
        decimals
        priceId
        minAmount
        assetType
        metadata
        multiChainAsset {
          data {
            attributes {
              slug
            }
          }
        }
        hasValue
        icon {
          data {
            attributes {
              url
            }
          }
        }
        assetRefs {
          type
          metadata
          destAsset {
            data {
              attributes {
                slug
              }
            }
          }
        }
      }
    }
  }
}
`;

const main = async () => {
    const oldAssetMap = await readJSONFile(SAVE_PATH);
    const downloadDir = `${DOWNLOAD_DIR}/chain-assets`;
    const apiUrl = BRANCH_NAME === 'master' ? 'https://content.subwallet.app/api/list/chain-asset' : 'https://content.subwallet.app/api/list/chain-asset?preview=true';
    const results = await fetch(apiUrl);
    const data = await results.json();

    const patchAssetsMap = {};
    const patchHashMap = {};

    const assets = await Promise.all(data.map(async asset => {
        let iconURL = asset.icon;
        if (iconURL) {
            try {
                const newFileName = await downloadFile(iconURL, downloadDir, asset.slug.toLowerCase());
                iconURL = `${DOWNLOAD_LINK}/assets/chain-assets/${newFileName}`;
            } catch (e) {
                console.error(e);
            }
        }

        const newAsset = {
            originChain: asset.originChain,
            slug: asset.slug,
            name: asset.name,
            symbol: asset.symbol,
            decimals: asset.decimals,
            priceId: asset.priceId,
            minAmount: asset.minAmount,
            assetType: asset.assetType,
            metadata: asset.metadata,
            multiChainAsset: asset.multiChainAsset || null,
            hasValue: asset.hasValue,
            icon: iconURL
        }

        if (!oldAssetMap[asset.slug] || JSON.stringify(newAsset) !== JSON.stringify(oldAssetMap[asset.slug])) {
          patchAssetsMap[asset.slug] = newAsset;
          patchHashMap[asset.slug] = crypto.createHash('sha256').update(JSON.stringify(newAsset)).digest('hex');
        }

        return newAsset
    }));

    const assetMap = Object.fromEntries(assets.map(chain => [chain.slug, chain]));

    const refMap = {}
    data.forEach((item)=> {
      const refs = item.assetRefs;
      refs.forEach((ref)=> {
        const srcAsset = assetMap[item.slug];
        const destSlug = ref.destAsset;
        const destAsset = assetMap[destSlug];
        if (destAsset) {
          refMap[`${item.slug}___${destSlug}`] = {
            srcAsset: item.slug,
            destAsset: destAsset.slug,
            srcChain: srcAsset.originChain,
            destChain: destAsset.originChain,
            path: ref.type,
            metadata: ref.metadata ?? undefined
          }
        }
      });
    });


    // save to json file
    await writeChainAssetChange(PATCH_SAVE_PATH, patchAssetsMap, patchHashMap);
    await writeJSONFile(SAVE_PATH, assetMap);

    // save to json file
    await writeJSONFile(SAVE_REF_PATH, refMap);
}

main().catch((error) => console.error(error));
