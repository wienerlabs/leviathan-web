import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
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

const TokenomicsCharts = lazy(() => import('../components/charts/TokenomicsCharts'))

function TokenomicsChartsFallback() {
  return (
    <div className="my-10 space-y-4">
      <div className="h-24 rounded-[24px] border border-black/10 bg-black/[0.03] animate-pulse" />
      <div className="h-[360px] rounded-[32px] border border-black/10 bg-black/[0.03] animate-pulse" />
    </div>
  )
}

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
          Phase 0 proof is shipped. Phase 1 (devnet core) is complete and live on
          Solana devnet: trust machine and training swarm both verified. Phase 2
          Genesis Run has started. See{' '}
          <A href="/docs/project/roadmap">Roadmap</A>.
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
          rounds. A 5/16 sign-flip coalition drives naive mean to 12.0
          (diverged); centered clip + excision finishes at 2.20 against a 2.18
          honest reference and admits 3% of malicious deltas.
        </P>
        <H2 id="base-command">Base command</H2>
        <Pre>{`PYTORCH_ENABLE_MPS_FALLBACK=1 uv run python -m leviathan_sim.run --rounds 30`}</Pre>
        <H2 id="sparse">Sparse mode</H2>
        <P>
          Chunked top-k + 1-bit sign at 2% density. The sign-flip coalition is
          rejected even harder under compression (malicious selection 0.03 to
          0.00), for about 0.7 loss cost at a ~50x bandwidth reduction. The
          defense holds in the SparseLoCo transport domain.
        </P>
        <Pre>{`PYTORCH_ENABLE_MPS_FALLBACK=1 uv run python -m leviathan_sim.run --rounds 30 --sparse`}</Pre>
        <H2 id="verify">Verify mode</H2>
        <P>
          Tolerance-band replay separates 1% simulated cross-hardware drift
          (distance 0.010, passes) from sign-flip (6.0), gaussian (1.35) and lazy
          (1.0), all caught above the 0.05 band, with 0 honest false positives and
          3/3 cheaters caught.
        </P>
        <Pre>{`PYTORCH_ENABLE_MPS_FALLBACK=1 uv run python -m leviathan_sim.run --rounds 30 --verify`}</Pre>
        <H2 id="what-lives-in-sim">What lives in sim/</H2>
        <P>
          Condorcet aggregation, attack and staking layers ported onto a real GPT
          trained by a 16-worker swarm: centered clip + excision vs sign-flip and
          ALIE coalitions, stake ledger with replay audits, break-even bond
          calibration against H100 market cost. Tests: memnet program suites
          17/17, coordinator core 20/20.
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
          The memnet suites are 17/17. CODEMAP notes the suite as the TDD
          substrate for bond, audit and slash work.
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
    path: '/docs/developer/run-a-node',
    title: 'Run a training node',
    description: 'Toolchain, create a permissionless run, and train on devnet.',
    body: (
      <>
        <H1>Run a training node</H1>
        <Lead>
          Build the client against the NousResearch tch fork, create a
          permissionless devnet run, and launch <Code>psyche-solana-client train</Code>.
        </Lead>

        <H2 id="toolchain">Toolchain</H2>
        <P>
          The client links libtorch through the NousResearch tch fork, which pins
          PyTorch 2.9.1. A mismatched torch fails the build&apos;s version probe.{' '}
          <Code>numpy</Code> and <Code>setuptools</Code> are required because
          torch-sys imports <Code>torch.utils.cpp_extension</Code> during its build
          probe.
        </P>
        <Pre>{`uv venv --python 3.11 /tmp/leviathan-torch-venv
uv pip install --python /tmp/leviathan-torch-venv/bin/python torch==2.9.1 numpy setuptools

export LIBTORCH_USE_PYTORCH=1
export PYO3_PYTHON=/tmp/leviathan-torch-venv/bin/python
export LIBTORCH_BYPASS_VERSION_CHECK=1
export DYLD_LIBRARY_PATH=/tmp/leviathan-torch-venv/lib/python3.11/site-packages/torch/lib
export PYTORCH_ENABLE_MPS_FALLBACK=1
cargo build -p psyche-solana-client`}</Pre>

        <H2 id="create-run">Create a permissionless devnet run</H2>
        <Pre>{`run-manager join-authorization-create --authorizer 11111111111111111111111111111111 --rpc https://api.devnet.solana.com
run-manager create-run --run-id <id> --client-version demo --rpc https://api.devnet.solana.com --ws-rpc wss://api.devnet.solana.com
run-manager update-config --run-id <id> --config-path config/solana-test/nano-config.toml --num-parameters 1000 --vocab-size 30 --rpc https://api.devnet.solana.com --ws-rpc wss://api.devnet.solana.com
run-manager set-paused --run-id <id> --resume --rpc https://api.devnet.solana.com --ws-rpc wss://api.devnet.solana.com`}</Pre>

        <H2 id="train">Launch train against devnet</H2>
        <Pre>{`LEVIATHAN_JOIN_TIMEOUT_SECS=45 psyche-solana-client train \\
  --wallet-private-key-path <wallet> \\
  --rpc https://api.devnet.solana.com --ws-rpc wss://api.devnet.solana.com \\
  --run-id <id> --data-parallelism 1 --tensor-parallelism 1 --micro-batch-size 1 \\
  --authorizer 11111111111111111111111111111111 --logs console`}</Pre>

        <H2 id="join-timeout">LEVIATHAN_JOIN_TIMEOUT_SECS</H2>
        <P>
          Default 30. Sets the join-transaction confirmation deadline. The public
          devnet RPC routinely exceeds the old hard-coded 5s, which killed a client
          the moment it tried to re-join for the next epoch (Psyche re-joins every
          epoch). Raising it enables sustained multi-epoch runs.
        </P>

        <H2 id="what-you-see">What you will see</H2>
        <Ul>
          <Li>Join on-chain</Li>
          <Li>Model download</Li>
          <Li>Warmup</Li>
          <Li>Training rounds</Li>
          <Li>DisTrO gradients over the iroh mesh</Li>
          <Li>Witness and tick transactions</Li>
        </Ul>
        <P>
          A verified run used <Code>pefontana/Nano-Llama</Code> (vocab 30, seq_len
          64), crossed the epoch 0 to epoch 1 boundary, and recorded 2 epochs, 16
          training rounds, 15 DisTrO-compressed pseudo-gradients, 0 join timeouts,
          and on-chain 2 Join + 12 Witness + 38 Tick transactions. Details:{' '}
          <A href="/docs/network/devnet">Devnet programs</A>.
        </P>
      </>
    ),
  },
  {
    path: '/docs/developer/conviction-demo',
    title: 'Conviction demo',
    description: 'Live devnet slash loop and deterministic memnet proof.',
    body: (
      <>
        <H1>Conviction demo</H1>
        <Lead>
          End-to-end bond, dispute reject, slash, and vault forfeit on live
          devnet, with a deterministic memnet twin.
        </Lead>
        <H2 id="binary">devnet-conviction-demo</H2>
        <P>
          The <Code>devnet-conviction-demo</Code> binary is behind the{' '}
          <Code>demo</Code> feature of <Code>psyche-solana-tooling</Code>. It is
          chain-only; it needs the same libtorch env only if built in the same
          workspace pass as the training client.
        </P>
        <Pre>{`cargo run -p psyche-solana-tooling --bin devnet-conviction-demo --features demo`}</Pre>
        <H2 id="verified">Verified output</H2>
        <P>
          A participant posted a bond of 500. A stranger&apos;s dispute was
          rejected (authority gated). The run authority convicted the cheater
          mid-epoch through the treasurer, which CPIs the coordinator&apos;s{' '}
          <Code>slash_client</Code> with the run PDA signature. At epoch end the
          coordinator wrote <Code>slashed = 200</Code> on-chain. On bond
          withdrawal the cheater recovered 300 and the forfeited 200 stayed in
          the run vault as reward liquidity.
        </P>
        <H2 id="memnet">Deterministic memnet equivalent</H2>
        <Pre>{`cargo test -p psyche-solana-tooling`}</Pre>
        <P>
          The same loop is proven deterministically by the memnet suites (17/17).
          Programs:{' '}
          <A href="/docs/network/devnet">Devnet programs</A>. Economics framing:{' '}
          <A href="/docs/protocol/economics">Economics</A>.
        </P>
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
            12.0 (diverged); centered clip + excision finishes at 2.20 against a
            2.18 honest reference and admits 3% of malicious deltas.
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
        <H2 id="holds-under-compression">Holds under compression</H2>
        <P>
          The same clip + excision defense holds in the SparseLoCo transport
          domain. With <Code>--sparse</Code> (chunked top-k + 1-bit sign at 2%
          density), the sign-flip coalition is rejected even harder under
          compression (malicious selection 0.03 to 0.00), for about 0.7 loss cost
          at a ~50x bandwidth reduction.
        </P>
        <H2 id="replay-in-practice">Replay audits, in practice</H2>
        <P>
          A local training round is a replayable pure function of (checkpoint,
          seed, data). The verifier recomputes the assigned round and scores
          relative L2 distance against the submitted delta. A mismatch beyond a
          calibrated tolerance band is a binary fraud proof, judged on chain.
        </P>
        <P>
          The band absorbs benign nondeterminism (GPU scatter-reduce, bf16 casts,
          data-parallel reduce order) rather than demanding bitwise equality;
          this is the OVIG-style approach. With <Code>--verify</Code>, 1%
          simulated cross-hardware drift scores distance 0.010 and passes; sign-flip
          (6.0), gaussian (1.35) and lazy (1.0) all sit above the 0.05 band, with 0
          honest false positives and 3/3 cheaters caught. Full concept page:{' '}
          <A href="/docs/protocol/verification">Verification</A>.
        </P>
      </>
    ),
  },
  {
    path: '/docs/protocol/verification',
    title: 'Verification',
    description: 'Replay audits, tolerance bands, and fraud proofs.',
    body: (
      <>
        <H1>Verification</H1>
        <Lead>
          Replay audits make lying a priced, detectable event without demanding
          bitwise equality across hardware.
        </Lead>
        <H2 id="pure-function">Replayable pure function</H2>
        <P>
          A local training round is a replayable pure function of (checkpoint,
          seed, data). The verifier recomputes the assigned round and scores
          relative L2 distance against the submitted delta.
        </P>
        <H2 id="band">Tolerance band</H2>
        <P>
          A mismatch beyond a calibrated tolerance band is a binary fraud proof,
          judged on chain. The band absorbs benign cross-hardware nondeterminism
          (GPU scatter-reduce, bf16 casts, data-parallel reduce order) instead of
          demanding bitwise equality. This is the OVIG-style approach.
        </P>
        <H2 id="numbers">Band numbers from the sim</H2>
        <P>
          With <Code>--verify</Code>, tolerance-band replay separates 1%
          simulated cross-hardware drift (distance 0.010, passes) from sign-flip
          (6.0), gaussian (1.35) and lazy (1.0), all caught above the 0.05 band,
          with 0 honest false positives and 3/3 cheaters caught.
        </P>
        <Pre>{`PYTORCH_ENABLE_MPS_FALLBACK=1 uv run python -m leviathan_sim.run --rounds 30 --verify`}</Pre>
        <P>
          Related: <A href="/docs/protocol/security">Security model</A>,{' '}
          <A href="/docs/developer/sim">Reproduce the sim</A>.
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
          Reward per round = 1.35x the H100-market cost of the round&apos;s FLOPs.
          At audit rate p = 0.1 the break-even bond is nine rounds of reward at
          every scale. Whitepaper examples: about $0.15 per worker for the 125M
          proof run, $2.91 for the 1B genesis run, $41 for the 7B scale run.
        </P>
        <H2 id="flywheel">Flywheel</H2>
        <P>
          Inference fees (vLLM workers verified by TOPLOC activation commitments)
          flow to the treasury. The treasury funds the next training run.
          Futarchy (Wienerpad) decides what the network trains next. Weights are
          public.
        </P>
        <H2 id="verified-conviction">Verified conviction economics</H2>
        <P>
          Worked example of bond &gt;= reward x (1-p)/p with a real slash on live
          devnet. A participant posted a bond of 500. A stranger&apos;s dispute
          was rejected (authority gated). The run authority convicted the cheater
          mid-epoch through the treasurer, which CPIs the coordinator&apos;s{' '}
          <Code>slash_client</Code> with the run PDA signature. At epoch end the
          coordinator wrote <Code>slashed = 200</Code> on-chain. On bond
          withdrawal the cheater recovered 300 and the forfeited 200 stayed in
          the run vault as reward liquidity.
        </P>
        <P>
          Reproduce the loop:{' '}
          <A href="/docs/developer/conviction-demo">Conviction demo</A>. Memnet
          suites prove the same path deterministically at 17/17 (
          <Code>cargo test -p psyche-solana-tooling</Code>).
        </P>
        <P>
          Full token design, supply allocation, collateral and TGE plan:{' '}
          <A href="/docs/protocol/tokenomics">Tokenomics</A>.
        </P>
      </>
    ),
  },
  {
    path: '/docs/protocol/tokenomics',
    title: 'Tokenomics',
    description:
      'Units, operating economics, supply allocation, collateral, PoG conversion and TGE plan.',
    body: (
      <>
        <H1>Tokenomics</H1>
        <Lead>
          Engineering and product design for bonds, Proof of Gradient rewards,
          supply allocation and TGE. Source of truth:{' '}
          <A href="https://github.com/wienerlabs/leviathan/blob/main/docs/TOKENOMICS.md">
            docs/TOKENOMICS.md
          </A>{' '}
          in wienerlabs/leviathan. Round economics are coded in{' '}
          <Code>sim/leviathan_sim/economy.py</Code>. This is not a legal opinion;
          counsel review gates any public token offer.
        </Lead>

        <figure className="my-10 rounded-[24px] sm:rounded-[28px] border border-black overflow-hidden bg-black/[0.02] max-w-[420px] mx-auto sm:mx-0">
          <img
            src="/tokenomics-benjamin.jpg"
            alt="Benjamin Franklin with a stack of $LEVI bills"
            width={1002}
            height={1002}
            className="block w-full aspect-square object-cover grayscale"
          />
          <figcaption className="px-4 sm:px-5 py-3 sm:py-4 border-t border-black/10 text-[13px] sm:text-[14px] md:text-[15px] text-black/50 leading-relaxed">
            $LEVI is the network reward and governance unit after TGE. Bonds,
            PoG and treasury math stay collateral-denominated until then.
          </figcaption>
        </figure>

        <Suspense fallback={<TokenomicsChartsFallback />}>
          <TokenomicsCharts />
        </Suspense>

        <H2 id="goals">Design goals</H2>
        <Ol>
          <Li>
            Pay for accepted learning work (Proof of Gradient), not raw hash
            power.
          </Li>
          <Li>
            Keep fraud expected-negative at the published{' '}
            <Code>(p, bond, reward)</Code> point.
          </Li>
          <Li>
            Fund continuous audit pressure even when nobody is cheating
            (zero-fraud equilibrium).
          </Li>
          <Li>
            Avoid yield promises. Utility is training rewards, run-selection
            governance, and later inference settlement.
          </Li>
          <Li>
            Stay compatible with a compliant launch structure after legal review.
          </Li>
        </Ol>

        <H2 id="units">Units</H2>
        <Table
          headers={['Unit', 'Role', 'Issued by']}
          rows={[
            [
              'Collateral',
              'Bond deposits, slash forfeiture, optional reward redemption',
              'Mainnet mint TBD; external mint or network stable collateral',
            ],
            [
              'PoG points',
              'Per-epoch earned counter on the coordinator (live on devnet)',
              'Coordinator epoch settlement',
            ],
            [
              'Network token ($LEVI)',
              'Long-term reward and governance unit after TGE',
              'Mint authority under a Squads multisig',
            ],
          ]}
        />
        <P>
          Before TGE, testnet and genesis rehearsal pay only in the testnet
          collateral mint (
          <Code>BWLv1Fj5RKJbcr3ZMLVKhviFq1i3tq6afgVS2ngyot3X</Code> on devnet).
          PoG points convert to collateral through the treasurer claim path
          already deployed.
        </P>

        <H2 id="collateral">How collateral works</H2>
        <P>
          Collateral is an SPL token held in the run vault (treasurer program).
          It is not a yield stake. It is the deposit for honest participation
          and, for now, the unit used to pay rewards.
        </P>
        <Ul>
          <Li>
            <strong>Bond deposit.</strong> You transfer collateral into the run
            vault. Your <Code>bond_amount</Code> increases. Claims require bond
            at or above <Code>bond_minimum_amount</Code>.
          </Li>
          <Li>
            <strong>Rewards.</strong> Healthy epochs accrue PoG points. Claim
            pays 1 collateral unit per claimed point from the same vault (rate
            is set by the coordinator earning schedule).
          </Li>
          <Li>
            <strong>Exit.</strong> Request withdraw, wait the challenge window,
            then finalize. If you were slashed, unsettled slash points forfeit
            bond into the vault (and may pay a reporter bounty). The rest returns
            to your wallet.
          </Li>
        </Ul>
        <P>
          Break-even bond law (coded):{' '}
          <Code>bond = reward × (1 − p) / p</Code>. At p = 0.1 the bond is nine
          rounds of reward. See also{' '}
          <A href="/docs/protocol/economics">Economics</A> and the{' '}
          <A href="/docs/developer/conviction-demo">conviction demo</A>.
        </P>

        <H2 id="operating">Operating economics (coded)</H2>
        <P>
          From <Code>genesis_parameters()</Code> and{' '}
          <Code>calibration_table()</Code>. Reward per round is 1.35× H100-market
          cost of the round&apos;s FLOPs.
        </P>
        <Table
          headers={[
            'Preset',
            'Round cost (H100)',
            'Round reward (1.35×)',
            'Bond at p=0.1',
            'Expected catch rounds',
          ]}
          rows={[
            ['125M proof', '$0.0120', '$0.0162', '$0.15', '10'],
            ['1B genesis', '$0.240', '$0.324', '$2.91', '10'],
            ['7B scale', '$3.36', '$4.53', '$40.79', '10'],
          ]}
        />
        <H3 id="zero-fraud-burn">Zero-fraud audit burn</H3>
        <P>
          When nobody cheats, verifier income is pure treasury spend. Audit fee
          floor is 1.1× H100 cost per audited contribution.
        </P>
        <Table
          headers={[
            'Preset at p=0.1, 100 workers',
            'Audit fee / contribution',
            'Treasury burn / round',
            'Burn share of rewards',
          ]}
          rows={[['1B genesis', '$0.264', '$2.64', '8.15%']]}
        />
        <P>
          That is the sustained cost of security in the honest equilibrium. The
          audit / security treasury must be sized for it.
        </P>

        <H2 id="allocation">Supply allocation</H2>
        <P>
          Working totals for modelling only. Counsel may require structural
          change. These percentages live only in the tokenomics design; they are
          not encoded in <Code>economy.py</Code> (that file covers
          bond/reward/audit math).
        </P>
        <Table
          headers={['Allocation', 'Share', 'Vesting', 'Purpose']}
          rows={[
            [
              'Training rewards endowment',
              '35%',
              'Emission over multi-year PoG schedule',
              'Pay accepted work',
            ],
            [
              'Audit / security treasury',
              '15%',
              'Continuous draw for audit fees and red-team bounties',
              'Fund p=0.1 pressure and paid breaks',
            ],
            [
              'Ecosystem / grants',
              '10%',
              'Squads multisig, milestone grants',
              'Tooling, relays, research',
            ],
            [
              'Team',
              '25%',
              '1y cliff, 3y linear',
              'Build and operate',
            ],
            [
              'Early contributors / community',
              '10%',
              'TGE unlock + short vest',
              'Genesis participants, bug bounties',
            ],
            [
              'Liquidity / market making',
              '5%',
              'At TGE under Squads multisig policy',
              'CEX/DEX depth if pursued',
            ],
          ]}
        />
        <Note>
          Total 100%. Team rose from 15% to 25% entirely by reducing the
          training rewards endowment from 45% to 35%. Training rewards remain the
          largest single bucket (35% &gt; 25%), so the thesis that the network
          that trains the model holds the primary emission share still holds.
        </Note>
        <P>
          Emission is not a fixed block subsidy. Each run configures epoch
          earning rates on the coordinator; the treasury tops up the run vault.
          Unused endowment stays unminted or locked, never inflated ad hoc.
        </P>

        <H2 id="pog-conversion">PoG to token conversion</H2>
        <Ol>
          <Li>
            Trainer stays Healthy through an epoch and accrues{' '}
            <Code>earned</Code> points (existing coordinator behaviour).
          </Li>
          <Li>
            Treasurer <Code>participant_claim</Code> redeems points for
            collateral while the run is collateral-denominated.
          </Li>
          <Li>
            After TGE, conversion is fixed per run at run-create time:{' '}
            <Code>tokens_per_point = run_reward_budget / expected_total_points</Code>
            .
          </Li>
          <Li>
            Slashed points reduce redeemable balance (bond finalize forfeits into
            the vault; claim path must continue to respect <Code>slashed</Code>).
          </Li>
          <Li>No retroactive reprice of settled claims.</Li>
        </Ol>

        <H2 id="bond-slash-bounty">Bond, slash, bounty</H2>
        <Table
          headers={['Mechanism', 'Parameter', 'Source of truth']}
          rows={[
            [
              'Bond size',
              '>= break-even at published p',
              'Run bond config + sim table',
            ],
            [
              'Audit probability',
              'verification_percent / 100',
              'Coordinator config',
            ],
            [
              'Slash on conviction',
              'Earned points + bond forfeit path',
              'Coordinator eject + treasurer settle',
            ],
            [
              'Reporter bounty',
              'slash_bounty_bps of forfeited bond',
              'Treasurer (default design 5000 = 50%)',
            ],
            [
              'Challenge window',
              'Withdraw delay on bond request',
              'Treasurer withdraw instructions',
            ],
          ]}
        />

        <H2 id="tge">TGE plan</H2>
        <P>Phases, each gated:</P>
        <Ol>
          <Li>
            Legal structure lock (entity, jurisdiction, token classification,
            KYC/AML for any custodial surface).
          </Li>
          <Li>
            Independent security audit of coordinator, treasurer and authorizer;
            critical and high findings closed.
          </Li>
          <Li>
            Mainnet programs with fresh program IDs, Squads multisig
            authorities, upgrade keys secured.
          </Li>
          <Li>
            Genesis run complete on testnet with published metrics and a go
            decision.
          </Li>
          <Li>
            TGE directly on Solana rails, no launchpad dependency: mint under the Squads multisig,
            distributor for airdrop and vesting, public tokenomics page, no APY
            marketing copy.
          </Li>
          <Li>
            Post-TGE: inference revenue (later) routes to treasury; futarchy for
            next model selection remains a later phase.
          </Li>
        </Ol>

        <H2 id="not-claimed">What is deliberately not claimed</H2>
        <Ul>
          <Li>
            The token is not marketed as equity, debt, or a guaranteed return.
          </Li>
          <Li>
            Security is economic, not cryptographic. Uncaught rate, band width
            and bond curve remain public metrics.
          </Li>
          <Li>
            Supply shares above are a planning sketch until counsel and
            governance lock them.
          </Li>
        </Ul>

        <H2 id="reproduce">Reproduce the numbers</H2>
        <Pre>{`cd sim
uv run python -c "from leviathan_sim.economy import genesis_parameters, calibration_table, audit_burn_projection; print(genesis_parameters()); print(calibration_table([0.1])); print(audit_burn_projection([0.1]))"`}</Pre>
        <P>
          Related docs:{' '}
          <A href="/docs/protocol/economics">Economics</A>,{' '}
          <A href="/docs/protocol/security">Security model</A>,{' '}
          <A href="/docs/project/roadmap">Roadmap</A>. Upstream design file:{' '}
          <A href="https://github.com/wienerlabs/leviathan/blob/main/docs/TOKENOMICS.md">
            TOKENOMICS.md
          </A>
          .
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
          production addresses. Program IDs are unchanged after later in-place
          upgrades that carried the bond, slash and run_slash instructions on the
          same addresses.
        </Note>
        <H2 id="verified-live">Verified on live devnet</H2>
        <H3 id="conviction">Conviction</H3>
        <P>
          A participant posted a bond of 500. A stranger&apos;s dispute was
          rejected (authority gated). The run authority convicted the cheater
          mid-epoch through the treasurer, which CPIs the coordinator&apos;s{' '}
          <Code>slash_client</Code> with the run PDA signature. At epoch end the
          coordinator wrote <Code>slashed = 200</Code> on-chain. On bond
          withdrawal the cheater recovered 300 and the forfeited 200 stayed in
          the run vault as reward liquidity.
        </P>
        <Pre>{`cargo run -p psyche-solana-tooling --bin devnet-conviction-demo --features demo`}</Pre>
        <P>
          The same loop is proven deterministically by the memnet suites (
          <Code>cargo test -p psyche-solana-tooling</Code>, 17/17).
        </P>
        <H3 id="training">Training</H3>
        <P>
          The <Code>psyche-solana-client</Code> builds against the NousResearch
          tch fork and runs on this machine&apos;s MPS. A verified run: the client
          joined on-chain, downloaded <Code>pefontana/Nano-Llama</Code> (a nano CI
          model, vocab 30, seq_len 64, tiny dataset from a single HF URL), and
          trained across the epoch 0 to epoch 1 boundary, re-joining successfully.
        </P>
        <P>
          Totals: 2 epochs, 16 training rounds, loss descending from the ln(30) ≈
          3.40 random-init baseline, 15 DisTrO-compressed pseudo-gradients
          broadcast over the iroh mesh, 0 join timeouts, and on-chain 2 Join + 12
          Witness + 38 Tick transactions, all coordinated by our devnet
          coordinator. Multi-node and multi-week resilience remain Phase 2 work.
        </P>
        <P>
          How to launch a node:{' '}
          <A href="/docs/developer/run-a-node">Run a training node</A>.
        </P>
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
          Shipped. Whitepaper, decision log, and the sim on real transformer
          gradients.
        </P>
        <H2 id="phase-1">Phase 1 - devnet core</H2>
        <P>
          Complete and live. All of 1.1-1.10 shipped. Fork bootstrap, code map,
          devnet deploy, bond custody (treasurer deposit / challenge-window
          withdraw / settlement), audit lottery, dispute-driven slashing, the
          treasurer run_slash CPI, the tolerance-band verifier core, and the
          training-client toolchain.
        </P>
        <P>
          Both halves run on live devnet: the trust machine (verified conviction)
          and the training swarm (verified sustained training). See{' '}
          <A href="/docs/network/devnet">Devnet programs</A>,{' '}
          <A href="/docs/developer/conviction-demo">Conviction demo</A>, and{' '}
          <A href="/docs/developer/run-a-node">Run a training node</A>.
        </P>
        <H2 id="phase-2">Phase 2 - Genesis Run</H2>
        <P>
          Started. First items done: env-tunable join timeout enabling sustained
          multi-epoch runs, and this docs/marketing site (leviathan-web). Next: a
          multi-volunteer swarm, a live collective loss-curve view, one-line join,
          and the first open-weight run trained by its participants.
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
