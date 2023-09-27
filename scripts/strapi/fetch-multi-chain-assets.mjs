import {gql} from "graphql-request";
import * as fs from "fs";
import {graphQLClient} from "./strapi-api.mjs";

const SAVE_PATH = './packages/chain-list/src/data/MultiChainAsset.json';

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
    const results = await graphQLClient.request(query);
    const chains = results.multiChainAssets.data.map(mAsset => {
        const attributes = mAsset.attributes;
        return {
            slug: attributes.slug,
            originChainAsset: attributes.originChainAsset.data?.attributes.slug,
            name: attributes.name,
            symbol: attributes.symbol,
            priceId: attributes.priceId,
            hasValue: attributes.hasValue,
            icon: attributes.icon.data?.attributes.url,
        }
    });
    const mAssetMap = Object.fromEntries(chains.map(chain => [chain.slug, chain]));

    // save to json file
    fs.writeFile(SAVE_PATH, JSON.stringify(mAssetMap, null, 2), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + SAVE_PATH);
        }
    });
}

main().catch((error) => console.error(error));
