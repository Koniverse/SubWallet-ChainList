import {gql} from "graphql-request";
import * as fs from "fs";
import {graphQLClient} from "./strapi-api.mjs";

const SAVE_PATH = './packages/chain-list/src/data/ChainInfo.json';

const query = gql`
query {
  chains (pagination: {pageSize: 1000}, sort: "ordinal:asc") {
    data {
      attributes {
        slug
        name
        chainStatus
        providers {
          name
          url
        }
        isTestnet
        substrateInfo {
          paraId
          relaySlug
          genesisHash
          addressPrefix
          crowdloanUrl
          chainType
          blockExplorer
          symbol
          existentialDeposit
          decimals
          supportStaking
          hasNativeNft
          supportSmartContract
        }
        evmInfo {
          evmChainId
          blockExplorer
          symbol
          decimals
          existentialDeposit
          supportSmartContract
          abiExplorer
        }
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
    const chains = results.chains.data.map(chain => {
        const attributes = chain.attributes;
        const providers = Object.fromEntries(attributes.providers.map(provider => [provider.name, provider.url]));
        return {
            slug: attributes.slug,
            name: attributes.name,
            chainStatus: attributes.chainStatus,
            providers,
            isTestnet: attributes.isTestnet,
            substrateInfo: attributes.substrateInfo,
            evmInfo: attributes.evmInfo,
            icon: attributes.icon?.data?.attributes?.url,
        }
    });
    const chainMap = Object.fromEntries(chains.map(chain => [chain.slug, chain]));

    // save to json file
    fs.writeFile(SAVE_PATH, JSON.stringify(chainMap, null, 2), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + SAVE_PATH);
        }
    });
}

main().catch((error) => console.error(error));
