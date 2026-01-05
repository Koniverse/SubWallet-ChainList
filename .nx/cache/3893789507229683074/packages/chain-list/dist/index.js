import { Md5 as e } from "ts-md5";
import s from "./data/AssetLogoMap.json";
import n from "./data/AssetRef.json";
import i from "./data/ChainAsset.json";
import E from "./data/ChainInfo.json";
import m from "./data/ChainLogoMap.json";
import T from "./data/MultiChainAsset.json";
const B = E, b = i, x = n, P = T, V = s, y = m;
var h = /* @__PURE__ */ ((a) => (a.POLKADOT = "polkadot", a.KUSAMA = "kusama", a.MOONBEAM = "moonbeam", a.MOONRIVER = "moonriver", a.ETHEREUM = "ethereum", a.ACALA = "acala", a.KARURA = "karura", a.ALEPH_ZERO = "aleph", a.ASTAR = "astar", a.WESTEND = "westend", a.BINANCE = "binance", a.ASTAR_EVM = "astarEvm", a.HYDRADX = "hydradx_main", a.HYDRADX_TESTNET = "hydradx_rococo", a.ETHEREUM_SEPOLIA = "sepolia_ethereum", a.CHAINFLIP_POLKADOT = "chainflip_dot", a.MOONBASE = "moonbase", a.POLKADOT_ASSET_HUB = "statemint", a.KUSAMA_ASSET_HUB = "statemine", a.ROCOCO_ASSET_HUB = "rococo_assethub", a.ARBITRUM = "arbitrum_one", a))(h || {}), c = /* @__PURE__ */ ((a) => (a.DOT = "polkadot-NATIVE-DOT", a.ETH = "ethereum-NATIVE-ETH", a.KSM = "kusama-NATIVE-KSM", a.ETH_SEPOLIA = "sepolia_ethereum-NATIVE-ETH", a.PDOT = "chainflip_dot-NATIVE-pDOT", a.HDX = "hydradx_main-NATIVE-HDX", a.USDC_ETHEREUM = "ethereum-ERC20-USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", a.USDC_SEPOLIA = "sepolia_ethereum-ERC20-USDC-0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", a.HDX_TESTNET = "hydradx_rococo-NATIVE-HDX", a.USDT_HYDRADX_TESTNET = "hydradx_rococo-LOCAL-USDT", a.DOT_HYDRADX_TESTNET = "hydradx_rococo-LOCAL-DOT", a.USDT_ETHEREUM = "ethereum-ERC20-USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7", a))(c || {});
const K = [
  "polkadot",
  "kusama",
  "ethereum"
  /* ETHEREUM */
];
function X(a) {
  const { chainStatus: t, icon: o, providers: D, ...r } = a;
  return e.hashStr(JSON.stringify(r));
}
function k(a) {
  const { icon: t, ...o } = a;
  return e.hashStr(JSON.stringify(o));
}
export {
  V as AssetLogoMap,
  x as AssetRefMap,
  c as COMMON_ASSETS,
  h as COMMON_CHAIN_SLUGS,
  b as ChainAssetMap,
  B as ChainInfoMap,
  y as ChainLogoMap,
  P as MultiChainAssetMap,
  K as _DEFAULT_CHAINS,
  k as md5HashChainAsset,
  X as md5HashChainInfo
};
