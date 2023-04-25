# Contributing to SubWallet-Chain
Your input is always welcome! This is a guide on how to contribute to this project as easy and transparent as possible, you can make the following contributions:
- Reporting a bug
- Proposing new integrations
- Update existing data
- Discussion/proposal about the project

## General guidelines
- Please be as transparent as you can be and provide as much useful information as you can
- Follow closely to the issue/PR templates
- For any technical issues, please tag @NamPhamc99
- For business inquiries and proposals, please tag @RyanDinh8 or @Mabel-Nguyen
- To contact the team, please refer to [this link](https://linktr.ee/subwallet.app)

## Making a pull request
1. Make sure you understand the schema and interfaces, otherwise you can raise an issue instead.
2. Fork the repo and create your branch from `master`.
3. Add your data.
4. We have a few validation scripts, please make sure your data passes before committing.
5. Make sure your code lints.
6. Issue that pull request for review!

## Raising an issue
We have provided an *issue template*, so you can easily fill in the necessary information

## Project status
- Support Substrate-based and EVM chains
- Support ERC20, ERC721 tokens for EVM chains
- Support PSP22, PSP34 for Substrate chains with contract pallet

## A few notes about integration
**Using slug is a little bit tricky, but it provides a semantic key that is readable and easier to scale with JSON files. Please make sure that the slugs align to ensure the consistency of the data**

1. Adding a blockchain
   - Make sure to add a corresponding native token in ChainAsset
   - Make sure the information of the native token aligns with the blockchain
2. Adding a local token
   - A local token is any token that is not native token (not used to pay transaction fee) but has support out-of-the-box from the blockchain
   - Make sure to add all the metadata and on-chain information of the token to ensure everything works properly
3. Adding a smart contract token
   - Please provide some reference to prove your smart contract is legit and your project has users/holders
   - Under metadata field of the token, please fill in the contract address
4. Slug convention
   - Chain: a short, compact string (use "_" as separator if you need to). Ex: `polkadot`, `aventus_polkadot`
   - Chain asset: `ORIGIN_CHAIN-ASSET_TYPE-ASSET_SYMBOL`
     - For smart contract asset, please also add contract address at the end `ORIGIN_CHAIN-ASSET_TYPE-ASSET_SYMBOL_CONTRACT_ADDRESS`. Ex: `ethereum-ERC20-USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7`
     - Native/local token example: `polkadot-NATIVE-DOT`, `moonbeam-LOCAL-xcDOT`
   - Multichain asset: `SYMBOL-ASSET_NAME` (just need to make sure that it's unique)
