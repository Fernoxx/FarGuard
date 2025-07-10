"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { createConfig, http } from "wagmi"
import { base, mainnet, arbitrum } from "wagmi/chains"

export const config = createConfig(
  getDefaultConfig({
    appName: "FarGuard",
    projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // replace with actual ID
    chains: [mainnet, base, arbitrum],
    transports: {
      [mainnet.id]: http(),
      [base.id]: http(),
      [arbitrum.id]: http(),
    },
    ssr: true,
  })
)



