"use client";

import { sdk } from '@farcaster/frame-sdk'
import { farcasterFrame as frameConnector } from '@farcaster/frame-wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { WagmiProvider, useAccount, useConnect, useSignMessage } from 'wagmi'
import { config } from './wagmiConfig'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function AppInner() {
  useEffect(() => {
    sdk.actions.ready()
  }, [])

  return (
    <>
      <div>Simple Wagmi React Frame Example</div>
      <ConnectMenu />
    </>
  )
}

function ConnectMenu() {
  const { isConnected, address } = useAccount()
  const { connect } = useConnect()

  if (isConnected) {
    return (
      <>
        <div>Connected account:</div>
        <div>{address}</div>
        <SignButton />
      </>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        connect({ connector: frameConnector() }) 
      }}
    >
      Connect
    </button>
  )
}

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage()

  return (
    <>
      <button
        type="button"
        onClick={() => signMessage({ message: 'hello world' })}
        disabled={isPending}
      >
        {isPending ? 'Signing...' : 'Sign message'}
      </button>
      {data && (
        <>
          <div>Signature</div>
          <div>{data}</div>
        </>
      )}
      {error && (
        <>
          <div>Error</div>
          <div>{error.message}</div>
        </>
      )}
    </>
  )
}

export default App
