// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

import { SupportedChainId, Token } from '@uniswap/sdk-core'

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
export const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
export const WETH_CONTRACT_ADDRESS =
  '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

// Currencies and Tokens

export const YNB_TOKEN = new Token(
  SupportedChainId.GOERLI,
  '0xBfd5cC2405d411383424732b6f4B8aF78CCbfb28',
  18,
  'YNB5',
  'Yanabu5'
)

export const WETH_TOKEN = new Token(
  SupportedChainId.GOERLI,
  '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  18,
  'WETH',
  'Wrapped Ether'
)

export const UNI_TOKEN = new Token(
  SupportedChainId.GOERLI,
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  18,
  'UNI',
  'Uniswap'
)

export const USDC_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  6,
  'USDC',
  'USD//C'
)

export const DAI_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const IMX_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
  18,
  'IMX',
  'Immutable X'
)

export const CVP_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0x38e4adB44ef08F22F5B5b76A8f0c2d0dCbE7DcA1',
  18,
  'CVP',
  'Concentrated Voting Power'
)

// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const WETH_ABI = [
  // Wrap ETH
  'function deposit() payable',

  // Unwrap ETH
  'function withdraw(uint wad) public',
]

// Transactions

export const MAX_FEE_PER_GAS = 100000000000
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000
