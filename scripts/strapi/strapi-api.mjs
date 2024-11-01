import {GraphQLClient} from "graphql-request";
import axios from "axios";
import * as fs from "fs";
import path from "path";

// Init basic config
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const BRANCH_NAME = process.env.BRANCH_NAME || 'dev';

export const DOWNLOAD_DIR = './packages/chain-list-assets/public/assets';
export const DOWNLOAD_LINK = BRANCH_NAME === 'dev' ? 'https://dev.sw-chain-list-assets.pages.dev' : 'https://chain-list-assets.subwallet.app';

export const graphQLClient = new GraphQLClient(`${STRAPI_URL}/graphql`, {
    headers: {
        "Authorization": "Bearer " + STRAPI_TOKEN,
    },
});

export async function writeJSONFile(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("JSON saved to " + filePath);
    }
  })
}

export async function readJSONFile(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf-8', );

  return JSON.parse(data);
}

export async function writeChainInfoChange(filePath, changeMap, hashMap) {
  const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

  data.ChainInfo = changeMap;
  data.ChainInfoHashMap = hashMap;
  await writeJSONFile(filePath, data);
}

export async function writeChainAssetChange(filePath, changeMap, hashMap) {
  const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

  data.ChainAsset = changeMap;
  data.ChainAssetHashMap = hashMap;
  await writeJSONFile(filePath, data);
}

export async function writeMultiAssetChange(filePath, changeMap, hashMap) {
  const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

  data.MultiChainAsset = changeMap;
  data.MultiChainAssetHashMap = hashMap;
  await writeJSONFile(filePath, data);
}

export async function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function (entry) {
      const entryPath = path.join(dir, entry);
      if (fs.lstatSync(entryPath).isDirectory()) {
        removeDir(entryPath);
      } else {
        fs.unlinkSync(entryPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

export async function downloadFile (url, downloadDir, forceFileName = null) {
  // Create dir if not exist
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, {recursive: true});
  }

  // Download file with axios
  let fileName = url.split('/').pop();
  if (forceFileName) {
    fileName = forceFileName + '.' + fileName.split('.').pop();
  }
  const filePath = path.join(downloadDir, fileName);

  // Download and save file
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return await new Promise((resolve, reject) => {
    writer.on('finish', () => {
      resolve(fileName);
    });
    writer.on('error', reject);
  });
}

export const STABLE_VERSION = '0.2.92';
export const PATCH_VERSION = '0.2.93-beta.0'

export const PATCH_SAVE_PATH = `./packages/chain-list-assets/public/patch/${STABLE_VERSION}/data.json`;
