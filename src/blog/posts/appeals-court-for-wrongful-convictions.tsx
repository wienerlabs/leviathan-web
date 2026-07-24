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
  BlindSpotFigure,
  LifecycleFigure,
  OverturnEconomicsFigure,
  PartitionFigure,
  ShipProofFigure,
} from '../figures/appeals-figures'

const COMMIT =
  'https://github.com/wienerlabs/leviathan-net/commit/efd9d5b61fc031d0ce6269cfd45bf6552df42524'
const PROGRAM_ID = '9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8'
const EXPLORER = `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`
const DEMO =
  'https://github.com/wienerlabs/leviathan-net/blob/main/architectures/decentralized/solana-tooling/src/bin/devnet_appeals_demo.rs'
const JURY = '/blog/verifier-as-jury-member'
const E2E = '/blog/jury-executed-on-devnet'
const BOUNTY = '/blog/verifier-needs-to-eat'

const meta = getBlogMeta('appeals-court-for-wrongful-convictions')!

export const appealsCourtForWrongfulConvictions: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>
        Leviathan: an appeals court for wrongful convictions
      </H1>
      <Lead>
        We added a court of appeal. A verifier that convicts an innocent node
        now loses its own bond.
      </Lead>

      <P>
        Committee vote already took the power to punish off a single key. A
        bonded jury decided who cheated. One hole remained: a wrong accusation
        cost the verifier nothing. That blind spot is closed.
      </P>
      <BlindSpotFigure />
      <P>
        Prior notes:{' '}
        <A href={JURY}>verifier as jury member</A>,{' '}
        <A href={E2E}>live conviction on devnet</A>,{' '}
        <A href={BOUNTY}>bounty for honest voters</A>. This post is the missing
        counter-penalty.
      </P>

      <H2 id="what">What changed</H2>
      <P>
        When a verifier majority convicts a node, the slash is no longer
        immediate (when the challenge window is enabled). An appeal window
        opens. The accused can post its own bond and convene a larger,
        separately drawn tie-breaker jury. That jury is not a person with a
        special key. It is another bonded committee, the same idea as the first
        vote, only larger and disjoint.
      </P>
      <Ul>
        <Li>
          <strong>Overturn (two-thirds).</strong> Accusing verifiers forfeit
          bond. The innocent target is unharmed.
        </Li>
        <Li>
          <strong>Uphold (two-thirds).</strong> The original slash becomes
          final.
        </Li>
        <Li>
          <strong>No challenge.</strong> When the window closes, the slash
          finalises alone.
        </Li>
      </Ul>
      <LifecycleFigure />

      <H2 id="how">How it shipped without touching the coordinator</H2>
      <P>
        The pleasant surprise: the coordinator program did not need a
        redeploy. The tie-breaker seats already existed in the coordinator
        lottery. They were simply never filled (
        <Code>start_round_train</Code> always passed zero). The treasurer now
        draws its own selection with{' '}
        <Code>from_coordinator_with_tie_breakers</Code>, overrides the
        tie-breaker count from a per-run config, and partitions one epoch into
        disjoint trainer, verifier, and tie-breaker sets. Nobody sits as judge
        on a case they already argued.
      </P>
      <PartitionFigure />
      <P>
        Five new treasurer instructions:{' '}
        <Code>run_set_challenge_config</Code>, <Code>run_open_challenge</Code>,{' '}
        <Code>run_submit_appeal_verdict</Code>, <Code>run_finalize_slash</Code>,{' '}
        <Code>run_slash_losing_verifier</Code>. Two config knobs, both default
        zero. Existing runs keep the old immediate-slash path. Full backward
        compatibility is a default, not a migration story.
      </P>
      <P>
        On <Code>AuditVerdict</Code> the lifecycle is explicit:{' '}
        Voting → SlashPending → Challenged → Upheld or Overturned. Losing bonds
        still settle through the existing slash-then-epoch-boundary path.
      </P>

      <H2 id="proof">Proof, lab and live</H2>
      <P>
        The memnet treasurer package is green at twenty-four of twenty-four.
        Three new suites cover the whole court:
      </P>
      <Ol>
        <Li>Overturn penalises the convicting verifiers.</Li>
        <Li>Uphold slashes the target.</Li>
        <Li>Unchallenged verdict finalises after the window.</Li>
      </Ol>
      <P>
        Then the same path on real Solana devnet via{' '}
        <A href={DEMO}>
          <Code>devnet_appeals_demo</Code>
        </A>
        . Two verifiers convict. The target challenges. Two tie-breakers
        overturn. Both accusing verifiers each burn two hundred units of bond.
        The innocent target keeps the full bond (
        <Code>slashed = 0</Code>). Observed run prefix{' '}
        <Code>2QZxyEG</Code>.
      </P>
      <OverturnEconomicsFigure />
      <P>
        Treasurer program upgraded in place at{' '}
        <A href={EXPLORER}>
          <Code>{PROGRAM_ID}</Code>
        </A>{' '}
        (data length 522760). Coordinator untouched. Shared coordinator library
        gained a pure{' '}
        <Code>from_coordinator_with_tie_breakers</Code> constructor so the
        treasurer can fill seats the on-chain coordinator account still leaves
        empty.
      </P>
      <ShipProofFigure />

      <H2 id="where">Where we are</H2>
      <P>
        Three economic layers of the multiparty security machine now have
        symmetric teeth. A node that cheats can lose bond. A verifier that
        hunts honestly can eat. A verifier that convicts the innocent can burn.
        Detection, conviction, bounty, and appeal are no longer a one-way stick.
      </P>
      <Note>
        Closed for issue net#4 means the appeals court is implemented, tested
        at 24/24, redeployed, and executed live once under a controlled demo.
        It does not mean every operational swarm size or every private-sim
        collusion curve is finished.
      </Note>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        Majority vote without an appeal is still a trust surface if a false
        majority pays nothing. Today the chain can reverse a wrongful
        conviction and charge the people who forced it. The judge is still a
        bonded committee. The sentence can still be appealed. Both sides of a
        bad judgment now have skin in the game.
      </P>
      <Ul>
        <Li>
          Code:{' '}
          <A href={COMMIT}>
            <Code>efd9d5b6</Code>
          </A>
        </Li>
        <Li>
          Treasurer on devnet: <A href={EXPLORER}>explorer</A>
        </Li>
        <Li>
          Live demo source:{' '}
          <A href={DEMO}>
            <Code>devnet_appeals_demo</Code>
          </A>
        </Li>
      </Ul>
    </>
  ),
}
