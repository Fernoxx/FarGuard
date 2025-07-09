'use client'

import { ReactNode } from 'react'
import { WagmiProvider }   from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig }     from '../lib/wagmi'

/** Create one QueryClient for your app */
const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* 1. Provide React Query */}
        <QueryClientProvider client={queryClient}>
          {/* 2. Then provide Wagmi */}
          <WagmiProvider config={wagmiConfig}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

