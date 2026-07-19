import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import Waitlist from './Waitlist'

const LossCurvesChart = lazy(() => import('./charts/LossCurvesChart'))
const SecurityEconomicsChart = lazy(
  () => import('./charts/SecurityEconomicsChart'),
)
const ExplainSection = lazy(() => import('./ExplainSection'))

function ChartFallback() {
  return (
    <div className="rounded-[28px] border border-black h-[380px] md:h-[420px] animate-pulse bg-black/[0.02]" />
  )
}

function ExplainFallback() {
  return (
    <div className="border-t border-black/10 px-5 md:px-12 py-20">
      <div className="max-w-[1100px] mx-auto h-[420px] rounded-[32px] border border-black/10 animate-pulse bg-black/[0.02]" />
    </div>
  )
}

const LINKS = [
  {
    label: 'Docs',
    href: '/docs/developer/quickstart',
    detail: 'Quickstart, architecture, security',
    external: false,
  },
  {
    label: 'Network substrate',
    href: 'https://github.com/wienerlabs/leviathan-net',
    detail: 'Bonds, audits, slashing on Solana',
    external: true,
  },
  {
    label: 'Research & sim',
    href: 'https://github.com/wienerlabs/leviathan',
    detail: 'Phase 0 proof and whitepaper',
    external: true,
  },
  {
    label: 'On X',
    href: 'https://x.com/leviathanfront',
    detail: '@leviathanfront',
    external: true,
  },
]

const LAYERS = [
  {
    title: 'Robust aggregation',
    body: 'Centered clipping with far-outlier excision caps any contribution in the round it arrives. A Byzantine coalition cannot drag the model off course while it still lives.',
  },
  {
    title: 'Replay audits',
    body: 'Each gradient is audited with probability p. Local rounds are pure functions of checkpoint, seed and data. A mismatch beyond the tolerance band is a binary fraud proof.',
  },
  {
    title: 'Bonds & slash',
    body: 'Break-even bond equals reward times (1-p)/p. Lying is priced. A slashed identity re-enters only with a fresh bond; forfeited stake funds the verifiers hunting it.',
  },
]

const OPEN_SLOT = [
  {
    name: 'Bittensor training subnets',
    verification: 'Scoring gates, admitted gaps',
    economics: 'Emissions only, no bonds',
    tag: 'Economics without proof',
    logo: '/logos/bittensor.png',
    us: false,
  },
  {
    name: 'Nous Psyche',
    verification: 'Witness liveness, verifier is a todo',
    economics: 'No stake, dead slash code, whitelist',
    tag: 'Coordination without teeth',
    logo: '/logos/nous.png',
    us: false,
  },
  {
    name: 'Gensyn Verde',
    verification: 'Strong, FP32 single-GPU determinism',
    economics: 'Pre-mainnet',
    tag: 'Proof without a market',
    logo: '/logos/gensyn.png',
    us: false,
  },
  {
    name: 'OVIG',
    verification: 'Tolerance-band replay audits',
    economics: 'Paper, not a network',
    tag: 'Theory without a mesh',
    logo: '/logos/ovig.png',
    us: false,
  },
  {
    name: 'Leviathan',
    verification: 'OVIG-style replay audits',
    economics: 'Bonds sized (1-p)/p, live slashing',
    tag: 'Both columns, live on devnet',
    logo: '/mascot.png',
    us: true,
  },
]

const SIM_ROWS = [
  {
    scenario: 'Honest swarm, mean',
    loss: '2.175',
    outcome: 'Reference',
  },
  {
    scenario: 'Sign flip 5/16 vs mean',
    loss: '12.0, diverged',
    outcome: 'Naive aggregation destroyed',
  },
  {
    scenario: 'Sign flip 5/16 vs clip + excision',
    loss: '2.203',
    outcome: 'Neutralized; malicious acceptance 3%',
  },
  {
    scenario: 'ALIE 5/16 vs clip',
    loss: '2.190',
    outcome: 'Stealth accepted 100%, damage 0.7%',
  },
  {
    scenario: 'ALIE 5/16 vs clip + audit p=0.1',
    loss: '2.194',
    outcome: 'All 5 cheaters slashed',
  },
  {
    scenario: 'Honest non-IID, clip',
    loss: '2.222',
    outcome: 'Zero honest false positives',
  },
]

const ROADMAP = [
  {
    phase: 'Phase 0',
    title: 'Proof',
    status: 'Done',
    body: 'Whitepaper, decision log, and the sim: Condorcet security economics on real transformer gradients.',
  },
  {
    phase: 'Phase 1',
    title: 'Devnet core',
    status: 'In progress',
    body: 'Bond custody, audit lottery, and slash paths are live on the fork. Open: verifier daemon, local swarm, conviction demo.',
  },
  {
    phase: 'Phase 2',
    title: 'Genesis Run',
    status: 'Next',
    body: 'Public testnet, 50+ volunteer nodes, 350M to 1B model, live loss curve, one-line join.',
  },
  {
    phase: 'Phase 3',
    title: 'Mainnet',
    status: 'Later',
    body: 'TGE, real bonds, Proof of Gradient live, open weights, inference network v0.',
  },
  {
    phase: 'Phase 4',
    title: 'Scale',
    status: 'Later',
    body: 'DanteGPU supply, 7B+, futarchy for the next model, optional TEE lane.',
  },
]

const DEVNET = [
  {
    label: 'Coordinator',
    id: 'JD9rHTiqBFgHjViWZc7gFZX74LvKKysbLbqFRaFvtmmN',
  },
  {
    label: 'Authorizer',
    id: '2Kg5ERG6ubuzyPmQ24axsws7V2ja2EvWp5CHMKFCrTxv',
  },
  {
    label: 'Treasurer',
    id: '9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8',
  },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[15px] md:text-[17px] text-black/50 font-medium mb-6 tracking-[0.06em]">
      {children}
    </p>
  )
}

export default function Content() {
  return (
    <div className="relative z-10 bg-white text-black">
      <section className="px-5 md:px-12 pt-14 md:pt-20 pb-20 md:pb-32 max-w-[1100px] mx-auto">
        <SectionLabel>Thesis</SectionLabel>
        <h2 className="font-italiana text-[42px] md:text-[72px] leading-[1.06] max-w-[1000px] mb-10 md:mb-14">
          Hobbes drew Leviathan as a giant made of thousands of people. This one
          is made of thousands of GPUs.
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 text-[18px] md:text-[22px] leading-relaxed text-black/80">
          <p>
            Frontier AI today sits on five balance sheets. The math of training
            over the open internet is already solved and shipping. What remains
            unsolved is trust: nobody has made it safe to accept a gradient from
            a stranger and pay them for it.
          </p>
          <p>
            Leviathan is a Solana-coordinated training network. Anyone with a GPU
            joins by posting a bond, earns Proof of Gradient for work that
            survives verification, and loses the bond if they lie. The model
            belongs to the network that trained it.
          </p>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start mb-12 md:mb-16">
            <div>
              <SectionLabel>The open slot</SectionLabel>
              <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-6 max-w-[900px]">
                Everyone picked one column. Nobody picked both.
              </h2>
              <p className="text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[640px] mb-6">
                Decentralized training has two hard problems: proving a stranger
                did real work, and making lying cost more than it earns. Live
                networks keep choosing only one.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                <div className="rounded-[24px] border border-black p-5">
                  <p className="text-[13px] tracking-[0.08em] text-black/45 mb-2">
                    Column A
                  </p>
                  <p className="text-[20px] md:text-[22px] font-semibold mb-2">
                    Verification
                  </p>
                  <p className="text-[15px] md:text-[16px] leading-relaxed text-black/65">
                    Replay audits, tolerance bands, fraud proofs. Hard without
                    live bonds and slash.
                  </p>
                </div>
                <div className="rounded-[24px] border border-black p-5">
                  <p className="text-[13px] tracking-[0.08em] text-black/45 mb-2">
                    Column B
                  </p>
                  <p className="text-[20px] md:text-[22px] font-semibold mb-2">
                    Live economics
                  </p>
                  <p className="text-[15px] md:text-[16px] leading-relaxed text-black/65">
                    Bonds, emissions, slashing. Empty if the verifier path is a
                    todo or a whitelist.
                  </p>
                </div>
              </div>
              <p className="text-[17px] md:text-[19px] leading-relaxed text-black/70 max-w-[640px]">
                Bonded contributions plus random replay audits plus slashing is
                not run by anyone else for live LLM training today. Leviathan
                occupies that cell: both columns, on Solana, verified on devnet.
              </p>
            </div>

            <figure className="rounded-[28px] border border-black overflow-hidden bg-black/[0.02] lg:sticky lg:top-8">
              <img
                src="/open-slot.jpg"
                alt="Leviathan open slot figure"
                width={1080}
                height={1200}
                className="block w-full h-auto max-h-[520px] object-cover object-center grayscale"
              />
              <figcaption className="px-5 py-4 border-t border-black/10 text-[14px] md:text-[15px] text-black/50 leading-relaxed">
                The missing cell: verification guarantees and live bond economics
                in one network.
              </figcaption>
            </figure>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-6">
            {OPEN_SLOT.filter((r) => !r.us).map((row) => (
              <div
                key={row.name}
                className="rounded-[24px] border border-black/20 p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-[12px] md:text-[13px] tracking-[0.08em] text-black/40 mb-2">
                      {row.tag}
                    </p>
                    <h3 className="text-[18px] md:text-[20px] font-semibold">
                      {row.name}
                    </h3>
                  </div>
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-[14px] border border-black/15 bg-white flex items-center justify-center shrink-0 overflow-hidden p-2">
                    <img
                      src={row.logo}
                      alt=""
                      className="h-full w-full object-contain grayscale"
                    />
                  </div>
                </div>
                <div className="space-y-3 text-[15px] md:text-[16px] leading-snug">
                  <div>
                    <p className="text-black/40 text-[12px] mb-1">Verification</p>
                    <p className="text-black/75">{row.verification}</p>
                  </div>
                  <div>
                    <p className="text-black/40 text-[12px] mb-1">
                      Live economics
                    </p>
                    <p className="text-black/75">{row.economics}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {OPEN_SLOT.filter((r) => r.us).map((row) => (
            <div
              key={row.name}
              className="rounded-[28px] border border-black bg-black text-white p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="max-w-[560px]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-[16px] border border-white/25 bg-white flex items-center justify-center overflow-hidden p-2 shrink-0">
                      <img
                        src={row.logo}
                        alt=""
                        className="h-full w-full object-contain grayscale"
                      />
                    </div>
                    <div>
                      <p className="text-[12px] md:text-[13px] tracking-[0.08em] text-white/50 mb-1">
                        {row.tag}
                      </p>
                      <h3 className="text-[28px] md:text-[36px] font-normal">
                        {row.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[16px] md:text-[18px] leading-relaxed text-white/75">
                    Replay audits that survive heterogeneous hardware, bonds sized
                    so expected cheating is negative, and live slash that feeds the
                    run vault. Not a paper. Not a whitelist. A permissionless
                    training network.
                  </p>
                </div>
                <div className="grid gap-3 min-w-[240px]">
                  <div className="rounded-[18px] border border-white/25 px-4 py-3">
                    <p className="text-[12px] text-white/45 mb-1">Verification</p>
                    <p className="text-[15px] md:text-[16px] text-white/90">
                      {row.verification}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-white/25 px-4 py-3">
                    <p className="text-[12px] text-white/45 mb-1">
                      Live economics
                    </p>
                    <p className="text-[15px] md:text-[16px] text-white/90">
                      {row.economics}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={<ExplainFallback />}>
        <ExplainSection />
      </Suspense>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-12 md:mb-16 max-w-[860px]">
            One daemon. One wallet. From a gaming GPU to a datacenter.
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <div>
              <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[15px] font-medium mb-5">
                01
              </div>
              <h3 className="text-[20px] md:text-[24px] font-semibold mb-3">
                Join with a bond
              </h3>
              <p className="text-[17px] md:text-[19px] leading-relaxed text-black/70">
                Every contributor posts collateral. Participation is open, sybil
                is a cost, and exit runs through a challenge window.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[15px] font-medium mb-5">
                02
              </div>
              <h3 className="text-[20px] md:text-[24px] font-semibold mb-3">
                Train over the mesh
              </h3>
              <p className="text-[17px] md:text-[19px] leading-relaxed text-black/70">
                Training runs across the internet. Solana coordinates each round:
                contribution commitments, verifications and rewards live
                on-chain. The chain does not carry tensors. It carries trust.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[15px] font-medium mb-5">
                03
              </div>
              <h3 className="text-[20px] md:text-[24px] font-semibold mb-3">
                Proof of Gradient
              </h3>
              <p className="text-[17px] md:text-[19px] leading-relaxed text-black/70">
                Every gradient that survives verification mints token. Bitcoin
                turned electricity into security. This network turns idle compute
                into collective intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel>Phase 0 proof</SectionLabel>
          <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-6 max-w-[920px]">
            Security economics on real transformer gradients
          </h2>
          <p className="text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[760px] mb-10 md:mb-14">
            30 outer rounds, 16 workers, a 5/16 Byzantine coalition, gradients
            from an 826k-parameter GPT. At audit probability p = 0.1, expected
            catch time is 10 rounds; observed mean across five convictions was
            9.8.
          </p>

          <div className="overflow-x-auto rounded-[28px] border border-black mb-10 md:mb-14">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.03]">
                  <th className="px-5 md:px-6 py-4 text-[15px] md:text-[16px] font-semibold">
                    Scenario
                  </th>
                  <th className="px-5 md:px-6 py-4 text-[15px] md:text-[16px] font-semibold">
                    Final val loss
                  </th>
                  <th className="px-5 md:px-6 py-4 text-[15px] md:text-[16px] font-semibold">
                    Outcome
                  </th>
                </tr>
              </thead>
              <tbody>
                {SIM_ROWS.map((row) => (
                  <tr
                    key={row.scenario}
                    className="border-b border-black/10 last:border-0"
                  >
                    <td className="px-5 md:px-6 py-4 text-[15px] md:text-[17px] font-medium">
                      {row.scenario}
                    </td>
                    <td className="px-5 md:px-6 py-4 text-[15px] md:text-[17px] font-mono text-black/80">
                      {row.loss}
                    </td>
                    <td className="px-5 md:px-6 py-4 text-[15px] md:text-[17px] text-black/70">
                      {row.outcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-6 md:gap-8">
            <Suspense fallback={<ChartFallback />}>
              <LossCurvesChart />
            </Suspense>
            <Suspense fallback={<ChartFallback />}>
              <SecurityEconomicsChart />
            </Suspense>
          </div>

          <div className="mt-10">
            <Link
              to="/docs/developer/sim"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-[15px] md:text-[16px] font-medium hover:bg-black hover:text-white transition-colors"
            >
              Reproduce the sim
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel>Security</SectionLabel>
          <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-6 max-w-[900px]">
            Defection becomes economically irrational
          </h2>
          <p className="text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[720px] mb-14 md:mb-16">
            Every contribution is bonded. Random spot-checks catch liars; caught
            bonds are burned into the system. Three layers cover each other&apos;s
            gap.
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {LAYERS.map((layer) => (
              <div
                key={layer.title}
                className="rounded-[28px] border border-black p-6 md:p-8"
              >
                <h3 className="text-[20px] md:text-[22px] font-semibold mb-3">
                  {layer.title}
                </h3>
                <p className="text-[17px] md:text-[19px] leading-relaxed text-black/70">
                  {layer.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <SectionLabel>Ownership</SectionLabel>
            <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-8">
              Weights public. Revenue circular. Governance by futarchy.
            </h2>
          </div>
          <div className="space-y-6 text-[18px] md:text-[22px] leading-relaxed text-black/75 pt-2">
            <p>
              Model weights are public. The inference network earns revenue.
              Revenue flows to the treasury. The treasury funds the next training
              run.
            </p>
            <p>
              Which model gets trained next is decided by futarchy. Frontier AI
              no longer lives only on five corporate balance sheets. It lives in
              the wallets of the people who contribute.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel>Roadmap</SectionLabel>
          <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-12 md:mb-16 max-w-[820px]">
            Honest status, not vapor timeline
          </h2>
          <div className="space-y-4 md:space-y-5">
            {ROADMAP.map((item) => (
              <div
                key={item.phase}
                className="rounded-[28px] border border-black p-6 md:p-8 grid md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 items-start"
              >
                <div>
                  <p className="text-[14px] md:text-[15px] text-black/45 mb-1">
                    {item.phase}
                  </p>
                  <p className="text-[20px] md:text-[24px] font-semibold">
                    {item.title}
                  </p>
                </div>
                <p className="text-[17px] md:text-[19px] leading-relaxed text-black/70">
                  {item.body}
                </p>
                <span className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-black px-4 text-[13px] md:text-[14px] font-medium whitespace-nowrap">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/docs/project/roadmap"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-[15px] md:text-[16px] font-medium hover:bg-black hover:text-white transition-colors"
            >
              Full roadmap in docs
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel>Devnet</SectionLabel>
          <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-6 max-w-[820px]">
            Programs live on Solana devnet
          </h2>
          <p className="text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[720px] mb-10 md:mb-12">
            Deployed 2026-07-19 under our own program IDs. Permissionless run{' '}
            <span className="font-mono text-[16px] md:text-[18px]">
              leviathan-dev
            </span>{' '}
            sits in WaitingForMembers. Mainnet will use fresh IDs.
          </p>
          <div className="grid gap-3 md:gap-4">
            {DEVNET.map((row) => (
              <div
                key={row.label}
                className="rounded-[24px] border border-black px-5 md:px-6 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"
              >
                <span className="text-[15px] md:text-[16px] font-semibold sm:w-[130px] shrink-0">
                  {row.label}
                </span>
                <code className="text-[13px] md:text-[15px] font-mono text-black/75 break-all">
                  {row.id}
                </code>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/docs/network/devnet"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-[15px] md:text-[16px] font-medium hover:bg-black hover:text-white transition-colors"
            >
              Devnet docs
            </Link>
            <a
              href="https://github.com/wienerlabs/leviathan-net"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-black text-white px-6 text-[15px] md:text-[16px] font-medium hover:bg-black/80 transition-colors"
            >
              leviathan-net
            </a>
          </div>
        </div>
      </section>

      <Waitlist />

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel>Open source</SectionLabel>
          <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-12 md:mb-16">
            Read the code
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {LINKS.map((link) => {
              const className =
                'group rounded-[28px] border border-black p-6 md:p-8 hover:bg-black hover:text-white transition-colors duration-200'
              const inner = (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[18px] md:text-[20px] font-semibold">
                      {link.label}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current text-[16px] transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                  <p className="text-[16px] md:text-[17px] text-black/60 group-hover:text-white/70 transition-colors duration-200">
                    {link.detail}
                  </p>
                </>
              )
              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                )
              }
              return (
                <Link key={link.href} to={link.href} className={className}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10">
        <div className="w-full flex justify-center px-5 md:px-12 pt-10 md:pt-12">
          <img
            src="/banner.jpg"
            alt="Leviathan"
            className="block w-full max-w-[480px] md:max-w-[560px] h-auto grayscale"
            width={1400}
            height={653}
          />
        </div>
        <div className="px-5 md:px-12 py-10 md:py-12">
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/mascot.png"
                alt=""
                className="h-10 w-10 object-contain grayscale"
              />
              <div>
                <p className="text-[17px] font-semibold">Leviathan</p>
                <p className="text-[15px] text-black/50">
                  Trustless training for the people&apos;s model
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-black text-[15px] font-medium hover:bg-black hover:text-white transition-colors duration-200"
              >
                Waitlist
              </a>
              <a
                href="https://x.com/leviathanfront"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-black text-[15px] font-medium hover:bg-black hover:text-white transition-colors duration-200"
              >
                Follow on X
              </a>
              <a
                href="https://github.com/wienerlabs/leviathan-net"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-black text-white text-[15px] font-medium hover:bg-black/80 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
