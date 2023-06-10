import {
  // ChainId,
  Fetcher,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} from '@uniswap/sdk'
import UniswapV2Router02 from '@uniswap/v2-periphery/build/UniswapV2Router02.json'

// import { BigNumber } from 'ethers'
// import { ROUTER_ABI } from './constants'
import { getProvider, getWalletAddress } from './providers'
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

// import { Percent } from '@uniswap/sdk'
// import { CurrencyAmount } from '@uniswap/sdk-core'
// import JSBI from 'jsbi'
import { ethers } from 'ethers'

import { CurrentConfig, Environment } from '../config'
import { sendTransaction } from './providers'
import { fromReadableAmount } from './utils'

export async function executeTradeV2(
  trade: Trade,
  gasPrice: number
): Promise<ethers.providers.TransactionReceipt | null> {
  console.log('execute', trade, 'gasPrice', gasPrice)
  const provider = getProvider()
  const walletAddress = getWalletAddress()
  const abi = UniswapV2Router02['abi']

  const out_token = new Token(
    CurrentConfig.tokens.out.chainId,
    CurrentConfig.tokens.out.address,
    18
  )

  const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%

  // const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
  // const amountOutMinHex = ethers.BigNumber.from(
  //   amountOutMin.toString()
  // ).toHexString()

  // const path = [WETH[out_token.chainId].address, out_token.address]
  // const to = '' // should be a checksummed recipient address
  // const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
  // const value = trade.inputAmount.raw // // needs to be converted to e.g. hex
  // const valueHex = await ethers.BigNumber.from(value.toString()).toHexString() //convert to hex string

  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
  const amountOutMinHex = ethers.BigNumber.from(
    amountOutMin.toString()
  ).toHexString()
  const path = [WETH[out_token.chainId].address, out_token.address]
  const to = walletAddress // should be a checksummed recipient address
  const deadline = Math.floor(Date.now() / 1000) + 20 * 1 // 15 secs from the current Unix time
  const value = trade.inputAmount.raw // // needs to be converted to e.g. hex
  const valueHex = await ethers.BigNumber.from(value.toString()).toHexString() //convert to hex string

  if (provider != null) {
    const UNISWAP_ROUTER_CONTRACT = new ethers.Contract(
      UNISWAP_ROUTER_ADDRESS,
      abi,
      provider
    )

    //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
    const rawTxn =
      await UNISWAP_ROUTER_CONTRACT.populateTransaction.swapExactETHForTokens(
        amountOutMinHex,
        path,
        to,
        deadline,
        {
          value: valueHex,
        }
      )

    //Returns a Promise which resolves to the transaction.

    if (walletAddress != null) {
      rawTxn.from = walletAddress
    }
    console.log('sendTxn1', rawTxn)
    rawTxn.gasPrice = ethers.utils.parseUnits(String(gasPrice), 'gwei')
    const sendTxn = sendTransaction(rawTxn)

    // const sendTxn = await sendTransaction(rawTxn)
    console.log('sendTxn2', sendTxn)

    return sendTxn
  }

  return null
}

export async function createTradeV2(amount: number): Promise<any> {
  console.log('estimate trade v2')
  const out_token = new Token(
    CurrentConfig.tokens.out.chainId,
    CurrentConfig.tokens.out.address,
    18
  )

  const in_token = new Token(
    CurrentConfig.tokens.in.chainId,
    CurrentConfig.tokens.in.address,
    18
  )

  let url = CurrentConfig.rpc.mainnet
  if (CurrentConfig.env == Environment.LOCAL) {
    url = CurrentConfig.rpc.local
  }
  const customHttpProvider = new ethers.providers.JsonRpcProvider(url)
  const pair = await Fetcher.fetchPairData(
    out_token,
    in_token,
    customHttpProvider
  )
  const route = new Route([pair], WETH[out_token.chainId])
  const trade = new Trade(
    route,
    new TokenAmount(
      WETH[out_token.chainId],
      fromReadableAmount(amount, CurrentConfig.tokens.in.decimals).toString()
    ),
    TradeType.EXACT_INPUT
  )

  return trade
}
