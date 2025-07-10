'use client'

import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName, usePublicClient } from 'wagmi'

export default function HomePage() {
  // Wagmi hooks
  const { connect, connectors, error: connectError } = useConnect()
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { disconnect } = useDisconnect()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Revoke All Contracts</h1>

      {!isConnected ? (
        <div>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="border border-gray-400 rounded px-4 py-2 m-2"
            >
              Connect Wallet ({connector.name})
            </button>
          ))}
          {connectError && <div className="text-red-500">{connectError.message}</div>}
        </div>
      ) : (
        <div>
          <p className="mb-4">Connected: {address}</p>
          <button
            onClick={() => disconnect()}
            className="border border-red-400 text-red-600 rounded px-4 py-2"
          >
            Disconnect
          </button>
        </div>
      )}
    </main>
  )
}

