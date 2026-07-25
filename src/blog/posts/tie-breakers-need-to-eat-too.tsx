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
  BiasedBountyFigure,
  EmptyBenchFigure,
  Net4ClosedFigure,
  SettlementRoutesFigure,
  SymmetricBountyFigure,
} from '../figures/appeal-bounty-figures'

const COMMIT_BOUNTY =
  'https://github.com/wienerlabs/leviathan-net/commit/e3d75a01fac5191aaf36759644c2957aae20ca10'
const COMMIT_FIX =
  'https://github.com/wienerlabs/leviathan-net/commit/b93ccb13c1e1274bee4b757831058a4af891cc57'
const PROGRAM_ID = '9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8'
const EXPLORER = `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`
const APPEALS = '/blog/appeals-court-for-wrongful-convictions'
const VERIFIER_EAT = '/blog/verifier-needs-to-eat'

const meta = getBlogMeta('tie-breakers-need-to-eat-too')!

export const tieBreakersNeedToEatToo: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>Leviathan: the appeals bench needs to eat too</H1>
      <Lead>
        The appeals court had a hole in its pocket. Tie-breakers paid the cost
        of a re-audit and earned nothing. I closed that hole, then caught my
        own bias and fixed it the same day.
      </Lead>

      <P>
        Yesterday the court could reverse a wrongful conviction and burn the
        accusers. That was the security tooth. What was missing was the wage
        for the people who staff the second jury. Without it, a rational
        tie-breaker never votes. A bench nobody sits is not a court.
      </P>
      <EmptyBenchFigure />
      <P>
        The committee economics sim already taught this for verifiers:{' '}
        <A href={VERIFIER_EAT}>the cheat hunter needs to eat too</A>. The same
        lesson applies one layer up. Prior court note:{' '}
        <A href={APPEALS}>appeals court for wrongful convictions</A>.
      </P>

      <H2 id="bounty">What I shipped first</H2>
      <P>
        I routed a bounty to the tie-breakers out of the losing verifiers&apos;
        forfeited bonds when an appeal overturns. No new instruction. No new
        config knob. The existing <Code>slash_bounty_bps</Code> machine and the
        same split-and-verify settlement the cheater path already used. When a
        losing verifier finalises withdraw, it may pass the target&apos;s{' '}
        <Code>AuditVerdict</Code> as an optional appeal account. The program
        checks the verdict is Overturned and the withdrawer was one of the
        recorded voters, then splits the bounty among the recorded appeal
        voters, with each recipient token account owner verified on chain.
      </P>
      <P>
        Commit:{' '}
        <A href={COMMIT_BOUNTY}>
          <Code>e3d75a01</Code>
        </A>
        . Memnet asserts the overturn payout. Treasurer redeployed. Full suite
        green at 24/24.
      </P>

      <H2 id="mistake">Then I caught my own mistake</H2>
      <P>
        The first cut paid the tie-breakers only on overturn. That is worse
        than paying nothing. A tie-breaker who wants the reward has a reason to
        free the target whether or not the target is guilty. Exactly the bias
        that lets a guilty node appeal and walk.
      </P>
      <BiasedBountyFigure />
      <P>
        The fix is symmetry. Tie-breakers are paid on both outcomes, each time
        from the side that lost:
      </P>
      <Ul>
        <Li>
          <strong>Overturn.</strong> Funded by the convicting verifiers&apos;
          forfeit (the path already built).
        </Li>
        <Li>
          <strong>Uphold.</strong> Funded by the target&apos;s forfeit. When a
          slashed target withdraws and the verdict is Upheld with a non-empty
          appeal-voter set, the bounty routes to the tie-breakers who confirmed
          the slash, not to the original verifiers alone.
        </Li>
      </Ul>
      <SymmetricBountyFigure />
      <P>
        Because a tie-breaker earns either way, the reward no longer pushes the
        ballot. It votes its honest read. That is the neutral Schelling point
        the first design missed.
      </P>
      <P>
        Commit:{' '}
        <A href={COMMIT_FIX}>
          <Code>b93ccb13</Code>
        </A>
        .
      </P>

      <H2 id="routes">Settlement map</H2>
      <P>
        One bounty machine, three routes. Non-appealed convictions are
        unchanged: empty appeal-voter set still pays the original committee.
        The committee-slash suite was not touched.
      </P>
      <SettlementRoutesFigure />

      <H2 id="proof">Proof</H2>
      <Ol>
        <Li>
          Memnet now asserts a tie-breaker is paid on both overturn and uphold.
        </Li>
        <Li>Full treasurer suite green at 24/24.</Li>
        <Li>
          Treasurer rebuilt and redeployed to{' '}
          <A href={EXPLORER}>
            <Code>{PROGRAM_ID}</Code>
          </A>{' '}
          (data length 533000).
        </Li>
      </Ol>

      <H2 id="where">Where we are</H2>
      <P>
        Issue net#4 is closed for both halves: the security feature
        (losing-side penalty) and its economics (adjudicator incentive). Both
        are live and tested. The only open item left in that arc is an
        explicit challenge bond, a fee so frivolous appeals cost something up
        front. That is a parameter decision, not a missing mechanism.
      </P>
      <Net4ClosedFigure />
      <Note>
        Closed means the appeals court can reverse false convictions, charge
        false accusers, and pay the second jury without tilting its vote. It
        does not mean every economic coefficient is final for mainnet swarm
        sizes.
      </Note>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        A jury that cannot eat will not hunt. An appeals bench that is paid
        only to free people will free too many. Today the bench is paid from
        whoever lost, on both doors, through the same bounty machine the first
        jury already uses. Honest adjudication is the rational move again.
      </P>
      <Ul>
        <Li>
          Appeal bounty:{' '}
          <A href={COMMIT_BOUNTY}>
            <Code>e3d75a01</Code>
          </A>
        </Li>
        <Li>
          Symmetric fix:{' '}
          <A href={COMMIT_FIX}>
            <Code>b93ccb13</Code>
          </A>
        </Li>
        <Li>
          Court mechanism: <A href={APPEALS}>appeals court post</A>
        </Li>
        <Li>
          Treasurer on devnet: <A href={EXPLORER}>explorer</A>
        </Li>
      </Ul>
    </>
  ),
}
