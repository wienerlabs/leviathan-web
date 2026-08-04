import { motion } from 'motion/react'
import type { ProgramStatus } from '../../data/chain'

const short = (s: string) => (s.length > 12 ? `${s.slice(0, 4)}…${s.slice(-4)}` : s)

function explorer(address: string, cluster: 'devnet' | 'mainnet') {
  const suffix = cluster === 'devnet' ? '?cluster=devnet' : ''
  return `https://solscan.io/account/${address}${suffix}`
}

export default function ProgramsPanel({
  programs,
  cluster,
  multisig,
  loading,
}: {
  programs: ProgramStatus[]
  cluster: 'devnet' | 'mainnet'
  multisig: string
  loading: boolean
}) {
  const live = programs.filter((p) => p.deployed)
  const allUnderMultisig = live.length > 0 && live.every((p) => p.underMultisig)

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
            Programs
          </p>
          <h2 className="text-[24px] sm:text-[28px] leading-tight tracking-tight font-normal">
            Who can change the code
          </h2>
        </div>
        <span
          className={[
            'inline-flex h-8 items-center rounded-full px-3 text-[13px] shrink-0',
            allUnderMultisig
              ? 'bg-black text-white'
              : 'border border-black/20 text-black/60',
          ].join(' ')}
        >
          {loading && live.length === 0
            ? 'Reading'
            : allUnderMultisig
              ? 'Upgrades need the multisig'
              : 'Single key can upgrade'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-[14px]">
          <thead>
            <tr className="text-left text-[12px] text-black/40">
              <th className="px-5 sm:px-6 py-3 font-normal">Program</th>
              <th className="px-3 py-3 font-normal">Program id</th>
              <th className="px-3 py-3 font-normal">Upgrade authority</th>
              <th className="px-5 sm:px-6 py-3 font-normal text-right">Size</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.programId} className="border-t border-black/[0.06]">
                <td className="px-5 sm:px-6 py-3">{p.name}</td>
                <td className="px-3 py-3">
                  <a
                    href={explorer(p.programId, cluster)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[13px] text-black/55 underline underline-offset-2 hover:text-black hover:no-underline"
                  >
                    {short(p.programId)}
                  </a>
                </td>
                <td className="px-3 py-3">
                  {!p.deployed ? (
                    <span className="text-black/40">Not deployed</span>
                  ) : p.underMultisig ? (
                    <a
                      href={explorer(multisig, cluster)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 hover:no-underline"
                    >
                      Multisig
                    </a>
                  ) : p.upgradeAuthority ? (
                    <span className="font-mono text-[13px]">
                      {short(p.upgradeAuthority)}
                    </span>
                  ) : (
                    <span>Immutable</span>
                  )}
                </td>
                <td className="px-5 sm:px-6 py-3 text-right tabular-nums text-black/55">
                  {p.dataLength ? `${Math.round(p.dataLength / 1024)} KB` : '·'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-black/10 px-5 sm:px-6 py-4">
        <p className="text-[13px] text-black/50 leading-relaxed">
          These are the {cluster} deployments. A program whose upgrade authority
          is a single key can be replaced by whoever holds that key, including
          the code that holds participant bonds, so this row is worth checking
          before trusting a run.
        </p>
      </div>
    </motion.section>
  )
}
