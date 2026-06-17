#!/usr/bin/env node

import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const DEFAULT_CHAIN_INFO_PATH = './packages/chain-list/src/data/ChainInfo.json';

function parseArgs (args) {
  const options = {
    chainInfoPath: DEFAULT_CHAIN_INFO_PATH,
    dryRun: false,
    keepTemp: false,
    viemVersion: process.env.VIEM_VERSION || null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--keep-temp') {
      options.keepTemp = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--chain-info') {
      options.chainInfoPath = args[++i];
    } else if (arg.startsWith('--chain-info=')) {
      options.chainInfoPath = arg.slice('--chain-info='.length);
    } else if (arg === '--viem-version') {
      options.viemVersion = args[++i];
    } else if (arg.startsWith('--viem-version=')) {
      options.viemVersion = arg.slice('--viem-version='.length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp () {
  console.log(`Usage: yarn migrate-multicall3 [options]

Options:
  --viem-version <version>  viem version to source chain definitions from.
                            Defaults to npm latest, or VIEM_VERSION when set.
  --chain-info <path>      ChainInfo.json path. Defaults to ${DEFAULT_CHAIN_INFO_PATH}.
  --dry-run                Print summary without writing ChainInfo.json.
  --keep-temp              Keep downloaded viem package in temp for debugging.
  -h, --help               Show this help message.
`);
}

function normalize (value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function npmViewLatestViemVersion () {
  return execFileSync('npm', ['view', 'viem', 'version', '--silent'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  }).trim();
}

function npmPackViem (version, tempDir) {
  const output = execFileSync('npm', ['pack', `viem@${version}`, '--pack-destination', tempDir, '--silent'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  }).trim();

  const tarballName = output.split('\n').filter(Boolean).pop();

  if (!tarballName) {
    throw new Error('Unable to determine viem tarball name from npm pack output');
  }

  return path.join(tempDir, tarballName);
}

function extractTarball (tarballPath, tempDir) {
  const extractDir = path.join(tempDir, 'extract');

  fs.mkdirSync(extractDir, { recursive: true });
  execFileSync('tar', ['-xzf', tarballPath, '-C', extractDir], {
    stdio: ['ignore', 'inherit', 'inherit']
  });

  return path.join(extractDir, 'package');
}

function readViemMulticall3Map (viemPackageDir) {
  const definitionsDir = path.join(viemPackageDir, 'chains', 'definitions');
  const byId = new Map();

  for (const file of fs.readdirSync(definitionsDir).filter((file) => file.endsWith('.ts'))) {
    const source = fs.readFileSync(path.join(definitionsDir, file), 'utf8');
    const idMatch = source.match(/\bid:\s*([0-9_]+)/);
    const addressMatch = source.match(/\bmulticall3:\s*{[\s\S]*?\baddress:\s*['"]([^'"]+)['"]/);

    if (!idMatch || !addressMatch) {
      continue;
    }

    const id = Number(idMatch[1].replace(/_/g, ''));
    const entry = {
      address: addressMatch[1],
      file,
      key: path.basename(file, '.ts'),
      normalizedKey: normalize(path.basename(file, '.ts'))
    };

    if (!byId.has(id)) {
      byId.set(id, []);
    }

    byId.get(id).push(entry);
  }

  return byId;
}

function findMulticall3 (chain, viemMulticall3ById) {
  const entries = viemMulticall3ById.get(chain.evmInfo.evmChainId);

  if (!entries) {
    return { address: null, reason: 'missing' };
  }

  const uniqueAddresses = [...new Set(entries.map((entry) => entry.address.toLowerCase()))];

  if (uniqueAddresses.length === 1) {
    return { address: entries[0].address, reason: 'matched' };
  }

  const candidates = [chain.slug, chain.name].map(normalize).filter(Boolean);
  const exact = entries.find((entry) => candidates.includes(entry.normalizedKey));

  if (exact) {
    return { address: exact.address, reason: 'matched-by-name' };
  }

  const partial = entries.find((entry) =>
    candidates.some((candidate) => candidate.includes(entry.normalizedKey) || entry.normalizedKey.includes(candidate))
  );

  if (partial) {
    return { address: partial.address, reason: 'matched-by-name' };
  }

  return {
    address: null,
    reason: 'ambiguous',
    candidates: entries.map((entry) => `${entry.key}:${entry.address}`)
  };
}

function migrateChainInfo (chainInfo, viemMulticall3ById) {
  const stats = {
    ambiguous: [],
    filled: 0,
    missing: [],
    totalEvm: 0,
    unchanged: 0,
    updated: 0
  };

  for (const [slug, chain] of Object.entries(chainInfo)) {
    if (!chain.evmInfo) {
      continue;
    }

    stats.totalEvm++;

    const { address, reason, candidates } = findMulticall3(chain, viemMulticall3ById);
    const previous = chain.evmInfo.multicall3 ?? null;
    const { evmChainId, multicall3: _previousMulticall3, ...rest } = chain.evmInfo;

    chain.evmInfo = {
      evmChainId,
      multicall3: address,
      ...rest
    };

    if (previous === address) {
      stats.unchanged++;
    } else {
      stats.updated++;
    }

    if (address) {
      stats.filled++;
    } else if (reason === 'ambiguous') {
      stats.ambiguous.push({ slug, evmChainId, candidates });
    } else {
      stats.missing.push({ slug, evmChainId });
    }
  }

  return stats;
}

function printStats (stats, viemVersion, chainInfoPath, dryRun) {
  console.log(`viem version: ${viemVersion}`);
  console.log(`chain info: ${chainInfoPath}`);
  console.log(`mode: ${dryRun ? 'dry-run' : 'write'}`);
  console.log(`EVM chains: ${stats.totalEvm}`);
  console.log(`filled multicall3: ${stats.filled}`);
  console.log(`null multicall3: ${stats.missing.length + stats.ambiguous.length}`);
  console.log(`updated entries: ${stats.updated}`);
  console.log(`unchanged entries: ${stats.unchanged}`);

  if (stats.ambiguous.length) {
    console.log('\nAmbiguous viem chain ids, left as null:');
    stats.ambiguous.forEach(({ slug, evmChainId, candidates }) => {
      console.log(`- ${slug} (${evmChainId}): ${candidates.join(', ')}`);
    });
  }

  if (stats.missing.length) {
    console.log('\nNo viem multicall3 definition, left as null:');
    stats.missing.forEach(({ slug, evmChainId }) => {
      console.log(`- ${slug} (${evmChainId})`);
    });
  }
}

async function main () {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const chainInfoPath = path.resolve(process.cwd(), options.chainInfoPath);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'subwallet-viem-'));

  try {
    const viemVersion = options.viemVersion || npmViewLatestViemVersion();
    const tarballPath = npmPackViem(viemVersion, tempDir);
    const viemPackageDir = extractTarball(tarballPath, tempDir);
    const viemMulticall3ById = readViemMulticall3Map(viemPackageDir);
    const chainInfo = JSON.parse(fs.readFileSync(chainInfoPath, 'utf8'));
    const stats = migrateChainInfo(chainInfo, viemMulticall3ById);

    printStats(stats, viemVersion, options.chainInfoPath, options.dryRun);

    if (!options.dryRun) {
      fs.writeFileSync(chainInfoPath, `${JSON.stringify(chainInfo, null, 2)}\n`);
      console.log(`\nUpdated ${options.chainInfoPath}`);
    }
  } finally {
    if (options.keepTemp) {
      console.log(`\nTemp dir: ${tempDir}`);
    } else {
      fs.rmSync(tempDir, { force: true, recursive: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
