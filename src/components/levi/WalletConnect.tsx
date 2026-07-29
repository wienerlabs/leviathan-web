import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletReadyState } from '@solana/wallet-adapter-base'

export function shortAddress(value: string, lead = 4, tail = 4) {
  if (value.length <= lead + tail + 1) return value
  return `${value.slice(0, lead)}…${value.slice(-tail)}`
}

export default function WalletConnect({
  className = '',
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { wallets, select, connect, connecting, connected, publicKey, disconnect, wallet } =
    useWallet()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const installed = useMemo(
    () =>
      wallets.filter(
        (w) =>
          w.readyState === WalletReadyState.Installed ||
          w.readyState === WalletReadyState.Loadable,
      ),
    [wallets],
  )

  useEffect(() => {
    if (connected) setOpen(false)
  }, [connected])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const height = compact ? 'h-10' : 'h-12'

  if (connected && publicKey) {
    return (
      <button
        type="button"
        onClick={() => disconnect().catch(() => undefined)}
        className={[
          height,
          'inline-flex items-center gap-2 rounded-full border border-black px-4 text-[14px] font-medium hover:bg-black hover:text-white transition-colors',
          className,
        ].join(' ')}
        title={publicKey.toBase58()}
      >
        <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
        <span className="font-mono">{shortAddress(publicKey.toBase58())}</span>
        <span className="text-black/40 group-hover:text-white/60">Disconnect</span>
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null)
          setOpen(true)
        }}
        disabled={connecting}
        className={[
          height,
          'inline-flex items-center justify-center rounded-full bg-black px-5 text-[15px] font-medium text-white hover:bg-black/80 transition-colors disabled:opacity-60',
          className,
        ].join(' ')}
      >
        {connecting ? 'Connecting' : 'Connect wallet'}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choose a wallet"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-[380px] rounded-[24px] border border-black bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">Wallet</p>
                <h3 className="text-[22px] leading-tight">Connect to Solana</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 w-9 shrink-0 rounded-full border border-black/15 hover:border-black transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {installed.length === 0 ? (
              <div className="rounded-[18px] border border-black/15 px-4 py-4">
                <p className="text-[15px] leading-relaxed text-black/70">
                  No Solana wallet detected in this browser. Install Phantom,
                  Solflare or Backpack, then reload this page.
                </p>
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex h-10 items-center rounded-full bg-black px-4 text-[14px] font-medium text-white hover:bg-black/80 transition-colors"
                >
                  Get a wallet
                </a>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {installed.map((w) => (
                  <li key={w.adapter.name}>
                    <button
                      type="button"
                      onClick={async () => {
                        setError(null)
                        try {
                          select(w.adapter.name)
                          await connect().catch(() => undefined)
                        } catch (e) {
                          setError(
                            e instanceof Error ? e.message : 'Could not connect',
                          )
                        }
                      }}
                      className="w-full inline-flex items-center gap-3 rounded-[18px] border border-black/15 px-4 py-3 text-left hover:border-black transition-colors"
                    >
                      {w.adapter.icon ? (
                        <img
                          src={w.adapter.icon}
                          alt=""
                          className="h-7 w-7 rounded-md"
                          width={28}
                          height={28}
                        />
                      ) : null}
                      <span className="text-[15px] font-medium">{w.adapter.name}</span>
                      {wallet?.adapter.name === w.adapter.name ? (
                        <span className="ml-auto text-[13px] text-black/40">Selected</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {error ? (
              <p className="mt-3 text-[13px] text-black/60">{error}</p>
            ) : null}

            <p className="mt-4 text-[13px] leading-relaxed text-black/45">
              Your keys stay in your wallet. This page only asks it to sign the
              swap you approve.
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
