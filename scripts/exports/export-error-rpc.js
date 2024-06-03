import createApiRequest from '../../utils/baseApi.js'
import Bluebird from 'bluebird'
import {Web3} from 'web3'
import {ApiPromise, WsProvider} from '@polkadot/api'
import fs from 'fs'


const URL_GET_CHAIN = 'https://static-data.subwallet.app/chains/list.json'
const CHAIN_TYPE = {
  EVM: 'evm',
  SUBSTRATE: 'substrate',
}
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

const getChains = async (url = URL_GET_CHAIN) => {

  const {success, data} = await createApiRequest({
    url,
    method: 'GET',
  })
  if (!success) {
    throw new Error(`Cannot get info chain`)
  }

  return data
}

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

const checkHealthEvmRpc = async (url) => {
  try {
    const web3 = new Web3(url)
    await web3.eth.getBlockNumber()

    return STATUS.ACTIVE
  } catch (err) {

    return STATUS.INACTIVE
  }
}

const checkHealthSubstrateRpc = async (url) => {
  try {
    let provider
    if (url.startsWith('light://')) {
      return STATUS.ACTIVE
    } else {
      provider = new WsProvider(url)
    }
    if (!provider) {
      return STATUS.INACTIVE
    }

    const api = await ApiPromise.create({provider})
    await api.rpc.chain.getFinalizedHead()
    await api.disconnect()
    console.log("Done check checkHealthSubstrateRpc", url)

    return STATUS.ACTIVE
  } catch (err) {
    console.log("checkHealthSubstrateRpc error", url, err)
    return STATUS.INACTIVE
  }
}

const checkHealthSubstrateRpcWithTimeout = (url, timeout = 60000) => {
  return Promise.race([
    checkHealthSubstrateRpc(url),
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("Timeout reached for", url);
        resolve(STATUS.INACTIVE);
      }, timeout)
    )
  ]);
};

const _checkHealthRpc = async (type = CHAIN_TYPE.SUBSTRATE, url) => {
  console.log("_checkHealthRpc", url)
  if (!isValidUrl(url)) {
    console.log("invalid url", url)
    return STATUS.INACTIVE
  }

  if (type === CHAIN_TYPE.EVM) {
    return checkHealthEvmRpc(url)
  }

  return checkHealthSubstrateRpcWithTimeout(url)
}

const getErrorRpc = async (chainInfo) => {

  if (!chainInfo.substrateInfo && !chainInfo.evmInfo) {
    return {}
  }

  const providers = chainInfo.providers
  const rpcs = []
  for (const provider in chainInfo.providers) {
    rpcs.push({name: provider, url: providers[provider]})
  }

  if (!chainInfo.providers) {
    return {}
  }
  const chainType = !!chainInfo.substrateInfo ? CHAIN_TYPE.SUBSTRATE : CHAIN_TYPE.EVM

  const errorRpcs = {}
  await Bluebird.each(rpcs, async (rpc) => {
    if (await _checkHealthRpc(chainType, rpc.url) === STATUS.INACTIVE) {
      errorRpcs[rpc.name] = rpc.url
    }
  }, {concurrency: 10})

  return errorRpcs
}

const writeFileSync = (data) => {
  const fileName = `exports/error-rpc.json`
  fs.mkdirSync('exports', {recursive: true})
  const jsonData = JSON.stringify(data, null, 2)

  fs.writeFileSync(fileName, jsonData, function (err) {
      if (err) throw err
      console.log('complete')
    }
  )

}
const checkHealthRpc = async () => {
  const chains = await getChains()
  const errorChain = []
  await Bluebird.map(chains, async (chainInfo) => {
    const errorRpcs = await getErrorRpc(chainInfo)
    console.log('errorRpcs', chainInfo.name, errorRpcs)
    if (!(Object.entries(errorRpcs).length === 0 && errorRpcs.constructor === Object)) {
      errorChain.push({
        slug: chainInfo.slug,
        name: chainInfo.name,
        status: chainInfo.chainStatus,
        errorRpcs,
      })
    }

  }, {concurrency: 20})

  writeFileSync(errorChain)
}

setImmediate(async () => {

  try {

    await checkHealthRpc()

    process.exit()


  } catch (err) {
    console.error(err)
  }
})
