import {gql} from "graphql-request";
import * as fs from "fs";
import {DOWNLOAD_DIR, DOWNLOAD_LINK, downloadFile, graphQLClient, writeJSONFile} from "./strapi-api.mjs";

const SAVE_PATH = './packages/chain-list/src/data/ChainAsset.json';
const SAVE_REF_PATH = './packages/chain-list/src/data/AssetRef.json';

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
    const results = await graphQLClient.request(query);
    const downloadDir = `${DOWNLOAD_DIR}/chain-assets`;
    const chains = await Promise.all(results.chainAssets.data.map(async asset => {
        const attributes = asset.attributes;
        let iconURL = attributes.icon?.data?.attributes?.url;
        if (iconURL) {
            try {
                const newFileName = await downloadFile(iconURL, downloadDir, attributes.slug.toLowerCase());
                iconURL = `${DOWNLOAD_LINK}/assets/chain-assets/${newFileName}`;
            } catch (e) {
                console.error(e);
            }
        }

        return {
            originChain: attributes.originChain?.data?.attributes.slug,
            slug: attributes.slug,
            name: attributes.name,
            symbol: attributes.symbol,
            decimals: attributes.decimals,
            priceId: attributes.priceId,
            minAmount: attributes.minAmount,
            assetType: attributes.assetType,
            metadata: attributes.metadata,
            multiChainAsset: attributes.multiChainAsset?.data?.attributes.slug || null,
            hasValue: attributes.hasValue,
            icon: iconURL
        }
    }));

    const assetMap = Object.fromEntries(chains.map(chain => [chain.slug, chain]));

    const refMap = {}
    results.chainAssets.data.forEach((item)=> {
      const refs = item.attributes.assetRefs;
      refs.forEach((ref)=> {
        const srcAsset = assetMap[item.attributes.slug];
        const destSlug = ref.destAsset.data.attributes.slug
        const destAsset = assetMap[destSlug];
        refMap[`${item.attributes.slug}___${destSlug}`] = {
          srcAsset: item.attributes.slug,
          destAsset: destAsset.slug,
          srcChain: srcAsset.originChain,
          destChain: destAsset.originChain,
          path: ref.type
        }
      });
    });

    // save to json file
    await writeJSONFile(SAVE_PATH, assetMap);

    // save to json file
    await writeJSONFile(SAVE_REF_PATH, refMap);
}

main().catch((error) => console.error(error));
