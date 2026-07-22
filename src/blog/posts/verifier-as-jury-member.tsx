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
  DualModeFigure,
  JudgeToJuryFigure,
  QuorumTimelineFigure,
  RemainingWorkFigure,
  TestProofFigure,
} from '../figures/jury-figures'

const COMMIT_TREASURER =
  'https://github.com/wienerlabs/leviathan-net/commit/12cf97566d3d468605e51117a3049a3f2be2ab86'
const COMMIT_DAEMON =
  'https://github.com/wienerlabs/leviathan-net/commit/71e82f9613427728cb414fc5ffad8513f83ffc3e'
const PREV = '/blog/cheat-catching-machine-is-live'
const FUSION = '/blog/verifier-daemon-fusion'

const meta = getBlogMeta('verifier-as-jury-member')!

export const verifierAsJuryMember: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>
        Leviathan: the verifier is no longer a judge, but a jury member
      </H1>
      <Lead>
        Last time we took the power to punish off a single key and put it on
        bonded verifiers. The autonomous daemon was still walking the old path:
        see fraud, slash alone. Today that daemon joins the committee.
      </Lead>

      <P>
        It is no longer a judge. It is one seat on a jury. When it detects
        fraud it does not execute the slash itself. It casts a vote. The penalty
        lands only when enough independent, bonded daemons reach the same
        verdict. One daemon, no matter how sure, cannot punish anyone alone.
        That is the whole point: trust the system without trusting any single
        actor&apos;s mercy.
      </P>

      <JudgeToJuryFigure />

      <H2 id="why">Why this step matters</H2>
      <P>
        The earlier fusion closed detection and conviction into one always-on
        process. That was necessary. It was also incomplete. A single process
        that can both see and punish is still a single point of trust. If that
        key is compromised, or that operator is captured, the network inherits
        their bias.
      </P>
      <P>
        Proof of Gradient already prices honesty with bonds. The natural next
        step is to make the people who audit pay bond too, and to require a
        threshold of them before the chain ejects anyone. The treasurer now
        holds that threshold. The daemon had to speak that language.
      </P>
      <P>
        Context from the previous notes:{' '}
        <A href={FUSION}>daemon fusion</A> and{' '}
        <A href={PREV}>live slash on devnet</A>. Those posts end where this one
        begins: the solo judge must become a juror.
      </P>

      <H2 id="what-changed">What changed in the code</H2>
      <P>
        The change is small in surface area and large in meaning. The daemon
        gained a mode.
      </P>
      <Ul>
        <Li>
          <strong>Default.</strong> The Phase-1 single-authority path remains.
          Existing runs keep working. Identity is still the run authority. On
          fraud the daemon still calls the classic slash instruction.
        </Li>
        <Li>
          <strong>Vote mode.</strong> Identity is no longer the run owner. It is
          a bonded verifier. On fraud the daemon does not slash. It writes a
          verdict on chain via{' '}
          <Code>run_submit_audit_verdict</Code>.
        </Li>
      </Ul>
      <DualModeFigure />
      <P>
        On the program side, an <Code>AuditVerdict</Code> PDA per run and target
        accumulates votes for the current epoch. The caller must be bonded at or
        above the run minimum, must appear as an assigned Verifier in the live
        epoch (via <Code>CommitteeSelection</Code> on the coordinator account),
        and may vote once per target per epoch. When{' '}
        <Code>verdict_count</Code> reaches the configured quorum, the target is
        ejected and the bond path settles at epoch end the way it already did
        for single-authority conviction.
      </P>
      <P>
        Two commits on{' '}
        <A href="https://github.com/wienerlabs/leviathan-net">leviathan-net</A>{' '}
        main:
      </P>
      <Ul>
        <Li>
          <A href={COMMIT_TREASURER}>
            <Code>12cf9756</Code>
          </A>{' '}
          : treasurer bonded multi-verifier committee vote for slashing.
        </Li>
        <Li>
          <A href={COMMIT_DAEMON}>
            <Code>71e82f96</Code>
          </A>{' '}
          : daemon submits committee verdicts instead of single-authority slash
          when <Code>--verdict</Code> is set.
        </Li>
      </Ul>

      <H2 id="not-on-paper">Not left on paper</H2>
      <P>
        Again we refused a design-only story. There is a test against the real
        on-chain program.
      </P>
      <P>
        Setup: six bonded participants, three verifiers, quorum two. Three
        independent daemons audit the same forged gradient (real DisTrO dump,
        honest reference). The first two votes leave the target Healthy. That is
        the proof that a single daemon cannot convict alone. When the third vote
        lands, the target is ejected and the bond is cut at epoch end.
      </P>
      <QuorumTimelineFigure />
      <TestProofFigure />
      <P>
        The suite that owns this behaviour is{' '}
        <Code>memnet_verifier_daemon_committee</Code>. The full daemon test
        package is green at twenty-three of twenty-three. The core package is
        still twenty-one.
      </P>

      <H2 id="where-we-are">Where we are</H2>
      <P>
        The detection-to-conviction line is multiparty for real. Independent
        daemons vote. Majority convicts. Nobody stands alone. That piece of the
        trustless security machine sits where it should.
      </P>
      <P>
        Status for the work item &quot;make the daemon trustless and
        autonomous&quot;: closed for this slice. This round shipped on-chain
        committee vote plus the daemon wire-up, with memnet at 23/23.
      </P>
      <Note>
        Closed means the multiparty verdict path is implemented, tested against
        the real program, and selectable without breaking Phase-1 runs. It does
        not mean every economic edge case of committee life is finished.
      </Note>

      <H2 id="honest">Honest remaining work</H2>
      <P>
        Three threads stay open under issues #4 and #5. Naming them keeps the
        ledger honest.
      </P>
      <Ol>
        <Li>
          <strong>Bounty and wrong-vote cost.</strong> Split forfeited bond as
          reward among voters who were right. Penalize verifiers who vote wrong.
          Without that, the jury has detection power but incomplete skin in the
          economic game.
        </Li>
        <Li>
          <strong>Committee economics in the private sim.</strong> Quorum size,
          collusion threshold, cost of packing the verifier set. The chain can
          enforce a threshold; the sim must tell us which thresholds stay
          fraud-negative under realistic capture.
        </Li>
        <Li>
          <strong>Trainer-backed reference and deploy path.</strong> The daemon
          should recompute the honest reference itself (trainer-backed{' '}
          <Code>ReplayEngine</Code>), not only compare fixture dumps. The
          on-chain program must compile under SBF and the treasurer must
          redeploy: <Code>submit_audit_verdict</Code> runs{' '}
          <Code>CommitteeSelection</Code> on chain and has to fit the BPF 4KB
          stack limit. That is verified at deploy time, not assumed.
        </Li>
      </Ol>
      <RemainingWorkFigure />

      <H2 id="takeaway">Takeaway</H2>
      <P>
        A security machine that can see fraud and punish it in one process is
        powerful. A security machine that requires independent bonded jurors to
        agree before anyone loses a bond is trustless in the sense that
        matters for Leviathan.
      </P>
      <P>
        The daemon still reads live coordinator state, still replay-audits
        contributions, still never invents parameters. What changed is the last
        step: the output is a vote, and the chain is the only judge that can
        finish the sentence.
      </P>
      <Ul>
        <Li>
          Committee vote on chain:{' '}
          <A href={COMMIT_TREASURER}>
            <Code>12cf9756</Code>
          </A>
        </Li>
        <Li>
          Daemon as juror:{' '}
          <A href={COMMIT_DAEMON}>
            <Code>71e82f96</Code>
          </A>
        </Li>
        <Li>
          Earlier live slash note: <A href={PREV}>cheat-catching machine</A>
        </Li>
      </Ul>
    </>
  ),
}
