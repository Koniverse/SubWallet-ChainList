import {_ChainAsset, _MultiChainAsset} from "./packages/chain-list/src/types";
import fs from 'fs';

const MultiChainAsset = require('./packages/chain-list/src/data/MultiChainAsset.json') as Record<string, _MultiChainAsset>;
const ChainAsset = require('./packages/chain-list/src/data/ChainAsset.json') as Record<string, _ChainAsset>;

describe('test chain list', () => {
  it('multi chain asset', async () => {
    return new Promise<void>((resolve) => {
      const result: Record<string, _ChainAsset[]> = {};

      for (const multiChainAsset of Object.values(MultiChainAsset)) {
        result[multiChainAsset.slug] = Object.values(ChainAsset).filter((asset) => asset.multiChainAsset === multiChainAsset.slug);
      }

      fs.writeFile('./multi_chain.json', JSON.stringify(result, undefined, 2), () => {
        resolve();
      })
    })

  })
})
