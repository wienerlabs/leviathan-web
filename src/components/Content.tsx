const LINKS = [
  {
    label: 'Network substrate',
    href: 'https://github.com/wienerlabs/leviathan-net',
    detail: 'Bonds, audits, slashing on Solana',
  },
  {
    label: 'Research & sim',
    href: 'https://github.com/wienerlabs/leviathan',
    detail: 'Phase 0 proof and whitepaper',
  },
  {
    label: 'On X',
    href: 'https://x.com/leviathanfront',
    detail: '@leviathanfront',
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

export default function Content() {
  return (
    <div className="relative z-10 bg-white text-black">
      <div className="w-full border-b border-black/10">
        <img
          src="/banner.jpg"
          alt="Leviathan"
          className="block w-full max-h-[42vh] object-cover object-center grayscale"
          width={1400}
          height={653}
        />
      </div>
      <section className="px-5 md:px-12 pt-14 md:pt-20 pb-20 md:pb-32 max-w-[1100px] mx-auto">
        <p className="text-[13px] md:text-[14px] text-black/50 font-medium mb-6 tracking-[0.06em]">
          Thesis
        </p>
        <h2 className="font-italiana text-[32px] md:text-[56px] leading-[1.08] max-w-[900px] mb-10 md:mb-14">
          Hobbes drew Leviathan as a giant made of thousands of people.
          This one is made of thousands of GPUs.
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 text-[15px] md:text-[17px] leading-relaxed text-black/80">
          <p>
            Frontier AI today sits on five balance sheets. The math of training
            over the open internet is already solved and shipping. What remains
            unsolved is trust: nobody has made it safe to accept a gradient from
            a stranger and pay them for it.
          </p>
          <p>
            Leviathan is a Solana-coordinated training network. Anyone with a
            GPU joins by posting a bond, earns Proof of Gradient for work that
            survives verification, and loses the bond if they lie. The model
            belongs to the network that trained it.
          </p>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[13px] md:text-[14px] text-black/50 font-medium mb-6 tracking-[0.06em]">
            How it works
          </p>
          <h2 className="font-italiana text-[28px] md:text-[48px] leading-[1.1] mb-12 md:mb-16 max-w-[720px]">
            One daemon. One wallet. From a gaming GPU to a datacenter.
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <div>
              <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[13px] font-medium mb-5">
                01
              </div>
              <h3 className="text-[17px] md:text-[18px] font-semibold mb-3">
                Join with a bond
              </h3>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-black/70">
                Every contributor posts collateral. Participation is open, sybil
                is a cost, and exit runs through a challenge window.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[13px] font-medium mb-5">
                02
              </div>
              <h3 className="text-[17px] md:text-[18px] font-semibold mb-3">
                Train over the mesh
              </h3>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-black/70">
                Training runs across the internet. Solana coordinates each
                round: contribution commitments, verifications and rewards live
                on-chain. The chain does not carry tensors. It carries trust.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[13px] font-medium mb-5">
                03
              </div>
              <h3 className="text-[17px] md:text-[18px] font-semibold mb-3">
                Proof of Gradient
              </h3>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-black/70">
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
          <p className="text-[13px] md:text-[14px] text-black/50 font-medium mb-6 tracking-[0.06em]">
            Security
          </p>
          <h2 className="font-italiana text-[28px] md:text-[48px] leading-[1.1] mb-6 max-w-[760px]">
            Defection becomes economically irrational
          </h2>
          <p className="text-[15px] md:text-[17px] leading-relaxed text-black/70 max-w-[640px] mb-14 md:mb-16">
            Every contribution is bonded. Random spot-checks catch liars; caught
            bonds are burned into the system. Three layers cover each other's
            gap.
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {LAYERS.map((layer) => (
              <div
                key={layer.title}
                className="rounded-[28px] border border-black p-6 md:p-8"
              >
                <h3 className="text-[16px] md:text-[18px] font-semibold mb-3">
                  {layer.title}
                </h3>
                <p className="text-[14px] md:text-[15px] leading-relaxed text-black/70">
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
            <p className="text-[13px] md:text-[14px] text-black/50 font-medium mb-6 tracking-[0.06em]">
              Ownership
            </p>
            <h2 className="font-italiana text-[28px] md:text-[48px] leading-[1.1] mb-8">
              Weights public. Revenue circular. Governance by futarchy.
            </h2>
          </div>
          <div className="space-y-6 text-[15px] md:text-[17px] leading-relaxed text-black/75 pt-2">
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
          <p className="text-[13px] md:text-[14px] text-black/50 font-medium mb-6 tracking-[0.06em]">
            Open source
          </p>
          <h2 className="font-italiana text-[28px] md:text-[48px] leading-[1.1] mb-12 md:mb-16">
            Read the code
          </h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[28px] border border-black p-6 md:p-8 hover:bg-black hover:text-white transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[15px] md:text-[16px] font-semibold">
                    {link.label}
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current text-[16px] transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
                <p className="text-[13px] md:text-[14px] text-black/60 group-hover:text-white/70 transition-colors duration-200">
                  {link.detail}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 px-5 md:px-12 py-10 md:py-12">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/mascot.png"
              alt=""
              className="h-8 w-8 object-contain grayscale"
            />
            <div>
              <p className="text-[14px] font-semibold">Leviathan</p>
              <p className="text-[12px] text-black/50">
                Trustless training for the people's model
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://x.com/leviathanfront"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-black text-[12px] font-medium hover:bg-black hover:text-white transition-colors duration-200"
            >
              Follow on X
            </a>
            <a
              href="https://github.com/wienerlabs/leviathan-net"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-black text-white text-[12px] font-medium hover:bg-black/80 transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
