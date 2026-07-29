import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LEVI } from '../../data/levi'
import {
  fetchQuote,
  fetchSolBalance,
  fetchSwapTransaction,
  fetchTokenBalance,
  SOL_DECIMALS,
  SOL_MINT,
  type QuoteView,
} from '../../data/jupiter'
import WalletConnect from './WalletConnect'

const SLIPPAGE_OPTIONS = [50, 100, 300] as const
const QUOTE_DEBOUNCE_MS = 400
const QUOTE_REFRESH_MS = 12000
const SOL_FEE_BUFFER = 0.02

type Status =
  | { kind: 'idle' }
  | { kind: 'signing' }
  | { kind: 'sending' }
  | { kind: 'confirming'; signature: string }
  | { kind: 'done'; signature: string }
  | { kind: 'error'; message: string }

function formatAmount(value: number, max = 6) {
  if (!Number.isFinite(value)) return '0'
  if (value === 0) return '0'
  if (value < 0.000001) return value.toExponential(2)
  return value.toLocaleString('en-US', { maximumFractionDigits: max })
}

function TokenBadge({ symbol, logo }: { symbol: string; logo: string }) {
  return (
    <span className="shrink-0 inline-flex items-center gap-2.5 rounded-full border border-black pl-1.5 pr-3 py-1.5 text-[14px] font-medium bg-white">
      <span className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/10 bg-white p-1.5 flex items-center justify-center">
        <img
          src={logo}
          alt=""
          className={[
            'h-full w-full object-cover',
            logo.includes('mascot') ? 'theme-mark' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          width={32}
          height={32}
          decoding="async"
        />
      </span>
      {symbol}
    </span>
  )
}

export default function LeviSwap() {
  const { connection } = useConnection()
  const { publicKey, connected, signTransaction } = useWallet()

  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [slippageBps, setSlippageBps] = useState<number>(100)
  const [quote, setQuote] = useState<QuoteView | null>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [quoting, setQuoting] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [leviBalance, setLeviBalance] = useState<number | null>(null)

  const mint = LEVI.mint
  const parsedAmount = Number(amount)
  const hasAmount = Number.isFinite(parsedAmount) && parsedAmount > 0

  const input = side === 'buy'
    ? { symbol: 'SOL', mint: SOL_MINT, decimals: SOL_DECIMALS, logo: '/logos/solana.png' }
    : { symbol: 'LEVI', mint, decimals: LEVI.decimals, logo: LEVI.logo }
  const output = side === 'buy'
    ? { symbol: 'LEVI', mint, decimals: LEVI.decimals, logo: LEVI.logo }
    : { symbol: 'SOL', mint: SOL_MINT, decimals: SOL_DECIMALS, logo: '/logos/solana.png' }

  const inputBalance = side === 'buy' ? solBalance : leviBalance

  const refreshBalances = useCallback(async () => {
    if (!publicKey) {
      setSolBalance(null)
      setLeviBalance(null)
      return
    }
    try {
      const [sol, levi] = await Promise.all([
        fetchSolBalance(connection, publicKey),
        mint ? fetchTokenBalance(connection, publicKey, mint) : Promise.resolve(0),
      ])
      setSolBalance(sol)
      setLeviBalance(levi)
    } catch {
      setSolBalance(null)
      setLeviBalance(null)
    }
  }, [connection, publicKey, mint])

  useEffect(() => {
    refreshBalances()
  }, [refreshBalances])

  const quoteKey = `${side}:${amount}:${slippageBps}`
  const quoteKeyRef = useRef(quoteKey)
  quoteKeyRef.current = quoteKey

  useEffect(() => {
    if (!mint || !hasAmount) {
      setQuote(null)
      setQuoteError(null)
      setQuoting(false)
      return
    }

    const controller = new AbortController()
    let timer: number | undefined
    let refresh: number | undefined

    const run = async () => {
      setQuoting(true)
      try {
        const next = await fetchQuote({
          inputMint: input.mint,
          outputMint: output.mint,
          amount: parsedAmount,
          inputDecimals: input.decimals,
          outputDecimals: output.decimals,
          slippageBps,
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        setQuote(next)
        setQuoteError(null)
      } catch (error) {
        if (controller.signal.aborted) return
        setQuote(null)
        setQuoteError(
          error instanceof Error ? error.message : 'Could not price this swap',
        )
      } finally {
        if (!controller.signal.aborted) setQuoting(false)
      }
    }

    timer = window.setTimeout(() => {
      run()
      refresh = window.setInterval(run, QUOTE_REFRESH_MS)
    }, QUOTE_DEBOUNCE_MS)

    return () => {
      controller.abort()
      if (timer) window.clearTimeout(timer)
      if (refresh) window.clearInterval(refresh)
    }
  }, [
    mint,
    hasAmount,
    parsedAmount,
    slippageBps,
    input.mint,
    input.decimals,
    output.mint,
    output.decimals,
  ])

  const exceedsBalance =
    inputBalance !== null && hasAmount && parsedAmount > inputBalance

  const insufficientForFees =
    side === 'buy' &&
    solBalance !== null &&
    hasAmount &&
    parsedAmount > Math.max(solBalance - SOL_FEE_BUFFER, 0)

  const busy =
    status.kind === 'signing' ||
    status.kind === 'sending' ||
    status.kind === 'confirming'

  const onSwap = useCallback(async () => {
    if (!publicKey || !signTransaction || !quote) return
    setStatus({ kind: 'signing' })
    try {
      const transaction = await fetchSwapTransaction({
        quote: quote.raw,
        userPublicKey: publicKey.toBase58(),
      })
      const signed = await signTransaction(transaction)

      setStatus({ kind: 'sending' })
      const signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      })

      setStatus({ kind: 'confirming', signature })
      const latest = await connection.getLatestBlockhash('confirmed')
      const result = await connection.confirmTransaction(
        {
          signature,
          blockhash: latest.blockhash,
          lastValidBlockHeight: latest.lastValidBlockHeight,
        },
        'confirmed',
      )
      if (result.value.err) {
        throw new Error('The network rejected this swap')
      }

      setStatus({ kind: 'done', signature })
      setAmount('')
      setQuote(null)
      refreshBalances()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'The swap did not go through'
      setStatus({
        kind: 'error',
        message: /user rejected|denied/i.test(message)
          ? 'You declined the transaction in your wallet'
          : message,
      })
    }
  }, [publicKey, signTransaction, quote, connection, refreshBalances])

  const rate = useMemo(() => {
    if (!quote || !hasAmount) return null
    const value = quote.outAmount / parsedAmount
    return `1 ${input.symbol} = ${formatAmount(value)} ${output.symbol}`
  }, [quote, hasAmount, parsedAmount, input.symbol, output.symbol])

  const disabled =
    !connected ||
    !quote ||
    quoting ||
    busy ||
    exceedsBalance ||
    insufficientForFees

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="h-full rounded-[28px] border border-black bg-white overflow-hidden flex flex-col"
    >
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">Swap</p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight font-normal">
            Get $LEVI
          </h3>
        </div>
        <div className="inline-flex rounded-full border border-black p-1">
          {(['buy', 'sell'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSide(s)
                setAmount('')
                setQuote(null)
                setStatus({ kind: 'idle' })
              }}
              className={[
                'h-9 px-4 rounded-full text-[14px] font-medium transition-colors capitalize',
                side === s ? 'bg-black text-white' : 'text-black/60 hover:text-black',
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 sm:px-6 py-5 flex flex-col gap-4">
        <div className="rounded-[20px] border border-black/15 bg-black/[0.02] px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-black/45">You pay</span>
            {inputBalance !== null ? (
              <button
                type="button"
                onClick={() => {
                  const max =
                    side === 'buy'
                      ? Math.max(inputBalance - SOL_FEE_BUFFER, 0)
                      : inputBalance
                  setAmount(max > 0 ? String(Number(max.toFixed(9))) : '')
                }}
                className="text-[13px] text-black/45 hover:text-black transition-colors"
              >
                Balance {formatAmount(inputBalance, 4)}
              </button>
            ) : (
              <span className="text-[13px] text-black/45">{input.symbol}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^0-9.]/g, ''))
                if (status.kind === 'done' || status.kind === 'error') {
                  setStatus({ kind: 'idle' })
                }
              }}
              className="w-full bg-transparent text-[28px] sm:text-[32px] tabular-nums tracking-tight outline-none placeholder:text-black/20"
            />
            <TokenBadge symbol={input.symbol} logo={input.logo} />
          </div>
        </div>

        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={() => {
              setSide((s) => (s === 'buy' ? 'sell' : 'buy'))
              setAmount('')
              setQuote(null)
              setStatus({ kind: 'idle' })
            }}
            className="h-10 w-10 rounded-full border border-black bg-white flex items-center justify-center text-[18px] hover:bg-black hover:text-white transition-colors"
            aria-label="Flip swap direction"
          >
            ↓
          </button>
        </div>

        <div className="rounded-[20px] border border-black/15 bg-black/[0.02] px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-black/45">You receive</span>
            <span className="text-[13px] text-black/45">
              {quoting ? 'Pricing' : output.symbol}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p
              className={[
                'w-full text-[28px] sm:text-[32px] tabular-nums tracking-tight',
                quote ? 'text-black' : 'text-black/35',
              ].join(' ')}
            >
              {quote ? formatAmount(quote.outAmount) : '0.0'}
            </p>
            <TokenBadge symbol={output.symbol} logo={output.logo} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-black/45">Slippage</span>
          <div className="inline-flex rounded-full border border-black/15 p-1">
            {SLIPPAGE_OPTIONS.map((bps) => (
              <button
                key={bps}
                type="button"
                onClick={() => setSlippageBps(bps)}
                className={[
                  'h-8 px-3 rounded-full text-[13px] transition-colors tabular-nums',
                  slippageBps === bps
                    ? 'bg-black text-white'
                    : 'text-black/55 hover:text-black',
                ].join(' ')}
              >
                {bps / 100}%
              </button>
            ))}
          </div>
        </div>

        {quote ? (
          <dl className="rounded-[18px] border border-black/10 px-4 py-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[13px] text-black/45">Rate</dt>
              <dd className="text-[13px] tabular-nums text-right">{rate}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[13px] text-black/45">Price impact</dt>
              <dd
                className={[
                  'text-[13px] tabular-nums',
                  quote.priceImpactPct > 5 ? 'font-medium' : '',
                ].join(' ')}
              >
                {quote.priceImpactPct < 0.01
                  ? 'under 0.01%'
                  : `${quote.priceImpactPct.toFixed(2)}%`}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[13px] text-black/45">Minimum received</dt>
              <dd className="text-[13px] tabular-nums">
                {formatAmount(quote.minimumReceived)} {output.symbol}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[13px] text-black/45">Route</dt>
              <dd className="text-[13px] text-right truncate max-w-[60%]">
                {quote.route.map((step) => step.label).join(' then ')}
              </dd>
            </div>
          </dl>
        ) : null}

        {quoteError && hasAmount ? (
          <p className="text-[13px] text-black/60">{quoteError}</p>
        ) : null}
        {exceedsBalance ? (
          <p className="text-[13px] text-black/60">
            That is more {input.symbol} than this wallet holds.
          </p>
        ) : insufficientForFees ? (
          <p className="text-[13px] text-black/60">
            Leave about {SOL_FEE_BUFFER} SOL behind to cover network fees.
          </p>
        ) : null}

        {status.kind === 'error' ? (
          <p className="text-[13px] text-black/70">{status.message}</p>
        ) : null}
        {status.kind === 'done' ? (
          <p className="text-[13px] text-black/70">
            Swap confirmed.{' '}
            <a
              href={`https://solscan.io/tx/${status.signature}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:no-underline"
            >
              View on Solscan
            </a>
          </p>
        ) : null}

        {connected ? (
          <button
            type="button"
            onClick={onSwap}
            disabled={disabled}
            className="mt-auto inline-flex h-12 sm:h-14 items-center justify-center gap-2.5 rounded-full bg-black text-white text-[15px] sm:text-[16px] font-medium hover:bg-black/80 transition-colors disabled:opacity-40 disabled:hover:bg-black"
          >
            {status.kind === 'signing'
              ? 'Confirm in your wallet'
              : status.kind === 'sending'
                ? 'Sending'
                : status.kind === 'confirming'
                  ? 'Confirming on Solana'
                  : !hasAmount
                    ? 'Enter an amount'
                    : quoting
                      ? 'Pricing'
                      : side === 'buy'
                        ? 'Swap SOL for $LEVI'
                        : 'Swap $LEVI for SOL'}
          </button>
        ) : (
          <WalletConnect className="mt-auto w-full" />
        )}

        <p className="text-[13px] text-black/50 leading-relaxed">
          Routed through Jupiter across Solana venues. Your keys never leave your
          wallet; this page only asks it to sign the swap you approve.
        </p>
      </div>
    </motion.div>
  )
}
