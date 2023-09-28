import {gql} from "graphql-request";
import * as fs from "fs";
import {DOWNLOAD_DIR, DOWNLOAD_LINK, downloadFile, graphQLClient, removeDir, writeJSONFile} from "./strapi-api.mjs";

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
    const downloadDir = `${DOWNLOAD_DIR}/chains`;
    const chains = await Promise.all(results.chains.data.map(async chain => {
        const attributes = chain.attributes;
        const providers = Object.fromEntries(attributes.providers.map(provider => [provider.name, provider.url]));

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
            name: attributes.name,
            chainStatus: attributes.chainStatus,
            providers,
            isTestnet: attributes.isTestnet,
            substrateInfo: attributes.substrateInfo,
            evmInfo: attributes.evmInfo,
            icon: iconURL,
        }
    }));

    const chainMap = Object.fromEntries(chains.map(chain => [chain.slug, chain]));


    // save to json file
    await writeJSONFile(SAVE_PATH, chainMap);
}

main().catch((error) => console.error(error));
