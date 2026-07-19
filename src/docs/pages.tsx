import type { ReactNode } from 'react'
import {
  A,
  Code,
  H1,
  H2,
  H3,
  Lead,
  Li,
  Note,
  Ol,
  P,
  Pre,
  Table,
  Ul,
} from './Prose'

export type DocsPage = {
  path: string
  title: string
  description: string
  body: ReactNode
}

export const DOCS_PAGES: DocsPage[] = [
  {
    path: '/docs/introduction',
    title: 'Introduction',
    description: 'Trustless training for the people\'s model.',
    body: (
      <>
        <H1>Introduction</H1>
        <Lead>
          Leviathan is a Solana-coordinated training network where anyone with a
          GPU joins by posting a bond, earns Proof of Gradient for contributions
          that survive verification, and loses the bond if they lie.
        </Lead>
        <P>
          Frontier AI is produced inside five balance sheets. The mathematics of
          training over the open internet is solved and shipping; what remains
          unsolved is trust. Nobody has made it safe to accept a gradient from a
          stranger and pay them for it.
        </P>
        <P>
          The chain carries commitments, audits and money. The mesh carries
          compressed tensors. The model belongs to the network that trained it.
          Hobbes drew Leviathan as a giant composed of thousands of individuals.
          This one is composed of thousands of GPUs.
        </P>
        <H2 id="open-slot">The open slot</H2>
        <P>
          Every live decentralized-training network picked one column. Nobody
          picked both:
        </P>
        <Table
          headers={['Network', 'Verification guarantees', 'Live economics']}
          rows={[
            [
              'Bittensor training subnets',
              'scoring gates, admitted gaps',
              'emissions only, no bonds',
            ],
            [
              'Nous Psyche',
              'witness liveness, verifier is a todo',
              'no stake, dead slash code, whitelist',
            ],
            [
              'Gensyn Verde',
              'strong, FP32 single-GPU determinism',
              'pre-mainnet',
            ],
            [
              'OVIG',
              'tolerance-band replay audits',
              'paper, not a network',
            ],
            [
              <strong key="l">Leviathan</strong>,
              'OVIG-style replay audits',
              'bonds sized (1-p)/p, live slashing',
            ],
          ]}
        />
        <P>
          Sources:{' '}
          <A href="https://github.com/wienerlabs/leviathan">wienerlabs/leviathan</A>{' '}
          whitepaper and README;{' '}
          <A href="https://github.com/wienerlabs/leviathan-net">
            wienerlabs/leviathan-net
          </A>{' '}
          network substrate README.
        </P>
      </>
    ),
  },
  {
    path: '/docs/developer/quickstart',
    title: 'Quickstart',
    description: 'Clone the repos, run the sim, exercise the network substrate.',
    body: (
      <>
        <H1>Developer quickstart</H1>
        <Lead>
          Fastest path into Leviathan today: reproduce the Phase 0 security sim,
          then exercise the Phase 1 network substrate tests. Public one-line GPU
          join lands in Phase 2.
        </Lead>
        <Note>
          Phase status from <Code>docs/TASKS.md</Code> in{' '}
          <A href="https://github.com/wienerlabs/leviathan">wienerlabs/leviathan</A>
          : Phase 0 proof is done; Phase 1 has bond custody, audit lottery, and
          slash paths live on the fork. Verifier daemon and four-process swarm
          are still open.
        </Note>

        <H2 id="repos">1. Repositories</H2>
        <Ul>
          <Li>
            <A href="https://github.com/wienerlabs/leviathan">
              wienerlabs/leviathan
            </A>{' '}
            - whitepaper, architecture, sim, phase plan
          </Li>
          <Li>
            <A href="https://github.com/wienerlabs/leviathan-net">
              wienerlabs/leviathan-net
            </A>{' '}
            - Psyche/nousnet fork with bond, audit and slash layer
          </Li>
        </Ul>

        <H2 id="sim">2. Reproduce the Phase 0 sim</H2>
        <P>
          From the leviathan README. The sim re-derives Condorcet aggregation and
          bond economics on real transformer gradients (16 workers, 30 outer
          rounds, 826k-parameter GPT).
        </P>
        <Pre>{`git clone https://github.com/wienerlabs/leviathan.git
cd leviathan/sim
uv sync
PYTORCH_ENABLE_MPS_FALLBACK=1 uv run python -m leviathan_sim.run --rounds 30`}</Pre>
        <P>
          Requires Python <Code>&gt;=3.12,&lt;3.13</Code>, torch, numpy,
          matplotlib (<Code>sim/pyproject.toml</Code>).
        </P>

        <H2 id="network">3. Exercise the network substrate</H2>
        <P>
          From leviathan-net README and CODEMAP. The in-process memnet harness
          needs no Solana validator:
        </P>
        <Pre>{`git clone https://github.com/wienerlabs/leviathan-net.git
cd leviathan-net
cargo test -p psyche-solana-tooling`}</Pre>
        <P>
          Programs build with <Code>anchor build --no-idl</Code>. Root justfile
          also exposes <Code>just check-client</Code>, local testnet and
          integration test targets inherited from the nousnet substrate.
        </P>

        <H2 id="what-you-get">What these paths prove</H2>
        <Ul>
          <Li>
            Sim: robust aggregation vs sign-flip and ALIE, audit catch time near
            1/p, zero honest false positives on non-IID honest runs
          </Li>
          <Li>
            Memnet: bonded participation, audit lottery assignment, slash and
            settlement instruction layers end to end
          </Li>
        </Ul>
        <P>
          Next reading:{' '}
          <A href="/docs/developer/sim">Reproduce the sim</A>, then{' '}
          <A href="/docs/network/substrate">Network substrate</A>.
        </P>
      </>
    ),
  },
  {
    path: '/docs/developer/sim',
    title: 'Reproduce the sim',
    description: 'Phase 0 results and how to re-run the security economics sim.',
    body: (
      <>
        <H1>Reproduce the sim</H1>
        <Lead>
          Phase 0 is the proof that the security economics survive contact with
          real transformer gradients. Source: leviathan README and{' '}
          <Code>sim/</Code>.
        </Lead>
        <H2 id="setup">Setup</H2>
        <Pre>{`cd sim
uv sync
PYTORCH_ENABLE_MPS_FALLBACK=1 uv run python -m leviathan_sim.run --rounds 30`}</Pre>
        <H2 id="results">Phase 0 results</H2>
        <P>
          30 outer rounds, 16 workers, a 5/16 Byzantine coalition, real gradients
          from an 826k-parameter GPT:
        </P>
        <Table
          headers={['Scenario', 'Final val loss', 'Outcome']}
          rows={[
            ['Honest swarm, mean', '2.175', 'reference'],
            ['Sign flip 5/16 vs mean', '12.0, diverged', 'naive aggregation destroyed'],
            [
              'Sign flip 5/16 vs clip + excision',
              '2.203',
              'neutralized; malicious acceptance 3%',
            ],
            [
              'ALIE 5/16 vs clip',
              '2.190',
              'stealth coalition accepted 100%, damage 0.7%',
            ],
            [
              'ALIE 5/16 vs clip + audit p=0.1',
              '2.194',
              'all 5 cheaters slashed',
            ],
            ['Honest non-IID, clip', '2.222', 'zero honest false positives'],
          ]}
        />
        <P>
          At audit probability p = 0.1 the theoretical expected catch time is
          1/p = 10 rounds. Observed mean across the five convictions was 9.8
          rounds.
        </P>
        <H2 id="what-lives-in-sim">What lives in sim/</H2>
        <P>
          Condorcet aggregation, attack and staking layers ported onto a real GPT
          trained by a 16-worker swarm: centered clip + excision vs sign-flip and
          ALIE coalitions, stake ledger with replay audits, break-even bond
          calibration against H100 market cost.
        </P>
      </>
    ),
  },
  {
    path: '/docs/developer/network-tests',
    title: 'Network tests',
    description: 'Memnet suites and build commands from leviathan-net.',
    body: (
      <>
        <H1>Network tests</H1>
        <Lead>
          Commands and program IDs below are taken from{' '}
          <A href="https://github.com/wienerlabs/leviathan-net">
            leviathan-net
          </A>{' '}
          README, justfile and <Code>docs/CODEMAP.md</Code> in leviathan.
        </Lead>
        <H2 id="memnet">Memnet (no validator)</H2>
        <Pre>{`cargo test -p psyche-solana-tooling`}</Pre>
        <P>
          In-process harness for coordinator and treasurer instruction layers.
          CODEMAP notes the suite as the TDD substrate for bond, audit and slash
          work.
        </P>
        <H2 id="build">Build programs</H2>
        <Pre>{`anchor build --no-idl`}</Pre>
        <P>
          Deploy scripts live under the decentralized architecture justfile and
          <Code> scripts/deploy-solana-test.sh</Code>. Builds use{' '}
          <Code>--no-idl</Code> because anchor idl generation trips on a
          proc-macro2 toolchain mismatch; host cargo check and memnet tests are
          unaffected.
        </P>
        <H2 id="just">Useful just targets</H2>
        <Ul>
          <Li>
            <Code>just check-client</Code> -{' '}
            <Code>cargo run -p psyche-solana-client -- --help</Code>
          </Li>
          <Li>
            <Code>just local-testnet</Code> - centralized local testnet
          </Li>
          <Li>
            <Code>just integration-test</Code> - centralized integration tests
          </Li>
          <Li>
            <Code>just decentralized-integration-tests</Code> - decentralized
            integration suite
          </Li>
        </Ul>
        <H2 id="client-cli">Client CLI</H2>
        <Pre>{`cargo run -p psyche-solana-client -- --help`}</Pre>
      </>
    ),
  },
  {
    path: '/docs/protocol/architecture',
    title: 'Architecture',
    description: 'On-chain programs, off-chain daemons, system overview.',
    body: (
      <>
        <H1>Architecture</H1>
        <Lead>
          Source: <Code>docs/ARCHITECTURE.md</Code> in wienerlabs/leviathan.
        </Lead>
        <H2 id="overview">System overview</H2>
        <P>
          Solana carries coordinator round state, audit assignment, bonds, Proof
          of Gradient mint and slash routing, and treasury settlement. The iroh
          P2P mesh carries metadata gossip and compressed delta blobs. Trainer
          and verifier daemons attach to both. Checkpoints go to Arweave;
          tensors never land on chain.
        </P>
        <Pre>{`Solana: coordinator · ledger (bonds, PoG) · treasury
                ^ commitments, witness, audit verdicts
iroh mesh: gossip metadata · compressed deltas
                ^
trainer daemon(s) · verifier daemon(s)
checkpoints -> Arweave
telemetry -> web`}</Pre>
        <H2 id="on-chain">On-chain programs</H2>
        <P>Inherited from the nousnet fork and kept:</P>
        <Ul>
          <Li>
            <strong>coordinator</strong> - run state machine
            (WaitingForMembers, Warmup, RoundTrain, RoundWitness, Cooldown)
            advanced by a permissionless tick crank
          </Li>
          <Li>
            <strong>authorizer</strong> - permissionless sentinel; authority
            gating stays available for private runs
          </Li>
          <Li>
            <strong>treasurer</strong> - escrow paying per earned point; bond
            custody added here
          </Li>
          <Li>
            <strong>distributor</strong> - merkle airdrop with vesting, reused
            at TGE
          </Li>
          <Li>
            <strong>mining pool</strong> - funder escrow, reused for the compute
            endowment
          </Li>
        </Ul>
        <P>Leviathan additions upstream left as todo:</P>
        <Ul>
          <Li>bond account per participant with challenge-window withdraw</Li>
          <Li>
            audit assignment from on-chain seed at probability p to a verifier
            committee
          </Li>
          <Li>dispute, verdict, slash, eject identity</Li>
          <Li>
            reward routing that only pays contributions that survived selection
            and reads slash state at settlement
          </Li>
        </Ul>
        <H2 id="daemons">Off-chain daemons</H2>
        <Ul>
          <Li>
            <strong>trainer</strong> - local DiLoCo inner loop, SparseLoCo-class
            compression, deterministic seeds so local rounds are pure functions
            of (checkpoint, seed, data)
          </Li>
          <Li>
            <strong>verifier</strong> - replays sampled contributions inside a
            calibrated tolerance band (OVIG style), not bitwise equality
          </Li>
          <Li>
            <strong>aggregation</strong> - centered clipping with far-outlier
            excision over compressed pseudo-gradients
          </Li>
          <Li>
            <strong>relay and tracker</strong> - iroh relay fallback for nodes
            that cannot hole-punch
          </Li>
        </Ul>
      </>
    ),
  },
  {
    path: '/docs/protocol/security',
    title: 'Security model',
    description: 'Three layers: aggregation, audits, bonds.',
    body: (
      <>
        <H1>Security model</H1>
        <Lead>
          Economic security with published parameters, never a cryptographic
          overclaim. Sources: whitepaper §5, leviathan-net README, ARCHITECTURE.
        </Lead>
        <H2 id="layers">Three layers</H2>
        <Ol>
          <Li>
            <strong>Robust aggregation bounds damage.</strong> Centered clipping
            with far-outlier excision caps any contribution in the round it
            arrives. On the sim, a 5/16 sign-flip coalition drives naive mean to
            divergence (loss 12.0) while clip plus excision finishes at 2.203
            against a 2.175 honest reference and admits 3% of malicious
            contributions.
          </Li>
          <Li>
            <strong>Replay audits price lying.</strong> Each contribution is
            audited with probability p. Local rounds are pure functions of
            (checkpoint, seed, data); a mismatch beyond the calibrated tolerance
            band is a binary fraud proof. ALIE run at p = 0.1: all five stealth
            cheaters slashed at mean 9.8 rounds vs 1/p = 10.
          </Li>
          <Li>
            <strong>Bonds make sybil a cost.</strong> Break-even bond = reward x
            (1-p)/p. A slashed identity re-enters only with a fresh bond. Slashed
            stake funds the verifiers hunting it.
          </Li>
        </Ol>
        <H2 id="claims">Claims discipline</H2>
        <P>
          This is not cryptographic proof of training. The uncaught rate, the
          tolerance band width, and the bond curve are meant to be published
          dashboard metrics. Stealth attacks like ALIE that hide inside honest
          variance defeat aggregation alone; they are exactly what the audit
          layer exists to catch.
        </P>
        <H2 id="determinism">Determinism strategy</H2>
        <P>
          Bitwise replay across heterogeneous GPUs is not assumed. Verifier
          comparison uses calibrated tolerance bands per hardware class (OVIG /
          NAO style). RepOps-style bitwise determinism was rejected as the base
          path but remains viable for high-value dispute escalation.
        </P>
      </>
    ),
  },
  {
    path: '/docs/protocol/economics',
    title: 'Economics',
    description: 'Proof of Gradient, bonds, flywheel.',
    body: (
      <>
        <H1>Economics</H1>
        <Lead>Source: whitepaper §6 and Phase 0 sim calibration.</Lead>
        <H2 id="pog">Proof of Gradient</H2>
        <P>
          Work is rewarded if and only if it was committed before aggregation,
          survived selection, and was not convicted in audit. Rewards scale with
          accepted work, calibrated to market compute cost. Bitcoin paid for
          hashes; this pays for learning.
        </P>
        <H2 id="calibration">Calibration</H2>
        <P>
          Reward per round = 1.2x the H100-market cost of the round&apos;s FLOPs.
          At audit rate p = 0.1 the break-even bond is nine rounds of reward at
          every scale. Whitepaper examples: about $0.13 per worker for the 125M
          proof run, $2.60 for the 1B genesis run, $36 for the 7B scale run.
        </P>
        <H2 id="flywheel">Flywheel</H2>
        <P>
          Inference fees (vLLM workers verified by TOPLOC activation commitments)
          flow to the treasury. The treasury funds the next training run.
          Futarchy (Wienerpad) decides what the network trains next. Weights are
          public.
        </P>
      </>
    ),
  },
  {
    path: '/docs/protocol/round-lifecycle',
    title: 'Round lifecycle',
    description: 'Assign, train, commit, audit, aggregate, settle.',
    body: (
      <>
        <H1>Round lifecycle</H1>
        <Lead>Source: ARCHITECTURE.md round lifecycle and whitepaper §4.</Lead>
        <Ol>
          <Li>Coordinator publishes round seed and data assignments.</Li>
          <Li>
            Trainers run H inner steps locally, produce compressed
            pseudo-gradient delta, publish blob, commit root on chain.
          </Li>
          <Li>
            Witness quorum attests availability (bloom filters, inherited
            mechanism).
          </Li>
          <Li>
            Audit lottery fires at probability p per contribution; assigned
            verifiers replay and submit verdicts. Disputes settle before reward
            distribution for that round&apos;s audited subset; unaudited
            contributions pay out optimistically.
          </Li>
          <Li>
            Aggregator output (clip + excision) becomes the outer step with
            Nesterov momentum; designated checkpointers publish to Arweave and
            update the on-chain pointer.
          </Li>
          <Li>
            Ledger settles: accepted work earns PoG, convicted fraud slashes
            bonds, bounties pay verifiers.
          </Li>
        </Ol>
        <H2 id="roles">Roles</H2>
        <Ul>
          <Li>
            <strong>Trainers</strong> - compressed pseudo-gradients from
            deterministic (checkpoint, seed, data) assignments
          </Li>
          <Li>
            <strong>Verifiers</strong> - replay sampled contributions inside
            published tolerance bands and file fraud proofs
          </Li>
          <Li>
            <strong>Coordinator</strong> - sequences rounds and assigns audits
            from on-chain randomness
          </Li>
          <Li>
            <strong>Ledger</strong> - mints PoG for accepted work, slashes
            convicted fraud
          </Li>
        </Ul>
      </>
    ),
  },
  {
    path: '/docs/network/substrate',
    title: 'Substrate',
    description: 'What lives in leviathan-net, the nousnet fork.',
    body: (
      <>
        <H1>Network substrate</H1>
        <Lead>
          <A href="https://github.com/wienerlabs/leviathan-net">
            leviathan-net
          </A>{' '}
          is a fork of PsycheFoundation/nousnet (Apache-2.0) that carries the
          bond, audit and slash layer upstream designed but left unimplemented.
        </Lead>
        <H2 id="state">What is live on the fork</H2>
        <Table
          headers={['Component', 'State']}
          rows={[
            [
              'Bonded participation (solana-treasurer)',
              'participant_bond_deposit, request_withdraw, finalize_withdraw with challenge window; settlement forfeits slashed collateral into the run vault',
            ],
            [
              'Audit lottery (shared/coordinator)',
              'audit_selection derives verifier-to-target assignments from the round seed; pressure scales with verification_percent',
            ],
            [
              'Dispute and slash (solana-coordinator)',
              'slash_client convicts a client; ejection carries into exited_clients where the slashing rate applies; slashed counter now has a live producer',
            ],
          ]}
        />
        <H2 id="upstream-gaps">Upstream gaps that are now wired</H2>
        <P>From CODEMAP / README:</P>
        <Ul>
          <Li>
            <Code>Committee::Verifier =&gt; todo!()</Code>
          </Li>
          <Li>
            <Code>verification_percent</Code> pinned to zero by assert
          </Li>
          <Li>
            <Code>ClientState::Ejected</Code> never set by any path
          </Li>
          <Li>
            <Code>slashed</Code> counter never read by settlement
          </Li>
        </Ul>
        <H2 id="layout">Layout (CODEMAP)</H2>
        <Ul>
          <Li>
            <Code>shared/coordinator</Code> - pure state machine
          </Li>
          <Li>
            <Code>architectures/decentralized/solana-*</Code> - Anchor programs
            + client + memnet tooling
          </Li>
          <Li>
            <Code>shared/client</Code>, <Code>shared/modeling</Code>,{' '}
            <Code>shared/network</Code> - trainer, DisTrO, iroh
          </Li>
          <Li>
            <Code>architectures/centralized</Code> - chainless local development
          </Li>
        </Ul>
        <H2 id="lineage">Lineage</H2>
        <P>
          Solana coordinator, iroh P2P mesh, and Rust DisTrO compression are
          inherited. Bond, audit and slash layers are Leviathan&apos;s.
          Compression recipe follows SparseLoCo over a DiLoCo outer loop.
          Inference path follows vLLM workers verified by TOPLOC. Repository
          remains Apache-2.0.
        </P>
      </>
    ),
  },
  {
    path: '/docs/network/devnet',
    title: 'Devnet programs',
    description: 'Deployed program IDs and deploy notes.',
    body: (
      <>
        <H1>Devnet programs</H1>
        <Lead>
          IDs from leviathan-net README and leviathan <Code>docs/CODEMAP.md</Code>{' '}
          (deployed 2026-07-19). Mainnet will use freshly generated IDs.
        </Lead>
        <Table
          headers={['Program', 'ID']}
          rows={[
            [
              'coordinator',
              <Code key="c">JD9rHTiqBFgHjViWZc7gFZX74LvKKysbLbqFRaFvtmmN</Code>,
            ],
            [
              'authorizer',
              <Code key="a">2Kg5ERG6ubuzyPmQ24axsws7V2ja2EvWp5CHMKFCrTxv</Code>,
            ],
            [
              'treasurer',
              <Code key="t">9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8</Code>,
            ],
          ]}
        />
        <P>
          Collateral mint (CODEMAP):{' '}
          <Code>BWLv1Fj5RKJbcr3ZMLVKhviFq1i3tq6afgVS2ngyot3X</Code> (0 decimals,
          1M minted). Permissionless run <Code>leviathan-dev</Code> was created
          through the treasurer CPI path and sits in WaitingForMembers.
        </P>
        <H2 id="deploy">Deploy recipe (CODEMAP)</H2>
        <Pre>{`RUN_ID=... KEY_FILE=... \\
  RPC=https://api.devnet.solana.com \\
  WS_RPC=wss://api.devnet.solana.com \\
  ./scripts/deploy-solana-test.sh --treasurer

TREASURER_ARGS="--treasurer-collateral-mint <mint>" \\
  ./scripts/create-permissionless-run.sh --treasurer`}</Pre>
        <Note>
          These are devnet-only program keypairs. Do not treat them as mainnet
          production addresses.
        </Note>
      </>
    ),
  },
  {
    path: '/docs/project/decisions',
    title: 'Decisions',
    description: 'Locked architecture decisions from the prior-art sweep.',
    body: (
      <>
        <H1>Decision log</H1>
        <Lead>
          Locked 2026-07-19 in <Code>docs/DECISIONS.md</Code>. Summaries only;
          full evidence and rejected alternatives live in the repo.
        </Lead>
        <H3 id="d1">D1 - Fork PsycheFoundation/nousnet</H3>
        <P>
          Production shape already present: Anchor programs, Rust node, iroh P2P,
          licensed Rust DisTrO. Proven by Hermes 4.3 post-train on Psyche.
          Rejected: building from scratch, hivemind, prime-diloco as base.
        </P>
        <H3 id="d2">D2 - Security layer is ours</H3>
        <P>
          Bonded contributions, random replay audits, slashing. Upstream verifier
          dispatch was todo, slash code dead, whitelist in practice. OVIG +
          Condorcet supply the academic and economic pieces.
        </P>
        <H3 id="d3">D3 - Compression: DiLoCo + SparseLoCo</H3>
        <P>
          Chunked top-k at 1-2% density with 2-bit quantization and error
          feedback. At 1B scale, sync payload roughly 15-40 MB. Psyche Apache-2.0
          Rust DisTrO is the licensed equivalent in the fork.
        </P>
        <H3 id="d4">D4 - Inference: vLLM + TOPLOC + Solana settlement</H3>
        <P>
          Not Petals (unmaintained). Whole-model vLLM workers with TOPLOC
          activation commitments settle through Solana programs.
        </P>
        <H3 id="d5">D5 - Solana mainnet, bond as sybil price</H3>
        <P>
          Economic permissionlessness: join by posting a bond sized so expected
          slashing exceeds expected cheating gain at audit rate p.
        </P>
        <H3 id="d6">D6 - Honest claims policy</H3>
        <P>
          Claim economic security, never cryptographic proof. First runs prove
          the path at 125M then 1B then 7B; they do not claim an arrived frontier
          model.
        </P>
      </>
    ),
  },
  {
    path: '/docs/project/roadmap',
    title: 'Roadmap',
    description: 'Phase 0 to 4 from whitepaper and TASKS.',
    body: (
      <>
        <H1>Roadmap</H1>
        <Lead>
          Combined from whitepaper §7 and <Code>docs/TASKS.md</Code> status.
        </Lead>
        <H2 id="phase-0">Phase 0 - proof</H2>
        <P>
          Whitepaper, decision log, sim on real transformer gradients. Done
          (landing page and name lock were open checklist items at last TASKS
          write).
        </P>
        <H2 id="phase-1">Phase 1 - devnet core</H2>
        <P>Exit criteria: recorded end-to-end conviction demo, anchor tests green, two-GPU tolerance-band replay reproduced.</P>
        <Ul>
          <Li>Done: fork bootstrap, code map, devnet deploy, bond custody, audit lottery, dispute and slash</Li>
          <Li>Open: aggregation adaptation, verifier daemon v0, four-process local swarm, conviction demo capture</Li>
        </Ul>
        <H2 id="phase-2">Phase 2 - Genesis Run</H2>
        <P>
          Public testnet: 50+ volunteer nodes, 350M to 1B model, live collective
          loss curve, one-line join, tolerance band calibration across hardware
          classes.
        </P>
        <H2 id="phase-3">Phase 3 - mainnet</H2>
        <P>
          TGE, real bonds, Proof of Gradient live, open-weight release, inference
          network v0 (vLLM + TOPLOC), Arweave checkpoint lineage.
        </P>
        <H2 id="phase-4">Phase 4 - scale</H2>
        <P>
          DanteGPU enterprise supply, 7B+, futarchy governance, optional TEE
          attestation lane for datacenter suppliers.
        </P>
      </>
    ),
  },
  {
    path: '/docs/project/repositories',
    title: 'Repositories',
    description: 'Source of truth links.',
    body: (
      <>
        <H1>Repositories</H1>
        <Lead>All docs on this site are derived from these sources.</Lead>
        <Table
          headers={['Repo', 'Role']}
          rows={[
            [
              <A key="l" href="https://github.com/wienerlabs/leviathan">
                wienerlabs/leviathan
              </A>,
              'Vision, whitepaper, sim, architecture, decisions, PRD, tasks',
            ],
            [
              <A key="n" href="https://github.com/wienerlabs/leviathan-net">
                wienerlabs/leviathan-net
              </A>,
              'Network substrate: nousnet fork with bond, audit, slash',
            ],
            [
              <A key="w" href="https://github.com/wienerlabs/leviathan-web">
                wienerlabs/leviathan-web
              </A>,
              'This website',
            ],
          ]}
        />
        <Ul>
          <Li>
            X: <A href="https://x.com/leviathanfront">@leviathanfront</A>
          </Li>
          <Li>
            Upstream substrate lineage:{' '}
            <A href="https://github.com/PsycheFoundation/nousnet">
              PsycheFoundation/nousnet
            </A>{' '}
            (Apache-2.0)
          </Li>
        </Ul>
        <Note>
          If a number, program ID or command here disagrees with the GitHub
          source of truth, trust the repo.
        </Note>
      </>
    ),
  },
]

export function getDocsPage(path: string) {
  return DOCS_PAGES.find((page) => page.path === path) ?? null
}
