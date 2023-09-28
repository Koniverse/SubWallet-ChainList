import {gql} from "graphql-request";
import * as fs from "fs";
import {DOWNLOAD_DIR, DOWNLOAD_LINK, downloadFile, graphQLClient} from "./strapi-api.mjs";

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
    const downloadDir = `${DOWNLOAD_DIR}/multi-chain-assets`;
    const chains = await Promise.all(results.multiChainAssets.data.map(async mAsset => {
        const attributes = mAsset.attributes;

        let iconURL = attributes.icon?.data?.attributes?.url;
        if (iconURL) {
            try {
                const newFileName = await downloadFile(iconURL, downloadDir, attributes.slug.toLowerCase());
                iconURL = `${DOWNLOAD_LINK}/assets/chains/${newFileName}`;
            } catch (e) {
                console.error(e);
            }
        }

        return {
            slug: attributes.slug,
            originChainAsset: attributes.originChainAsset.data?.attributes.slug,
            name: attributes.name,
            symbol: attributes.symbol,
            priceId: attributes.priceId,
            hasValue: attributes.hasValue,
            icon: iconURL,
        }
    }));
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
