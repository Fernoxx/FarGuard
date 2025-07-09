'use client'

import { useState } from 'react'
import { BrowserProvider, Contract } from 'ethers'
import ERC20_ABI from '@/lib/erc20.abi.json'
import { useFrame } from '@/components/farcaster-provider'

export function Demo() {
  const { context } = useFrame()
  const frameProvider = context?.client?.provider
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [approvals, setApprovals] = useState<
    { tokenSymbol: string; spender: string; allowance: string }[]
  >([])

  async function connectWallet() {
    if (!frameProvider) {
      alert('Farcaster SDK not loaded')
      return
    }
    const web3Provider = new BrowserProvider(frameProvider as any)
    const signer = await web3Provider.getSigner()
    setSigner(signer)
  }

  async function fetchApprovals() {
    if (!signer) {
      alert('Connect your wallet first')
      return
    }
    const owner = await signer.getAddress()
    const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    const spender = '0xSpenderAddress'
    const contract = new Contract(tokenAddress, ERC20_ABI, signer)
    const allowance = await contract.allowance(owner, spender)
    const symbol = await contract.symbol()
    setApprovals([{ tokenSymbol: symbol, spender, allowance: allowance.toString() }])
  }

  async function revoke(spender: string) {
    if (!signer) return
    const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    const contract = new Contract(tokenAddress, ERC20_ABI, signer)
    await (await contract.approve(spender, 0)).wait()
    fetchApprovals()
  }

  return (
    <div className="p-4 space-y-4">
      <button onClick={connectWallet} className="px-4 py-2 bg-blue-600 text-white rounded">
        Connect Wallet
      </button>

      <button onClick={fetchApprovals} className="px-4 py-2 bg-green-600 text-white rounded">
        Fetch Approvals
      </button>

      {approvals.length > 0 && (
        <table className="min-w-full text-left border">
          <thead>
            <tr>
              <th>Token</th>
              <th>Spender</th>
              <th>Allowance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((a, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td>{a.tokenSymbol}</td>
                <td>{a.spender}</td>
                <td>{a.allowance}</td>
                <td>
                  <button
                    onClick={() => revoke(a.spender)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
