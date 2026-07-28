import {
  A,
  Code,
  H1,
  H2,
  Lead,
  Li,
  Note,
  Ol,
  P,
  Ul,
} from '../../docs/Prose'
import type { BlogPost } from '../types'
import { getBlogMeta } from '../catalog'
import {
  CiTrapFigure,
  MemnetProofFigure,
  ReplayLoopFigure,
  StackClosedFigure,
  TrustHoleFigure,
} from '../figures/replay-figures'

const COMMIT =
  'https://github.com/wienerlabs/leviathan-net/commit/6115b22d2d41873fa80b4136b6cbe5299d787851'
const FUSION = '/blog/verifier-daemon-fusion'
const LIVE = '/blog/cheat-catching-machine-is-live'
const JURY = '/blog/verifier-as-jury-member'
const APPEALS = '/blog/appeals-court-for-wrongful-convictions'
const BOUNTY = '/blog/tie-breakers-need-to-eat-too'

const meta = getBlogMeta('daemon-recomputes-its-own-truth')!

export const daemonRecomputesItsOwnTruth: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>Leviathan: the daemon recomputes its own truth</H1>
      <Lead>
        The verifier daemon no longer needs an honest peer to publish the
        reference dump. It can recompute the contribution itself, then convict
        against that.
      </Lead>

      <P>
        Until now the daemon wanted two directories: the dumps under audit, and
        a folder of honest dumps to compare them against. That second folder
        only existed if some node had already done the work correctly and
        published it. The protocol exists to remove exactly that assumption.
      </P>
      <TrustHoleFigure />
      <P>
        Prior notes on the machine:{' '}
        <A href={FUSION}>daemon fusion</A>,{' '}
        <A href={LIVE}>live slash</A>,{' '}
        <A href={JURY}>jury membership</A>. The court and its wage:{' '}
        <A href={APPEALS}>appeals</A>,{' '}
        <A href={BOUNTY}>tie-breaker bounty</A>.
      </P>

      <H2 id="what">What changed</H2>
      <P>
        The daemon now accepts an optional replay engine. When one is supplied,
        the reference directory is unnecessary. For each submitted dump it maps
        the committer to its epoch roster index, asks the engine to recompute
        that target&apos;s contribution, and judges against the result. Roster
        lookup runs before the audit because replay is keyed by roster index.
        That also stops the daemon from decompressing and judging dumps it
        could never act on.
      </P>
      <ReplayLoopFigure />
      <P>
        The binary grows <Code>--replay-model</Code> and{' '}
        <Code>--replay-data-dir</Code> beside the existing{' '}
        <Code>--reference-dir</Code>. Passing neither a reference directory nor
        an engine is no longer a silent no-op. It is an explicit error.
      </P>

      <H2 id="proof">Proof against real programs</H2>
      <P>
        End to end in memnet, against the real on-chain programs:
      </P>
      <Ol>
        <Li>
          A bonded cheater sits in a live epoch roster and submits a dump
          forged from what a nano model actually produced.
        </Li>
        <Li>
          The daemon recomputes the honest reference itself. No reference dump
          exists anywhere in the loop.
        </Li>
        <Li>It convicts.</Li>
        <Li>
          The chain settles <Code>slashed</Code> at the run rate with{' '}
          <Code>earned = 0</Code>.
        </Li>
      </Ol>
      <MemnetProofFigure />
      <P>
        Suites: daemon <Code>27/27</Code>. Libtorch-free packs stay{' '}
        <Code>24/24</Code> and <Code>15/15</Code>. The CI invariant was checked
        on purpose, not assumed.
      </P>

      <H2 id="trap">A trap I recorded on purpose</H2>
      <P>
        <Code>write_dense_dump</Code> lives in <Code>leviathan-verifier</Code>,
        not in the tooling test crate. The serialization it needs sits behind
        psyche-network, which pulls tch. Making that a tooling dev-dependency
        would have dragged libtorch into the default test run and broken CI. The
        helper stays where the torch edge already belongs.
      </P>
      <CiTrapFigure />

      <H2 id="arc">Today&apos;s arc</H2>
      <P>
        Three large pieces closed in sequence: the appeals court (net#4 core),
        the symmetric appeal bounty (net#4 economy), and trainer-backed replay
        plus daemon integration (net#5 core). Five commits, all tested; three
        proven on live devnet or against real on-chain programs.
      </P>
      <StackClosedFigure />
      <P>
        Detection no longer trusts a published honest dump. Conviction no longer
        trusts a single key. A false charge costs the accuser. Adjudicators are
        paid on both doors so the wage does not tilt the vote.
      </P>
      <Note>
        Closed for net#5 core means the daemon can recompute its reference and
        convict without importing someone else&apos;s truth, proven in memnet at
        27/27. It does not mean every production model size and every swarm
        ops path is finished.
      </Note>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        A cheat-catching machine that must be handed the honest answer is still
        a client of trust. Today the daemon can produce that answer itself,
        match it to the roster, and finish the sentence through the bonded
        multiparty path. Neither detection nor conviction asks anyone for
        mercy.
      </P>
      <Ul>
        <Li>
          Code:{' '}
          <A href={COMMIT}>
            <Code>6115b22d</Code>
          </A>
        </Li>
        <Li>
          Earlier fusion: <A href={FUSION}>verifier daemon fusion</A>
        </Li>
        <Li>
          Court + wage: <A href={APPEALS}>appeals</A>,{' '}
          <A href={BOUNTY}>tie-breaker bounty</A>
        </Li>
      </Ul>
    </>
  ),
}
