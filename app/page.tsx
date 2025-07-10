'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { usePublicClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const publicClient = usePublicClient()
  const [approvals, setApprovals] = useState<any[]>([])

  useEffect(() => {
    const fetchApprovals = async () => {
      if (!isConnected || !address || !publicClient) return

      // Dummy approval data - replace this later with real on-chain logic
      const fakeApprovals = [
        {
          contract: '0xTokenContractAddress',
          spender: '0xSpenderAddress',
          allowance: 'Unlimited',
        },
      ]
      setApprovals(fakeApprovals)
    }

    fetchApprovals()
  }, [isConnected, address, publicClient])

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-4">FarGuard: Revoke Token Approvals</h1>

      <ConnectButton />

      {isConnected && (
        <div className="mt-6">
          <h2 className="text-xl mb-2">Approvals for {address}</h2>

          {approvals.length === 0 ? (
            <p>No approvals found</p>
          ) : (
            <ul className="space-y-4">
              {approvals.map((approval, index) => (
                <li key={index} className="border p-4 rounded bg-gray-800">
                  <p>
                    <strong>Contract:</strong> {approval.contract}
                  </p>
                  <p>
                    <strong>Spender:</strong> {approval.spender}
                  </p>
                  <p>
                    <strong>Allowance:</strong> {approval.allowance}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  )
}

