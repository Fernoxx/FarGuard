import { createPublicClient, http } from 'viem'
import { mainnet, base, arbitrum } from 'viem/chains'

const chains = [mainnet, base, arbitrum]

const ERC721_ABI = [
  {
    constant: true,
    inputs: [{ name: 'owner', type: 'address' }, { name: 'operator', type: 'address' }],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  }
]

export async function fetchNFTApprovals(userAddress: string) {
  const approvals: any[] = []

  for (const chain of chains) {
    const client = createPublicClient({
      chain,
      transport: http()
    })

    try {
      // Use llamao's NFT allowance endpoint
      const res = await fetch(`https://api.llamao.fi/nfts/approvals?chain=${chain.id}&wallet=${userAddress}`)
      const data = await res.json()
      const nfts = data?.contracts || []

      for (const nft of nfts) {
        try {
          const isApproved = await client.readContract({
            address: nft.contract as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'isApprovedForAll',
            args: [userAddress as `0x${string}`, nft.spender as `0x${string}`]
          })

          if (isApproved) {
            approvals.push({
              chain: chain.name,
              contract: nft.contract,
              spender: nft.spender
            })
          }
        } catch (err) {
          console.warn('Error reading approval:', chain.name, nft.contract)
        }
      }
    } catch (err) {
      console.error('Error fetching NFTs from API for', chain.name)
    }
  }

  return approvals
}
