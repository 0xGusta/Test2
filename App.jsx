import React from 'react'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit'
import {
  configureChains,
  createConfig,
  WagmiConfig,
  useAccount,
  useBalance,
  useDisconnect
} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { Chain } from 'wagmi/chains'
import '@rainbow-me/rainbowkit/styles.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// Define Monad Testnet chain
const monadTestnet = {
  id: 0x279f,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
}

// Configuração da chain + provider
const { chains, publicClient } = configureChains(
  [monadTestnet],
  [jsonRpcProvider({ rpc: () => ({ http: 'https://testnet-rpc.monad.xyz' }) })]
)

// Wallet connectors padrão (MetaMask, WalletConnect, etc.)
const { connectors } = getDefaultWallets({
  appName: 'Monad Wallet Test',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // ou use qualquer valor para teste
  chains,
})

// Configuração do Wagmi
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address,
    watch: true,
  })

  if (!isConnected) return null

  return (
    <div style={{ marginTop: 20 }}>
      <p><strong>Endereço:</strong> {address}</p>
      <p><strong>Saldo MON:</strong> {balance?.formatted} MON</p>
      <button onClick={() => disconnect()}>Desconectar</button>
    </div>
  )
}

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <div style={{ padding: 20 }}>
          <h1>Conectar Carteira à Monad</h1>
          <ConnectButton />
          <WalletInfo />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
