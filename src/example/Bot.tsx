import './Bot.css'

import React, { useCallback, useEffect, useState } from 'react'

import { CurrentConfig, Environment } from '../config'
import {
  connectBrowserExtensionWallet,
  getProvider,
  getWalletAddress,
  TransactionState,
} from '../libs/providers'
import { createTrade, executeTrade, TokenTrade } from '../libs/trading'
import { createTradeV2, executeTradeV2 } from '../libs/tradingV2'
import { displayTrade, displayTradeV2 } from '../libs/utils'
import { getCurrencyBalance } from '../libs/wallet'
import CustomInput from './CustomInput'
const useOnBlockUpdated = (callback: (blockNumber: number) => void) => {
  useEffect(() => {
    const subscription = getProvider()?.on('block', callback)
    return () => {
      subscription?.removeAllListeners()
    }
  })
}
let willsentblock = 0 //보내고자하는 시간

const Example = () => {
  const [useV3, setUseV3] = useState<boolean>(false)
  const [blockTransfer, setBlockTransfer] = useState<number>(3) // 예상 블록
  const [blockNumber, setBlockNumber] = useState<number>(0)
  const [tokenInBalance, setTokenInBalance] = useState<string>()
  const [tokenOutBalance, setTokenOutBalance] = useState<string>()
  const [trade, setTrade] = useState<string>()
  const [tradeV2, setTradV2] = useState<any>(undefined)
  const [tradeV3, setTradV3] = useState<TokenTrade>()
  const [inputAmount, setAmount] = useState<number>(0.01)

  const [poolAvailableV3, setV3Available] = useState<boolean>(false)
  const [poolAvailableV2, setV2Available] = useState<boolean>(false)

  const [sent, setSent] = useState<boolean>(false) // 거래했는지 여부
  const [sentBlockNumber, setSentBlockNumber] = useState<number>(0) // 블록보낸시간
  const [resultBlockNumber, setResultBlockNumber] = useState<number>(0) // 처리된시간
  const [readyLiquidityBlockNumber, setLiquidityBlockNumber] =
    useState<number>(0) // 유동성공급준비시간

  const [txState, setTxState] = useState<TransactionState>(TransactionState.New)

  // Listen for new blocks and update the wallet
  useOnBlockUpdated(async (blockNumber: number) => {
    console.log(
      'block number',
      blockNumber,
      sentBlockNumber,
      blockTransfer,
      sent
    )
    setBlockNumber(blockNumber)
    setUseV3(false)

    onCreateTradeV2().then((result) => {
      if (result) {
        console.log('ready to trade')
        if (willsentblock == 0) {
          willsentblock = blockNumber
          setLiquidityBlockNumber(blockNumber)
        }
      }
    })
    if (
      sent == false &&
      willsentblock != 0 &&
      sentBlockNumber == 0 &&
      blockNumber >= willsentblock + blockTransfer - 1
    ) {
      onTradeV2()
    }
    // refreshBalances()
  })

  // Update wallet state given a block number
  const refreshBalances = useCallback(async () => {
    const provider = getProvider()
    const address = getWalletAddress()
    if (!address || !provider) {
      return
    }

    setTokenInBalance(
      await getCurrencyBalance(provider, address, CurrentConfig.tokens.in) // WETH
    )

    setTokenOutBalance(
      await getCurrencyBalance(provider, address, CurrentConfig.tokens.out)
    )
  }, [])

  // Event Handlers
  const onConnectWallet = useCallback(async () => {
    if (await connectBrowserExtensionWallet()) {
      refreshBalances()
    }
  }, [refreshBalances])

  const handleInput = (amount: string) => {
    console.log('amount', amount)
    setAmount(parseFloat(amount))
  }

  const handleBlock = (amount: string) => {
    setBlockTransfer(parseInt(amount))
  }
  const onCreateTradeV2 = useCallback(async () => {
    console.log('check liquidity')
    let result = false
    refreshBalances()
    setV2Available(false)
    try {
      const t = await createTradeV2(inputAmount)
      setTradV2(t)
      setTrade(displayTradeV2(t, CurrentConfig.tokens.out.symbol))
      setV2Available(true)
      result = true
    } catch (error) {
      console.log('error setTrade v2', error)
      setV2Available(false)
    }
    return result
  }, [inputAmount, refreshBalances])

  const onCreateTradeV3 = useCallback(async () => {
    // 유동성 풀 체크, 그리고 예상 갯수 만들기
    refreshBalances()
    setV3Available(false)
    try {
      const t = await createTrade(inputAmount)

      setTrade(displayTrade(t))
      setTradV3(t)
      setV3Available(true)
    } catch (error) {
      console.log('error setTrade v3')
      setV3Available(false)
    }
  }, [inputAmount, refreshBalances])

  const onTradeV2 = useCallback(async () => {
    // 거래를 한번하면 더이상 요청하지않는다.
    console.log('start onTradeV2', sent, willsentblock)
    if (sent == false) {
      willsentblock = 100
      console.log('trade v2 sent request', blockNumber + 1)
      setSentBlockNumber(blockNumber + 1)
      const result = await executeTradeV2(tradeV2, CurrentConfig.tokens.poolFee)
      if (result != null) {
        setResultBlockNumber(result.blockNumber)
      }
      setSent(true)
    }
  }, [blockNumber, tradeV2, sent, sentBlockNumber])

  const onTrade = useCallback(async (trade: TokenTrade | undefined) => {
    if (trade) {
      setTxState(await executeTrade(trade))
    }
  }, [])

  return (
    <div className="App">
      {CurrentConfig.rpc.mainnet === '' && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}
      {CurrentConfig.env === Environment.WALLET_EXTENSION &&
        getProvider() === null && (
          <h2 className="error">
            Please install a wallet to use this example configuration
          </h2>
        )}
      <h3>{`Block Number: ${blockNumber}`}</h3>

      <h3>{`Wallet Address: ${getWalletAddress()}`}</h3>
      {CurrentConfig.env === Environment.WALLET_EXTENSION &&
        !getWalletAddress() && (
          <button onClick={onConnectWallet}>Connect Wallet</button>
        )}

      <h3>{`${CurrentConfig.tokens.in.symbol} Balance: ${tokenInBalance}`}</h3>
      <h3>{`${CurrentConfig.tokens.out.symbol} Balance: ${tokenOutBalance}`}</h3>

      {/* <button onClick={onCreateTrade}>
        <p>Estimate Price with uniswap</p>
      </button> */}

      <CustomInput
        txt="거래에 사용할 eth"
        defaultInput={String(inputAmount)}
        handleInput={handleInput}></CustomInput>
      <button onClick={onCreateTradeV2}>
        <p>Estimate Price with uniswap v2</p>
      </button>

      {useV3 === true && (
        <button onClick={onCreateTradeV3}>
          <p>Estimate Price with uniswap v3</p>
        </button>
      )}

      {/* <h3>{`Pool v3 State: ${poolAvailableV3}, Pool v2 State: ${poolAvailableV2}`}</h3> */}
      <h3>{`Pool v2 State: ${poolAvailableV2}`}</h3>
      <h3>{trade && `예상 가격: ${trade}`}</h3>

      <CustomInput
        txt="유동성공급 후 특정블록 후 전송"
        defaultInput={String(blockTransfer)}
        handleInput={handleBlock}></CustomInput>

      <button
        onClick={() => onTradeV2()}
        disabled={
          poolAvailableV2 === false ||
          getProvider() === null ||
          CurrentConfig.rpc.mainnet === ''
        }>
        <p>수동 거래하기</p>
      </button>

      {useV3 === true && (
        <button
          onClick={() => onTrade(tradeV3)}
          disabled={
            poolAvailableV3 === false ||
            getProvider() === null ||
            CurrentConfig.rpc.mainnet === ''
          }>
          <p>Trade v3</p>
        </button>
      )}

      <h3>{`유동성공급 준비된 블록: ${readyLiquidityBlockNumber}`}</h3>
      <h3>{`트랜잭션 전송블록: ${sentBlockNumber}`}</h3>
      <h3>{`트랜잭션 처리블록: ${resultBlockNumber}`}</h3>
      <h3>{`Transaction State: ${txState}`}</h3>
    </div>
  )
}

export default Example
