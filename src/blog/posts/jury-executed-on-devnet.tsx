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
  ArcSummaryFigure,
  LiveScenarioFigure,
  StackToLiveFigure,
  TripleProofFigure,
  VoteSequenceFigure,
} from '../figures/e2e-figures'

const COMMIT_E2E =
  'https://github.com/wienerlabs/leviathan-net/commit/9969e0029253ad2b13428eeee75a46fa6d41168b'
const COMMIT_VOTE =
  'https://github.com/wienerlabs/leviathan-net/commit/12cf97566d3d468605e51117a3049a3f2be2ab86'
const COMMIT_DAEMON =
  'https://github.com/wienerlabs/leviathan-net/commit/71e82f9613427728cb414fc5ffad8513f83ffc3e'
const PROGRAM_ID = '9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8'
const EXPLORER = `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`
const DEMO =
  'https://github.com/wienerlabs/leviathan-net/blob/main/architectures/decentralized/solana-tooling/src/bin/devnet_committee_demo.rs'
const DEPLOY = '/blog/jury-live-on-devnet'
const JURY = '/blog/verifier-as-jury-member'

const meta = getBlogMeta('jury-executed-on-devnet')!

export const juryExecutedOnDevnet: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>
        Leviathan: the jury convened on real chain and executed its verdict
      </H1>
      <Lead>
        I had already built the bonded verifier committee in my own harness and
        then deployed it to live Solana devnet. Deploy does not prove execution.
        Today I convened that committee on real devnet and watched it carry out
        a real penalty.
      </Lead>

      <P>
        That is the difference between a program that exists at an address and a
        mechanism that has finished a sentence under network conditions. This
        post is the execution report.
      </P>
      <P>
        Prior notes:{' '}
        <A href={JURY}>daemon as jury member</A>, and{' '}
        <A href={DEPLOY}>jury deployed to devnet</A>.
      </P>

      <H2 id="scenario">The scenario</H2>
      <P>
        Three bonded participants joined the real network. The protocol opened an
        epoch. Two of them were assigned as verifiers; one was the target. The
        verifiers then voted in sequence.
      </P>
      <LiveScenarioFigure />
      <P>
        The first vote did not touch the target. A single verifier, no matter
        how sure, cannot convict anyone alone. When the second vote landed,
        quorum completed, the target was ejected from the network, and at epoch
        end the bond was cut on chain. Two hundred units, on real devnet, by a
        real multiparty vote.
      </P>
      <VoteSequenceFigure />
      <Note>
        Verified with the live demo against Helius RPC: three bonded clients,
        two verifiers, quorum two. One vote leaves the target Healthy; the
        second reaches quorum, ejects, and settles <Code>slashed == 200</Code>{' '}
        at epoch end. Source:{' '}
        <A href={DEMO}>
          <Code>devnet_committee_demo</Code>
        </A>
        .
      </Note>

      <H2 id="stack">It also passed the stack exam</H2>
      <P>
        The vote instruction runs committee selection on chain. That path must
        fit Solana BPF&apos;s hard stack limit. Before deploy I had already
        read a clean stack report. Today that same code was actually invoked and
        completed the transaction. If it had not fit, the call would have
        trapped.
      </P>
      <StackToLiveFigure />
      <P>
        So the line from compile-time stack check to a live multiparty vote is
        closed. Not assumed. Observed.
      </P>

      <H2 id="where">Where we are</H2>
      <P>
        Bonded committee vote is now proven three separate ways:
      </P>
      <Ol>
        <Li>
          In my test environment against real program bytecode (memnet daemon
          suite 23/23).
        </Li>
        <Li>Stack-safe for Solana&apos;s BPF runtime.</Li>
        <Li>
          On live devnet with a real majority conviction and a real on-chain
          slash settlement.
        </Li>
      </Ol>
      <TripleProofFigure />
      <P>
        A conviction mechanism you can trust without trusting any single
        person&apos;s mercy is no longer only a lab object. It runs on the
        network.
      </P>
      <P>
        Status for this continuation: three steps closed in sequence. SBF build
        check, treasurer redeploy (
        <A href={EXPLORER}>
          <Code>9A1kc8…</Code>
        </A>
        ), and live devnet quorum-slash e2e (
        <A href={COMMIT_E2E}>
          <Code>9969e002</Code>
        </A>
        , run <Code>E3BH7mJE…</Code>). Committee-vote is now memnet 23/23 +
        SBF-safe + live devnet.
      </P>

      <H2 id="arc">Today&apos;s arc in one line</H2>
      <P>
        In a single arc: on-chain committee-vote → daemon integration → SBF
        build → redeploy → live e2e. The move from a single key to majority
        vote is proven end to end.
      </P>
      <ArcSummaryFigure />
      <Ul>
        <Li>
          Committee vote:{' '}
          <A href={COMMIT_VOTE}>
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
          Live e2e demo:{' '}
          <A href={COMMIT_E2E}>
            <Code>9969e002</Code>
          </A>
        </Li>
      </Ul>

      <H2 id="honest">What remains</H2>
      <P>
        The multiparty path is live and executed once under a controlled
        three-client setup. What is still open is the longer operational and
        economic work around that core:
      </P>
      <Ol>
        <Li>
          <strong>Larger live swarms.</strong> More bonded verifier nodes under
          sustained load, not only a three-client demonstration run.
        </Li>
        <Li>
          <strong>Issue #4 v2 economics.</strong> Split forfeited bond to voters
          who were right; penalize wrong votes; model quorum and collusion in
          the private sim.
        </Li>
        <Li>
          <strong>Issue #5 trainer-backed ReplayEngine.</strong> The daemon
          should recompute the honest reference itself, not only drive the vote
          path with prepared evidence.
        </Li>
      </Ol>
      <H2 id="takeaway">Takeaway</H2>
      <P>
        Deploy proves presence. Memnet proves logic. Live e2e proves that
        independent bonded verifiers can meet on a real network, reach quorum,
        eject a target, and settle a two-hundred-unit slash without any single
        key finishing the sentence alone.
      </P>
      <P>
        That is the security machine&apos;s multiparty conviction path, not as a
        diagram, but as an observed outcome on Solana devnet.
      </P>
    </>
  ),
}
