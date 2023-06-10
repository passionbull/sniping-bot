# Sniping bot

## Overview

uniswap v2 sniping bot
- 원하는 토큰을 입력한다.
- 그 토큰이 유동성 공급이 됐을때 구매한다.
- eth amount와 가스비, 그리고 유동성 공급후 몇블록에 살 것인지 결정한다.
- 특정블록에 구매가 안될 경우, 구매하지 않는다. 만료된다.

## Configuration

1. cp config_testnet.ts config.ts
2. Mainnet or Testnet (local)
3. add eth address, privatekey
4. set token you want to buy
5. set PoolFee(Gas price)

### Install dependencies

1. Run `yarn install` to install the project dependencies
2. Run `yarn install:chain` to download and install Foundry
### Start the web interface

Run `yarn start` and navigate to [http://localhost:3000/](http://localhost:3000/)
