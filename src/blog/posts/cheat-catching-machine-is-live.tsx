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
  BondSlashFigure,
  BuildPathFigure,
  DetectionMetricsFigure,
  LiveProofFigure,
  PhaseRoadmapFigure,
} from '../figures/live-slash-figures'

const TX =
  '275RmYs59NUXPJMGsGZBDmn8PqURKD1XkYwYWyDM4VcoBz2jyznAadqbaGj3Gb26eapByTNkDoid5K5QUajRuECL'
const SOLSCAN =
  'https://solscan.io/tx/275RmYs59NUXPJMGsGZBDmn8PqURKD1XkYwYWyDM4VcoBz2jyznAadqbaGj3Gb26eapByTNkDoid5K5QUajRuECL?cluster=devnet'
const FUSION = '/blog/verifier-daemon-fusion'

const meta = getBlogMeta('cheat-catching-machine-is-live')!

export const cheatCatchingMachineIsLive: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>Leviathan: the cheat-catching machine is live</H1>
      <Lead>
        Today Leviathan crossed the critical threshold: the verifier daemon
        detects fraudulent gradients on live Solana devnet and writes the
        penalty on chain itself. One process. End to end.
      </Lead>

      <P>
        A short reminder of what this network is for. Leviathan is public model
        training coordinated on Solana. Proof of Gradient is a simple contract:
        post a bond, train, earn for verified work, lose the bond if you lie.
        The thesis is clean. To keep it from staying on paper, each layer is
        proven first in simulation, then on a real chain, one piece at a time.
      </P>
      <P>
        We started with the sim (three-layer defense: robust aggregation, random
        replay audit, bond and slash). Then programs moved to devnet. Bond and
        slash instructions landed. Then a client joined a live devnet run on an
        M4 Max Mac and actually trained. Anyone who has burned money on rented
        H100s knows the pain. Here everything ran, and still runs, on one Mac.
      </P>

      <BuildPathFigure />

      <P>This week closed the last link of that chain.</P>

      <H2 id="detection">Detection, on real data</H2>
      <P>
        A three-node swarm joined the same devnet run and produced real DisTrO
        gradients. A red-team tool applied a sign-flip forge to an honest
        gradient, one-for-one. The replay verifier caught all four contributions.
        Distance 6.0 against a tolerance band of 0.05. False positives: zero.
      </P>
      <DetectionMetricsFigure />

      <H2 id="conviction">Conviction, on chain</H2>
      <P>
        The full economic loop is verified on devnet. Bond of 500 posted. Fraud
        committed. Slash of 200 written on chain. When the cheater tried to
        withdraw, 300 returned and 200 stayed forfeited in the vault. An
        unauthorized party that tries to slash is rejected.
      </P>
      <BondSlashFigure />

      <H2 id="fusion">Fusion: leviathan-verifier-daemon</H2>
      <P>
        Detection and conviction now live in one always-on process. Read live
        coordinator state, replay-audit incoming contributions against an honest
        reference, map a fraud verdict onto the live epoch roster index, and
        send the slash. First against the real on-chain program in a
        deterministic test, then live. The engineering note for that fusion is{' '}
        <A href={FUSION}>here</A>.
      </P>

      <H2 id="live-slash">And a live slash</H2>
      <P>
        Public devnet RPC choked under even a single node&apos;s load. Moving to
        a dedicated endpoint cleared it. The node entered a live epoch. The
        daemon saw real fraud and submitted the slash transaction on chain.
      </P>
      <P>
        The part I like most: the committed and replayed hashes the daemon
        computed sit bit-for-bit in the coordinator{' '}
        <Code>SlashClient</Code> log. Proof of the cheat is permanent on chain.
        Anyone can inspect it.
      </P>
      <LiveProofFigure />
      <P>
        Transaction (devnet):{' '}
        <A href={SOLSCAN}>
          <Code>{TX.slice(0, 20) + '...'}</Code>
        </A>
        . Full signature: <Code>{TX}</Code>.
      </P>
      <Note>
        Open the Solscan link for the full explorer view, logs, and account
        balances around the slash.
      </Note>

      <H2 id="honest">Honest footnotes</H2>
      <P>
        Slash authority is still a single key for now. That is a deliberate
        Phase-1 stance. Committee voting and reporter bounties are Phase 3.
      </P>
      <PhaseRoadmapFigure />
      <P>What is next, in order:</P>
      <Ol>
        <Li>
          Trainer-backed replay so the daemon re-derives the honest reference
          itself.
        </Li>
        <Li>Live mesh intake (iroh subscribe), not fixture dumps alone.</Li>
        <Li>Scale. Then audit, counsel, and $LEVI.</Li>
      </Ol>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        The backbone of the security machine is live. The rest is engineering.
      </P>
      <Ul>
        <Li>
          Live slash tx: <A href={SOLSCAN}>Solscan (devnet)</A>
        </Li>
        <Li>
          Daemon fusion write-up:{' '}
          <A href={FUSION}>Fusing detection and conviction</A>
        </Li>
      </Ul>
    </>
  ),
}
