import Raincache from "./RainCache";
import BaseStorageEngine from "./storageEngine/BaseStorageEngine";
function RainCache(options : {storage : BaseStorageEngine, disabledEvents: any, cacheClasses?: Object}, inboundConnector: BaseStorageEngine, outboundConnector: BaseStorageEngine) {
    return new Raincache(options, inboundConnector, outboundConnector);
}

RainCache.Connectors = {
    AmqpConnector: import('./connector/AmqpConnector'),
    DirectConnector: import('./connector/DirectConnector'),
};

RainCache.Engines = {
    RedisStorageEngine: require('./storageEngine/RedisStorageEngine'),
};
export default RainCache;