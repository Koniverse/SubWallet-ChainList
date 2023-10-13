import {gql} from "graphql-request";
import * as fs from "fs";
import {DOWNLOAD_DIR, DOWNLOAD_LINK, downloadFile, graphQLClient, removeDir, writeJSONFile} from "./strapi-api.mjs";

const SAVE_PATH = './packages/chain-list/src/data/ChainInfo.json';

const main = async () => {
    const results = await fetch('https://content.subwallet.app/api/list/chain');
    const data = await results.json();
    const downloadDir = `${DOWNLOAD_DIR}/chains`;
    const chains = await Promise.all(data.map(async chain => {
        let iconURL = chain.icon;
        if (iconURL) {
            try {
                const newFileName = await downloadFile(iconURL, downloadDir, chain.slug.toLowerCase());
                iconURL = `${DOWNLOAD_LINK}/assets/chains/${newFileName}`;
            } catch (e) {
                console.error(e);
            }
        }

        chain.ordinal&& delete chain.ordinal;

        return chain
    }));

    const chainMap = Object.fromEntries(chains.map(chain => [chain.slug, chain]));


    // save to json file
    await writeJSONFile(SAVE_PATH, chainMap);
}

main().catch((error) => console.error(error));
