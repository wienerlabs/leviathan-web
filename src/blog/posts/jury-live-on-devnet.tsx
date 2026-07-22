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
  DeployGateFigure,
  RemainingDeployFigure,
  StackBudgetFigure,
  ThreeConditionsFigure,
  UpgradeFigure,
} from '../figures/deploy-figures'

const TREASURER =
  'https://github.com/wienerlabs/leviathan-net/blob/main/architectures/decentralized/solana-treasurer/programs/solana-treasurer/src/lib.rs'
const PROGRAM_ID = '9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8'
const EXPLORER = `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`
const COMMIT_VOTE =
  'https://github.com/wienerlabs/leviathan-net/commit/12cf97566d3d468605e51117a3049a3f2be2ab86'
const COMMIT_DAEMON =
  'https://github.com/wienerlabs/leviathan-net/commit/71e82f9613427728cb414fc5ffad8513f83ffc3e'
const JURY = '/blog/verifier-as-jury-member'
const LIVE = '/blog/cheat-catching-machine-is-live'

const meta = getBlogMeta('jury-live-on-devnet')!

export const juryLiveOnDevnet: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>Leviathan: the jury now convenes on real chain</H1>
      <Lead>
        In the last two steps I took the power to punish off a single key, put
        it on a bonded verifier committee, and made the autonomous daemon a
        member of that jury. All of that still lived only in my own test
        harness (memnet). Today I deployed the mechanism to real Solana
        devnet.
      </Lead>

      <P>
        That sentence is short on purpose. Getting here was not a new whitepaper
        idea. It was the boring, necessary work of proving that the vote path
        fits the machine that will actually run it, then upgrading the live
        program without breaking runs that are already open.
      </P>
      <P>
        Prior notes:{' '}
        <A href={JURY}>daemon as jury member</A>, and earlier{' '}
        <A href={LIVE}>live single-authority slash</A>. This post is the
        deployment chapter.
      </P>

      <DeployGateFigure />

      <H2 id="risk">The real risk was technical, and it mattered</H2>
      <P>
        The vote instruction does not only store a bit. On chain it runs the
        code that selects the committee. On Solana&apos;s BPF runtime every
        function frame must fit in a four-kilobyte stack. If that computation
        does not fit, the program can deploy cleanly and still trap the moment
        someone calls the instruction.
      </P>
      <P>
        So before any upgrade I built the program for BPF and read the stack
        report. The new vote path produced no stack-limit warnings. It fits. Only
        then did I deploy.
      </P>
      <StackBudgetFigure />
      <Note>
        A green memnet suite is necessary and not sufficient. Memnet proves
        logic against the program. BPF proves the same logic still lives inside
        the runtime budget of mainnet-class on-chain code.
      </Note>

      <H2 id="upgrade">Upgraded in place</H2>
      <P>
        I upgraded the treasurer program in place. The address is unchanged.
        Binary size grew from roughly 372 KB to 455 KB. The deploy tooling
        expanded the program data account automatically.
      </P>
      <UpgradeFigure />
      <P>
        Existing live runs did not break. This round never touched the old
        account layout. The vote counter lives entirely in a separate, new
        account (the <Code>AuditVerdict</Code> PDA). That is deliberate:
        multiparty conviction must not require a migration of every open run.
      </P>
      <P>
        Treasurer program on devnet:{' '}
        <A href={EXPLORER}>
          <Code>{PROGRAM_ID}</Code>
        </A>
        . Deploy observed at slot <Code>478174671</Code>. Source of the program
        id declaration:{' '}
        <A href={TREASURER}>
          <Code>solana-treasurer</Code> lib
        </A>
        .
      </P>

      <H2 id="where">Where we are</H2>
      <P>
        Bonded committee vote now clears three conditions at once:
      </P>
      <Ol>
        <Li>
          Proven in my test environment against real program bytecode (memnet
          daemon suite 23/23).
        </Li>
        <Li>Confirmed stack-safe for BPF before deploy.</Li>
        <Li>Deployed to live devnet at the stable treasurer program id.</Li>
      </Ol>
      <ThreeConditionsFigure />
      <P>
        So the multiparty form of the detection-to-conviction line is no longer
        only in the lab. It sits on a real network, at a real program address,
        with a real size and a real slot.
      </P>
      <P>
        Status for &quot;SBF build + treasurer redeploy&quot;: done. This arc,
        end to end:
      </P>
      <Ul>
        <Li>
          Committee vote on chain:{' '}
          <A href={COMMIT_VOTE}>
            <Code>12cf9756</Code>
          </A>
        </Li>
        <Li>
          Daemon integration:{' '}
          <A href={COMMIT_DAEMON}>
            <Code>71e82f96</Code>
          </A>
        </Li>
        <Li>
          SBF-safe devnet deploy: program{' '}
          <Code>9A1kc8…dvv8</Code>, slot <Code>478174671</Code>
        </Li>
      </Ul>

      <H2 id="honest">Honest remaining work</H2>
      <P>
        The mechanism is present on live devnet. It has not yet been exercised
        as a live multiparty swarm on that network. Getting several bonded
        verifier nodes to actually cast votes and tip quorum still wants a
        multi-node setup where each node posts bond. That is operational load,
        not a missing instruction.
      </P>
      <RemainingDeployFigure />
      <Ol>
        <Li>
          <strong>Live multiparty on devnet.</strong> Multiple bonded verifier
          nodes, real votes, quorum-triggered slash under public (or dedicated)
          RPC conditions.
        </Li>
        <Li>
          <strong>Issue #4 v2.</strong> Split forfeited bond to voters who were
          right. Penalize wrong votes. Model the economics in the private sim
          (quorum size, collusion threshold).
        </Li>
        <Li>
          <strong>Issue #5.</strong> Trainer-backed <Code>ReplayEngine</Code> so
          the daemon recomputes the honest reference itself instead of only
          comparing fixture dumps.
        </Li>
      </Ol>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        Design without deploy is theater. Deploy without a stack check is
        gambling. Today the jury is not only specified and tested. It is
        upgraded onto the chain address Leviathan already uses on devnet, with
        room left in the BPF frame and without rewriting the accounts of open
        runs.
      </P>
      <P>
        The security machine&apos;s multiparty conviction path is on the
        network. The next honest mile is making many independent, bonded
        daemons meet there in production conditions.
      </P>
      <Ul>
        <Li>
          Program:{' '}
          <A href={EXPLORER}>
            Solana explorer (devnet)
          </A>
        </Li>
        <Li>
          Jury design note: <A href={JURY}>verifier as jury member</A>
        </Li>
      </Ul>
    </>
  ),
}
