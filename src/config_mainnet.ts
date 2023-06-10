import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'

import {
  CVP_TOKEN,
  DAI_TOKEN,
  IMX_TOKEN,
  UNI_TOKEN,
  USDC_TOKEN,
  WETH_TOKEN,
} from './libs/constants'

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  MAINNET,
  WALLET_EXTENSION,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment
  rpc: {
    local: string
    mainnet: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    in: Token
    amountIn: number
    out: Token
    poolFee: number
  }
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  env: Environment.MAINNET,
  rpc: {
    local: 'https://rpc.ankr.com/eth_goerli',
    mainnet: 'https://mainnet.infura.io/v3/d7cede388bc94620adbb06d59e3dd4d3',
  },
  wallet: {
    address: '0x744a5f8F97e47e4E950EC2DdCf5dD9D1c2fE3466',
    privateKey:
      '0xc625bece33ab06dd6e4656f044253b252fa2a6278242b3cef297899f7cc45816',
  },
  tokens: {
    in: WETH_TOKEN, // input
    amountIn: 0, // no use
    out: IMX_TOKEN, // output
    poolFee: FeeAmount.LOWEST, // gas price
    // poolFee: 10, // 10 gwei
  },
}
