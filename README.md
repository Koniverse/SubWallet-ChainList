# SubWallet-Chain
**This is the repository to integrate, contain all information about projects/chains/assets available on SubWallet's products.** <br>

## Scope of this project
- Provide a coherent schema and interfaces for projects/chains/assets across blockchains
- Showing relationships between projects/chains/assets
- Track development status
- Provide metadata/on-chain information about chains and assets
- Provide general, non-tech information (website, description, social media,...) about chains and assets
- Allowing partners/teams to easily integrate with SubWallet products

## Schema
```mermaid
erDiagram
    CHAIN {
        string slug  "contains basic, general, non-tech information about a blockchain"
        string name
        string logo
        string description
        enum status "ACTIVE | INACTIVE | STOPPED: to show the current state of a chain"
    }

    EVM_CHAIN {
        int chainId
        string hexChainId
        string blockExplorer
    }

    SUBSTRATE_CHAIN {
        int paraId
        string genesisHash
        int addressPrefix
        string category "RELAYCHAIN | PARACHAIN"
    }

    CHAIN_PROVIDER {
        string endpoint
        string providerMode
    }

    CHAIN_ASSET {
        string originChain FK "The chain which token originated from"
        int multiChainAssetId FK "points to a multi-chain asset"
        string symbol
        int decimals
        string priceId "higher priority than multi-chain asset's priceId - using CoinGecko"
        string minAmount

        enum assetType "NATIVE | ERC20 | ERC721 | PSP34 | PSP22 | LOCAL"
    }

    MULTI_CHAIN_ASSET {
        string originChainAssetId FK "point to the origin asset"
        string slug
        string name
        string symbol
        string origin
        string priceId
    }

    ASSET_REF {
        int id_ PK "showing how a token can be converted to another"
        string srcTokenId FK
        string destTokenId FK
        string path "XCM | SWAP : path which asset can be converted"
    }

    PROJECT_CATEGORY {
        string category
    }

    PROJECT {
        string name
        string description
        string appUrl
        string discord
        string twitter
        string github
        string telegram
        string website
        enum status
    }

    CHAIN ||--o| EVM_CHAIN : is
    CHAIN ||--o| SUBSTRATE_CHAIN : is
    CHAIN_ASSET }|--|| MULTI_CHAIN_ASSET: "can be"
    CHAIN_ASSET ||--|| MULTI_CHAIN_ASSET: "originate from"
    ASSET_REF }o--o{ CHAIN_ASSET : has
    CHAIN ||--|{ CHAIN_ASSET : has
    CHAIN }o--o{ PROJECT : has
    PROJECT }|--|{ PROJECT_CATEGORY : belongs
    CHAIN_PROVIDER }|--|| CHAIN : has
    PROJECT }o--o{ CHAIN_ASSET: has
```
**Note: The current interfaces and json files do not necessarily follow this exact schema. The schema demonstrates the abstraction and relationships of the data**

### Explanation
- **Chain**: A blockchain, can be Polkadot, Kusama, Ethereum,...
- **EVM_Chain, SUBSTRATE_CHAIN**: blockchain type, contains technical information about a blockchain, a blockchain can be a mix between many types
- **Chain asset**: a token, NFT collection,... that originates from a blockchain
- **Multichain asset**: a high-level abstraction representation of an asset across many blockchains, it might have an on-chain origin or not
- **Asset reference**: showing path in which an asset can be converted to another
- **Project**: products for end-user building upon a blockchain, can be a dApp, a media team,...

**Please refer to [this guide](https://github.com/Koniverse/SubWallet-ChainList/wiki/Start-contributing-to-the-project) to start contributing to the project**
