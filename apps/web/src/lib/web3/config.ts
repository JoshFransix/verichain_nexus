import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'VeriChain Nexus' }),
    injected({ target: 'trust' }),
    injected(),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})
