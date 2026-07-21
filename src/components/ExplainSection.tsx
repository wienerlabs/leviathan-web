import { Link } from 'react-router-dom'
import AuditVisual from './math/AuditVisual'
import { FormulaScene } from './math/FormulaScene'
import { MathTex } from './math/Math'

export default function ExplainSection() {
  return (
    <section className="border-t border-black/10 px-4 sm:px-5 md:px-12 py-16 sm:py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="text-[14px] sm:text-[15px] md:text-[17px] text-black/50 font-medium mb-5 sm:mb-6 tracking-[0.06em]">
          Explain · 3B1B style
        </p>
        <h2 className="text-[30px] sm:text-[38px] md:text-[64px] leading-[1.08] mb-5 sm:mb-6 max-w-[920px] font-normal">
          The math that makes strangers safe to train with
        </h2>
        <p className="text-[16px] sm:text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[760px] mb-10 sm:mb-12 md:mb-16">
          Looping chalkboard scenes with step progress, equation history, and a
          live audit lottery. Formulas render in LaTeX and advance on a steady
          beat.
        </p>

        <div className="space-y-6 md:space-y-8">
          <FormulaScene
            index="Scene 01 · Bond"
            title="Price lying before it pays"
            lead="Break-even collateral so expected cheating value is non-positive at audit rate p."
            steps={[
              {
                label: 'Reward',
                tex: 'R = \\text{round reward}',
                note: 'Calibrated to ~1.35x H100 market cost of the round FLOPs.',
              },
              {
                label: 'Audit p',
                tex: 'p \\in (0,1]',
                note: 'Probability a contribution is replay-audited this round.',
              },
              {
                label: 'Catch time',
                tex: '\\mathbb{E}[T] = \\frac{1}{p}',
                note: 'Geometric waiting time until the first audit hit.',
              },
              {
                label: 'Bond',
                tex: 'B = R \\cdot \\frac{1-p}{p}',
                note: 'At p = 0.1, B = 9R. Persistent lying is expected-negative from round one.',
              },
            ]}
            footer={
              <p className="text-[15px] md:text-[16px] text-black/55 leading-relaxed">
                At <MathTex tex="p=0.1" className="text-[15px]" />, Phase 0
                calibration gives roughly{' '}
                <MathTex tex={String.raw`\$0.15`} className="text-[15px]" />{' '}
                (125M),{' '}
                <MathTex tex={String.raw`\$2.91`} className="text-[15px]" />{' '}
                (1B), <MathTex tex={String.raw`\$41`} className="text-[15px]" />{' '}
                (7B) per worker.
              </p>
            }
          />

          <FormulaScene
            index="Scene 02 · Proof of Gradient"
            title="Pay only what survived selection"
            lead="Bitcoin paid for hashes. Leviathan pays for learning that passes verification."
            steps={[
              {
                label: 'Commit',
                tex: 'c_i = \\mathrm{Commit}(\\Delta_i)',
                note: 'Trainers publish compressed pseudo-gradients off-chain; roots land on Solana.',
              },
              {
                label: 'Select',
                tex: 'S = \\mathrm{Aggregate}_{\\mathrm{clip}}(\\{\\Delta_i\\})',
                note: 'Centered clip + excision bounds damage before audits resolve.',
              },
              {
                label: 'Audit',
                tex: '\\|\\Delta_i - \\widehat{\\Delta}_i\\| \\le \\tau',
                note: 'Replay from (checkpoint, seed, data) inside a published tolerance band.',
              },
              {
                label: 'PoG',
                tex: '\\mathrm{PoG}_i = R_i \\cdot \\mathbf{1}[\\text{accepted} \\wedge \\neg\\text{slashed}]',
                note: 'Reward if committed, selected, and not convicted. Slash otherwise.',
              },
            ]}
          />

          <AuditVisual />
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/docs/protocol/security"
            className="inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-[15px] md:text-[16px] font-medium hover:bg-black hover:text-white transition-colors"
          >
            Security docs
          </Link>
          <Link
            to="/docs/developer/sim"
            className="inline-flex h-12 items-center justify-center rounded-full bg-black text-white px-6 text-[15px] md:text-[16px] font-medium hover:bg-black/80 transition-colors"
          >
            Reproduce the sim
          </Link>
        </div>
      </div>
    </section>
  )
}
