import { createConfig, http } from 'wagmi'
import { mainnet, base, arbitrum } from 'wagmi/chains'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'  // ← use this factory function :contentReference[oaicite:0]{index=0}

const chains = [mainnet, base, arbitrum]

export const wagmiConfig = createConfig({
  autoConnect: true,
  chains,
  transports: {
    [mainnet.id]:  http(process.env.NEXT_PUBLIC_ETHEREUM_RPC!),
    [base.id]:     http(process.env.NEXT_PUBLIC_BASE_RPC!),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC!),
  },
  connectors: [
    farcasterFrame(),  // ← call the factory, do not use `new`
  ],
})



