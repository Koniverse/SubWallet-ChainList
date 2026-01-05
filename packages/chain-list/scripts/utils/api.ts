import { GraphQLClient } from "graphql-request";
import axios, { AxiosResponse } from "axios";
import * as fs from "fs";
import path from "path";

// Init basic config
const STRAPI_TOKEN: string | undefined = process.env.STRAPI_TOKEN;
const STRAPI_URL: string = process.env.STRAPI_URL || 'http://localhost:1337';

export const DATA_DIR = './src/data';
export const DOWNLOAD_DIR = './src/public/assets';
export const DOWNLOAD_LINK = '';

export const DEFAULT_ICON = '/assets/default.png';

export const graphQLClient: GraphQLClient = new GraphQLClient(`${STRAPI_URL}/graphql`, {
    headers: {
        "Authorization": "Bearer " + STRAPI_TOKEN,
    },
});

export function getData<T>(url: string) {
  return axios.get<T>(url).then(res => res.data);
}

export async function writeJSONFile(filePath: string, data: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("JSON saved to " + filePath);
        resolve();
      }
    });
  });
}

export async function readJSONFile<T = unknown>(filePath: string): Promise<T> {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

export async function removeDir(dir: string): Promise<void> {
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

export async function downloadFile(
  url: string, 
  downloadDir: string, 
  forceFileName: string | null = null
): Promise<string> {
  // Create dir if not exist
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  // Download file with axios
  let fileName: string = url.split('/').pop() || 'download';
  if (forceFileName) {
    const extension = fileName.split('.').pop();
    fileName = forceFileName + '.' + extension;
  }
  const filePath: string = path.join(downloadDir, fileName);

  // Download and save file
  const writer = fs.createWriteStream(filePath);

  const response: AxiosResponse = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return await new Promise<string>((resolve, reject) => {
    writer.on('finish', () => {
      resolve(fileName);
    });
    writer.on('error', reject);
  });
}
