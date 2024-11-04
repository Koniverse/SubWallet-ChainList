import {DOWNLOAD_DIR, DOWNLOAD_LINK, downloadFile, PATCH_SAVE_PATH, readJSONFile, writeChainInfoChange, writeJSONFile} from "./strapi-api.mjs";
import crypto from 'crypto'
const BRANCH_NAME = process.env.BRANCH_NAME || 'dev';
const SAVE_PATH = './packages/chain-list/src/data/ChainInfo.json';

const main = async () => {
    const oldChainMap = await readJSONFile(SAVE_PATH);
    const apiUrl = BRANCH_NAME === 'master' ? 'https://content.subwallet.app/api/list/chain' : 'https://content.subwallet.app/api/list/chain?preview=true';
    const results = await fetch(apiUrl);
    const data = await results.json();
    const downloadDir = `${DOWNLOAD_DIR}/chains`;

    const patchChainsMap = {};
    const patchHashMap = {};

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

        chain.ordinal && delete chain.ordinal;

        if (!oldChainMap[chain.slug] || JSON.stringify(chain) !== JSON.stringify(oldChainMap[chain.slug])) {
          patchChainsMap[chain.slug] = chain;

          const { providers, chainStatus, ...chainWithoutProvidersAndStatus } = chain;

          patchHashMap[chain.slug] = crypto.createHash('md5').update(JSON.stringify(chainWithoutProvidersAndStatus)).digest('hex');
        }

        return chain;
    }));

    const chainMap = Object.fromEntries(chains.map(chain => [chain.slug, chain]));

    // Check deleted chain
    const deletedChain = Object.keys(oldChainMap).filter((element) => !Object.keys(chainMap).includes(element));
    if (deletedChain.length) {
      deletedChain.forEach((chainSlug) => {
        const chain = oldChainMap[chainSlug];
        chain.chainStatus = "INACTIVE";
        patchChainsMap[chainSlug] = chain;

        const { providers, chainStatus, ...chainWithoutProvidersAndStatus } = chain;

        patchHashMap[chainSlug] = crypto.createHash('md5').update(JSON.stringify(chainWithoutProvidersAndStatus)).digest('hex');
      })
    }

    // save to json file
    await writeChainInfoChange(PATCH_SAVE_PATH, patchChainsMap, patchHashMap);
    await writeJSONFile(SAVE_PATH, chainMap);
}

main().catch((error) => console.error(error));
