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
  BountySplitFigure,
  EconomyLoopFigure,
  IncentiveGapFigure,
  IntegrityFigure,
  ShipStatusFigure,
} from '../figures/bounty-figures'

const COMMIT =
  'https://github.com/wienerlabs/leviathan-net/commit/4700c1e7ed72a3997b9ad42ee7606430837a7d17'
const PROGRAM_ID = '9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8'
const EXPLORER = `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`
const JURY = '/blog/verifier-as-jury-member'
const E2E = '/blog/jury-executed-on-devnet'
const DEPLOY = '/blog/jury-live-on-devnet'

const meta = getBlogMeta('verifier-needs-to-eat')!

export const verifierNeedsToEat: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>Leviathan: the cheat hunter needs to eat too</H1>
      <Lead>
        When I built committee voting I left a hole wide enough to kill the
        design on paper: the verifier had no reason to vote.
      </Lead>

      <P>
        The situation was simple and wrong. A verifier must post a bond before
        it can cast a ballot. Then it audits someone else&apos;s work. If it
        finds fraud, it votes. What does it receive in return? Nothing. It puts
        capital in, spends effort, takes risk, and walks away empty-handed.
      </P>
      <P>
        In that regime a rational person does the obvious thing: nothing. If
        nobody audits, fraud is free. If fraud is free, the entire security
        architecture fails even when every instruction is perfectly coded.
      </P>
      <IncentiveGapFigure />
      <P>
        Prior notes on the multiparty path:{' '}
        <A href={JURY}>jury membership</A>,{' '}
        <A href={DEPLOY}>devnet deploy</A>,{' '}
        <A href={E2E}>live quorum execution</A>. This post is the missing
        incentive layer.
      </P>

      <H2 id="fix">What changed today</H2>
      <P>
        I closed the hole. The bond cut from a caught cheater is now paid out as
        a bounty to the committee that produced the verdict. The cheater loses.
        The hunters gain. The reward is not a tip to a single snitch. It is
        split equally across every verifier that cast a vote in that decision.
        The pack that ran the animal down also divides the meat.
      </P>
      <BountySplitFigure />
      <P>
        Concretely, on finalize-withdraw of the target&apos;s bond, the program
        can take the target&apos;s <Code>AuditVerdict</Code> as an optional
        account. When that account is present and carries voters, the bounty
        slice of the forfeit is divided among them. Integer dust stays in the
        vault. When the account is absent, the older single-reporter payout is
        unchanged.
      </P>

      <H2 id="details">Two details that matter</H2>
      <Ol>
        <Li>
          <strong>The chain checks the mouths at the trough.</strong> Every
          recipient token account must belong to a voter recorded on the
          verdict. Otherwise the instruction aborts (
          <Code>BountyRecipientMismatch</Code>). The punished side cannot
          redirect the payout and sabotage the committee.
        </Li>
        <Li>
          <strong>I did not break the old path.</strong> Existing runs and the
          single-reporter flow keep working. Compatibility is not a slogan
          here; it is a branch in the same finalize instruction.
        </Li>
      </Ol>
      <IntegrityFigure />

      <H2 id="proof">End-to-end proof</H2>
      <P>
        I verified the full settlement in test: three verifiers, quorum two,
        two hundred units cut from the target&apos;s bond. Fifty percent of that
        forfeit (one hundred) is the bounty pool. The two voters who formed
        quorum each receive fifty. The target recovers the remaining three
        hundred. Same day, the program was upgraded on live devnet.
      </P>
      <ShipStatusFigure />
      <P>
        Commit:{' '}
        <A href={COMMIT}>
          <Code>4700c1e7</Code>
        </A>
        . Program:{' '}
        <A href={EXPLORER}>
          <Code>{PROGRAM_ID}</Code>
        </A>
        . Suites: default <Code>21/21</Code> without libtorch, daemon{' '}
        <Code>23/23</Code>.
      </P>

      <H2 id="where">Where we are</H2>
      <P>
        The system now has both a stick and a meal. Cheaters lose bond. Hunters
        who vote the conviction take a share of that bond. No single key
        finishes the sentence alone. Security is no longer only a mechanism. It
        is an economy that feeds the people who keep it honest.
      </P>
      <EconomyLoopFigure />
      <Note>
        Still open on the economics side, and named honestly in the commit:
        a penalty for verifiers on the losing side of a resolved vote, and the
        committee sizing model in the private sim repo.
      </Note>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        A jury that cannot eat will not hunt. Today the forfeited bond of a
        caught cheater becomes the wage of the bonded verifiers who voted the
        truth. Equal split. On-chain recipient checks. Old runs intact. Tests
        green. Devnet upgraded.
      </P>
      <Ul>
        <Li>
          Code:{' '}
          <A href={COMMIT}>
            <Code>4700c1e7</Code>
          </A>
        </Li>
        <Li>
          Treasurer on devnet: <A href={EXPLORER}>explorer</A>
        </Li>
        <Li>
          Prior live conviction: <A href={E2E}>jury executed on devnet</A>
        </Li>
      </Ul>
    </>
  ),
}
