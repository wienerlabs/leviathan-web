import { useMemo, type ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'

export const SOLANA_RPC =
  (import.meta.env.VITE_SOLANA_RPC as string | undefined)?.trim() ||
  'https://api.mainnet-beta.solana.com'

export default function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => SOLANA_RPC, [])

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={[]} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
