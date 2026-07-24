import {
  A,
  Code,
  H1,
  H2,
  Lead,
  Li,
  Note,
  P,
  Ul,
} from '../../docs/Prose'
import type { BlogPost } from '../types'
import { getBlogMeta } from '../catalog'
import {
  BondCorrectionFigure,
  CommitteeScaleFigure,
  MissingConstraintFigure,
  OpenRiskFigure,
  ScienceNormFigure,
} from '../figures/economics-figures'

const COMMIT =
  'https://github.com/wienerlabs/leviathan/commit/37b42e5bfcefc97685b31688b06aa89c92ae2cea'
const COMMITTEE_DOC =
  'https://github.com/wienerlabs/leviathan/blob/main/docs/COMMITTEE_ECONOMICS.md'
const TOKENOMICS =
  'https://github.com/wienerlabs/leviathan/blob/main/docs/TOKENOMICS.md'
const BOUNTY = '/blog/verifier-needs-to-eat'
const E2E = '/blog/jury-executed-on-devnet'

const meta = getBlogMeta('bond-was-too-low')!

export const bondWasTooLow: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>Leviathan: I found my own number was wrong</H1>
      <Lead>
        I built committee voting, split the bounty to the voters, and took it
        live. Next I had to measure it: how many verifiers are safe, what
        quorum, how large a bond? The simulation answered with something I did
        not expect. The bond figure I had published was about 3.6× too low.
      </Lead>

      <P>
        That sentence is uncomfortable on purpose. The point of this project is
        not to defend a number because it already appeared in a whitepaper. The
        point is that every claim should be checkable, including the ones I
        wrote.
      </P>
      <P>
        Context:{' '}
        <A href={BOUNTY}>verifier bounty</A>,{' '}
        <A href={E2E}>live multiparty conviction</A>. This post is the
        economics chapter, and the correction.
      </P>

      <H2 id="gap">What the old formula saw, and what it missed</H2>
      <P>
        In the whitepaper I sized the bond to deter the cheater: expected return
        on fraud should be negative at the published audit probability. That
        half is still right. It is also incomplete, because it only looks at the
        attacker.
      </P>
      <MissingConstraintFigure />
      <P>
        Now look at the verifier. Every audit costs compute. Pay arrives only
        when a catch happens. The bounty is split across the committee. If a
        catch arrives roughly once every ten audits, ten audit costs must be
        covered by a single split bounty. Put the numbers in and the result is
        blunt: at the published bond, being a verifier loses money. Even if
        bounty is raised to one hundred percent of the forfeit, the auditor is
        still underwater at that bond.
      </P>
      <P>
        This is not a decorative flaw. A rational person will not run a job that
        loses money. No verifiers means no audits. No audits means free fraud. A
        security layer nobody runs is not a security layer.
      </P>

      <H2 id="second-floor">The second floor</H2>
      <P>
        So the model now carries two floors. The bond must deter the cheater.
        The bond must also pay the auditors who make deterrence real. The network
        should post the larger of the two.
      </P>
      <BondCorrectionFigure />
      <P>
        For a three-verifier committee at the 1B genesis preset with{' '}
        <Code>p = 0.1</Code> and a 50% bounty, that number is not two dollars
        and ninety-one cents. It is about ten dollars and fifty-five cents. The
        binding constraint is named in the sim: verifier sustainability, not
        cheater break-even.
      </P>
      <div className="my-8 overflow-x-auto rounded-[18px] border border-black/10">
        <pre className="m-0 px-4 py-4 text-[13px] sm:text-[14px] font-mono leading-relaxed text-black/80 whitespace-pre-wrap">
          {`sustainable bond = audit_cost × quorum / (fraud_rate × bounty_share)
network bond     = max(cheater_floor, verifier_floor)`}
        </pre>
      </div>

      <H2 id="scale">Committees are not free</H2>
      <P>
        The second lesson is about scale. Every extra verifier multiplies the
        audit cost the network must finance, while the bounty pool for a given
        slash stays a fixed share of one bond. Required bond therefore grows
        roughly linearly with quorum. Moving from three verifiers to twenty-one
        multiplies the bond by about seven.
      </P>
      <CommitteeScaleFigure />
      <P>
        What do you buy with that? More Byzantine headroom, and a collusion
        bill that jumps from about twenty-one dollars to about one thousand
        thirty-four. There is a real trade. There is no free security. For
        genesis I recommend starting with three to six verifiers, then buying
        headroom when the economy can carry a higher bond.
      </P>

      <H2 id="limits">What the model still does not cover</H2>
      <P>
        I also wrote down what we did not model, because the real gaps live
        there. Right now there is no direct penalty for framing an innocent
        target. If an attacker buys the majority, they can punish someone who
        did nothing wrong and pay no dedicated cost for the frame. That is the
        next economic job, related to a losing-side penalty on resolved votes.
      </P>
      <OpenRiskFigure />

      <H2 id="where">Where we are</H2>
      <P>
        The mechanism is live. Its economy is now tied to numbers you can
        re-run. The most important output of this round is not a prettier
        parameter table. It is catching our own published figure with our own
        simulation and correcting it in public.
      </P>
      <ScienceNormFigure />
      <P>
        Status: committee economics modelled in{' '}
        <A href={COMMIT}>
          <Code>37b42e5</Code>
        </A>
        . Quorum and Byzantine bounds, collusion capital, verifier EV, required
        bond with the binding constraint named. Twelve new tests. Full sim suite{' '}
        <Code>48/48</Code>. Honest correction in{' '}
        <A href={TOKENOMICS}>TOKENOMICS.md</A>. New document:{' '}
        <A href={COMMITTEE_DOC}>COMMITTEE_ECONOMICS.md</A>.
      </P>
      <Note>
        Private sim repo paths are linked from{' '}
        <A href="https://github.com/wienerlabs/leviathan">wienerlabs/leviathan</A>
        . If a link 404s for you, the repo may still be private; the commit hash
        and the numbers above remain the public claim.
      </Note>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        A whitepaper number that cannot survive its own sim should not survive
        the product. The cheater-only bond was incomplete. The network bond is
        the max of cheater deterrence and verifier pay. At the genesis preset
        that moves the figure from roughly $2.91 to roughly $10.55 for a
        three-verifier committee, and it forces an honest conversation about how
        large a jury the economy can actually feed.
      </P>
      <Ul>
        <Li>
          Model commit:{' '}
          <A href={COMMIT}>
            <Code>37b42e5</Code>
          </A>
        </Li>
        <Li>
          Doc: <A href={COMMITTEE_DOC}>COMMITTEE_ECONOMICS.md</A>
        </Li>
        <Li>
          Related incentive post: <A href={BOUNTY}>the cheat hunter needs to eat</A>
        </Li>
      </Ul>
    </>
  ),
}
