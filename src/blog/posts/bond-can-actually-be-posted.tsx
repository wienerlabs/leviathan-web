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
  DoorOpenFigure,
  FourCommandsFigure,
  GapFigure,
  LiveVerifyFigure,
} from '../figures/bond-ux-figures'

const COMMIT =
  'https://github.com/wienerlabs/leviathan-net/commit/30fd95b30c635ba69e5e993634d6d71dbf2785ad'
const NODE =
  'https://github.com/wienerlabs/leviathan-net/blob/main/scripts/leviathan-node.sh'
const ECON = '/blog/bond-was-too-low'
const E2E = '/blog/jury-executed-on-devnet'

const meta = getBlogMeta('bond-can-actually-be-posted')!

export const bondCanActuallyBePosted: BlogPost = {
  ...meta,
  body: (
    <>
      <H1>Leviathan: the bond can finally actually be posted</H1>
      <Lead>
        I started with the part that makes volunteer participation easier,
        because the real bottleneck is no longer code. It is people who can
        join the network.
      </Lead>

      <P>
        There was an embarrassing hole in the middle of the story. I had built
        the bond system, taken it live, modelled its economics. But the deposit
        path was only reachable from library code, tests, and my own demo
        binaries. Outside that circle, nobody could post a bond.
      </P>
      <P>
        A volunteer could run a node and still fail to join a bonded run. The
        whole security layer, in practice, could not leave the repository.
      </P>
      <GapFigure />
      <P>
        Prior depth on why bonds matter:{' '}
        <A href={ECON}>the bond correction</A>, and on multiparty enforcement:{' '}
        <A href={E2E}>live jury execution</A>. This post is the operator door.
      </P>

      <H2 id="fix">What shipped</H2>
      <P>
        That door is closed now. There are four commands:
      </P>
      <Ul>
        <Li>
          <Code>bond-deposit</Code> - create the participant account if missing,
          deposit collateral, report that the wallet meets the run minimum.
        </Li>
        <Li>
          <Code>bond-status</Code> - bond amount, pending withdraw, run minimum,
          challenge window, qualifies or not, one screen.
        </Li>
        <Li>
          <Code>bond-withdraw-request</Code> - start the exit / challenge
          window.
        </Li>
        <Li>
          <Code>bond-withdraw-finalize</Code> - settle any slash and pay out the
          rest.
        </Li>
      </Ul>
      <FourCommandsFigure />
      <P>
        The node launcher also took one new option. Pass{' '}
        <Code>--bond &lt;amount&gt;</Code> and{' '}
        <A href={NODE}>
          <Code>leviathan-node.sh</Code>
        </A>{' '}
        posts collateral before it joins. A bonded node is one command.
      </P>

      <H2 id="live">Live check, as usual</H2>
      <P>
        I verified on devnet against a treasurer run. First{' '}
        <Code>bond-status</Code>: no participant account yet. Then deposit one
        hundred units: the account was created, the deposit landed, both
        transactions hit the chain. Status again: bond one hundred, minimum
        met.
      </P>
      <LiveVerifyFigure />
      <Note>
        Create tx prefix <Code>6qvgFMvf…</Code>, deposit prefix{' '}
        <Code>4j7uHMxx…</Code>, as recorded in the commit message for this
        work.
      </Note>

      <H2 id="where">Where we are</H2>
      <P>
        The bond mechanism is no longer something only I can exercise. Someone
        outside the monorepo can show up with a wallet, stand up a node, and
        post collateral. The first technical barrier to a volunteer network is
        down.
      </P>
      <DoorOpenFigure />
      <P>
        Status: the bond-funding UX slice of net#8 is complete (
        <A href={COMMIT}>
          <Code>30fd95b3</Code>
        </A>
        ), live-verified. The issue stays open because a true one-line
        installer (<Code>curl | sh</Code> style, no full repo clone) is still
        missing.
      </P>

      <H2 id="takeaway">Takeaway</H2>
      <P>
        Security code that only the author can fund is still a private
        experiment. Today deposit, status, withdraw request, and finalize are
        operator commands, and a node can bond itself before it joins. The next
        packaging step is making that path findable without a full checkout.
      </P>
      <Ul>
        <Li>
          Commit:{' '}
          <A href={COMMIT}>
            <Code>30fd95b3</Code>
          </A>
        </Li>
        <Li>
          Node script:{' '}
          <A href={NODE}>
            <Code>leviathan-node.sh</Code>
          </A>
        </Li>
      </Ul>
    </>
  ),
}
