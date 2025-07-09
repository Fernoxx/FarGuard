import { createPublicClient, http, formatUnits } from 'viem'
import { mainnet, base, arbitrum } from 'viem/chains'
import axios from 'axios'

const chains = [mainnet, base, arbitrum]

const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  }
]

export async function fetchERC20Approvals(userAddress: string) {
  const results: any[] = []

  for (const chain of chains) {
    const client = createPublicClient({
      chain,
      transport: http()
    })

    try {
      const response = await axios.get(`https://api.llamao.fi/tokens/allowances?chain=${chain.id}&wallet=${userAddress}`)
      const tokens = response.data?.tokens || []

      for (const token of tokens) {
        try {
          const allowance = await client.readContract({
            address: token.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'allowance',
            args: [userAddress as `0x${string}`, token.spender as `0x${string}`]
          })

          if (BigInt(allowance) > 0n) {
            const decimals = await client.readContract({
              address: token.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: 'decimals'
            })

            const symbol = await client.readContract({
              address: token.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: 'symbol'
            })

            results.push({
              chain: chain.name,
              token: token.address,
              spender: token.spender,
              amount: formatUnits(allowance, Number(decimals)),
              symbol
            })
          }
        } catch (innerErr) {
          console.warn('Error checking token on', chain.name, token.address)
        }
      }
    } catch (err) {
      console.error('API error on chain', chain.name)
    }
  }

  return results
}
