import ChainInfoMap from '../../src/data/ChainInfo.json' with { type: "json" };
import fs from "fs";

const chainRpcMap = {}

Object.entries(ChainInfoMap).forEach(([chainSlug, chainInfo]) => {
  if (!!chainInfo.substrateInfo && chainInfo.chainStatus === 'ACTIVE') {
    chainRpcMap[chainSlug] = Object.values(chainInfo.providers);
  }
});

console.log(`List legacy chains: ${chainRpcMap}`);

try {
  const fileName = `exports/chain-rpcs.json`;

  fs.mkdirSync('exports', { recursive: true });
  fs.writeFile(fileName, JSON.stringify(chainRpcMap), function(err) {
    if (err) throw err;
    console.log(`Saved ${fileName} successfully`);
  });
} catch (err) {
  console.error(err);
}
