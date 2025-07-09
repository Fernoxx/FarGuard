'use client'

import { useState, useEffect } from 'react'
import { useConnect, useAccount, usePublicClient } from 'wagmi'
import { fetchERC20Approvals } from '../lib/fetchERC20Approvals'
import { fetchNFTApprovals } from '../lib/fetchNFTApprovals'

export default function HomePage() {
  // Wagmi hooks
  const { connect, connectors, error: connectError } = useConnect()
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()

  // Local state for approvals
  const [erc20Approvals, setErc20Approvals] = useState<any[]>([])
  const [nftApprovals,  setNftApprovals ] = useState<any[]>([])

  // When we get an address, fetch approvals
  useEffect(() => {
    if (isConnected && address) {
      fetchERC20Approvals('ethereum', address, publicClient).then(setErc20Approvals)
      fetchNFTApprovals('ethereum', address, publicClient).then(setNftApprovals)
    }
  }, [isConnected, address, publicClient])

  return (
    <main style={{ padding: 16 }}>
      { !isConnected && (
        <div>
          <h1>Connect Your Farcaster Wallet</h1>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={!connector.ready}
              style={{ display: 'block', margin: '8px 0' }}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
            </button>
          ))}
          {connectError && <p style={{ color: 'red' }}>{connectError.message}</p>}
        </div>
      )}

      { isConnected && (
        <>
          <h1>Connected as {address}</h1>

          <section>
            <h2>ERC20 Approvals</h2>
            {erc20Approvals.length > 0 ? (
              <ul>
                {erc20Approvals.map((a) => (
                  <li key={`${a.token}-${a.spender}`}>
                    {a.symbol} → {a.spender} (allowance: {a.allowance})
                    {/* TODO: add a Revoke button that calls your revokeERC20(a) */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ERC20 approvals</p>
            )}
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>NFT Approvals</h2>
            {nftApprovals.length > 0 ? (
              <ul>
                {nftApprovals.map((a) => (
                  <li key={`${a.contract}-${a.spender}`}>
                    {a.name} → {a.spender}
                    {/* TODO: add a Revoke button that calls your revokeNFT(a) */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No NFT approvals</p>
            )}
          </section>
        </>
      )}
    </main>
  )
}
