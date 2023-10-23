import {DOWNLOAD_DIR, DOWNLOAD_LINK, downloadFile, writeJSONFile} from "./strapi-api.mjs";

const BRANCH_NAME = process.env.BRANCH_NAME || 'dev';
const SAVE_PATH = './packages/chain-list/src/data/ChainInfo.json';

const main = async () => {
    const apiUrl = BRANCH_NAME === 'master' ? 'https://content.subwallet.app/api/list/chain' : 'https://content.subwallet.app/api/list/chain?preview=true';
    const results = await fetch(apiUrl);
    const data = await results.json();
    const downloadDir = `${DOWNLOAD_DIR}/chains`;
    const chains = await Promise.all(data.map(async chain => {
        let iconURL = chain.icon;
        if (iconURL) {
            try {
                const newFileName = await downloadFile(iconURL, downloadDir, chain.slug.toLowerCase());
                iconURL = `${DOWNLOAD_LINK}/assets/chains/${newFileName}`;
                chain.icon = iconURL;
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
