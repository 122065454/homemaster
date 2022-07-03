import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { FrameConnector } from '@web3-react/frame-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { SquarelinkConnector } from '@web3-react/squarelink-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'



function getConnector(name) {
  const connectors = {
    injected({chainId}) {
      return new InjectedConnector({ supportedChainIds: [chainId] })
    },
    frame({chainId}) {
      new FrameConnector({ supportedChainIds: [chainId] })
    },
    fortmatic({ chainId, apiKey }) {
      if (!apiKey) {
        throw new ConnectorConfigError(
          'The Fortmatic connector requires apiKey to be set.'
        )
      }
      return new FortmaticConnector({ apiKey, chainId })
    },
    portis({ chainId, dAppId }) {
      if (!dAppId) {
        throw new ConnectorConfigError(
          'The Portis connector requires dAppId to be set.'
        )
      }
      return new PortisConnector({ dAppId, networks: [chainId] })
    },
    provided({ chainId, provider }) {
      return new ProvidedConnector({
        provider,
        supportedChainIds: [chainId],
      })
    },
    authereum(chainId) {
      return new AuthereumConnector({ chainId })
    },
    squarelink({ chainId, clientId, options }) {
      return new SquarelinkConnector({
        clientId,
        networks: [chainId],
        options,
      })
    },
    torus({ chainId, initOptions, constructorOptions }) {
      return new TorusConnector({
        chainId,
        constructorOptions,
        initOptions,
      })
    },
    walletconnect({ chainId, provider, bridge, pollingInterval }) {
      if (!provider) {
        throw new Error(
          'The WalletConnect connector requires rpcUrl to be set.'
        )
      }
      if (!/^https?:\/\//.test(provider)) {
        throw new Error(
          'The WalletConnect connector requires rpcUrl to be an HTTP URL.'
        )
      }
      return new WalletConnectConnector({
        bridge,
        pollingInterval,
        qrcode: true,
        rpc: { [chainId]: provider},
      })
    },
    walletlink({ chainId, url, appName, appLogoUrl }) {
      if (chainId !== 1) {
        throw new Error(
          'The WalletLink connector requires chainId to be 1.'
        )
      }
      if (!/^https?:\/\//.test(url)) {
        throw new Error(
          'The WalletLink connector requires url to be an HTTP URL.'
        )
      }
      return new WalletLinkConnector({ url, appName, appLogoUrl })
    },
    ledger({chainId, provider}) {
      new LedgerConnector({ chainId, url: provider })
    },
    trezor({ chainId, provider, manifestEmail, manifestAppUrl }) {
      return new TrezorConnector({ chainId, url: provider, manifestEmail, manifestAppUrl })
    },
  }

  return connectors[name]
}

class Connector {
  constructor({chainId, provider}) {
    this.chainId = chainId
    this.provider = provider
    this.connectID = 0
    this.connector = null
  }
  async connect(name = 'injected', conf = {}) {
    const connector = getConnector(name)
    if (!connector) {
      throw new Error('unsupport connector')
    }
    this.connector = connector({
      chainId: this.chainId, 
      provider: this.provider, 
      ...conf,
    })
    this.connectID++
    return this.connector.activate(connector, null, true)
  }
  reset() {
    this.connector = null
  }
}

export default Connector