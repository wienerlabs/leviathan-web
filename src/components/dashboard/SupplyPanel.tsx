import { motion } from 'motion/react'
import { accountExplorerUrl } from '../../data/levi'
import type { MintFacts, SupplyBreakdown } from '../../data/chain'

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 })

const short = (s: string) => (s.length > 12 ? `${s.slice(0, 4)}…${s.slice(-4)}` : s)

const KIND_LABEL: Record<string, string> = {
  treasury: 'Multisig',
  locked: 'Vesting contract',
  pool: 'Liquidity',
  circulating: 'Free float',
}

function Bar({ breakdown }: { breakdown: SupplyBreakdown }) {
  const parts = [
    { key: 'treasury', amount: breakdown.treasury, tone: 'bg-black' },
    { key: 'locked', amount: breakdown.locked, tone: 'bg-black/55' },
    { key: 'pool', amount: breakdown.pool, tone: 'bg-black/25' },
    { key: 'circulating', amount: breakdown.circulating, tone: 'bg-black/10' },
  ].filter((p) => p.amount > 0)

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full border border-black/15">
      {parts.map((p) => (
        <div
          key={p.key}
          className={p.tone}
          style={{ width: `${(p.amount / breakdown.total) * 100}%` }}
          title={`${KIND_LABEL[p.key]} ${fmt(p.amount)}`}
        />
      ))}
    </div>
  )
}

export default function SupplyPanel({
  mint,
  breakdown,
  loading,
}: {
  mint: MintFacts | null
  breakdown: SupplyBreakdown | null
  loading: boolean
}) {
  const notLocked = breakdown
    ? breakdown.total - breakdown.treasury - breakdown.locked
    : 0
  const securedShare = breakdown
    ? ((breakdown.treasury + breakdown.locked) / breakdown.total) * 100
    : 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="mb-8 rounded-[24px] border border-black bg-white overflow-hidden"
    >
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Supply
          </p>
          <h2 className="text-[24px] sm:text-[28px] leading-tight tracking-tight font-normal">
            Where every token actually sits
          </h2>
        </div>
        <p className="text-[13px] text-black/45 sm:text-right max-w-[22rem]">
          Read from Solana mainnet on load, not from this page's own records.
        </p>
      </div>

      {loading && !breakdown ? (
        <div className="px-5 sm:px-6 py-10">
          <div className="h-3 w-full rounded-full bg-black/[0.06] animate-pulse" />
        </div>
      ) : !breakdown || !mint ? (
        <div className="px-5 sm:px-6 py-10 text-[15px] text-black/45">
          Could not reach an RPC endpoint to read the supply.
        </div>
      ) : (
        <>
          <div className="px-5 sm:px-6 pt-5 pb-4">
            <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <p className="text-[28px] sm:text-[34px] tabular-nums tracking-tight leading-none">
                {securedShare.toFixed(1)}%
              </p>
              <p className="text-[13px] text-black/50 max-w-[28rem] sm:text-right">
                in a multisig or an immutable vesting contract. The rest is
                liquidity and float.
              </p>
            </div>
            <Bar breakdown={breakdown} />
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Multisig', value: breakdown.treasury },
                { label: 'Vesting', value: breakdown.locked },
                { label: 'Liquidity', value: breakdown.pool },
                { label: 'Free float', value: breakdown.circulating },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[12px] text-black/40 mb-0.5">{s.label}</p>
                  <p className="text-[15px] tabular-nums">{fmt(s.value)}</p>
                  <p className="text-[12px] text-black/40 tabular-nums">
                    {((s.value / breakdown.total) * 100).toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-black/10 overflow-x-auto">
            <table className="w-full min-w-[560px] text-[14px]">
              <thead>
                <tr className="text-left text-[12px] text-black/40">
                  <th className="px-5 sm:px-6 py-3 font-normal">Holder</th>
                  <th className="px-3 py-3 font-normal">Kind</th>
                  <th className="px-3 py-3 font-normal text-right">Amount</th>
                  <th className="px-3 py-3 font-normal text-right">Share</th>
                  <th className="px-5 sm:px-6 py-3 font-normal text-right">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {breakdown.slices.map((slice) => (
                  <tr key={slice.owner} className="border-t border-black/[0.06]">
                    <td className="px-5 sm:px-6 py-3">{slice.label}</td>
                    <td className="px-3 py-3 text-black/50">
                      {KIND_LABEL[slice.kind]}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {fmt(slice.amount)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {slice.share.toFixed(2)}%
                    </td>
                    <td className="px-5 sm:px-6 py-3 text-right">
                      <a
                        href={accountExplorerUrl(slice.owner)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[13px] text-black/50 underline underline-offset-2 hover:text-black hover:no-underline"
                      >
                        {short(slice.owner)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-black/10 px-5 sm:px-6 py-4 grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[12px] text-black/40 mb-1">Mint authority</p>
              <p className="text-[15px]">
                {mint.mintAuthority ? short(mint.mintAuthority) : 'Revoked'}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-black/40 mb-1">Freeze authority</p>
              <p className="text-[15px]">
                {mint.freezeAuthority ? short(mint.freezeAuthority) : 'Revoked'}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-black/40 mb-1">Token program</p>
              <p className="text-[15px]">
                {mint.isToken2022 ? 'Token-2022' : 'SPL Token'}
                {mint.extensions.length > 0
                  ? ` · ${mint.extensions.length} extensions`
                  : ''}
              </p>
            </div>
          </div>

          <div className="border-t border-black/10 px-5 sm:px-6 py-4">
            <p className="text-[13px] text-black/50 leading-relaxed">
              A holder this page does not recognise is counted as free float, so
              an out of date label understates what is locked rather than
              overstating it. Not locked today: {fmt(notLocked)} $LEVI, which is
              the liquidity position and everything already in circulation.
            </p>
          </div>
        </>
      )}
    </motion.section>
  )
}
