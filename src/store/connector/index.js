import Connector from './connectors'
import config from '@/config'

export default new Connector({chainId: config.networkID, provider: config.provider})