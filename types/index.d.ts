import Raincache from "./RainCache";
import BaseStorageEngine from "./storageEngine/BaseStorageEngine";
declare function RainCache(options: {
    storage: BaseStorageEngine;
    disabledEvents: any;
    cacheClasses?: Object;
}, inboundConnector: BaseStorageEngine, outboundConnector: BaseStorageEngine): Raincache;
declare namespace RainCache {
    var Connectors: {
        AmqpConnector: Promise<typeof import("./connector/AmqpConnector")>;
        DirectConnector: Promise<typeof import("./connector/DirectConnector")>;
    };
    var Engines: {
        RedisStorageEngine: any;
    };
}
export default RainCache;
