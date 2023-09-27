import {gql} from "graphql-request";
import * as fs from "fs";
import {graphQLClient} from "./strapi-api.mjs";

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
    const chains = results.chainAssets.data.map(asset => {
        const attributes = asset.attributes;
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
            icon: attributes.icon?.data?.attributes.url
        }
    });

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
    fs.writeFile(SAVE_PATH, JSON.stringify(assetMap, null, 2), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + SAVE_PATH);
        }
    });

    // save to json file
    fs.writeFile(SAVE_REF_PATH, JSON.stringify(refMap, null, 2), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + SAVE_REF_PATH);
        }
    });
}

main().catch((error) => console.error(error));
