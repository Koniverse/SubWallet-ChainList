import { getData, writeJSONFile } from '../utils/api.ts';
import { compareData, CompareMap } from '../utils/compare.ts';
import { _ChainAsset, _ChainInfo } from '../../src/types.ts';

const FROM_VERSION = '0.2.116';
const TO_VERSION = "0.2.117-beta.2";

export interface LoopInput<T> {
  key: string;
  from?: T;
  to?: T;
  changes?: CompareMap;
  add?: T;
  remove?: T;
}

export async function getChanges<T>(dataType: string, loops?: (lInput: LoopInput<T>) => void) {
  const fromData =  await getData<Record<string, any>>(`https://cdn.jsdelivr.net/npm/@subwallet/chain-list@${FROM_VERSION}/data/${dataType}.json`);
  const toData = await getData<Record<string, any>>(`https://cdn.jsdelivr.net/npm/@subwallet/chain-list@${TO_VERSION}/data/${dataType}.json`);
  const fromKeys = Object.keys(fromData);
  const toKeys = Object.keys(toData);
  const allKeys = Array.from(new Set([...fromKeys, ...toKeys])).sort();

  const changes = {} as Record<string, CompareMap>;
  const add = {} as Record<string, T>;
  const remove = {} as Record<string, T>;

  for (const k of allKeys) {
    if (fromData[k] && toData[k]) {
      const rs = compareData<Record<string, T>>(fromData[k], toData[k], ['icon'])
      if (Object.keys(rs).length > 0) {
        changes[k] = rs;
      }
    } else if (fromData[k]) {
      remove[k] = fromData[k]
    } else if (toData[k]) {
      add[k] = toData[k]
    }

    if (loops) {
      loops({
        key: k,
        from: fromData[k],
        to: toData[k],
        changes: changes[k],
        add: add[k],
        remove: remove[k]
      });
    }
  }

  return { changes, add, remove };
}

const chainUpdates = await getChanges<_ChainInfo>('ChainInfo');
const chainAssetChanges = {} as Record<string, Record<string, any>>;
const assetUpdates = await getChanges<_ChainAsset>('ChainAsset', ({key, from, to, changes, add, remove}) => {
  const chainSlug = from?.originChain || to?.originChain || '';

  if (!chainSlug) {
    return;
  }

  if (add || remove || changes) {
   if (!chainAssetChanges[chainSlug]) {
      chainAssetChanges[chainSlug] = {};
    }
    chainAssetChanges[chainSlug][key] = {
      add,
      remove,
      changes
    }
  }
});

// Export chainUpdates to ../export-data/chain-updates.json
await writeJSONFile('../export-data/chain-updates.json', chainUpdates);

await writeJSONFile('../export-data/assets-update.json', chainAssetChanges);


// for (const key of DATA_KEYs) {
//   const { changes, add, remove } = await getChanges(key);
//
//   console.log(`=========================================================`);
//   console.log(`Changes in ${key} from version ${FROM_VERSION} to ${TO_VERSION}:`);
//   console.log('Added:');
//   Object.values(add).forEach((v) => {
//     console.log(`${v.name} (${v.slug})`)
//   })
//   console.log('Removed:');
//   Object.values(remove).forEach((v) => {
//     console.log(`${v.name} (${v.slug})`)
//   })
//   console.log('Modified:');
//   console.log(changes);
//   console.log(`=========================================================`);
// }