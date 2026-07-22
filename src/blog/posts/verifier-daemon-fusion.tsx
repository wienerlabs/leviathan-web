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
  Pre,
  Table,
  Ul,
} from '../../docs/Prose'
import type { BlogPost } from '../types'
import {
  CoverageModesFigure,
  DutyCycleFigure,
  IndexGuardFigure,
  OpenWorkFigure,
  ProofStripFigure,
} from '../figures/daemon-figures'

const COMMIT =
  'https://github.com/wienerlabs/leviathan-net/commit/74f45f3e9a1dc21cf3078e0308507314e4b94d78'
const LOCK_COMMIT =
  'https://github.com/wienerlabs/leviathan-net/commit/9d9a13c5eb8dc78c50ab3c021e9b70e1f692fdb1'
const MEMNET =
  'https://github.com/wienerlabs/leviathan-net/blob/main/architectures/decentralized/solana-tooling/tests/suites/memnet_verifier_daemon.rs'
const DAEMON_RS =
  'https://github.com/wienerlabs/leviathan-net/blob/main/architectures/decentralized/solana-tooling/src/daemon.rs'

export const verifierDaemonFusion: BlogPost = {
  slug: 'verifier-daemon-fusion',
  title: 'Fusing detection and conviction into one verifier daemon',
  description:
    'leviathan-verifier-daemon now closes the loop in one always-on process: read the coordinator, audit committed work against an honest reference, and slash on fraud with live roster indexing.',
  date: '2026-07-22',
  dateLabel: '22 July 2026',
  body: (
    <>
      <H1>Fusing detection and conviction into one verifier daemon</H1>
      <Lead>
        Detection without conviction is half a security story. On{' '}
        <time dateTime="2026-07-22">22 July 2026</time> we shipped the fusion:
        <Code>leviathan-verifier-daemon</Code> is a single always-on process that
        reads live coordinator state, replay-audits committed contributions, and
        submits on-chain slash when the audit says fraud.
      </Lead>

      <P>
        Primary change in{' '}
        <A href="https://github.com/wienerlabs/leviathan-net">leviathan-net</A>:{' '}
        <A href={COMMIT}>
          <Code>74f45f3e</Code> feat(daemon): fuse replay audit and on-chain
          conviction into one process
        </A>
        . Lockfile follow-up:{' '}
        <A href={LOCK_COMMIT}>
          <Code>9d9a13c5</Code>
        </A>
        .
      </P>

      <H2 id="loop">The always-on loop</H2>
      <P>
        One process, one duty cycle. No handoff between a detector box and a
        separate slasher script.
      </P>
      <DutyCycleFigure />
      <Pre>{`read live coordinator account
  → ingest committed contributions
  → replay-audit each against an honest reference
  → on fraud, process_treasurer_run_slash_with_hashes
     (map committer → live epoch_state.clients index)`}</Pre>
      <P>
        The slash path is not a mock. It maps the committing client to its index
        in the live epoch roster before calling the treasurer instruction. Wrong
        index is refused rather than guessed.
      </P>
      <IndexGuardFigure />

      <H2 id="build">How it was built</H2>
      <P>
        Four parallel investigation agents, then sequential implementation on the
        main tree. The important engineering choices:
      </P>
      <Ul>
        <Li>
          The audit loop lives in{' '}
          <A href={DAEMON_RS}>
            <Code>psyche_solana_tooling::daemon</Code>
          </A>
          , as a library module, not only as a binary. The binary is CLI plus
          loop so the path stays unit-testable.
        </Li>
        <Li>
          Two modes:{' '}
          <Code>--audit-all</Code> (every observed contribution, Phase-1 single
          authority) and <Code>--audit-assigned</Code> (
          <Code>select_audits_for_current_round</Code> lottery targets, Phase-3
          preview).
        </Li>
        <Li>
          The run PDA is derived from <Code>run_id</Code>. Operators supply the
          coordinator account and the authority keypair, not a hand-maintained
          PDA list.
        </Li>
        <Li>
          Heavy deps (<Code>clap</Code>, <Code>tokio</Code>,{' '}
          <Code>leviathan-verifier</Code>, <Code>psyche-verifier</Code>,{' '}
          <Code>tch</Code>) sit behind an optional <Code>daemon</Code> feature.
          Default memnet suite and CI stay free of libtorch. Twenty existing
          tests still pass without the feature and without a torch environment.
        </Li>
      </Ul>
      <CoverageModesFigure />

      <H2 id="math">What the audit decides</H2>
      <P>
        Replay audit is the decision core. Each contribution is checked against
        an honest reference under the published audit probability p. Expected
        rounds to catch a persistent cheater is 1/p at constant p. The bond floor
        is still the break-even law from the economics model:{' '}
        <Code>bond &gt;= reward × (1 − p) / p</Code>.
      </P>
      <P>
        The daemon does not invent those parameters. It enforces them: if the
        dump fails the reference, conviction must land on chain, not only in a
        log line.
      </P>

      <H2 id="evidence">Two-sided verification</H2>
      <ProofStripFigure />
      <Table
        headers={['Proof', 'What it shows']}
        rows={[
          [
            <>
              memnet suite{' '}
              <A href={MEMNET}>
                <Code>memnet_verifier_daemon.rs</Code>
              </A>{' '}
              (real on-chain program)
            </>,
            'Cheater is on the roster. Daemon audits a real dump. Chain records slash: slashed == 200, earned == 0 (1 passed).',
          ],
          [
            'Live devnet dry-run (flagship)',
            'Connected to devnet, derived the run PDA, audited 4 dumps (4× fraud score 6.0), looked up the committer on the live roster. With no target present, safe no-op (wrong-index guard).',
          ],
        ]}
      />
      <P>
        So the slash fires against a live committer in memnet with the real
        program, and the live chain-read + audit + roster-lookup path runs on
        real devnet state.
      </P>

      <H2 id="commits">Commits on main</H2>
      <Ul>
        <Li>
          <A href={COMMIT}>
            <Code>74f45f3e</Code>
          </A>{' '}
          : daemon fusion (
          <Code>architectures/decentralized/solana-tooling/src/daemon.rs</Code>
          and the memnet suite).
        </Li>
        <Li>
          <A href={LOCK_COMMIT}>
            <Code>9d9a13c5</Code>
          </A>{' '}
          : Cargo.lock for optional daemon feature deps.
        </Li>
      </Ul>
      <Note>
        Memory and issue tracking for the remaining live gaps stay open under
        issue #5. This post is the engineering record of what is already closed.
      </Note>

      <H2 id="honest">What is still open (issue #5)</H2>
      <P>Honest remaining work, not a victory lap:</P>
      <OpenWorkFigure />
      <Ol>
        <Li>Full live devnet slash-through-daemon as a single end-to-end tx.</Li>
        <Li>
          Live-mesh Verifier-subscribe intake (iroh gossip) instead of fixture
          dumps alone.
        </Li>
        <Li>Trainer-backed ReplayEngine on the same always-on path.</Li>
      </Ol>
      <P>
        All three want a live multi-node swarm. Public devnet RPC rate limits
        still thrash a single training node mid-epoch (
        <Code>all RPCs failed</Code> under node0 Tick spam). That is exactly why
        issue #1 exists: dedicated RPC. The daemon binary is ready to fire the
        live slash the moment a reliable RPC and a live participant are present.
        The transaction path is already proven against the real program in
        memnet.
      </P>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        Detection and conviction are no longer two scripts hoping to meet. They
        are one process, feature-gated for CI, verified in memnet, dry-run on
        devnet, and pointed at the same treasurer slash instruction the rest of
        the security stack already trusts.
      </P>
      <P>
        Read the change:{' '}
        <A href={COMMIT}>
          leviathan-net@74f45f3e
        </A>
        .
      </P>
    </>
  ),
}
