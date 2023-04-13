#bin/bash

yarn install && yarn build && cd ./packages/chain-list/build && npm publish --access=public
